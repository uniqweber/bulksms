"use client";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Loader2} from "lucide-react";

interface User {
    id: string;
    displayName?: string;
    email?: string;
    phone?: string;
    company?: string;
    currentCredit: number;
    campaigns: [];
    role?: string;
}

interface UsersTableProps {
    users: User[];
    loading: boolean;
}

export default function UsersTable({users, loading}: UsersTableProps) {
    return (
        <div>
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <Table className="border">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Credits</TableHead>
                            <TableHead>Campaigns</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="p-4 text-center text-muted-foreground">
                                    No users found
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} className="border-b hover:bg-muted/50">
                                    <TableCell className="p-4">{user.displayName || "-"}</TableCell>
                                    <TableCell className="p-4">{user.email || "-"}</TableCell>
                                    <TableCell className="p-4">{user.phone || "-"}</TableCell>
                                    <TableCell className="p-4">{user.company || "-"}</TableCell>
                                    <TableCell className="p-4">{user.currentCredit}</TableCell>
                                    <TableCell className="p-4">{user.campaigns.length}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
