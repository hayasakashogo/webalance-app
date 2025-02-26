"use client"

import Image from "next/image"
import Link from "next/link"

const ErrorPage =()=> {
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
                    <p className="text-text">リンクの有効期限が切れています。<br />もう一度Sign upしてください</p>
                    <Link href={"/signup"} className="block text-primary font-bold">Sign upページへ</Link>
                </div>
            </div>
        </>
        
    )
}

export default ErrorPage;