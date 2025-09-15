"use client";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {useRouter} from "next/navigation";
import Logo from "../ui/logo";
import PasswordInput from "../ui/password-input";

export function RegisterForm({className, ...props}: React.ComponentProps<"div">) {
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
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>Enter your details below to create your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <div className="flex flex-col gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="username">Full Name</Label>
                                <Input id="username" type="text" placeholder="John Doe" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="password">Password</Label>
                                <PasswordInput id="password" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <PasswordInput id="confirm-password" />
                            </div>

                            <Button type="submit" className="w-full">
                                Register
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm font-medium">
                            Don&apos;t have an account?{" "}
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
