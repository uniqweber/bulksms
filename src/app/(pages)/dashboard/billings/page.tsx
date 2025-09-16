"use client";

import UserDashboardLayout from "@/components/dashboard/layout/user-dashboard-layout";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useUser} from "@/context/firebase-context";
import {db} from "@/firebase";
import {collection, onSnapshot, query, Timestamp, where} from "firebase/firestore";
import {Send} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";

type Payment = {
    id: string;
    packageName: string;
    amount: number;
    credits: number;
    memo: string;
    status: string;
    createdAt: Timestamp;
};

export default function Billings() {
    const {user} = useUser();
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "cryptoPayments"), where("userId", "==", user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: Payment[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Payment[];
            setPayments(data);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <UserDashboardLayout>
            <div className="container mx-auto  py-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Billing & Payment</h1>
                        <p className="text-muted-foreground mt-1">Manage your billing and payment history</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Button asChild>
                            <Link href="/dashboard/create-campaign">
                                <Send className="mr-2 h-4 w-4" /> New Campaign
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="">
                    {payments.length === 0 ? (
                        <div className="h-60 flex items-center justify-center text-lg flex-col bg-card border  rounded-lg shadow gap-6">
                            <div>No payments found.</div>
                            <Button>
                                <Link href="/dashboard/buy-credits" className="">
                                    Buy Credits
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <Table className="border">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Package</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Credits</TableHead>
                                    <TableHead>Memo</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.toReversed().map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.packageName || "-"}</TableCell>
                                        <TableCell>{p.amount} USDT</TableCell>
                                        <TableCell>{p.credits}</TableCell>
                                        <TableCell>{p.memo}</TableCell>
                                        <TableCell>
                                            <div
                                                className={`${
                                                    p.status === "verified"
                                                        ? "bg-green-600"
                                                        : p.status === "rejected"
                                                        ? "bg-red-600"
                                                        : "bg-yellow-600"
                                                } text-white rounded-full text-sm capitalize font-semibold w-20 text-center `}
                                            >
                                                {p.status}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {p.createdAt?.toDate ? p.createdAt.toDate().toLocaleString() : "-"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </UserDashboardLayout>
    );
}
