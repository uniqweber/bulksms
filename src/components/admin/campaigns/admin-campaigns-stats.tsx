"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface CampaignStatsProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    campaigns: any[];
}

export default function CampaignStats({campaigns}: CampaignStatsProps) {
    return (
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
                    <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{campaigns.filter((c) => c.status === "scheduled").length}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{campaigns.filter((c) => c.status === "completed").length}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{campaigns.filter((c) => c.status === "failed").length}</div>
                </CardContent>
            </Card>
        </div>
    );
}
