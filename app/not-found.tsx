"use client";

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation";

const NotFound = () => {
    const router = useRouter();

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
                <p className="text-center text-primary font-bold text-[64px]">404</p>
                <Image
                    src={"/not-found/404.png"}
                    alt="page not found"
                    width={500}
                    height={500}
                    className="w-full"
                />
                <div className="px-4 space-y-2">
                    <button
                        className="text-primary font-bold"
                        onClick={() => router.back()}
                    >
                        前のページへ
                    </button>
                    <Link href={"/"} className="block text-primary font-bold">ホームへ</Link>
                </div>
            </div>
        </>
    )
}

export default NotFound