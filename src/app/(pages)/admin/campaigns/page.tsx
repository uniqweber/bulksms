"use client";

import AdminDashboardLayout from "@/components/admin/layout/dashboard-layout";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Eye, Loader2, Search, AlertCircle} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";

// --- Campaign type ---
interface Campaign {
    id: string;
    name: string;
    userId: string;
    userName: string;
    contacts: number;
    status: "completed" | "scheduled" | "failed";
    sentAt: string;
    deliveryRate: number | null;
    message: string;
}

export default function AdminCampaigns() {
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
    const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "scheduled" | "failed">("all");

    useEffect(() => {
        const fetchCampaigns = async () => {
            setLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const mockCampaigns: Campaign[] = [
                    {
                        id: "camp1",
                        name: "Summer Promotion",
                        userId: "user1",
                        userName: "John Doe",
                        contacts: 1200,
                        status: "completed",
                        sentAt: "2023-06-10",
                        deliveryRate: 98,
                        message:
                            "Get 20% off on all summer products! Use code SUMMER20 at checkout. Valid until June 30th.",
                    },
                    {
                        id: "camp2",
                        name: "New Product Launch",
                        userId: "user4",
                        userName: "Alice Brown",
                        contacts: 5000,
                        status: "completed",
                        sentAt: "2023-06-12",
                        deliveryRate: 97,
                        message:
                            "Introducing our new product line! Check it out at example.com/new. Limited stock available.",
                    },
                    {
                        id: "camp3",
                        name: "Customer Survey",
                        userId: "user2",
                        userName: "Jane Smith",
                        contacts: 350,
                        status: "completed",
                        sentAt: "2023-06-13",
                        deliveryRate: 99,
                        message:
                            "We value your feedback! Please take our quick survey at survey.example.com/feedback to help us improve.",
                    },
                    {
                        id: "camp4",
                        name: "Weekly Newsletter",
                        userId: "user1",
                        userName: "John Doe",
                        contacts: 1100,
                        status: "scheduled",
                        sentAt: "2023-06-17",
                        deliveryRate: null,
                        message:
                            "This week's top stories: 1. Industry news 2. Tips and tricks 3. Upcoming events. Read more at newsletter.example.com",
                    },
                    {
                        id: "camp5",
                        name: "Flash Sale",
                        userId: "user5",
                        userName: "Charlie Wilson",
                        contacts: 800,
                        status: "completed",
                        sentAt: "2023-06-09",
                        deliveryRate: 96,
                        message:
                            "FLASH SALE! 50% off everything for the next 24 hours only. Shop now at example.com/sale",
                    },
                    {
                        id: "camp6",
                        name: "Appointment Reminder",
                        userId: "user3",
                        userName: "Bob Johnson",
                        contacts: 75,
                        status: "failed",
                        sentAt: "2023-06-11",
                        deliveryRate: 45,
                        message:
                            "Reminder: Your appointment is scheduled for tomorrow at 2:00 PM. Reply YES to confirm or NO to reschedule.",
                    },
                ];

                setCampaigns(mockCampaigns);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    const filteredCampaigns = campaigns.filter((campaign) => {
        const matchesSearch =
            campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.userName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleViewCampaign = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setIsViewDialogOpen(true);
    };

    const getCampaignStatusColor = (
        status: Campaign["status"]
    ): "default" | "outline" | "destructive" | "secondary" => {
        switch (status) {
            case "completed":
                return "default";
            case "scheduled":
                return "outline";
            case "failed":
                return "destructive";
            default:
                return "secondary";
        }
    };

    return (
        <AdminDashboardLayout>
            <div className="container mx-auto py-8 px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Campaign Management</h1>
                        <p className="text-muted-foreground">Monitor and manage all SMS campaigns</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Button asChild variant="outline">
                            <Link href="/admin">Back to Dashboard</Link>
                        </Button>
                    </div>
                </div>

                {/* Search + Filters */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search campaigns..."
                            className="pl-8 w-full md:w-[350px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-4">
                        <Select
                            value={statusFilter}
                            onValueChange={(value) =>
                                setStatusFilter(value as "all" | "completed" | "scheduled" | "failed")
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="newest">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="name">Name (A-Z)</SelectItem>
                                <SelectItem value="contacts">Contacts (High-Low)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Stats */}
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
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Avg. Delivery Rate
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {campaigns.filter((c) => c.deliveryRate).length > 0
                                    ? (
                                          campaigns.reduce((sum, c) => sum + (c.deliveryRate || 0), 0) /
                                          campaigns.filter((c) => c.deliveryRate).length
                                      ).toFixed(1) + "%"
                                    : "N/A"}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-4 font-medium">Campaign Name</th>
                                            <th className="text-left p-4 font-medium">User</th>
                                            <th className="text-left p-4 font-medium">Contacts</th>
                                            <th className="text-left p-4 font-medium">Status</th>
                                            <th className="text-left p-4 font-medium">Sent Date</th>
                                            <th className="text-left p-4 font-medium">Delivery Rate</th>
                                            <th className="text-left p-4 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCampaigns.length > 0 ? (
                                            filteredCampaigns.map((campaign) => (
                                                <tr key={campaign.id} className="border-b hover:bg-muted/50">
                                                    <td className="p-4">{campaign.name}</td>
                                                    <td className="p-4">{campaign.userName}</td>
                                                    <td className="p-4">{campaign.contacts}</td>
                                                    <td className="p-4">
                                                        <Badge variant={getCampaignStatusColor(campaign.status)}>
                                                            {campaign.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4">{campaign.sentAt}</td>
                                                    <td className="p-4">
                                                        {campaign.deliveryRate ? `${campaign.deliveryRate}%` : "N/A"}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleViewCampaign(campaign)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="p-4 text-center text-muted-foreground">
                                                    No campaigns found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dialog */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Campaign Details</DialogTitle>
                            <DialogDescription>Detailed information about the campaign.</DialogDescription>
                        </DialogHeader>
                        {selectedCampaign && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground text-sm">Campaign Name</Label>
                                        <p className="font-medium">{selectedCampaign.name}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-sm">Status</Label>
                                        <div>
                                            <Badge variant={getCampaignStatusColor(selectedCampaign.status)}>
                                                {selectedCampaign.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-sm">User</Label>
                                        <p className="font-medium">{selectedCampaign.userName}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-sm">User ID</Label>
                                        <p className="font-medium">{selectedCampaign.userId}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-sm">Contacts</Label>
                                        <p className="font-medium">{selectedCampaign.contacts}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-sm">Sent Date</Label>
                                        <p className="font-medium">{selectedCampaign.sentAt}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-sm">Delivery Rate</Label>
                                        <p className="font-medium">
                                            {selectedCampaign.deliveryRate
                                                ? `${selectedCampaign.deliveryRate}%`
                                                : "N/A"}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-sm">Message Content</Label>
                                    <div className="mt-1 p-3 bg-muted rounded-md">
                                        <p>{selectedCampaign.message}</p>
                                    </div>
                                </div>
                                {selectedCampaign.status === "failed" && (
                                    <div className="bg-destructive/10 p-4 rounded-md">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-destructive" />
                                            <p className="font-medium text-destructive">Campaign Failed</p>
                                        </div>
                                        <p className="text-sm mt-1">
                                            This campaign encountered delivery issues. Please check the system logs for
                                            more details.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminDashboardLayout>
    );
}
