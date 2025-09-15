"use client";

import {CreditCard, FileText, MessageCircle, User} from "lucide-react";
import * as React from "react";

import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail} from "@/components/ui/sidebar";
import {Branding} from "./branding";
import {SidebarLinks} from "./sidebar-links";
import {SidebarUser} from "./sidebar-user";

// This is sample data.
const data = {
    user: {
        name: "John Doe",
        email: "m@example.com",
        avatar: "/images/placeholder.jpg",
    },

    routes: [
        {
            name: "Overview",
            url: "/dashboard",
            icon: FileText,
        },
        {
            name: "Create Campaign",
            url: "/dashboard/create-campaign",
            icon: MessageCircle,
        },
        {
            name: "Campaigns",
            url: "/dashboard/campaigns",
            icon: FileText,
        },
        {
            name: "Buy Credits",
            url: "/dashboard/buy-credits",
            icon: CreditCard,
        },
        {
            name: "Account",
            url: "/dashboard/account",
            icon: User,
        },
    ],
};

export function DashboardSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="">
                <Branding />
            </SidebarHeader>
            <SidebarContent>
                <SidebarLinks routes={data.routes} />
            </SidebarContent>
            <SidebarFooter>
                <SidebarUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
