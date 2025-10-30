'use client'
import HtmlData from '@/components/common/HtmlData/HtmlData';
import NoFound from '@/components/common/NoFound/NoFound';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { RootState, useAppDispatch } from '@/store/Store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { useNavigation } from '@/hooks/useNavigation';

const ListCards: FC<any> = ({ type, checkbox, setArticleId, articleId, setValue }) => {
    const user = useSelector((state: RootState) => state.user);
    const [article, setArticle] = useState<any>([])
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { navigate } = useNavigation()

    const getArticles = async () => {
        try {
            if (user?.profile?.[0]?.id) {
                const response = await apiCall(requests?.articles, { profileId: user?.profile[0]?.id }, 'get', false, dispatch, user, router);
                setArticle(response?.data?.data?.articles || []);
            }
        } catch (error) {
            console.warn("Error fetching articles:", error);
        }
    }

    useEffect(() => {
        if (user?.profile?.[0]?.id) {
            getArticles();
        }
    }, [user?.profile?.[0]?.id])

    const isLarge = type === 'large';

    return (
        <>
            {article.length > 0 ? (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: isLarge ? 'repeat(auto-fill, minmax(340px, 1fr))' : '1fr',
                        gap: 'clamp(12px, 2vw, 20px)',
                    }}
                >
                    {article.map((item: any, index: number) => (
                        <div
                            key={item?.id}
                            style={{
                                backgroundColor: '#1e1e1e',
                                borderRadius: '12px',
                                padding: isLarge ? '20px' : '12px 16px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                border: '1px solid #333',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.border = '1px solid #666';
                                e.currentTarget.style.transform = 'translateY(-3px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.border = '1px solid #333';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    gap: '12px',
                                }}
                            >
                                {checkbox && (
                                    <input
                                        type="checkbox"
                                        checked={articleId?.includes(item.id)}
                                        onChange={() => {
                                            setArticleId?.((prev: any[]) =>
                                                prev.includes(item.id)
                                                ? prev.filter((id) => id !== item.id)
                                                : [...prev, item.id]
                                            );
                                        }}
                                        style={{
                                            width: '16px',
                                            height: '16px',
                                            accentColor: '#007bff',
                                        }}
                                    />
                                )}

                                <div style={{ flex: 1, color: '#fff' }}>
                                <h4
                                    style={{
                                        fontSize: isLarge ? '18px' : '15px',
                                        fontWeight: 600,
                                        marginBottom: '6px',
                                        color: '#fff',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {item?.title}
                                </h4>

                                <p
                                    style={{
                                        fontSize: '14px',
                                        color: '#ccc',
                                        lineHeight: '1.5',
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: isLarge ? 3 : 2,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        marginBottom: '8px',
                                    }}
                                >
                                    {item?.description || 'No description available.'}
                                </p>

                                <span style={{ fontSize: '12px', color: '#888' }}>
                                    {item?.createdAt
                                        ? new Date(item.createdAt).toLocaleDateString()
                                        : 'Unknown date'}
                                </span>
                                </div>
                            </div>

                            <Link
                                href={`/dashboard/articles/${item?.id}`}
                                onClick={() => navigate(`/dashboard/articles/${item?.id}`)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 14px',
                                    border: '1px solid #fff',
                                    borderRadius: '20px',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    fontSize: '13px',
                                    alignSelf: 'flex-end',
                                    backgroundColor: 'transparent',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                View <Icon icon="mdi:arrow-right" width="14" />
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <NoFound message="Articles not found" />
            )}
        </>
    );
}

export default ListCards