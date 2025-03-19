'use client';
import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export const useNavigation = () => {
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const navigate = (url:string) => {
        setLoading(true); 
        startTransition(() => {
            router.push(url);
        });
    };

    useEffect(() => {
        if (!isPending) {
            setLoading(false); 
        }
    },[isPending])    

    return { navigate, loading, isPending };
};
