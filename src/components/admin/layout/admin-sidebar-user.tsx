"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {SidebarMenuButton} from "@/components/ui/sidebar";
import {LogOut} from "lucide-react";

export function SidebarUser({
    user,
}: {
    user: {
        name: string;
        email: string;
        avatar: string;
    };
}) {
    return (
        <div>
            <SidebarMenuButton size="lg">
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 dark:text-white text-black text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-black/60 dark:text-white/60 text-xs">{user.email}</span>
                </div>
                <LogOut />
            </SidebarMenuButton>
        </div>
    );
}
