"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation";

const ErrorPage =()=> {
    const router = useRouter();
    const params = useParams();
    console.log(params)

    return (
        <>
            <header>
                <div className="max-w-[640px] mx-auto p-4">
                    <h1 className="text-primary font-bold text-xl">
                        <Link href={"/"}> WeBalance</Link>
                    </h1>
                </div>
            </header>
            <div className="max-w-[640px] mx-auto">
                <Image
                    src={"/error/error.png"}
                    alt="page not found"
                    width={500}
                    height={500}
                    className="w-full"
                />
                <div className="px-4 space-y-2">
                    <p className="text-text">申し訳ございません。予期せぬエラーが発生しました。</p>
                    <Link href={"/"} className="block text-primary font-bold">ホームへ</Link>
                </div>
            </div>
        </>
        
    )
}

export default ErrorPage;