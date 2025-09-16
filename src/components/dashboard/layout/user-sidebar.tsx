"use client";

import {SidebarMenuButton} from "@/components/ui/sidebar";
import {useUser} from "@/context/firebase-context";
import {LogOut} from "lucide-react";

export function SidebarUser() {
    const {user, logout} = useUser();
    return (
        <div>
            <SidebarMenuButton size="lg">
                <div className="grid flex-1 dark:text-white text-black text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.displayName}</span>
                    <span className="truncate text-black/60 dark:text-white/60 text-xs">{user?.email}</span>
                </div>
                <div>
                    <LogOut onClick={logout} className="text-primary" />
                </div>
            </SidebarMenuButton>
        </div>
    );
}
