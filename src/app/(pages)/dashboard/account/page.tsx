"use client";

import UserDashboardLayout from "@/components/dashboard/layout/user-dashboard-layout";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

import {Loader2, Save} from "lucide-react";
import {useState} from "react";

export default function Settings() {
    const currentUser = {
        displayName: "John Doe",
        email: "VW5bM@example.com",
        phoneNumber: "+1234567890",
        photoURL: "https://example.com/avatar.jpg",
    };

    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Profile settings state
    const [name, setName] = useState(currentUser?.displayName || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [phone, setPhone] = useState(currentUser?.phoneNumber || "");
    const [company, setCompany] = useState("");

    // Security settings state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleSaveProfile = async () => {
        setSaving(true);
        setSaveSuccess(false);

        try {
            // In a real app, you would update the user profile in Firebase
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Show success message
            setSaveSuccess(true);

            // Hide success message after 3 seconds
            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        // Reset error
        setPasswordError("");

        // Validate passwords
        if (!currentPassword) {
            setPasswordError("Current password is required");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return;
        }

        setSaving(true);

        try {
            // In a real app, you would update the password in Firebase
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Clear password fields
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // Show success message
            setSaveSuccess(true);

            // Hide success message after 3 seconds
            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        } catch (error) {
            console.error("Error changing password:", error);
            setPasswordError("Failed to change password");
        } finally {
            setSaving(false);
        }
    };

    return (
        <UserDashboardLayout>
            <div className="container mx-auto py-8 ">
                <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your account profile information and settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Company Name</Label>
                                        <Input
                                            id="company"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            {saveSuccess && (
                                <div className="text-green-600 font-medium">Profile saved successfully!</div>
                            )}
                            <Button onClick={handleSaveProfile} disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Update your password and security preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                {passwordError && (
                                    <Alert variant="destructive">
                                        <AlertDescription>{passwordError}</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            {saveSuccess && (
                                <div className="text-green-600 font-medium">Password changed successfully!</div>
                            )}
                            <Button onClick={handleChangePassword} disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>Change Password</>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
