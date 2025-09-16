import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Timestamp} from "firebase/firestore";
import {ReactNode} from "react";

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

export default function PaymentStats({payments}: {payments: Payment[]}) {
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
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
                title="Total Revenue"
                stat={
                    <>
                        <div className="text-2xl font-bold">${getTotalRevenue()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            From {payments.filter((p) => p.status === "verified").length} payments
                        </p>
                    </>
                }
            />
            <StatsCard
                title="Total Credits Sold"
                stat={
                    <>
                        <div className="text-2xl font-bold">{getTotalCredits()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            From {payments.filter((p) => p.status === "verified").length} payments
                        </p>
                    </>
                }
            />

            <StatsCard
                title="Pending Payments"
                stat={
                    <>
                        <div className="text-2xl font-bold">
                            {payments.filter((p) => p.status === "pending").length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            ${payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)}{" "}
                            pending
                        </p>
                    </>
                }
            />
            <StatsCard
                title="Avg. Transaction"
                stat={
                    <>
                        <div className="text-2xl font-bold">
                            $
                            {payments.length > 0
                                ? (payments.reduce((sum, p) => sum + p.amount, 0) / payments.length).toFixed(2)
                                : "0.00"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            From {payments.filter((p) => p.status === "verified").length} payments
                        </p>
                    </>
                }
            />
        </div>
    );
}

export const StatsCard = ({title, stat}: {title: string; stat: ReactNode}) => {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>{stat}</CardContent>
        </Card>
    );
};
