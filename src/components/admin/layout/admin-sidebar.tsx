"use client";

import {CreditCard, FileText, MessageCircle, User} from "lucide-react";
import * as React from "react";

import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail} from "@/components/ui/sidebar";
import {Branding} from "./admin-branding";
import {SidebarLinks} from "./admin-sidebar-links";
import {SidebarUser} from "./admin-sidebar-user";

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
            url: "/admin",
            icon: FileText,
        },
        {
            name: "Campaign",
            url: "/admin/campaigns",
            icon: MessageCircle,
        },
        {
            name: "Payments",
            url: "/admin/payments",
            icon: FileText,
        },
        {
            name: "Users",
            url: "/admin/users",
            icon: CreditCard,
        },
        {
            name: "Settings",
            url: "/admin/settings",
            icon: User,
        },
    ],
};

export function AdminDashboardSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
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
