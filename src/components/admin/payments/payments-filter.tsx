import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Search} from "lucide-react";

interface PaymentsFilterProps {
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
    statusFilter: string;
    setStatusFilter: (statusFilter: string) => void;
    methodFilter: string;
    setMethodFilter: (methodFilter: string) => void;
}

export default function PaymentsFilter({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    methodFilter,
    setMethodFilter,
}: PaymentsFilterProps) {
    return (
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
    );
}
