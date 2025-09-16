"use client";

import PasswordChange from "@/components/dashboard/account/password-change";
import ProfileInformation from "@/components/dashboard/account/profile-information";
import UserDashboardLayout from "@/components/dashboard/layout/user-dashboard-layout";

export default function Settings() {
    return (
        <UserDashboardLayout>
            <div className="container mx-auto py-8 ">
                <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
                <div className="space-y-8">
                    <ProfileInformation />
                    <PasswordChange />
                </div>
            </div>
        </UserDashboardLayout>
    );
}
