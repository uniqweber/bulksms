/* eslint-disable @typescript-eslint/no-explicit-any */
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ReactNode} from "react";

interface AdminOverviewStatsProp {
    users: any[];
    campaigns: any[];
    payments: any[];
}

export default function AdminOverviewStats({users, campaigns, payments}: AdminOverviewStatsProp) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <AdminStatCard
                title="Total Users"
                stat={
                    <>
                        <div className="text-2xl font-bold">{users.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">{users.length} active users</p>
                    </>
                }
            />
            <AdminStatCard
                title="Total Campaigns"
                stat={
                    <>
                        <div className="text-2xl font-bold">{campaigns.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {campaigns.filter((c) => c.status === "completed").length} completed{" "}
                            {campaigns.filter((c) => c.status === "scheduled").length} scheduled{" "}
                            {campaigns.filter((c) => c.status === "failed").length} failed
                        </p>
                    </>
                }
            />

            <AdminStatCard
                title="Total Revenue"
                stat={
                    <>
                        <div className="text-2xl font-bold">
                            ${payments.filter((p) => p.status === "verified").reduce((sum, p) => sum + p.amount, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            From {payments.filter((p) => p.status === "verified").length} payments
                        </p>
                    </>
                }
            />
            <AdminStatCard
                title="Total Delivered Contacts"
                stat={
                    <>
                        <div className="text-2xl font-bold">{campaigns.filter((c) => c.delivered).reduce((sum, c) => sum + c.delivered, 0)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Across all campaigns</p>
                    </>
                }
            />
        </div>
    );
}

export const AdminStatCard = ({title, stat}: {title: string; stat: ReactNode}) => {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>{stat}</CardContent>
        </Card>
    );
};
