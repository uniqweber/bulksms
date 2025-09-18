import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";

const quickActions = [
    {
        title: "Create Campaign",
        description: "Send messages to your contacts",
        content: "Create a new SMS campaign to reach your audience with important updates or promotions.",
        label: "Start Now",
        link: "/dashboard/create-campaign",
    },
    {
        title: "Buy Credits",
        description: "Add more messaging credits",
        content: "Purchase additional SMS credits to continue sending messages to your contacts.",
        label: "View Plans",
        link: "/dashboard/buy-credits",
    },
    {
        title: "Account Settings",
        description: "Manage your profile",
        content: "Update your profile information, change your password, and manage your account preferences.",
        label: "Settings",
        link: "/dashboard/account",
    },
];

export default function QuickActions() {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4  ">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{action.title}</CardTitle>
                            <CardDescription>{action.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground border-t pt-4 border-dashed">
                            {action.content}
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full dark:hover:text-white" variant={"outline"} asChild>
                                <Link href={action.link}>{action.label}</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
