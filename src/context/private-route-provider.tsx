"use client";

import {useRouter} from "next/navigation";
import {ReactNode, useEffect} from "react";
import {useUser} from "./firebase-context";

interface PrivateRouteProps {
    children: ReactNode;
    adminOnly?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({children, adminOnly = false}) => {
    const {user, loading} = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) router.replace("/login"); // not logged in
            else if (adminOnly && user.role !== "admin") router.replace("/dashboard"); // block non-admin
            else if (!adminOnly && user.role === "admin") router.replace("/admin"); // block admin from user pages
        }
    }, [user, loading, adminOnly, router]);

    if (loading || !user || (adminOnly && user.role !== "admin") || (!adminOnly && user?.role === "admin")) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default PrivateRoute;
