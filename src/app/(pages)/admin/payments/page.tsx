"use client";

import AdminDashboardLayout from "@/components/admin/layout/admin-layout";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
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
import {Download, Eye, Loader2, Search} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";

// ✅ Payment type
type Payment = {
    id: string;
    userId: string;
    userName: string;
    amount: number;
    credits: number;
    method: "bitcoin" | "ethereum" | "usdc";
    status: "completed" | "pending" | "failed";
    date: string;
    txHash: string;
};

export default function AdminPayments() {
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [payments, setPayments] = useState<Payment[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [methodFilter, setMethodFilter] = useState<string>("all");

    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 1000));

                const mockPayments: Payment[] = [
                    {
                        id: "pay1",
                        userId: "user1",
                        userName: "John Doe",
                        amount: 100,
                        credits: 2500,
                        method: "bitcoin",
                        status: "completed",
                        date: "2023-06-05",
                        txHash: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
                    },
                    {
                        id: "pay2",
                        userId: "user4",
                        userName: "Alice Brown",
                        amount: 400,
                        credits: 10000,
                        method: "ethereum",
                        status: "completed",
                        date: "2023-06-08",
                        txHash: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
                    },
                    {
                        id: "pay3",
                        userId: "user2",
                        userName: "Jane Smith",
                        amount: 25,
                        credits: 500,
                        method: "bitcoin",
                        status: "completed",
                        date: "2023-06-10",
                        txHash: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
                    },
                    {
                        id: "pay4",
                        userId: "user5",
                        userName: "Charlie Wilson",
                        amount: 100,
                        credits: 2500,
                        method: "usdc",
                        status: "pending",
                        date: "2023-06-14",
                        txHash: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
                    },
                    {
                        id: "pay5",
                        userId: "user1",
                        userName: "John Doe",
                        amount: 25,
                        credits: 500,
                        method: "bitcoin",
                        status: "completed",
                        date: "2023-05-20",
                        txHash: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
                    },
                    {
                        id: "pay6",
                        userId: "user3",
                        userName: "Bob Johnson",
                        amount: 100,
                        credits: 2500,
                        method: "ethereum",
                        status: "failed",
                        date: "2023-06-12",
                        txHash: "0x0000000000000000000000000000000000000000",
                    },
                ];

                setPayments(mockPayments);
            } catch (error) {
                console.error("Error fetching payments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    // ✅ Filter payments
    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
        const matchesMethod = methodFilter === "all" || payment.method === methodFilter;

        return matchesSearch && matchesStatus && matchesMethod;
    });

    const handleViewPayment = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsViewDialogOpen(true);
    };

    const getPaymentStatusColor = (status: Payment["status"]): "default" | "outline" | "destructive" | "secondary" => {
        switch (status) {
            case "completed":
                return "default";
            case "pending":
                return "outline";
            case "failed":
                return "destructive";
            default:
                return "secondary";
        }
    };

    const getTotalRevenue = (): number => {
        return payments
            .filter((payment) => payment.status === "completed")
            .reduce((sum, payment) => sum + payment.amount, 0);
    };

    const getTotalCredits = (): number => {
        return payments
            .filter((payment) => payment.status === "completed")
            .reduce((sum, payment) => sum + payment.credits, 0);
    };

    const handleExportCSV = (): void => {
        alert("CSV export functionality would be implemented here");
    };

    return (
        <AdminDashboardLayout>
            <div className="container mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Payment Management</h1>
                        <p className="text-muted-foreground">Track and manage all payment transactions</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-4">
                        <Button variant="outline" onClick={handleExportCSV}>
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/admin">Back to Dashboard</Link>
                        </Button>
                    </div>
                </div>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${getTotalRevenue()}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                From {payments.filter((p) => p.status === "completed").length} payments
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Credits Sold
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{getTotalCredits()}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Pending Payments
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {payments.filter((p) => p.status === "pending").length}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                ${payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)}{" "}
                                pending
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Avg. Transaction
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                $
                                {payments.length > 0
                                    ? (payments.reduce((sum, p) => sum + p.amount, 0) / payments.length).toFixed(2)
                                    : "0.00"}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search payments..."
                            className="pl-8 w-full md:w-[350px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-4">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={methodFilter} onValueChange={setMethodFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Payment Method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Methods</SelectItem>
                                <SelectItem value="bitcoin">Bitcoin</SelectItem>
                                <SelectItem value="ethereum">Ethereum</SelectItem>
                                <SelectItem value="usdc">USDC</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {/* Payments Table */}
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
                                            <th className="text-left p-4 font-medium">ID</th>
                                            <th className="text-left p-4 font-medium">User</th>
                                            <th className="text-left p-4 font-medium">Amount</th>
                                            <th className="text-left p-4 font-medium">Credits</th>
                                            <th className="text-left p-4 font-medium">Method</th>
                                            <th className="text-left p-4 font-medium">Status</th>
                                            <th className="text-left p-4 font-medium">Date</th>
                                            <th className="text-left p-4 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPayments.length > 0 ? (
                                            filteredPayments.map((payment) => (
                                                <tr key={payment.id} className="border-b hover:bg-muted/50">
                                                    <td className="p-4">{payment.id}</td>
                                                    <td className="p-4">{payment.userName}</td>
                                                    <td className="p-4">${payment.amount}</td>
                                                    <td className="p-4">{payment.credits}</td>
                                                    <td className="p-4 capitalize">{payment.method}</td>
                                                    <td className="p-4">
                                                        <Badge variant={getPaymentStatusColor(payment.status)}>
                                                            {payment.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4">{payment.date}</td>
                                                    <td className="p-4">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleViewPayment(payment)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={8} className="p-4 text-center text-muted-foreground">
                                                    No payments found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
                {/* View Payment Dialog */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Payment Details</DialogTitle>
                            <DialogDescription>Detailed information about the payment transaction.</DialogDescription>
                        </DialogHeader>
                        {selectedPayment && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground text-sm">Payment ID</Label>
                                        <p className="font-medium">{selectedPayment.id}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-sm">Status</Label>
                                        <div>
                                            <Badge variant={getPaymentStatusColor(selectedPayment.status)}>
                                                {selectedPayment.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-sm">User</Label>
                                        <p className="font-medium">{selectedPayment.userName}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-sm">User ID</Label>
                                        <p className="font-medium">{selectedPayment.userId}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-sm">Amount</Label>
                                        <p className="font-medium">${selectedPayment.amount}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-sm">Credits</Label>
                                        <p className="font-medium">{selectedPayment.credits}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-sm">Payment Method</Label>
                                        <p className="font-medium capitalize">{selectedPayment.method}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground text-sm">Date</Label>
                                        <p className="font-medium">{selectedPayment.date}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-sm">Transaction Hash</Label>
                                    <div className="mt-1 p-3 bg-muted rounded-md">
                                        <p className="font-mono text-sm break-all">{selectedPayment.txHash}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminDashboardLayout>
    );
}
