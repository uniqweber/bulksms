"use client";

import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import Link from "next/link";
import Logo from "../ui/logo";
import PasswordInput from "../ui/password-input";
import {useRouter} from "next/navigation";
import {useState} from "react";
import { useUser } from "@/context/firebase-context";


export function LoginForm({className, ...props}: React.ComponentProps<"div">) {
    const router = useRouter();
    const {login} = useUser(); // Using context
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const target = e.target as typeof e.target & {
            email: {value: string};
            password: {value: string};
        };

        const email = target.email.value.trim();
        const password = target.password.value;

        try {
            await login({email, password});

            // Redirect based on role
            // Assuming user role is updated in context inside login
            router.push("/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) setError(err.message);
            else setError("Something went wrong");
        } finally {
            setLoading(false);
        }
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
                                <PasswordInput id="password" required />
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
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
