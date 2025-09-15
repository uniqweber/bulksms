import {DashboardSidebar} from "@/components/dashboard/layout/user-dashboard-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Separator} from "@/components/ui/separator";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {ThemeToggler} from "@/components/ui/theme-toggler";
import PrivateRoute from "@/context/private-route-provider";
import {ReactNode} from "react";

export default function UserDashboardLayout({children}: {children: ReactNode}) {
    return (
        <PrivateRoute>
            <SidebarProvider>
                <DashboardSidebar />
                <SidebarInset>
                    <header className="flex h-16 border-b sticky top-0 bg-background shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center justify-between w-full px-4">
                            <div className="flex items-center gap-2">
                                <SidebarTrigger className="-ml-1" />
                                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem className="hidden md:block">
                                            <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
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
