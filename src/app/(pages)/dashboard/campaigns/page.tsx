"use client";

import UserDashboardLayout from "@/components/dashboard/layout/dashboard-layout";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ArrowUpDown, Loader2, Search, Send} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";

// ------------------- Types -------------------
interface Campaign {
    id: string;
    name: string;
    date: string;
    recipients: number;
    sent: number;
    delivered: number;
    status: "completed" | "scheduled" | "failed" | "pending";
    message: string;
}

// ------------------- Status Badge -------------------
interface CampaignStatusBadgeProps {
    status: Campaign["status"];
}
const CampaignStatusBadge: React.FC<CampaignStatusBadgeProps> = ({status}) => {
    const statusConfig: Record<Campaign["status"], {className: string; label: string}> = {
        completed: {className: "bg-green-100 text-green-800", label: "Completed"},
        scheduled: {className: "bg-blue-100 text-blue-800", label: "Scheduled"},
        failed: {className: "bg-red-100 text-red-800", label: "Failed"},
        pending: {className: "bg-yellow-100 text-yellow-800", label: "Pending"},
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.className}`}>
            {config.label}
        </span>
    );
};

// ------------------- Campaign Table -------------------
interface CampaignTableProps {
    campaigns: Campaign[];
}
const CampaignTable: React.FC<CampaignTableProps> = ({campaigns}) => (
    <div className="bg-card border rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="border-b">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Recipients
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Delivered
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                        </th>
                      
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {campaigns.map((c) => (
                        <tr key={c.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{c.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{c.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                {c.recipients}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                {c.delivered} ({Math.round((c.delivered / c.recipients) * 100)}%)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <CampaignStatusBadge status={c.status} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// ------------------- No Campaigns -------------------
interface NoCampaignsProps {
    searchTerm: string;
    statusFilter: string;
}
const NoCampaigns: React.FC<NoCampaignsProps> = ({searchTerm, statusFilter}) => (
    <div className="text-center py-12 bg-white rounded-lg shadow">
        <Send className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No campaigns found</h3>
        <p className="mt-2 text-muted-foreground">
            {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters or search term"
                : "Create your first campaign to start sending messages"}
        </p>
        {!searchTerm && statusFilter === "all" && (
            <Button className="mt-4" asChild>
                <Link href="/dashboard/create-campaign">Create Campaign</Link>
            </Button>
        )}
    </div>
);

// ------------------- Main Component -------------------
export default function Campaigns() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        // const currentUser = {displayName: "John Doe", email: "", phoneNumber: "", photoURL: ""};

        const fetchCampaigns = async () => {
            // Mock data
            const mockCampaigns: Campaign[] = [
                {
                    id: "1",
                    name: "Welcome Message",
                    date: "2023-10-15",
                    recipients: 120,
                    sent: 120,
                    delivered: 118,
                    status: "completed",
                    message: "Welcome to our service!",
                },
                {
                    id: "2",
                    name: "October Promotion",
                    date: "2023-10-10",
                    recipients: 250,
                    sent: 250,
                    delivered: 245,
                    status: "completed",
                    message: "Don't miss our October special!",
                },
                {
                    id: "3",
                    name: "Customer Survey",
                    date: "2023-10-05",
                    recipients: 180,
                    sent: 180,
                    delivered: 175,
                    status: "completed",
                    message: "We value your feedback!",
                },
                {
                    id: "4",
                    name: "Black Friday Preview",
                    date: "2023-11-20",
                    recipients: 300,
                    sent: 0,
                    delivered: 0,
                    status: "scheduled",
                    message: "Black Friday deals start next week.",
                },
                {
                    id: "5",
                    name: "Service Update",
                    date: "2023-09-28",
                    recipients: 200,
                    sent: 198,
                    delivered: 190,
                    status: "completed",
                    message: "Maintenance on Oct 1st.",
                },
            ];

            setCampaigns(mockCampaigns);
            setLoading(false);
        };

        fetchCampaigns();
    }, []);

    const toggleSortOrder = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc");

    const filteredCampaigns = campaigns
        .filter((c) => {
            const matchesSearch =
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.message.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || c.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            let comparison = 0;
            if (sortBy === "date") comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            else if (sortBy === "name") comparison = a.name.localeCompare(b.name);
            else if (sortBy === "recipients") comparison = a.recipients - b.recipients;
            return sortOrder === "asc" ? comparison : -comparison;
        });

    if (loading)
        return (
            <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );

    return (
        <UserDashboardLayout>
            <div className="container mx-auto py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Campaigns</h1>
                        <p className="text-muted-foreground mt-1">Manage your SMS campaigns</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Button asChild>
                            <Link href="/dashboard/create-campaign">
                                <Send className="mr-2 h-4 w-4" /> New Campaign
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search campaigns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="w-40">
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
                        </div>
                        <div className="w-40">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="recipients">Recipients</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button variant="outline" size="icon" onClick={toggleSortOrder}>
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Campaigns */}
                {filteredCampaigns.length > 0 ? (
                    <CampaignTable campaigns={filteredCampaigns} />
                ) : (
                    <NoCampaigns searchTerm={searchTerm} statusFilter={statusFilter} />
                )}
            </div>
        </UserDashboardLayout>
    );
}
