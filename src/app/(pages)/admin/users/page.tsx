"use client";

import AdminDashboardLayout from "@/components/admin/layout/admin-layout";
import UsersTable from "@/components/admin/users/users-table";
import {Input} from "@/components/ui/input";
import useAllUsers from "@/hooks/use-all-users";
import {Search} from "lucide-react";
import {useState} from "react";

export default function AllUsers() {
    const {users, loading} = useAllUsers();
    const [searchTerm, setSearchTerm] = useState("");
    const filteredUsers = users.filter(
        (u) =>
            u?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <AdminDashboardLayout>
            <div className="container mx-auto px-4 py-8">
                <div className=" mb-8">
                    <h1 className="text-3xl font-bold">All Users</h1>
                    <p className="text-muted-foreground">Manage all registered users</p>
                </div>
                <div className="relative mb-4">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search with name and email"
                        className="pl-8 w-full md:w-[450px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <UsersTable users={filteredUsers} loading={loading} />
            </div>
        </AdminDashboardLayout>
    );
}
