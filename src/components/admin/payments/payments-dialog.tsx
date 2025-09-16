import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Timestamp} from "firebase/firestore";
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

export default function PaymentsDialog({
    isViewDialogOpen,
    setIsViewDialogOpen,
    selectedPayment,
}: {
    isViewDialogOpen: boolean;
    setIsViewDialogOpen: (open: boolean) => void;
    selectedPayment: Payment | null;
}) {
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

    return (
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
                                <p className="font-medium truncate">{selectedPayment.id}</p>
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
    );
}
