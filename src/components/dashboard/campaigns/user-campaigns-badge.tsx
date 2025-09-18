"use client";

interface CampaignStatusBadgeProps {
    status: "completed" | "scheduled" | "failed";
}

const CampaignStatusBadge: React.FC<CampaignStatusBadgeProps> = ({status}) => {
    const statusConfig: Record<typeof status, {className: string; label: string}> = {
        completed: {className: "bg-green-100 text-green-800", label: "Completed"},
        scheduled: {className: "bg-blue-100 text-blue-800", label: "Scheduled"},
        failed: {className: "bg-red-100 text-red-800", label: "Failed"},
    };
    const config = statusConfig[status];

    return (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.className}`}>
            {config.label}
        </span>
    );
};

export default CampaignStatusBadge;
