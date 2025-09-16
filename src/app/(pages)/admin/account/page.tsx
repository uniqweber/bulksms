"use client";

import AdminDashboardLayout from "@/components/admin/layout/admin-layout";
import PasswordChange from "@/components/dashboard/account/password-change";
import ProfileInformation from "@/components/dashboard/account/profile-information";

export default function Settings() {
    return (
        <AdminDashboardLayout>
            <div className="container mx-auto py-8 ">
                <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
                <div className="space-y-8">
                    <ProfileInformation />
                    <PasswordChange />
                </div>
            </div>
        </AdminDashboardLayout>
    );
}
