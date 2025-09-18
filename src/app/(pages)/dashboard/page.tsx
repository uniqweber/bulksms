"use client";
import {useEffect, useState} from "react";

import UserDashboardLayout from "@/components/dashboard/layout/user-dashboard-layout";
import OverviewHeader from "@/components/dashboard/overview/overview-header";
import QuickActions from "@/components/dashboard/overview/quick-actions";
import RecentCampaigns from "@/components/dashboard/overview/recent-campaigns";
import StatCard from "@/components/dashboard/overview/stat-card";
import {useUser} from "@/context/firebase-context";
import {db} from "@/firebase";
import useCurrentCredits from "@/hooks/use-current-credit";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {BarChart3, CreditCard, Send, Users} from "lucide-react";

export default function Dashboard() {
    const {user} = useUser();
    const credits = useCurrentCredits();
    const [stats, setStats] = useState({
        totalSent: 0,
        activeContacts: 0,
        campaigns: 0,
    });
    useEffect(() => {
        if (!user) return;

        const q = query(collection(db, "campaigns"), where("userId", "==", user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const campaignsData = snapshot.docs.map((doc) => doc.data());

            const totalSent = campaignsData.reduce((sum, c) => sum + (c.delivered || 0), 0);
            const activeContacts = campaignsData.reduce((sum, c) => sum + (c.contactCount || 0), 0);
            const campaignsCount = snapshot.size;

            setStats({
                totalSent,
                activeContacts,
                campaigns: campaignsCount,
            });
        });

        return () => unsubscribe();
    }, [user]);

    if (!user) return null;

    return (
        <UserDashboardLayout>
            <div className="container mx-auto py-8 ">
                <OverviewHeader />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="Credits Remaining"
                        value={credits}
                        description="Available for campaigns"
                        icon={<CreditCard className="h-5 w-5 text-primary" />}
                    />
                    <StatCard
                        title="Messages Sent"
                        value={stats.totalSent}
                        description="Total all time"
                        icon={<Send className="h-5 w-5 text-primary" />}
                    />
                    <StatCard
                        title="Active Contacts"
                        value={stats.activeContacts}
                        description="In your database"
                        icon={<Users className="h-5 w-5 text-primary" />}
                    />
                    <StatCard
                        title="Campaigns"
                        value={stats.campaigns}
                        description="Created so far"
                        icon={<BarChart3 className="h-5 w-5 text-primary" />}
                    />
                </div>
                <RecentCampaigns />
                <QuickActions />
            </div>
        </UserDashboardLayout>
    );
}
