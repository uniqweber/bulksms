"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import Link from "next/link";
import Logo from "../ui/logo";
import PasswordInput from "../ui/password-input";
import { useRouter } from "next/navigation";


export function LoginForm({className, ...props}: React.ComponentProps<"div">) {
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
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <div className="flex flex-col gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="/forgot-password"
                                        className="ml-auto inline-block text-sm underline-offset-4 font-medium hover:underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <PasswordInput id="password" />
                            </div>

                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm font-medium">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="underline underline-offset-4">
                                Register
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
