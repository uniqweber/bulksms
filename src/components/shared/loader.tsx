import {Loader2} from "lucide-react";

export default function Loader() {
    return (
        <div className="fixed inset-0 bg-background text-primary flex items-center justify-center">
            <Loader2 className="animate-spin size-10" />
        </div>
    );
}
