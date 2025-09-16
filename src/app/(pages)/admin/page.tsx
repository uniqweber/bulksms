"use client";

import AdminDashboardLayout from "@/components/admin/layout/admin-layout";
import AdminOverviewHeader from "@/components/admin/overview/admin-overview-header";
import AdminOverviewStats from "@/components/admin/overview/admin-overview-stats";
import PaymentsTable from "@/components/admin/payments/payments-table";
import UsersTable from "@/components/admin/users/users-table";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import useAllPayments from "@/hooks/use-all-payments";
import useAllUsers from "@/hooks/use-all-users";
import {CreditCard, Loader2, MessageSquare, MoreHorizontal, Users} from "lucide-react";
import {useEffect, useState} from "react";


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

// ================== Component ==================
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"users" | "campaigns" | "payments">("payments");
    const {users} = useAllUsers();
    const {payments, setPayments, loading: paymentLoading} = useAllPayments();
    const [loading, setLoading] = useState(true);

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
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
                setCampaigns(mockCampaigns);
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
                <AdminOverviewHeader />
                <AdminOverviewStats users={users} campaigns={campaigns} payments={payments} />

                <Tabs
                    defaultValue={activeTab}
                    className="w-full"
                    onValueChange={(val) => setActiveTab(val as "users" | "campaigns" | "payments")}
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <TabsList>
                            <TabsTrigger value="payments">
                                <CreditCard className="h-4 w-4 mr-2" /> Payments
                            </TabsTrigger>
                            <TabsTrigger value="campaigns">
                                <MessageSquare className="h-4 w-4 mr-2" /> Campaigns
                            </TabsTrigger>
                            <TabsTrigger value="users">
                                <Users className="h-4 w-4 mr-2" /> Users
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div>
                            <TabsContent value="payments" className="mt-0">
                                <PaymentsTable
                                    payments={payments.slice(0, 10)}
                                    loading={paymentLoading}
                                    setPayments={setPayments}
                                />
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
                            <TabsContent value="users" className="mt-0">
                                <UsersTable users={users.slice(0, 10)} loading={loading} />
                            </TabsContent>
                        </div>
                    )}
                </Tabs>
            </div>
        </AdminDashboardLayout>
    );
}
