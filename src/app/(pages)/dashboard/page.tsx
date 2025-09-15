"use client";
import {useState} from "react";

import UserDashboardLayout from "@/components/dashboard/layout/dashboard-layout";
import OverviewHeader from "@/components/dashboard/overview/overview-header";
import QuickActions from "@/components/dashboard/overview/quick-actions";
import RecentCampaigns from "@/components/dashboard/overview/recent-campaigns";
import StatCard from "@/components/dashboard/overview/stat-card";
import {BarChart3, CreditCard, Send, Users} from "lucide-react";

export default function Dashboard() {
    // const [loading, setLoading] = useState(true);
    const [stats] = useState({
        totalSent: 0,
        activeContacts: 0,
        campaigns: 0,
        creditsRemaining: 0,
    });

    // useEffect(() => {
    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 1000);
    // }, []);

    // if (loading) {
    //     return (
    //         <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
    //             <Loader2 className="h-8 w-8 animate-spin text-primary" />
    //         </div>
    //     );
    // }

    return (
        <UserDashboardLayout>
            <div className="container mx-auto py-8 ">
                <OverviewHeader />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard
                        title="Credits Remaining"
                        value={stats.creditsRemaining}
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
