/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {db} from "@/firebase";
import {doc, updateDoc} from "firebase/firestore";
import {useState} from "react";
import CampaignTable from "./admin-campaigns-table";

export default function AdminDeliveryCampaigns({campaigns}: {campaigns: any[]}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
    const [deliveredValue, setDeliveredValue] = useState(0);

    const handleUpdateDelivered = (campaign: any) => {
        setSelectedCampaign(campaign);
        setDeliveredValue(campaign.delivered || 0);
        setIsModalOpen(true);
    };
    const handleStatusChange = async (id: string, status: string) => {
        await updateDoc(doc(db, "campaigns", id), {status});
    };
    const handleSaveDelivered = async () => {
        if (!selectedCampaign) return;
        await updateDoc(doc(db, "campaigns", selectedCampaign.id), {
            delivered: deliveredValue,
        });
        setIsModalOpen(false);
    };

    return (
        <>
            {/* Table with prop for edit */}
            <CampaignTable
                campaigns={campaigns}
                onUpdateDelivered={handleUpdateDelivered}
                onStatusChange={handleStatusChange}
            />

            {/* Modal controlled here */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Delivered Count</DialogTitle>
                    </DialogHeader>
                    <input
                        type="number"
                        value={deliveredValue}
                        onChange={(e) => setDeliveredValue(parseInt(e.target.value))}
                        className="border p-2 w-full rounded"
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveDelivered}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
