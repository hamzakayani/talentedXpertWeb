'use client';
import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/Store';
import { setLoadingState } from '@/reducers/LoadingSlice';

export const useNavigation = () => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const dispatch = useAppDispatch()

    const navigate = (url: string) => {
        dispatch(setLoadingState(true));
        startTransition(() => {
            router.push(url);
        });
    };

    useEffect(() => {
        if (!isPending) {
            dispatch(setLoadingState(false));
        }
    }, [isPending])

    return { navigate, isPending };
};
