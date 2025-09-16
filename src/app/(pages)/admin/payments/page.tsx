"use client";
import AdminDashboardLayout from "@/components/admin/layout/admin-layout";
import PaymentsFilter from "@/components/admin/payments/payments-filter";
import PaymentStats from "@/components/admin/payments/payments-stats";
import PaymentsTable from "@/components/admin/payments/payments-table";
import {Button} from "@/components/ui/button";
import useAllPayments from "@/hooks/use-all-payments";
import Link from "next/link";
import {useState} from "react";

export default function Payments() {
    const {payments, setPayments, loading} = useAllPayments();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [methodFilter, setMethodFilter] = useState<string>("all");

    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
        const matchesMethod = methodFilter === "all" || payment.method === methodFilter;
        return matchesSearch && matchesStatus && matchesMethod;
    });

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

                <PaymentStats payments={payments} />

                <PaymentsFilter
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    methodFilter={methodFilter}
                    setMethodFilter={setMethodFilter}
                />

                <PaymentsTable payments={filteredPayments} loading={loading} setPayments={setPayments} />
            </div>
        </AdminDashboardLayout>
    );
}
