import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Copy} from "lucide-react";
import PaymentWarning from "./payment-warning";

export type PaymentMethod = "bitcoin" | "ethereum" | "usdc";

export interface PaymentOption {
    id: string;
    name: string;
    icon: React.ReactNode;
}

export interface PaymentDetails {
    address: string;
    amount: number | string;
    memo: string;
}

interface PaymentTabContentProps {
    option: PaymentOption;
    paymentDetails: PaymentDetails;
    selectedAmount: number;
    handleCopyToClipboard: (text: string) => void;
}

export default function PaymentTabContent({
    option,
    paymentDetails,
    selectedAmount,
    handleCopyToClipboard,
}: PaymentTabContentProps) {
    return (
        <Card>
            <CardContent className="">
                <div className="mb-4">
                    <Label className="block mb-2">Send {option.name} to this address:</Label>
                    <div className="flex">
                        <Input value={paymentDetails.address} readOnly className="flex-grow font-mono text-sm" />
                        <Button
                            variant="outline"
                            size="icon"
                            className="ml-2"
                            onClick={() => handleCopyToClipboard(paymentDetails.address)}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label className="block mb-2">Amount:</Label>
                        <Input value={`${selectedAmount} USD`} readOnly />
                    </div>
                    <div>
                        <Label className="block mb-2">Memo/Reference:</Label>
                        <Input value={paymentDetails.memo} readOnly />
                    </div>
                </div>
                <PaymentWarning />
            </CardContent>
        </Card>
    );
}
