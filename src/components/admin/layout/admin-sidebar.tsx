"use client";

import {DollarSign, FileText, MessageCircle, Settings, Users2} from "lucide-react";
import * as React from "react";

import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail} from "@/components/ui/sidebar";
import {Branding} from "./admin-branding";
import {SidebarLinks} from "./admin-sidebar-links";
import {SidebarUser} from "./admin-sidebar-user";

// This is sample data.
const routes = [
    {
        name: "Overview",
        url: "/admin",
        icon: FileText,
    },
    {
        name: "Campaigns",
        url: "/admin/campaigns",
        icon: MessageCircle,
    },
    {
        name: "Payments",
        url: "/admin/payments",
        icon: DollarSign,
    },
    {
        name: "Users",
        url: "/admin/users",
        icon: Users2,
    },
    {
        name: "Settings",
        url: "/admin/account",
        icon: Settings,
    },
];

export function AdminDashboardSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="">
                <Branding />
            </SidebarHeader>
            <SidebarContent>
                <SidebarLinks routes={routes} />
            </SidebarContent>
            <SidebarFooter>
                <SidebarUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
