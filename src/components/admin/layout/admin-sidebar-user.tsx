"use client";

import {Button} from "@/components/ui/button";
import {useUser} from "@/context/firebase-context";
import {LogOut} from "lucide-react";

export function SidebarUser() {
    const {user, logout} = useUser();
    return (
        <div className="flex items-center justify-between p-2.5">
            <div className="grid flex-1 dark:text-white text-black text-left text-sm leading-tight">
                <span className="truncate font-medium capitalize">{user?.displayName}</span>
                <span className="truncate text-black/60 dark:text-white/60 text-xs">{user?.email}</span>
            </div>
            <Button onClick={logout} className="text-white">
                <LogOut />
            </Button>
        </div>
    );
}
