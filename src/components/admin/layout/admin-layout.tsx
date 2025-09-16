import {Separator} from "@/components/ui/separator";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {ThemeToggler} from "@/components/ui/theme-toggler";
import PrivateRoute from "@/context/private-route-provider";
import {ReactNode} from "react";
import {AdminDashboardSidebar} from "./admin-sidebar";

export default function AdminDashboardLayout({children}: {children: ReactNode}) {
    return (
        <PrivateRoute adminOnly>
            <SidebarProvider>
                <AdminDashboardSidebar />
                <SidebarInset>
                    <header className="flex h-16 border-b sticky top-0 bg-background shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center justify-between w-full px-4">
                            <div className="flex items-center gap-2">
                                <SidebarTrigger className="-ml-1" />
                                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                            </div>
                            <ThemeToggler />
                        </div>
                    </header>
                    <div className="p-4 pt-0">{children}</div>
                </SidebarInset>
            </SidebarProvider>
        </PrivateRoute>
    );
}
