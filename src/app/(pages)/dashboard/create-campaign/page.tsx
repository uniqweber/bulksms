"use client";

import UserDashboardLayout from "@/components/dashboard/layout/user-dashboard-layout";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Textarea} from "@/components/ui/textarea";
import {useUser} from "@/context/firebase-context";
import {db} from "@/firebase";
import {addDoc, collection, doc, increment, serverTimestamp, updateDoc} from "firebase/firestore";
import {AlertCircle, Info, Loader2, Send, Upload} from "lucide-react";
import {useRouter} from "next/navigation";
import {ChangeEvent, FormEvent, useRef, useState} from "react";
import * as XLSX from "xlsx";

interface Contact {
    [key: string]: string;
}

interface CampaignData {
    name: string;
    message: string;
    scheduledDate: string;
    scheduledTime: string;
}

export default function CreateCampaign() {
    const navigate = useRouter();
    const {user} = useUser(); // current logged in user
    const [step, setStep] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [contactsPreview, setContactsPreview] = useState<Contact[]>([]);
    const [manualContacts, setManualContacts] = useState<number>(0);
    const [campaignData, setCampaignData] = useState<CampaignData>({
        name: "",
        message: "",
        scheduledDate: "",
        scheduledTime: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle input changes
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setCampaignData((prev) => ({...prev, [name]: value}));
    };

    // Handle file upload (CSV or Excel)
    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log(file);

        setCsvFile(file);
        setError("");

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = event.target?.result;
            if (!data) return;

            let parsedContacts: Contact[] = [];

            if (file.name.endsWith(".csv")) {
                const text = data as string;
                const rows = text.split("\n").filter((r) => r.trim() !== "");
                const headers = rows[0].split(",");

                if (!headers.includes("phone")) {
                    setError('CSV/Excel must include a "phone" column');
                    return;
                }

                for (let i = 1; i < rows.length; i++) {
                    const values = rows[i].split(",");
                    const contact: Contact = {};
                    headers.forEach((header, index) => {
                        contact[header.trim()] = values[index]?.trim() || "";
                    });
                    parsedContacts.push(contact);
                }
            } else {
                const workbook = XLSX.read(data, {type: "binary"});
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                parsedContacts = XLSX.utils.sheet_to_json(sheet);
            }

            setContacts(parsedContacts);
            setContactsPreview(parsedContacts.slice(0, 5));
        };

        if (file.name.endsWith(".csv")) {
            reader.readAsText(file);
        } else {
            reader.readAsBinaryString(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!user) {
            setError("You must be logged in to create a campaign");
            return;
        }

        if (step === 1 && !csvFile && manualContacts <= 0) {
            setError("Please upload a CSV/Excel file or enter total contacts manually");
            return;
        }

        if (step === 2) {
            if (!campaignData.name.trim()) {
                setError("Please enter a campaign name");
                return;
            }
            if (!campaignData.message.trim()) {
                setError("Please enter a message");
                return;
            }

            const totalRecipients = contacts.length || manualContacts;
            if (totalRecipients === 0) {
                setError("You must provide at least 1 recipient");
                return;
            }

            if (user.currentCredit < totalCredits) {
                setError("Insufficient credits to create this campaign");
                return;
            }

            try {
                setLoading(true);
                setError("");

                await addDoc(collection(db, "campaigns"), {
                    ...campaignData,
                    contacts: contacts.length ? contacts : [],
                    manualContacts: contacts.length ? 0 : manualContacts,
                    totalContacts: totalRecipients,
                    segments: messagesPerSMS,
                    totalCredits,
                    userId: user.uid,
                    createdAt: serverTimestamp(),
                    status: "pending",
                });

                // Deduct credits from user balance
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                    currentCredit: increment(-totalCredits),
                });

                setSuccess(true);
                setLoading(false);

                setTimeout(() => {
                    navigate.push("/dashboard/campaigns");
                }, 2000);
            } catch (err) {
                console.error("Error creating campaign:", err);
                setError("Failed to create campaign. Please try again.");
                setLoading(false);
            }
        } else {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        setStep(step - 1);
        setError("");
    };

    const messageLength = campaignData.message.length;
    const messagesPerSMS =
        messageLength <= 160 ? 1 : messageLength <= 306 ? 2 : messageLength <= 459 ? 3 : Math.ceil(messageLength / 153);

    const totalContacts = contacts.length || manualContacts;
    const totalCredits = totalContacts * messagesPerSMS;

    if (success) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-3xl">
                <Alert className="bg-green-50 border-green-200">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-600">Success!</AlertTitle>
                    <AlertDescription>
                        Your campaign has been created successfully. Redirecting to campaigns page...
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <UserDashboardLayout>
            <div className="container mx-auto py-8">
                <div className="w-full ">
                    <h1 className="text-3xl font-bold mb-2">Create Campaign</h1>
                    <p className="text-muted-foreground mb-8">Send messages to your contacts</p>

                    <div className="flex mb-8">
                        <div className={`flex-1 pb-4 border-b-2 ${step >= 1 ? "border-primary" : "border-muted"}`}>
                            <div
                                className={`rounded-full h-8 w-8 flex items-center justify-center ${
                                    step >= 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                }`}
                            >
                                1
                            </div>
                            <p
                                className={`mt-2 text-sm ${
                                    step >= 1 ? "text-primary font-medium" : "text-muted-foreground"
                                }`}
                            >
                                Upload Contacts
                            </p>
                        </div>
                        <div className={`flex-1 pb-4 border-b-2 ${step >= 2 ? "border-primary" : "border-muted"}`}>
                            <div
                                className={`rounded-full h-8 w-8 flex items-center justify-center ${
                                    step >= 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                }`}
                            >
                                2
                            </div>
                            <p
                                className={`mt-2 text-sm ${
                                    step >= 2 ? "text-primary font-medium" : "text-muted-foreground"
                                }`}
                            >
                                Create Message
                            </p>
                        </div>
                    </div>

                    {error && (
                        <Alert className="mb-6 bg-red-50 border-red-200">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertTitle className="text-red-600">Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div>
                                <Card>
                                    <CardContent className="pt-6 space-y-6">
                                        <div>
                                            <Label htmlFor="csv-file" className="block mb-2">
                                                Upload Contacts (CSV/Excel)
                                            </Label>
                                            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                                                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                                <p className="mb-2 text-sm text-muted-foreground">
                                                    Drag and drop your CSV/Excel file here, or click to browse
                                                </p>
                                                <Input
                                                    id="csv-file"
                                                    type="file"
                                                    accept=".csv,.xls,.xlsx"
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                    ref={fileInputRef}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    Select File
                                                </Button>
                                                {csvFile && (
                                                    <p className="mt-2 text-sm text-green-600">
                                                        File selected: {csvFile.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="manualContacts" className="block mb-2">
                                                Or enter total contacts manually
                                            </Label>
                                            <Input
                                                id="manualContacts"
                                                type="number"
                                                min={1}
                                                value={manualContacts}
                                                onChange={(e) => setManualContacts(Number(e.target.value))}
                                                placeholder="e.g. 500"
                                            />
                                        </div>

                                        {contactsPreview.length > 0 && (
                                            <div>
                                                <h3 className="font-medium mb-2">
                                                    Preview ({contacts.length} contacts)
                                                </h3>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-muted">
                                                            <tr>
                                                                {Object.keys(contactsPreview[0]).map((header) => (
                                                                    <th key={header} className="px-4 py-2 text-left">
                                                                        {header}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {contactsPreview.map((contact, index) => (
                                                                <tr key={index} className="border-b">
                                                                    {Object.values(contact).map((value, i) => (
                                                                        <td key={i} className="px-4 py-2">
                                                                            {value}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {contacts.length > 5 && (
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        Showing 5 of {contacts.length} contacts
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <div className="mt-6 flex justify-end">
                                    <Button type="submit" disabled={(!csvFile && manualContacts <= 0) || loading}>
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Next Step
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <Card className="mb-6">
                                    <CardContent className="pt-6 space-y-4">
                                        <div>
                                            <Label htmlFor="name" className="block mb-2">
                                                Campaign Name
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={campaignData.name}
                                                onChange={handleInputChange}
                                                placeholder="e.g. October Promotion"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="message" className="block mb-2">
                                                Message
                                            </Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                value={campaignData.message}
                                                onChange={handleInputChange}
                                                placeholder="Enter your message here..."
                                                rows={5}
                                                required
                                            />
                                            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                                <span>{messageLength} characters</span>
                                                <span>{messagesPerSMS} SMS per recipient</span>
                                            </div>
                                        </div>

                                        <Tabs defaultValue="now">
                                            <TabsList className="mb-4">
                                                <TabsTrigger value="now">Send Now</TabsTrigger>
                                                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="now">
                                                <p className="text-sm text-muted-foreground">
                                                    Your message will be sent immediately after submission.
                                                </p>
                                            </TabsContent>
                                            <TabsContent value="schedule">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="scheduledDate" className="block mb-2">
                                                            Date
                                                        </Label>
                                                        <Input
                                                            id="scheduledDate"
                                                            name="scheduledDate"
                                                            type="date"
                                                            value={campaignData.scheduledDate}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="scheduledTime" className="block mb-2">
                                                            Time
                                                        </Label>
                                                        <Input
                                                            id="scheduledTime"
                                                            name="scheduledTime"
                                                            type="time"
                                                            value={campaignData.scheduledTime}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>

                                <Card className="mb-6 bg-muted/50">
                                    <CardContent className="">
                                        <div className="flex items-start">
                                            <Info className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h3 className="font-medium mb-1">Campaign Summary</h3>
                                                <ul className="text-sm text-muted-foreground space-y-1">
                                                    <li>Recipients: {totalContacts} contacts</li>
                                                    <li>
                                                        Message length: {messageLength} characters ({messagesPerSMS} SMS
                                                        per contact)
                                                    </li>
                                                    <li>Total credits required: {totalCredits}</li>
                                                    {campaignData.scheduledDate && campaignData.scheduledTime && (
                                                        <li>
                                                            Scheduled for: {campaignData.scheduledDate} at{" "}
                                                            {campaignData.scheduledTime}
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="mt-6 flex justify-between">
                                    <Button type="button" variant="outline" onClick={handleBack} disabled={loading}>
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={
                                            loading ||
                                            !campaignData.name ||
                                            !campaignData.message ||
                                            totalContacts <= 0 ||
                                            user?.currentCredit < totalCredits
                                        }
                                    >
                                        {loading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="mr-2 h-4 w-4" />
                                        )}
                                        {campaignData.scheduledDate && campaignData.scheduledTime
                                            ? "Schedule Campaign"
                                            : "Send Now"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
