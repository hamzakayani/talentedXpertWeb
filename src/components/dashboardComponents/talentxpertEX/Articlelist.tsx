'use client'
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/Store';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import HtmlData from '@/components/common/HtmlData/HtmlData';
import NoFound from '@/components/common/NoFound/NoFound';


export const Articlelist = () => {
    const user = useSelector((state: RootState) => state.user);
    const [article, setArticle] = useState<any>([])
    const dispatch = useAppDispatch();
    const router = useRouter();
    // console.log(setArticle)
    

    const getArticles = async () => {
        try {
            const response = await apiCall(requests?.articles, {}, 'get', false, dispatch, user, router);
            console.log('res',response)
            setArticle(response?.data?.data?.articles|| []);
        } catch (error) {
            console.warn("Error fetching articles:", error);
        }

    }
     useEffect(() => {
            getArticles();

            }, [])


    return (
        <section className='addtask'>
            <div className="card">
                <div className="card-header bg-dark text-light d-flex flex-wrap align-items-center justify-content-between">
                    <h5 className='mb-0 me-5'>My Articles</h5>
                    <Link href='/dashboard/articles/add'><div className='d-flex align-items-center' >
                        <h5 className='mb-0 me-3 text-light'>Add New Article</h5>
                        <Icon icon="line-md:plus-square-filled" className='text-info' width={32} height={32} />
                    </div></Link>
                </div>
                <div className="card-body bg-gray">
                   {article.length>0 ? (article.map((article:any)=>(<div className="card bg-dark mb-2" key={article?.id}>
                        <div className="card-body">
                            <h6 className='text-light'>{article?.title}</h6>
                            <HtmlData data={article?.description}className='text-light fs-12'/>
                            {/* {article?.documents?.map((doc: any) => (
                                    // onClick={() => getPrivateFile(doc)}
                                    <div key={doc.fileUrl}>
                                        <Link href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                            {doc.key}
                                        </Link>
                                    </div>
                                ))} */}
                            <div className='d-md-flex align-items-center justify-content-between'>
                                <div className='d-flex flex-wrap mb-2 mb-md-0 '>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">Networking</button>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">Development</button>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">AI blockchain</button>
                                </div>
                                <div className='d-flex'>
                                <div className='d-flex mb-2 mb-md-0'>
                                    <Icon icon="ri:facebook-fill" className='me-2 text-light' />
                                    <Icon icon="lets-icons:insta" className="me-2 text-light" />
                                    <Icon icon="mdi:twitter" className="me-2 text-light" />
                                    <Icon icon="mdi:youtube" className='me-2 text-light' />
                                </div>
                                <div className='d-flex mb-2 mb-md-0'>
                                    <Link className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm ls" href={`/dashboard/articles/${article?.id}`}>
                                        View Details  <Icon icon="line-md:arrow-right" className='ms-1' />
                                    </Link>
                                </div>
                                </div>
                               
                            </div>
                        </div>
                    </div>))) :<NoFound message={'No Articles found'}/>}
                    <div className="card bg-dark mb-2">
                        <div className="card-body">
                            <h6 className='text-light'>Write headlines with words that resonate</h6>
                            <p className='text-light fs-12'>{`It makes sense. Audiences are seeking information that will help them in their lives, and they have a lot of content from which to choose. By using the article a, we’ve created a general statement, implying that any cup of tea would taste good after any long day By writing phrases like “how to” in a headline, you tell ...`}</p>
                            <div className='d-md-flex align-items-center justify-content-between'>
                                <div className='d-flex flex-wrap mb-2 mb-md-0 '>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">Networking</button>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">Development</button>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">AI blockchain</button>
                                </div>
                                <div className='d-flex'>
                                <div className='d-flex mb-2 mb-md-0'>
                                    <Icon icon="ri:facebook-fill" className='me-2 text-light' />
                                    <Icon icon="lets-icons:insta" className="me-2 text-light" />
                                    <Icon icon="mdi:twitter" className="me-2 text-light" />
                                    <Icon icon="mdi:youtube" className='me-2 text-light' />
                                </div>
                                <div className='d-flex mb-2 mb-md-0'>
                                    <Link className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm ls" href={'/dashboard/articles/2'}>
                                        View Details  <Icon icon="line-md:arrow-right" className='ms-1' />
                                    </Link>
                                </div>
                                </div>
                              
                            </div>
                        </div>
                    </div>
                    <div className="card bg-dark mb-2">
                        <div className="card-body">
                            <h6 className='text-light'>Write headlines with words that resonate</h6>
                            <p className='text-light fs-12'>{`It makes sense. Audiences are seeking information that will help them in their lives, and they have a lot of content from which to choose. By using the article a, we’ve created a general statement, implying that any cup of tea would taste good after any long day By writing phrases like “how to” in a headline, you tell ...`}</p>
                            <div className='d-md-flex align-items-center justify-content-between'>
                                <div className='d-flex flex-wrap mb-2 mb-md-0'>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">Networking</button>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">Development</button>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">AI blockchain</button>
                                </div>
                                <div className='d-flex'>
                                <div className='d-flex mb-2 mb-md-0'>
                                    <Icon icon="ri:facebook-fill" className='me-2 text-light' />
                                    <Icon icon="lets-icons:insta" className="me-2 text-light" />
                                    <Icon icon="mdi:twitter" className="me-2 text-light" />
                                    <Icon icon="mdi:youtube" className='me-2 text-light' />
                                </div>
                                <div className='d-flex mb-2 mb-md-0'>
                                    <Link className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm ls" href={'/dashboard/articles/3'}>
                                        View Details  <Icon icon="line-md:arrow-right" className='ms-1' />
                                    </Link>
                                </div>
                                </div>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}
