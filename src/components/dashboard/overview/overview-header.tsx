import {Button} from "@/components/ui/button";
import {CreditCard, Send} from "lucide-react";
import Link from "next/link";

export default function OverviewHeader() {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back, John Doe</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
                <Button variant="outline" asChild className="dark:hover:text-white">
                    <Link href="/dashboard/buy-credits" className="dark-hover:text-white">
                        <CreditCard className="mr-2 h-4 w-4" /> Buy Credits
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/dashboard/create-campaign">
                        <Send className="mr-2 h-4 w-4" /> New Campaign
                    </Link>
                </Button>
            </div>
        </div>
    );
}
