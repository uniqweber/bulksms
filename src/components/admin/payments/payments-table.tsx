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
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {db} from "@/firebase";
import {collection, doc, increment, onSnapshot, Timestamp, updateDoc} from "firebase/firestore";
import {Eye, Loader2, Search} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";

// ✅ Payment type
type Payment = {
    id: string;
    userId: string;
    userName: string;
    amount: number;
    credits: number;
    method: "bitcoin" | "erc20" | "trc20";
    status: "verified" | "pending" | "rejected";
    createdAt: Timestamp;
    memo: string;
};

export default function AdminPaymentsTable() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [methodFilter, setMethodFilter] = useState<string>("all");
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    useEffect(() => {
        const paymentsCol = collection(db, "cryptoPayments");
        const unsubscribe = onSnapshot(paymentsCol, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})) as Payment[];
            setPayments(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Filtered payments
    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
        const matchesMethod = methodFilter === "all" || payment.method === methodFilter;
        return matchesSearch && matchesStatus && matchesMethod;
    });

    const getPaymentStatusColor = (status: Payment["status"]): "default" | "outline" | "destructive" => {
        switch (status) {
            case "verified":
                return "default";
            case "pending":
                return "outline";
            case "rejected":
                return "destructive";
        }
    };

    const getTotalRevenue = (): number => {
        return payments
            .filter((payment) => payment.status === "verified")
            .reduce((sum, payment) => sum + payment.amount, 0);
    };

    const getTotalCredits = (): number => {
        return payments
            .filter((payment) => payment.status === "verified")
            .reduce((sum, payment) => sum + payment.credits, 0);
    };

    const handleViewPayment = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsViewDialogOpen(true);
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
                        <Button asChild variant="outline">
                            <Link href="/admin">Back to Overview</Link>
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
                                From {payments.filter((p) => p.status === "verified").length} payments
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
                            <p className="text-xs text-muted-foreground mt-1">
                                From {payments.filter((p) => p.status === "verified").length} payments
                            </p>
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
                            <p className="text-xs text-muted-foreground mt-1">
                                From {payments.filter((p) => p.status === "verified").length} payments
                            </p>
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
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={methodFilter} onValueChange={setMethodFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Payment Method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Methods</SelectItem>
                                <SelectItem value="bitcoin">Bitcoin</SelectItem>
                                <SelectItem value="erc20">ERC20</SelectItem>
                                <SelectItem value="trc20">TRC20</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {/* Payments Table */}
                <div>
                    <div>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <Table className="border">
                                <TableHeader>
                                    <TableRow className="border-b">
                                        <TableHead>ID</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Credits</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPayments.length > 0 ? (
                                        filteredPayments.map((payment) => (
                                            <TableRow key={payment.id} className="border-b hover:bg-muted/50">
                                                <TableCell>{payment.id}</TableCell>
                                                <TableCell>{payment.userName}</TableCell>
                                                <TableCell>${payment.amount}</TableCell>
                                                <TableCell>{payment.credits}</TableCell>
                                                <TableCell className="p-4 capitalize">{payment.method}</TableCell>
                                                <TableCell>
                                                    <Select
                                                        value={payment.status}
                                                        onValueChange={async (newValue) => {
                                                            const newStatus = newValue as
                                                                | "verified"
                                                                | "pending"
                                                                | "rejected"; // <-- cast here
                                                            try {
                                                                const prevStatus = payment.status;
                                                                await updateDoc(doc(db, "cryptoPayments", payment.id), {
                                                                    status: newStatus,
                                                                });

                                                                const userRef = doc(db, "users", payment.userId);
                                                                let creditDelta = 0;

                                                                if (
                                                                    prevStatus !== "verified" &&
                                                                    newStatus === "verified"
                                                                ) {
                                                                    creditDelta = payment.credits;
                                                                } else if (
                                                                    prevStatus === "verified" &&
                                                                    newStatus !== "verified"
                                                                ) {
                                                                    creditDelta = -payment.credits;
                                                                }

                                                                if (creditDelta !== 0) {
                                                                    await updateDoc(userRef, {
                                                                        currentCredit: increment(creditDelta),
                                                                    });
                                                                }

                                                                payment.status = newStatus;
                                                                setPayments([...payments]);
                                                            } catch (err) {
                                                                console.error("Failed to update payment status:", err);
                                                            }
                                                        }}
                                                    >
                                                        <SelectTrigger
                                                            className={`px-2 py-1 rounded-full text-xs ${
                                                                payment.status === "verified"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : payment.status === "pending"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pending">pending</SelectItem>
                                                            <SelectItem value="verified">verified</SelectItem>
                                                            <SelectItem value="rejected">rejected</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>

                                                <TableCell>
                                                    {payment.createdAt
                                                        ? payment.createdAt instanceof Date
                                                            ? payment.createdAt.toLocaleString()
                                                            : payment.createdAt.toDate().toLocaleString()
                                                        : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleViewPayment(payment)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="p-4 text-center text-muted-foreground">
                                                No payments found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </div>
                </div>
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
                                        <p className="font-medium truncate">{selectedPayment.userId}</p>
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
                                        <p className="font-medium">
                                            {selectedPayment.createdAt?.toDate
                                                ? selectedPayment.createdAt.toDate().toLocaleString()
                                                : "-"}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-sm">Transaction Memo</Label>
                                    <div className="mt-1 p-3 bg-muted rounded-md">
                                        <p className="font-mono text-sm break-all">{selectedPayment.memo}</p>
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
