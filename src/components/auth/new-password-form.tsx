"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import Link from "next/link";
import Logo from "../ui/logo";
import PasswordInput from "../ui/password-input";
import { useRouter } from "next/navigation";

export function NewPasswordForm({className, ...props}: React.ComponentProps<"div">) {
    const router = useRouter();
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push("/dashboard");
    };
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <Logo />
                    <CardTitle>New Password</CardTitle>
                    <CardDescription>Enter your new password below</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <div className="flex flex-col gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput id="password" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <PasswordInput id="confirm-password" />
                            </div>
                            <Button type="submit" className="w-full">
                                Reset Password
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm font-medium">
                            Remember your password?{" "}
                            <Link href="/login" className="underline underline-offset-4">
                                Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
