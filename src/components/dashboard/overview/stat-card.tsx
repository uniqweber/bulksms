import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface StatCardProps {
    title: string;
    value: number;
    description: string;
    icon: React.ReactNode;
}

export default function StatCard({title, value, description, icon}: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
