"use client";

import AdminDashboardLayout from "@/components/admin/layout/admin-layout";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {db} from "@/firebase";
import {collection, doc, onSnapshot, query, Timestamp, updateDoc} from "firebase/firestore";
import {Download, Loader2, Pencil, Search} from "lucide-react";
import {useEffect, useState} from "react";

// ------------------- Types -------------------
interface Campaign {
    id: string;
    userId: string;
    name: string;
    message: string;
    contactCount: number;
    segments: number;
    driveLink: string;
    requiredCredits: number;
    delivered: number;
    createdAt: Timestamp;
    scheduledAt: string | Timestamp;
    status: "completed" | "scheduled" | "failed";
}

// ------------------- Campaign Table -------------------
interface CampaignTableProps {
    campaigns: Campaign[];
    onStatusChange: (id: string, newStatus: Campaign["status"]) => void;
    onUpdateDelivered: (campaign: Campaign) => void;
}
const CampaignTable: React.FC<CampaignTableProps> = ({campaigns, onStatusChange, onUpdateDelivered}) => (
    <div className="overflow-x-auto">
        <Table className=" border">
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Segments</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Delivered</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {campaigns.map((c) => (
                    <TableRow key={c.id}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell className=" max-w-sm pr-5 break-words whitespace-normal ">
                            <div className="">{c.message}</div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center  gap-2 ">
                                <div>{c.contactCount}</div>
                                <a href={c.driveLink} target="_blank" className="text-blue-600">
                                    <Download size={16} />
                                </a>
                            </div>
                        </TableCell>
                        <TableCell className="text-center">{c.segments}</TableCell>
                        <TableCell>{c.createdAt.toDate().toLocaleDateString()}</TableCell>
                        <TableCell>
                            {c.scheduledAt === "instant"
                                ? "Instant"
                                : new Date(c.scheduledAt.toString()).toLocaleString()}
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center">
                                {c.delivered}
                                <Button variant="ghost" size="icon" onClick={() => onUpdateDelivered(c)}>
                                    <Pencil size={16} />
                                </Button>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Select
                                value={c.status}
                                onValueChange={(value: Campaign["status"]) => onStatusChange(c.id, value)}
                            >
                                <SelectTrigger
                                    className={`
                                 px-2 py-1 rounded-full text-sm font-semibold
                                 ${c.status === "completed" ? "bg-green-100 text-green-800" : ""}
                                 ${c.status === "scheduled" ? "bg-blue-100 text-blue-800" : ""}
                                 ${c.status === "failed" ? "bg-red-100 text-red-800" : ""}
                                `}
                                >
                                    <SelectValue>{c.status.charAt(0).toUpperCase() + c.status.slice(1)}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
);

// ------------------- Admin Dashboard -------------------
export default function AdminCampaigns() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date");

    // Delivered modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [deliveredValue, setDeliveredValue] = useState<number>(0);

    useEffect(() => {
        const q = query(collection(db, "campaigns"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: Campaign[] = snapshot.docs.map((doc) => {
                const d = doc.data();
                return {
                    id: doc.id,
                    userId: d.userId,
                    name: d.name,
                    message: d.message || "",
                    contactCount: d.contactCount || 0,
                    driveLink: d.driveLink || "",
                    segments: d.segments || 0,
                    requiredCredits: d.requiredCredits || 0,
                    delivered: d.delivered || 0,
                    status: d.status,
                    createdAt: d.createdAt,
                    scheduledAt: d.scheduledAt || "",
                };
            });
            setCampaigns(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // ------------------- Handlers -------------------
    const handleStatusChange = async (id: string, status: Campaign["status"]) => {
        try {
            await updateDoc(doc(db, "campaigns", id), {status});
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateDelivered = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setDeliveredValue(campaign.delivered);
        setIsModalOpen(true);
    };

    const handleSaveDelivered = async () => {
        if (!selectedCampaign) return;
        try {
            await updateDoc(doc(db, "campaigns", selectedCampaign.id), {delivered: deliveredValue});
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredCampaigns = campaigns
        .filter((c) => {
            const matchesSearch =
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.message.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || c.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === "date") return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
            if (sortBy === "name") return a.name.localeCompare(b.name);
            return 0;
        });

    if (loading)
        return (
            <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );

    return (
        <AdminDashboardLayout>
            <div className="container mx-auto py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <h1 className="text-3xl font-bold">All Campaigns</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Campaigns</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{campaigns.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {campaigns.filter((c) => c.status === "completed").length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {campaigns.filter((c) => c.status === "scheduled").length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {campaigns.filter((c) => c.status === "failed").length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search campaigns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full md:w-[450px]"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <CampaignTable
                    campaigns={filteredCampaigns}
                    onStatusChange={handleStatusChange}
                    onUpdateDelivered={handleUpdateDelivered}
                />
                {/* Delivered Modal */}
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Delivered Count</DialogTitle>
                        </DialogHeader>
                        <Input
                            type="number"
                            value={deliveredValue}
                            onChange={(e) => setDeliveredValue(Number(e.target.value))}
                            className="mb-4"
                        />
                        <DialogFooter>
                            <Button onClick={handleSaveDelivered}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminDashboardLayout>
    );
}
