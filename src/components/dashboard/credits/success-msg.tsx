import {Button} from "@/components/ui/button";
import {Check} from "lucide-react";

export default function SuccessMsg({credits}: {credits: number}) {
    return (
        <div className="text-center py-12 bg-card border  rounded-lg shadow">
            <div className="rounded-full bg-green-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">Your account has been credited with {credits} SMS credits.</p>
            <div className="flex justify-center gap-4">
                <Button asChild>
                    <a href="/dashboard">Go to Dashboard</a>
                </Button>
                <Button variant="outline" asChild>
                    <a href="/campaigns/create">Create Campaign</a>
                </Button>
            </div>
        </div>
    );
}
