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
        if(!router || !url) return; // early return if router or url is undefined/null
        if (url === pathname) return; // no need to navigate if already on the same page
        // if(url !== pathname){
            dispatch(setLoadingState(true));
            // router.prefetch(url)
            startTransition(() => {
                router?.push(url);   // safe call
                // if (router?.push) {
                // } else {
                //     console.error("router.push is undefined!"); // log issue
                // }
            });
        // }
    };

    useEffect(() => {
        dispatch(setLoadingState(false));
    }, [pathname]);

    return { navigate, isPending };
};
