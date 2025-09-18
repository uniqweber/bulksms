"use client";

import {Button} from "@/components/ui/button";
import {Send} from "lucide-react";
import Link from "next/link";

const NoCampaigns: React.FC = () => (
    <div className="bg-card text-card-foreground  rounded-xl border py-12 text-center mb-8 shadow-sm">
        <Send className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No campaigns yet</h3>
        <p className="mt-2 text-muted-foreground">Create your first campaign to start sending messages</p>
        <Button className="mt-4">
            <Link href="/dashboard/create-campaign">Create Campaign</Link>
        </Button>
    </div>
);

export default NoCampaigns;
