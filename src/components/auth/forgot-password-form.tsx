"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {useRouter} from "next/navigation";
import Logo from "../ui/logo";

export function ForgotPasswordForm({className, ...props}: React.ComponentProps<"div">) {
    const router = useRouter();
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push("/new-password");
    };
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <Logo />
                    <CardTitle>Forgot Password</CardTitle>
                    <CardDescription>Enter your email below to reset your password</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <div className="flex flex-col gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <Button type="submit" className="w-full">
                                Send Reset Link
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
