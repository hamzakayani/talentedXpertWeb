'use client';
import { useEffect, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/Store';
import { setLoadingState } from '@/reducers/LoadingSlice';

export const useNavigation = () => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch()

    const navigate = (url: string) => {
        if(url !== pathname){
            dispatch(setLoadingState(true));
            startTransition(() => {
                if (router?.push) {
                    router?.push(url);   // ✅ safe call
                } else {
                    console.error("router.push is undefined!"); // log issue
                }
            });
        }
    };

    useEffect(() => {
        dispatch(setLoadingState(false));
    }, [pathname]);

    return { navigate, isPending };
};
