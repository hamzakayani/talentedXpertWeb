'use client';
import { useEffect, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { RootState, useAppDispatch } from '@/store/Store';
import { setLoadingState } from '@/reducers/LoadingSlice';
import { useSelector } from 'react-redux';

export const useNavigation = () => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch()

    // const isAuth = useSelector((state: RootState) => state.auth?.isAuthenticated);
    // const isCompleteProfile = useSelector((state: RootState) => state.user?.isProfileComplete);

    const navigate = (url: string) => {
        if(!router || !url) return; // early return if router or url is undefined/null
        if (url === pathname) return; // no need to navigate if already on the same page

        // Check if profile is incomplete before navigation
        // if (isAuth && !isCompleteProfile && !url.includes("/profile-setting")) {
        //     router.push("/dashboard/profile-setting");  // Redirect to profile setting if incomplete
        //     return;
        // }

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
