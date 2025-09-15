"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {CreditCard, Loader2, MessageSquare, MoreHorizontal, Search, Users} from "lucide-react";
import AdminDashboardLayout from "@/components/admin/layout/dashboard-layout";

// ================== Types ==================
type User = {
    id: string;
    name: string;
    email: string;
    credits: number;
    status: "active" | "inactive";
    campaigns: number;
    lastActive: string;
};

type Campaign = {
    id: string;
    name: string;
    userId: string;
    userName: string;
    contacts: number;
    status: "completed" | "scheduled" | "draft" | string;
    sentAt: string;
    deliveryRate: number | null;
};

type Payment = {
    id: string;
    userId: string;
    userName: string;
    amount: number;
    credits: number;
    method: string;
    status: "completed" | "pending" | string;
    date: string;
};

type Stats = {
    totalUsers: number;
    totalCampaigns: number;
    totalRevenue: number;
    activeUsers: number;
};

// ================== Component ==================
export default function AdminDashboard() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [activeTab, setActiveTab] = useState<"users" | "campaigns" | "payments">("users");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalCampaigns: 0,
        totalRevenue: 0,
        activeUsers: 0,
    });

    const [users, setUsers] = useState<User[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Mock Users
                const mockUsers: User[] = [
                    {
                        id: "user1",
                        name: "John Doe",
                        email: "john@example.com",
                        credits: 2500,
                        status: "active",
                        campaigns: 12,
                        lastActive: "2023-06-15",
                    },
                    {
                        id: "user2",
                        name: "Jane Smith",
                        email: "jane@example.com",
                        credits: 500,
                        status: "active",
                        campaigns: 5,
                        lastActive: "2023-06-14",
                    },
                    {
                        id: "user3",
                        name: "Bob Johnson",
                        email: "bob@example.com",
                        credits: 0,
                        status: "inactive",
                        campaigns: 0,
                        lastActive: "2023-05-20",
                    },
                    {
                        id: "user4",
                        name: "Alice Brown",
                        email: "alice@example.com",
                        credits: 10000,
                        status: "active",
                        campaigns: 25,
                        lastActive: "2023-06-15",
                    },
                    {
                        id: "user5",
                        name: "Charlie Wilson",
                        email: "charlie@example.com",
                        credits: 1500,
                        status: "active",
                        campaigns: 8,
                        lastActive: "2023-06-10",
                    },
                ];

                // Mock Campaigns
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
                    },
                ];

                // Mock Payments
                const mockPayments: Payment[] = [
                    {
                        id: "pay1",
                        userId: "user1",
                        userName: "John Doe",
                        amount: 100,
                        credits: 2500,
                        method: "bitcoin",
                        status: "completed",
                        date: "2023-06-05",
                    },
                    {
                        id: "pay2",
                        userId: "user4",
                        userName: "Alice Brown",
                        amount: 400,
                        credits: 10000,
                        method: "ethereum",
                        status: "completed",
                        date: "2023-06-08",
                    },
                    {
                        id: "pay3",
                        userId: "user2",
                        userName: "Jane Smith",
                        amount: 25,
                        credits: 500,
                        method: "bitcoin",
                        status: "completed",
                        date: "2023-06-10",
                    },
                    {
                        id: "pay4",
                        userId: "user5",
                        userName: "Charlie Wilson",
                        amount: 100,
                        credits: 2500,
                        method: "usdc",
                        status: "pending",
                        date: "2023-06-14",
                    },
                    {
                        id: "pay5",
                        userId: "user1",
                        userName: "John Doe",
                        amount: 25,
                        credits: 500,
                        method: "bitcoin",
                        status: "completed",
                        date: "2023-05-20",
                    },
                ];

                setUsers(mockUsers);
                setCampaigns(mockCampaigns);
                setPayments(mockPayments);

                // Stats
                setStats({
                    totalUsers: mockUsers.length,
                    totalCampaigns: mockCampaigns.length,
                    totalRevenue: mockPayments.reduce(
                        (sum, payment) => sum + (payment.status === "completed" ? payment.amount : 0),
                        0
                    ),
                    activeUsers: mockUsers.filter((u) => u.status === "active").length,
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filtering
    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCampaigns = campaigns.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPayments = payments.filter(
        (p) =>
            p.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.method.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminDashboardLayout>
            <div className="container mx-auto py-8 px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage users, campaigns, and payments</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Button asChild>
                            <Link href="/dashboard">Back to User Dashboard</Link>
                        </Button>
                    </div>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                            <p className="text-xs text-muted-foreground mt-1">{stats.activeUsers} active users</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Campaigns</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {campaigns.filter((c) => c.status === "completed").length} completed
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${stats.totalRevenue}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                From {payments.filter((p) => p.status === "completed").length} payments
                            </p>
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
                            <p className="text-xs text-muted-foreground mt-1">Across all campaigns</p>
                        </CardContent>
                    </Card>
                </div>
                {/* Tabs + Search */}
                <Tabs
                    defaultValue="users"
                    className="w-full"
                    onValueChange={(val) => setActiveTab(val as "users" | "campaigns" | "payments")}
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <TabsList>
                            <TabsTrigger value="users">
                                <Users className="h-4 w-4 mr-2" /> Users
                            </TabsTrigger>
                            <TabsTrigger value="campaigns">
                                <MessageSquare className="h-4 w-4 mr-2" /> Campaigns
                            </TabsTrigger>
                            <TabsTrigger value="payments">
                                <CreditCard className="h-4 w-4 mr-2" /> Payments
                            </TabsTrigger>
                        </TabsList>
                        <div className="mt-4 md:mt-0 md:ml-4 relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="pl-8 w-full md:w-[250px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Content */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div>
                            {/* Users Tab */}
                            <TabsContent value="users" className="mt-0">
                                <Card>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left p-4 font-medium">Name</th>
                                                        <th className="text-left p-4 font-medium">Email</th>
                                                        <th className="text-left p-4 font-medium">Credits</th>
                                                        <th className="text-left p-4 font-medium">Status</th>
                                                        <th className="text-left p-4 font-medium">Campaigns</th>
                                                        <th className="text-left p-4 font-medium">Last Active</th>
                                                        <th className="text-left p-4 font-medium">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredUsers.length > 0 ? (
                                                        filteredUsers.map((user) => (
                                                            <tr key={user.id} className="border-b hover:bg-muted/50">
                                                                <td className="p-4">{user.name}</td>
                                                                <td className="p-4">{user.email}</td>
                                                                <td className="p-4">{user.credits}</td>
                                                                <td className="p-4">
                                                                    <Badge
                                                                        variant={
                                                                            user.status === "active"
                                                                                ? "default"
                                                                                : "secondary"
                                                                        }
                                                                    >
                                                                        {user.status}
                                                                    </Badge>
                                                                </td>
                                                                <td className="p-4">{user.campaigns}</td>
                                                                <td className="p-4">{user.lastActive}</td>
                                                                <td className="p-4">
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan={7}
                                                                className="p-4 text-center text-muted-foreground"
                                                            >
                                                                No users found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            {/* Campaigns Tab */}
                            <TabsContent value="campaigns" className="mt-0">
                                <Card>
                                    <CardContent className="p-0">
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
                                                            <tr
                                                                key={campaign.id}
                                                                className="border-b hover:bg-muted/50"
                                                            >
                                                                <td className="p-4">{campaign.name}</td>
                                                                <td className="p-4">{campaign.userName}</td>
                                                                <td className="p-4">{campaign.contacts}</td>
                                                                <td className="p-4">
                                                                    <Badge
                                                                        variant={
                                                                            campaign.status === "completed"
                                                                                ? "default"
                                                                                : campaign.status === "scheduled"
                                                                                ? "outline"
                                                                                : "secondary"
                                                                        }
                                                                    >
                                                                        {campaign.status}
                                                                    </Badge>
                                                                </td>
                                                                <td className="p-4">{campaign.sentAt}</td>
                                                                <td className="p-4">
                                                                    {campaign.deliveryRate
                                                                        ? `${campaign.deliveryRate}%`
                                                                        : "N/A"}
                                                                </td>
                                                                <td className="p-4">
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan={7}
                                                                className="p-4 text-center text-muted-foreground"
                                                            >
                                                                No campaigns found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            {/* Payments Tab */}
                            <TabsContent value="payments" className="mt-0">
                                <Card>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left p-4 font-medium">ID</th>
                                                        <th className="text-left p-4 font-medium">User</th>
                                                        <th className="text-left p-4 font-medium">Amount</th>
                                                        <th className="text-left p-4 font-medium">Credits</th>
                                                        <th className="text-left p-4 font-medium">Method</th>
                                                        <th className="text-left p-4 font-medium">Status</th>
                                                        <th className="text-left p-4 font-medium">Date</th>
                                                        <th className="text-left p-4 font-medium">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredPayments.length > 0 ? (
                                                        filteredPayments.map((payment) => (
                                                            <tr key={payment.id} className="border-b hover:bg-muted/50">
                                                                <td className="p-4">{payment.id}</td>
                                                                <td className="p-4">{payment.userName}</td>
                                                                <td className="p-4">${payment.amount}</td>
                                                                <td className="p-4">{payment.credits}</td>
                                                                <td className="p-4">{payment.method}</td>
                                                                <td className="p-4">
                                                                    <Badge
                                                                        variant={
                                                                            payment.status === "completed"
                                                                                ? "default"
                                                                                : "secondary"
                                                                        }
                                                                    >
                                                                        {payment.status}
                                                                    </Badge>
                                                                </td>
                                                                <td className="p-4">{payment.date}</td>
                                                                <td className="p-4">
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan={8}
                                                                className="p-4 text-center text-muted-foreground"
                                                            >
                                                                No payments found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    )}
                </Tabs>
            </div>
        </AdminDashboardLayout>
    );
}
