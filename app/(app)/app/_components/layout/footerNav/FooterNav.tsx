'use client'
import React, { useState } from 'react'
import { FiPlusCircle } from "react-icons/fi";
import { AiFillHome, AiOutlineCloseCircle } from "react-icons/ai";
import { IoMdSettings } from "react-icons/io";
import { IoMdMenu } from "react-icons/io";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FaCirclePlus } from "react-icons/fa6";
import { TfiMenuAlt } from "react-icons/tfi";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from 'next/link';
import { useCoupleContext } from '../../context/coupleContext/CoupleContext';
import { usePathname, useRouter } from 'next/navigation';
import { IoMenu } from 'react-icons/io5';
import { HiUser, HiUsers } from 'react-icons/hi';
import { PiSignOutBold } from 'react-icons/pi';
import { supabase } from '@/utils/supabase/client';
import { ExpenseForm } from './ExpenseForm';
import RatioSlider from './RatioSlider';
import { colors } from '@/lib/colors/colors';
import { buttonBaseClasses } from '@mui/material';
import toast from 'react-hot-toast';
import { signOut } from '@/lib/supabese/client/signout';
import { contactFormUrl } from '@/lib/links/links';
import { FaExternalLinkAlt } from 'react-icons/fa';

const FooterNav = () => {
    const { couple: { coupleId }, partner } = useCoupleContext();
    const [firstDrawerOpen, setFirstDrawerOpen] = useState<boolean>(false);
    const [secondDrawerOpen, setSecondDrawerOpen] = useState<boolean>(false);
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut("サインアウトしました。");
        router.push("/");
    }

    const handleClick = () => {
        toast.error(
            "こちらの機能はパートナーの登録後に使用できます。",
            {
                duration: 4000,
                position: "bottom-left"
            }
        );
    }
    return (
        <div className='fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-base'>
            <div style={{ boxShadow: '0px 0px 15px -5px #777777' }} className='px-3 py-2 w-[97%] mx-auto mb-1.5 max-w-[430px] bg-primary shadow rounded-2xl'>
                <ul className='flex items-center justify-around'>
                    <li className='pt-1'>
                        {partner ?
                            <Drawer open={firstDrawerOpen} onOpenChange={setFirstDrawerOpen}>
                                <DrawerTrigger>
                                    <FaArrowRightArrowLeft size={"28px"} color={colors.base} />
                                </DrawerTrigger>
                                <DrawerContent className='bg-base'>
                                    <div className="px-6 -mt-2">
                                        <button onClick={() => setFirstDrawerOpen(false)} className="text-primary font-bold">キャンセル</button>
                                    </div>
                                    <DrawerHeader>
                                        <DrawerTitle className='text-center text-text'>精算する</DrawerTitle>
                                    </DrawerHeader>
                                    <div className='px-8 pb-8'>
                                        <RatioSlider />
                                    </div>
                                </DrawerContent>
                            </Drawer>
                            :
                            <button onClick={() => handleClick()}>
                                <FaArrowRightArrowLeft size={"28px"} color={colors.base} />
                            </button>
                        }
                    </li>

                    <li className='pt-2'>
                        <Drawer open={secondDrawerOpen} onOpenChange={setSecondDrawerOpen}>
                            <DrawerTrigger>
                                <FaCirclePlus size={"32px"} color={colors.base} />
                            </DrawerTrigger>
                            <DrawerContent className='bg-base'>
                                <div className="px-6 -mt-2">
                                    <button onClick={() => setSecondDrawerOpen(false)} className="text-primary font-bold">キャンセル</button>
                                </div>
                                <DrawerHeader>
                                    <DrawerTitle className='text-center text-text'>支出を追加</DrawerTitle>
                                </DrawerHeader>
                                <div className='px-8 pb-8'>
                                    <ExpenseForm setDrawerOpen={setSecondDrawerOpen} />
                                </div>
                            </DrawerContent>
                        </Drawer>
                    </li>

                    <li className='pt-2'>
                        <Sheet>
                            <SheetTrigger className='relative z-20'>
                                <TfiMenuAlt size={"32px"} color={colors.base} />
                            </SheetTrigger>
                            <SheetContent side={"right"} className='bg-base'>
                                <SheetHeader
                                    className="bg-primary p-6 "
                                    style={{
                                        borderBottomLeftRadius: "50% 50%",
                                        borderBottomRightRadius: "50% 50%",
                                    }}
                                >
                                    <SheetTitle className="text-center text-xl text-white">
                                        <Link href={"/"}>WeBalance</Link>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className='p-6 h-[calc(90vh)] flex flex-col justify-between'>
                                    <nav>
                                        <ul className='flex flex-col gap-4'>
                                            <li className='border-b border-[#DDEBEA] py-1'>
                                                <Link href={`/app/${coupleId}/menu/profile`}
                                                    className='flex items-center gap-2 font-bold text-primary'
                                                >
                                                    <HiUser size={"20px"} />
                                                    Profile
                                                </Link>
                                            </li>
                                            <li className='border-b border-[#DDEBEA] py-1'>
                                                <Link href={`/app/${coupleId}/menu/coupleInfo`}
                                                    className='flex items-center gap-2 font-bold text-primary'
                                                >
                                                    <HiUsers size={"20px"} />
                                                    Couple Info
                                                </Link>
                                            </li>
                                            <li className='border-b border-[#DDEBEA] py-1'>
                                                <button
                                                    className='flex items-center gap-2 font-bold text-secondary'
                                                    onClick={async () => await handleSignOut()}>
                                                    <PiSignOutBold size={"20px"} />
                                                    Sign out
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                    <nav className='mt-auto'>
                                        <ul className='space-y-2'>
                                            <li>
                                                <Link href={"/privacy"}
                                                    className='text-primary text-sm'
                                                >
                                                    プライバシーポリシー
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={"/terms"}
                                                    className='text-primary text-sm'
                                                >
                                                    利用規約
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={contactFormUrl}
                                                    className="flex items-center gap-2 text-primary text-sm"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <span>問い合わせ</span>
                                                    <FaExternalLinkAlt />
                                                </Link>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default FooterNav
