'use client'
import { Icon } from '@iconify/react';
import apiCall from '@/services/apiCall/apiCall'
import { requests } from '@/services/requests/requests'
import { RootState, useAppDispatch } from '@/store/Store'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { setUser } from '@/reducers/UserSlice';

const PaymentInformation = () => {
    const user = useSelector((state: RootState) => state.user)
    const [data, setData] = useState<any>(null)

    const router = useRouter()
    const pathName = usePathname()

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (user?.stripeAccountId !== null) {
            getConnectAccountInfo(user?.stripeAccountId)
        }
    }, [user])

    const getConnectAccountInfo = (id: any) => {
        id && apiCall(`${requests?.connectStripeAccount}`, {}, 'get', false, dispatch, user, router).then(res => {
            if (res?.error?.message) {
                return;
            } else {
                setData({
                    id: user?.id,
                    card_payments: res?.data?.data?.capabilities?.card_payments,
                    created: res?.data?.data?.created
                })
            }
        }).catch(err => {
            console.warn(err)
        })
    }

    const connectExpressAccount = () => {
        let param = {
            refreshUrl: process.env.DOMAIN + pathName,
            returnUrl: process.env.DOMAIN + pathName,
            type: 'account_onboarding'
        }
        apiCall(`${requests?.connectStripeAccount}`, param, 'post', false, dispatch, user, router).then(res => {
            if (res?.error?.message) {
                return;
            } else {
                if (res?.data?.url) {
                    router.push(res?.data?.url)
                    
                    // Once the user returns from the onboarding, ensure `getProfileData` is called
                    setTimeout(() => {
                        if (!data) {
                            getUserDetails();
                        }
                    }, 60000);
                }
            }
        }).catch(err => {
            console.warn(err)
        })
    }

    const getUserDetails = async () => {
        await apiCall(requests.getUserInfo, {}, 'get', false, dispatch, user, router).then((res: any) => {
            if (res?.error) {
                return;
            } else {
                dispatch(setUser(res?.data))
            }
        }).catch(err => console.warn(err))
    }

    return (
        <div>
            <div className='card'>
                <div className='viewtask-card card-header px-4 bg-gray'>
                    <div className='card-left-heading '>
                        <h3>Payment Information</h3>
                    </div>
                </div>
                <div className='card-bodyy paymentinformation'>
                    <h3>Payment information details is telling you one thing but your customers or employees are telling you another?</h3>
                    <p>
                        {`I can understand why the idea of big data has grown so rapidly. The value of data is very easy to sell. It’s a clear, almost mathematical way to analyse trends and drive marginal gains within a business or product. But equally, I would argue it’s also a lazy strategy if used in silo. What if the fundamental approach the business or a product is taking is wrong? Are you just driving changes towards the wrong end?
                        This is where consumer experience or ‘consumer love’ is key. Creating a product that people relate to; that fulfils a real need or desire is critical to building a long-lasting, successful business. But herein lies the problem — how do you measure emotional response towards your product?
                        `}
                    </p>
                    <h3 className='pt-4'>Stripe Account information (for US only)</h3>
                    <p>
                    
                        Stripe Account Status:
                        <span className={`${data?.card_payments === 'active' ? "verified" : "pending"} fs-14 bg-gray py-1 px-2 ms-2`}>
                            {data?.card_payments === 'active' ? 'Verified' : 'Pending'}
                            {data?.card_payments === 'inactive' ? <Icon icon="bi:info-circle" width="16" height="16" /> : null}
                        </span>
                    </p>
                    <div className=' mt-3'>
                        <button type='button' className="btn rounded-pill btn-info mt-2" onClick={connectExpressAccount}>{user?.stripeAccountId !== null && 'Update '}Connect Account</button>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default PaymentInformation