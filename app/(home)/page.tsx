import { getUser } from "@/lib/supabese/server/session";
import { getCurrentYearMonth } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import WeBalanceGuide from "../_components/elements/WeBalanceGuide";

export default async function page() {
    const { user } = await getUser();
    const currentYearMonth = getCurrentYearMonth();

    let coupleId: string | undefined = undefined;

    if (user) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("couples")
            .select("custom_couple_id")
            .or(`primary_user_id.eq.${user.id},partner_user_id.eq.${user.id}`);

        if (!error && data.length > 0) {
            coupleId = data[0].custom_couple_id
        }
    }
    return (
        <div>
            <section className="bg-primary p-6 pb-1 text-white font-bold" >
                <div className="flex  items-center flex-col sm:flex-row sm:gap-4 sm:justify-center max-w-[768px] mx-auto">
                    <div>
                        <div>
                            <h2 className='text-3xl font-bold '>二人のバランス、<br />カンタン管理。</h2>
                            <p className="mt-4">
                                WeBalanceは、カップルの支出を簡単に管理し、フェアに分担するためのアプリです。<br />
                                あなたの大切な人と、もっとスムーズにお金のやりとりをしましょう。
                            </p>
                        </div>
                        <div className="w-full flex flex-col items-center gap-4 mt-4">
                            {!user ?
                                <>
                                    <Link href={"/signup"} className="block text-primary bg-base py-2 text-center w-2/3 max-w-[430px] rounded-full">はじめる</Link>
                                    <Link href={"/signin"} className="text-xs border-b border-base pb-1">Sign in はこちら</Link>
                                </>
                                : user && !coupleId ?
                                    <Link href={"/setup"} className="block text-primary bg-base py-2 text-center w-2/3 max-w-[430px] rounded-full">Appを開く</Link>
                                    :
                                    <Link href={`/app/${coupleId}/${currentYearMonth}`} className="block text-primary bg-base py-2 text-center w-2/3 max-w-[430px] rounded-full">Appを開く</Link>

                            }
                        </div>
                    </div>
                    <div className="h-[500px] overflow-hidden mt-4">
                        <Image
                            src="/home/mv/home_view.png"
                            alt="hero"
                            width={500}
                            height={0}
                            className="w-[600px]"
                        />
                    </div>
                </div>
            </section>
            <section className="p-6 text-text flex flex-col items-center sm:py-12">
                <div className="mx-auto max-w-[960px] flex flex-col items-center">
                    <h2 className="font-bold text-xl border-b border-[#85D8DE] p-4 pt-0 inline-block">WeBalanceの特徴</h2>
                    <div>
                        <ul className="flex flex-col sm:flex-row sm:gap-4">
                            <li className="sm:w-[33%]">
                                <Image
                                    src="/home/feature/device.png"
                                    alt="hero"
                                    width={500}
                                    height={0}
                                    className="w-full"
                                />
                                <div className="-mt-10 sm:-mt-5">
                                    <h3 className="font-bold">インストール不要ですぐにはじめられる</h3>
                                    <p>アプリのダウンロードは不要！Webブラウザからすぐにアクセスできるので、どのデバイスでも手軽に使えます。</p>
                                </div>
                            </li>
                            <li className="sm:w-[33%]">
                                <Image
                                    src="/home/feature/calculator.png"
                                    alt="hero"
                                    width={500}
                                    height={0}
                                    className="w-full"
                                />
                                <div className="-mt-10 sm:-mt-5">
                                    <h3 className="font-bold">シンプルな機能で直感的に操作</h3>
                                    <p>余計な機能を省き、誰でも簡単に使えるデザインに。支出を入力するだけで、自動で計算＆整理！</p>
                                </div>
                            </li>
                            <li className="sm:w-[33%]">
                                <Image
                                    src="/home/feature/couple.png"
                                    alt="hero"
                                    width={500}
                                    height={0}
                                    className="w-full"
                                />
                                <div className="-mt-10 sm:-mt-5">
                                    <h3 className="font-bold">負担比率を自由に設定</h3>
                                    <p>支払いを5:5だけでなく、収入差や状況に応じて調整可能。カップルに最適な分担方法で、スムーズな精算を実現！</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <WeBalanceGuide />
            <div className="w-full flex flex-col items-center bg-white pb-6 sm:pb-12">
                {!user ?
                    <Link href={"/signup"} className="block bg-primary font-bold text-white py-2 text-center w-2/3 max-w-[430px] rounded-full">はじめる</Link>
                    : user && !coupleId ?
                        <Link href={"/setup"} className="block bg-primary font-bold text-white py-2 text-center w-2/3 max-w-[430px] rounded-full">Appを開く</Link>
                        :
                        <Link href={`/app/${coupleId}/${currentYearMonth}`} className="block bg-primary font-bold text-white py-2 text-center w-2/3 max-w-[430px] rounded-full">Appを開く</Link>
                }
            </div>
        </div>
    )
}
