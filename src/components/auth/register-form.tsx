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
import {useState} from "react";
import { useUser } from "@/context/firebase-context";


export function RegisterForm({className, ...props}: React.ComponentProps<"div">) {
    const router = useRouter();
    const {register} = useUser(); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const target = e.target as typeof e.target & {
            username: {value: string};
            email: {value: string};
            password: {value: string};
            "confirm-password": {value: string};
        };

        const fullName = target.username.value.trim();
        const email = target.email.value.trim();
        const password = target.password.value;
        const confirmPassword = target["confirm-password"].value;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            await register({fullName, email, password});
            router.push("/dashboard"); // After registration redirect
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
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
                                <PasswordInput id="password" required />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <PasswordInput id="confirm-password" required />
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Registering..." : "Register"}
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm font-medium">
                            Already have an account?{" "}
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
