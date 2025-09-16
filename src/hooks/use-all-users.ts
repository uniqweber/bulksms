"use client";

import {db} from "@/firebase";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {useEffect, useState} from "react";

interface User {
    id: string;
    displayName?: string;
    email?: string;
    phone?: string;
    company?: string;
    currentCredit: number;
    campaigns: [];
    role?: string;
}
export default function useAllUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const usersCol = query(collection(db, "users"), where("role", "==", "user"));
        const unsubscribe = onSnapshot(usersCol, (snapshot) => {
            const data: User[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as User[];
            setUsers(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return {
        users,
        loading,
    };
}
