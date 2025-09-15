"use client";

import AdminDashboardLayout from "@/components/admin/layout/dashboard-layout";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {AlertCircle, Edit, Loader2, Plus, Search, Trash2} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";

// Types
interface User {
    id: string;
    name: string;
    email: string;
    credits: number;
    status: "active" | "inactive";
    campaigns: number;
    lastActive: string;
}

interface EditForm {
    name: string;
    email: string;
    credits: number;
    status: "active" | "inactive";
}

export default function AdminUsers() {
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [editForm, setEditForm] = useState<EditForm>({
        name: "",
        email: "",
        credits: 0,
        status: "active",
    });

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const mockUsers: User[] = [
                    {
                        id: "user1",
                        name: "John Doe",
                        email: "john@example.com",
                        credits: 2500,
                        status: "active",
                        campaigns: 12,
                        lastActive: "2023-06-15",
                    },
                    {
                        id: "user2",
                        name: "Jane Smith",
                        email: "jane@example.com",
                        credits: 500,
                        status: "active",
                        campaigns: 5,
                        lastActive: "2023-06-14",
                    },
                    {
                        id: "user3",
                        name: "Bob Johnson",
                        email: "bob@example.com",
                        credits: 0,
                        status: "inactive",
                        campaigns: 0,
                        lastActive: "2023-05-20",
                    },
                    {
                        id: "user4",
                        name: "Alice Brown",
                        email: "alice@example.com",
                        credits: 10000,
                        status: "active",
                        campaigns: 25,
                        lastActive: "2023-06-15",
                    },
                    {
                        id: "user5",
                        name: "Charlie Wilson",
                        email: "charlie@example.com",
                        credits: 1500,
                        status: "active",
                        campaigns: 8,
                        lastActive: "2023-06-10",
                    },
                ];
                setUsers(mockUsers);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setEditForm({
            name: user.name,
            email: user.email,
            credits: user.credits,
            status: user.status,
        });
        setIsEditDialogOpen(true);
    };

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const handleEditFormChange = (field: keyof EditForm, value: string | number) => {
        setEditForm((prev) => ({
            ...prev,
            [field]: field === "credits" ? Number(value) : value,
        }));
    };

    const handleSaveUser = () => {
        if (!selectedUser) return;
        const updatedUsers = users.map((user) => (user.id === selectedUser.id ? {...user, ...editForm} : user));
        setUsers(updatedUsers);
        setIsEditDialogOpen(false);
    };

    const handleConfirmDelete = () => {
        if (!selectedUser) return;
        const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
        setUsers(updatedUsers);
        setIsDeleteDialogOpen(false);
    };

    return (
        <AdminDashboardLayout>
            <div className="container mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">User Management</h1>
                        <p className="text-muted-foreground">Manage user accounts and permissions</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-4">
                        <Button asChild variant="outline">
                            <Link href="/admin">Back to Dashboard</Link>
                        </Button>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add User
                        </Button>
                    </div>
                </div>
                {/* Search */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search users..."
                            className="pl-8 w-full md:w-[350px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                {/* Users Table */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-4 font-medium">Name</th>
                                            <th className="text-left p-4 font-medium">Email</th>
                                            <th className="text-left p-4 font-medium">Credits</th>
                                            <th className="text-left p-4 font-medium">Status</th>
                                            <th className="text-left p-4 font-medium">Campaigns</th>
                                            <th className="text-left p-4 font-medium">Last Active</th>
                                            <th className="text-left p-4 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <tr key={user.id} className="border-b hover:bg-muted/50">
                                                    <td className="p-4">{user.name}</td>
                                                    <td className="p-4">{user.email}</td>
                                                    <td className="p-4">{user.credits}</td>
                                                    <td className="p-4">
                                                        <Badge variant={user.status === "active" ? "default" : "secondary"}>
                                                            {user.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4">{user.campaigns}</td>
                                                    <td className="p-4">{user.lastActive}</td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleEditUser(user)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDeleteUser(user)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="p-4 text-center text-muted-foreground">
                                                    No users found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
                {/* Edit User Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>Make changes to the user&apos;s account details.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={editForm.name}
                                    onChange={(e) => handleEditFormChange("name", e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => handleEditFormChange("email", e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="credits" className="text-right">
                                    Credits
                                </Label>
                                <Input
                                    id="credits"
                                    type="number"
                                    value={editForm.credits}
                                    onChange={(e) => handleEditFormChange("credits", e.target.value)}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                    Status
                                </Label>
                                <Select
                                    value={editForm.status}
                                    onValueChange={(value) => handleEditFormChange("status", value)}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveUser}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                {/* Delete User Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete User</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this user? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        {selectedUser && (
                            <div className="bg-muted p-4 rounded-md mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle className="h-4 w-4 text-destructive" />
                                    <p className="font-medium">You are about to delete:</p>
                                </div>
                                <p>
                                    <strong>Name:</strong> {selectedUser.name}
                                </p>
                                <p>
                                    <strong>Email:</strong> {selectedUser.email}
                                </p>
                                <p>
                                    <strong>Campaigns:</strong> {selectedUser.campaigns}
                                </p>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleConfirmDelete}>
                                Delete User
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminDashboardLayout>
    );
}
