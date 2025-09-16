export default function AdminOverviewHeader() {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage users, campaigns, and payments</p>
            </div>
        </div>
    );
}
