"use client";

import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {db} from "@/firebase";
import {doc, increment, Timestamp, updateDoc} from "firebase/firestore";
import {Eye, Loader2} from "lucide-react";
import {useState} from "react";
import PaymentsDialog from "./payments-dialog";

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

interface PaymentsTableProps {
    payments: Payment[];
    loading: boolean;
    setPayments: (payments: Payment[]) => void;
}

export default function PaymentsTable({payments, loading, setPayments}: PaymentsTableProps) {
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const handleViewPayment = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsViewDialogOpen(true);
    };
    return (
        <div>
            <div>
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <Table className="border w-full overflow-x-auto">
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
                            {payments.length > 0 ? (
                                payments.map((payment) => (
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
                                                    const newStatus = newValue as "verified" | "pending" | "rejected"; // <-- cast here
                                                    try {
                                                        const prevStatus = payment.status;
                                                        await updateDoc(doc(db, "cryptoPayments", payment.id), {
                                                            status: newStatus,
                                                        });

                                                        const userRef = doc(db, "users", payment.userId);
                                                        let creditDelta = 0;

                                                        if (prevStatus !== "verified" && newStatus === "verified") {
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
            <PaymentsDialog
                isViewDialogOpen={isViewDialogOpen}
                setIsViewDialogOpen={setIsViewDialogOpen}
                selectedPayment={selectedPayment}
            />
        </div>
    );
}
