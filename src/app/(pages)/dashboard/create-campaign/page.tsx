"use client";

import UserDashboardLayout from "@/components/dashboard/layout/user-dashboard-layout";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Textarea} from "@/components/ui/textarea";
import {AlertCircle, Info, Loader2, Send, Upload} from "lucide-react";
import {useRouter} from "next/navigation";
import {ChangeEvent, FormEvent, useRef, useState} from "react";

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
    const [step, setStep] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [contactsPreview, setContactsPreview] = useState<Contact[]>([]);
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

    // Handle file upload
    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== "text/csv") {
                setError("Please upload a CSV file");
                return;
            }

            setCsvFile(file);
            setError("");

            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const rows = text.split("\n").filter((r) => r.trim() !== "");
                const headers = rows[0].split(",");

                if (!headers.includes("phone")) {
                    setError('CSV must include a "phone" column');
                    return;
                }

                const parsedContacts: Contact[] = [];

                for (let i = 1; i < rows.length; i++) {
                    const values = rows[i].split(",");
                    const contact: Contact = {};
                    headers.forEach((header, index) => {
                        contact[header.trim()] = values[index]?.trim() || "";
                    });
                    parsedContacts.push(contact);
                }

                setContacts(parsedContacts);
                setContactsPreview(parsedContacts.slice(0, 5));
            };

            reader.readAsText(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (step === 1 && !csvFile) {
            setError("Please upload a CSV file with contacts");
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

            try {
                setLoading(true);
                setError("");

                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 1500));

                setSuccess(true);
                setLoading(false);

                setTimeout(() => {
                    navigate.push("/campaigns");
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
    const messagesPerSMS = Math.ceil(messageLength / 160);
    const totalCredits = contacts.length * messagesPerSMS;

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
                    {/* Progress Steps */}
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
                                    <CardContent className="pt-6">
                                        <div className="mb-6">
                                            <Label htmlFor="csv-file" className="block mb-2">
                                                Upload Contacts (CSV)
                                            </Label>
                                            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                                                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                                <p className="mb-2 text-sm text-muted-foreground">
                                                    Drag and drop your CSV file here, or click to browse
                                                </p>

                                                <Input
                                                    id="csv-file"
                                                    type="file"
                                                    accept=".csv"
                                                    onChange={handleFileUpload}
                                                    className="hidden"
                                                    ref={fileInputRef}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => fileInputRef.current?.click()} // safe with optional chaining
                                                >
                                                    Select CSV File
                                                </Button>
                                                {csvFile && (
                                                    <p className="mt-2 text-sm text-green-600">
                                                        File selected: {csvFile.name}
                                                    </p>
                                                )}
                                            </div>
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
                                    <Button type="submit" disabled={!csvFile || loading}>
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Next Step
                                    </Button>
                                </div>
                            </div>
                        )}
                        {step === 2 && (
                            <div>
                                <Card className="mb-6">
                                    <CardContent className="pt-6">
                                        <div className="mb-4">
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
                                        <div className="mb-4">
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
                                    <CardContent className="pt-6">
                                        <div className="flex items-start">
                                            <Info className="h-5 w-5 mr-2 text-muted-foreground flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h3 className="font-medium mb-1">Campaign Summary</h3>
                                                <ul className="text-sm text-muted-foreground space-y-1">
                                                    <li>Recipients: {contacts.length} contacts</li>
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
                                    <Button type="submit" disabled={loading}>
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
