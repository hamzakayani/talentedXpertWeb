'use client';
import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/Store';
import { setLoadingState } from '@/reducers/LoadingSlice';

export const useNavigation = () => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch()

    const navigate = (url: string) => {
        console.log(url)
        dispatch(setLoadingState(true));
        startTransition(() => {
            router.push(url);
        });
    };

    // useEffect(() => {
    //     console.log('isPending', isPending);
    //     if (!isPending) {
    //         dispatch(setLoadingState(false));
    //     }
    // }, [isPending])

    useEffect(() => {
        dispatch(setLoadingState(false));
    }, [pathname]);

    return { navigate, isPending };
};
