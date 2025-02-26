'use client'

import Link from 'next/link';
import React from 'react';
import { getCurrentYearMonth } from '@/lib/utils';
import { User } from '@supabase/supabase-js';
import { signOut } from '@/lib/supabese/client/signout';
import { useRouter } from 'next/navigation';

type HederProps = {
    coupleId: string | undefined;
    user: User | null;
}

const Header = (props: HederProps) => {
    const { coupleId, user } = props;
    const currentYearMonth = getCurrentYearMonth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut("サインアウトしました。");
        router.refresh();
    }

    return (
        <header className='p-4 bg-primary border-b border-[#85D8DE] fixed top-0 w-full z-10'>
            <div className='flex items-center justify-between max-w-[768px] mx-auto'>
                <h1 className='text-xl font-bold text-base'>
                    <Link href={"/"}>WeBalance<span className='text-xs'>(β版)</span></Link>
                </h1>

                {!user ?
                    <nav>
                        <ul className='flex items-center gap-4'>
                            <li>
                                <Link
                                    href="/signup"
                                    className='font-bold text-primary bg-base py-2 px-4 text-xs rounded-sm border border-base'
                                >
                                    Sign up
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={"/signin"}
                                    className='font-bold text-white border border-white py-2 px-4 text-xs rounded-sm'
                                >
                                    Sign in
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    : user && !coupleId ?
                        <nav>
                            <ul className='flex items-center gap-4'>
                                <li>
                                    <Link
                                        href={'/setup'}
                                        className='font-bold text-sm py-2 px-4 bg-base text-primary rounded-md'
                                    >
                                        App
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        className='text-white font-bold text-sm border-b border-white py-1'
                                        onClick={async () => await handleSignOut()}
                                    >
                                        Sign out
                                    </button>
                                </li>
                            </ul>
                        </nav>
                        :
                        <nav>
                            <ul className='flex items-center gap-4'>
                                <li>
                                    <Link
                                        href={`/app/${coupleId}/${currentYearMonth}`}
                                        className='font-bold text-sm py-2 px-4 bg-base text-primary rounded-md'
                                    >
                                        App
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        className='text-white font-bold text-sm border-b border-white py-1'
                                        onClick={async () => await handleSignOut()}
                                    >
                                        Sign out
                                    </button>
                                </li>
                            </ul>
                        </nav>
                }
            </div>
        </header>
    )
}

export default Header
