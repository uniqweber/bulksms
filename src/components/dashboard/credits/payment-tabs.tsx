import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Loader2} from "lucide-react";
import PaymentTabContent from "./payment-tab-content";
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

export interface Package {
    id: string;
    name: string;
    credits: number;
    price: number;
    popular: boolean;
}

interface PaymentTabsProps {
    cryptoOptions: PaymentOption[];
    paymentMethod: PaymentMethod;
    paymentDetails: PaymentDetails;
    selectedPackage: Package;
    handlePaymentMethodChange: (method: PaymentMethod) => void;
    handleCopyToClipboard: (text: string) => void;
    handleSubmitPayment: () => void;
    loading: boolean;
}

export default function PaymentTabs({
    cryptoOptions,
    paymentMethod,
    paymentDetails,
    selectedPackage,
    handlePaymentMethodChange,
    handleCopyToClipboard,
    handleSubmitPayment,
    loading,
}: PaymentTabsProps) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <Tabs
                value={paymentMethod}
                onValueChange={(value: string) => {
                    // Type guard
                    if (value === "bitcoin" || value === "ethereum" || value === "usdc") {
                        handlePaymentMethodChange(value);
                    }
                }}
            >
                <TabsList className="mb-4">
                    {cryptoOptions.map((option) => (
                        <TabsTrigger key={option.id} value={option.id}>
                            <div className="flex items-center">
                                {option.icon}
                                <span className="ml-2">{option.name}</span>
                            </div>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {cryptoOptions.map((option) => (
                    <TabsContent key={option.id} value={option.id}>
                        <PaymentTabContent
                            option={option}
                            paymentDetails={paymentDetails}
                            selectedAmount={selectedPackage.price}
                            handleCopyToClipboard={handleCopyToClipboard}
                        />
                    </TabsContent>
                ))}
            </Tabs>

            <div className="mt-6">
                <Button onClick={handleSubmitPayment} disabled={loading} className="w-full md:w-auto">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm Payment
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                    For demo, clicking &quot;Confirm Payment&quot; simulates a successful payment.
                </p>
            </div>
        </div>
    );
}
