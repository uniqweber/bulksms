import {useUser} from "@/context/firebase-context";
import {db} from "@/firebase";
import {doc, onSnapshot} from "firebase/firestore";
import {useEffect, useState} from "react";

export default function useCurrentCredits() {
    const {user} = useUser();
    const [credits, setCredits] = useState<number>(0);

    useEffect(() => {
        if (!user?.uid) return;

        const unsubscribe = onSnapshot(doc(db, "users", user?.uid), (docSnap) => {
            if (docSnap.exists()) {
                setCredits(docSnap.data().currentCredit);
            }
        });

        return () => unsubscribe();
    }, [user?.uid]);

    return credits;
}
