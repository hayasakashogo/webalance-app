import Image from "next/image";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const WeBalanceGuide = () => {
    return (
        <section className="p-6 text-text flex flex-col items-center bg-white sm:py-12">
            <h2 className="font-bold text-xl border-b border-[#85D8DE] p-4 pt-0 inline-block">WeBalanceの使い方</h2>

            <div className="mt-6 w-full max-w-[900px] sm:mt-12">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <li className="bg-base p-8 rounded-xl space-y-4 relative w-full">
                        <p className="font-bold text-primary absolute top-[-10px] left-[-4px] text-lg">Step 1</p>
                        <h3 className="font-bold text-center">サインアップ</h3>
                        <Image
                            src="/home/guide/signup.png"
                            alt="hero"
                            width={500}
                            height={0}
                            className="w-4/5 mx-auto"
                        />
                        <p className="text-sm">
                            メールアドレスとパスワードを設定後、本登録メールが届きます。<br />
                            メール内のリンクをクリックすると登録完了！そのままセットアップページへ進みます。
                        </p>
                    </li>
                    <li className="bg-base p-8 rounded-xl space-y-4 relative w-full">
                        <p className="font-bold text-primary absolute top-[-10px] left-[-4px] text-lg">Step 2</p>
                        <h3 className="font-bold text-center">セットアップ</h3>
                        <Image
                            src="/home/guide/setup.png"
                            alt="hero"
                            width={500}
                            height={0}
                            className="w-4/5 mx-auto"
                        />
                        <div className="text-sm space-y-4 leading-relaxed mt-4">
                            <p>セットアップページでは、以下の情報を入力します。</p>
                            <ul className="space-y-1 pl-4 list-disc">
                                <li>
                                    <Accordion type="single" collapsible>
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger className="p-0 justify-start text-primary text-xs font-bold">
                                                Couple ID（紐付けに使用）
                                            </AccordionTrigger>
                                            <AccordionContent className="py-2">
                                                <ul className="pl-3 space-y-1 text-gray-600">
                                                    <li className="flex gap-2">
                                                        <span>-</span>
                                                        <span>最初に登録する人がIDを作成し、パートナーに共有</span>
                                                    </li>
                                                    <li className="flex gap-2">
                                                        <span>-</span>
                                                        <span>パートナーは同じIDを入力して登録することで、二人のアカウントが紐づく</span>
                                                    </li>
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </li>
                                <li><span>表示名</span>（お互いにわかりやすい名前）</li>
                                <li><span>アイコン画像</span>（好きな画像を設定可能）</li>
                            </ul>
                            <p>これでセットアップ完了！アプリを使用開始します。</p>
                        </div>
                    </li>
                    <li className="bg-base p-8 rounded-xl space-y-4 relative w-full">
                        <p className="font-bold text-primary absolute top-[-10px] left-[-4px] text-lg">Step 3</p>
                        <h3 className="font-bold text-center">支出を追加</h3>
                        <Image
                            src="/home/guide/add.png"
                            alt="hero"
                            width={500}
                            height={0}
                            className="w-4/5 mx-auto"
                        />
                        <p className="text-sm mt-4">
                            支払日、品目、金額を入力して支出を追加。<br />
                            アプリ内では、支出を月毎に管理。お互いが何にどれだけ支払ったかを一目で確認することができます。
                        </p>
                    </li>
                    <li className="bg-base p-8 rounded-xl space-y-4 relative w-full">
                        <p className="font-bold text-primary absolute top-[-10px] left-[-4px] text-lg">Step 4</p>
                        <h3 className="font-bold text-center">精算する</h3>
                        <Image
                            src="/home/guide/seisan.png"
                            alt="hero"
                            width={500}
                            height={0}
                            className="w-4/5 mx-auto"
                        />
                        <p className="text-sm mt-4">
                            負担比率に応じた精算金額を自動計算。<br />
                            比率を変更するとリアルタイムで再計算され、調整も簡単。<br />
                            さらに、明細で算出の過程を確認できるため、納得感のある精算ができます。
                        </p>
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default WeBalanceGuide;
