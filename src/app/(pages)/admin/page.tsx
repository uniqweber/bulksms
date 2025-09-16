"use client";

import AdminDashboardLayout from "@/components/admin/layout/admin-layout";
import UsersTable from "@/components/admin/users/users-table";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import useAllUsers from "@/hooks/use-all-users";
import {CreditCard, Loader2, MessageSquare, MoreHorizontal, Users} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";

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
    const {users} = useAllUsers();
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalCampaigns: 0,
        totalRevenue: 0,
        activeUsers: 0,
    });

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));

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

                setCampaigns(mockCampaigns);
                setPayments(mockPayments);

                // Stats
                setStats({
                    totalUsers: users.length,
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
                                <UsersTable users={users.slice(0, 10)} loading={loading} />
                            </TabsContent>

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
                                                    {campaigns.length > 0 ? (
                                                        campaigns.map((campaign) => (
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
                                                    {payments.length > 0 ? (
                                                        payments.map((payment) => (
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
