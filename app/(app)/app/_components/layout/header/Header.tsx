"use client"

import React from 'react'
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HiUser } from "react-icons/hi";
import { useCoupleContext } from '../../context/coupleContext/CoupleContext';
import YearMonthNavigator from '../../elements/yearMonthNavigator/yearMonthNavigator';
import { colors } from '@/lib/colors/colors';
import { useParams } from 'next/navigation'

type Params = {
    coupleId:string;
    yearMonth:string;
}

const Header = () => {
    const { currentUser, partner, couple: { coupleId, headerImg }, isPrimaryUser } = useCoupleContext();
    const { yearMonth } = useParams<Params>();
    
    if (!yearMonth) {
        return null;
    }

    return (
        <>
            <header
                className='w-full max-w-[430px]'
            >
                <div className='w-full relative'>
                    <div className='absolute z-20 w-full h-full flex items-center px-2'>
                        <p className='text-center font-bold text-lg text-white w-full' style={{
                            textShadow: '2px 2px 4px rgba(255, 255, 255, 0.6)',
                        }}>{coupleId}</p>
                    </div>
                    <div>
                        <AspectRatio ratio={5 / 1} className='border relative before:content-[""] before:absolute before:w-full before:h-full before:bg-black before:bg-opacity-30 before:z-10'>
                            <Image src={headerImg ? headerImg : "/sample1.jpg"} fill alt="Image" className="object-cover" />
                        </AspectRatio>
                    </div>
                </div>
                <ul className='flex items-center justify-center mt-[-20px] gap-4 relative z-20'>
                    <li className='flex flex-col items-center'>
                        <Avatar
                            className='bg-white'
                            style={{ border: isPrimaryUser ? `solid 1px ${colors.primary}` : `solid 1px ${colors.secondary}` }}
                        >
                            <AvatarImage src={currentUser.icon} />
                            <AvatarFallback style={{ backgroundColor: isPrimaryUser ? colors.primary_light : colors.secondary_light }}>
                                <HiUser color={isPrimaryUser ? colors.primary : colors.secondary} size={"28px"} />
                            </AvatarFallback>
                        </Avatar>
                        <p className='text-text font-bold'>{currentUser.name}</p>
                    </li>
                    {partner &&
                        <li className='flex flex-col items-center'>
                            <Avatar
                                className='bg-white'
                                style={{ border: isPrimaryUser ? `solid 1px ${colors.secondary}` : `solid 1px ${colors.primary}` }}
                            >
                                <AvatarImage src={partner.icon} />
                                <AvatarFallback style={{ backgroundColor: isPrimaryUser ? colors.secondary_light : colors.primary_light }}>
                                    <HiUser color={isPrimaryUser ? colors.secondary : colors.primary} size={"28px"} />
                                </AvatarFallback>
                            </Avatar>
                            <p className='text-text font-bold'>{partner.name}</p>
                        </li>
                    }
                </ul>
            </header>
            <YearMonthNavigator yearMonth={yearMonth} />
        </>
    )
}

export default Header
