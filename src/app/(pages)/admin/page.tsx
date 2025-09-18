"use client";

import AdminDeliveryCampaigns from "@/components/admin/campaigns/admin-delivery-campaigns";
import AdminDashboardLayout from "@/components/admin/layout/admin-layout";
import AdminOverviewHeader from "@/components/admin/overview/admin-overview-header";
import AdminOverviewStats from "@/components/admin/overview/admin-overview-stats";
import PaymentsTable from "@/components/admin/payments/payments-table";
import UsersTable from "@/components/admin/users/users-table";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {db} from "@/firebase";
import useAllPayments from "@/hooks/use-all-payments";
import useAllUsers from "@/hooks/use-all-users";
import {collection, onSnapshot, query} from "firebase/firestore";
import {CreditCard, Loader2, MessageSquare, Users} from "lucide-react";
import {useEffect, useState} from "react";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"users" | "campaigns" | "payments">("payments");
    const {users} = useAllUsers();
    const {payments, setPayments, loading: paymentLoading} = useAllPayments();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "campaigns"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
            setCampaigns(data);
            setLoading(false);
        });
        return () => unsubscribe();
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
                                    payments={payments.sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()).slice(0, 10)}
                                    loading={paymentLoading}
                                    setPayments={setPayments}
                                />
                            </TabsContent>

                            <TabsContent value="campaigns" className="mt-0">
                                <AdminDeliveryCampaigns
                                    campaigns={campaigns
                                        .sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime())
                                        .slice(0, 10)}
                                />
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
