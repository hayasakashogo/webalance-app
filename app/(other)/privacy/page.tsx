'use client';

import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { contactFormUrl } from '@/lib/links/links';
import { FaExternalLinkAlt } from 'react-icons/fa';

const TermsOfService = () => {
    const router = useRouter();
    return (
        <>
            <header className="p-3 text-white bg-primary">
                <div className='flex justify-between items-center max-w-4xl mx-auto'>
                    <button
                        className="-mr-[24px] relative z-10"
                        onClick={() => {
                            router.refresh();
                            router.back();
                        }}>
                        <IoIosArrowBack size={"24px"} />
                    </button>
                    <h1 className="w-full text-center font-bold">プライバシーポリシー</h1>
                </div>
            </header>
            <div className="max-w-2xl mx-auto p-6 text-sm">
                <h1 className="text-2xl font-bold pb-2">プライバシーポリシー</h1>
                <p className="mb-4">
                    WeBalance（以下、「当サービス」といいます。）は、ユーザーの個人情報の保護を重要な責務と認識し、以下のプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
                </p>

                <section className="mb-6 border-b pb-4">
                    <h2 className="font-bold mb-2 text-xl">1. 適用範囲</h2>
                    <p>本ポリシーは、当サービスが提供するサービス全般において、ユーザーの個人情報を取得・利用・管理する際に適用されます。</p>
                </section>

                <section className="mb-6 border-b pb-4">
                    <h2 className="font-bold mb-2 text-xl">2. 個人情報の取得方法</h2>
                    <ul className="list-disc pl-5">
                        <li>ユーザーが当サービスに登録する際に入力した情報</li>
                        <li>お問い合わせフォーム等を通じて提供された情報</li>
                        <li>サービス利用に伴い自動的に取得される情報（アクセスログ、Cookie等）</li>
                    </ul>
                </section>

                <section className="mb-6 border-b pb-4">
                    <h2 className="font-bold mb-2 text-xl">3. 個人情報の利用目的</h2>
                    <ul className="list-disc pl-5">
                        <li>本サービスの運営、維持、管理</li>
                        <li>ユーザーサポートおよび問い合わせ対応</li>
                        <li>サービス品質向上のための分析・統計</li>
                        <li>法令に基づく対応</li>
                    </ul>
                </section>

                <section className="mb-6 border-b pb-4">
                    <h2 className="font-bold mb-2 text-xl">4. 個人情報の管理</h2>
                    <p>当サービスは、個人情報の漏えい、滅失、毀損を防止するため、適切な安全管理措置を講じます。また、個人情報の管理体制を定期的に見直し、改善を図ります。</p>
                </section>

                <section className="mb-6 border-b pb-4">
                    <h2 className="font-bold mb-2 text-xl">5. 個人情報の第三者提供</h2>
                    <p>当サービスは、以下の場合を除き、個人情報を第三者に提供することはありません。</p>
                    <ul className="list-disc pl-5">
                        <li>ユーザーの同意がある場合</li>
                        <li>法令に基づき開示が求められた場合</li>
                        <li>ユーザーの権利や安全を保護するために必要な場合</li>
                    </ul>
                </section>

                <section className="mb-6 border-b pb-4">
                    <h2 className="font-bold mb-2 text-xl">6. 個人情報の開示・訂正・削除</h2>
                    <p>ユーザーは、当サービスに対し、自己の個人情報の開示、訂正、削除を求めることができます。対応を希望される場合は、以下の窓口までお問い合わせください。</p>
                </section>

                <section className="mb-6 border-b pb-4">
                    <h2 className="font-bold mb-2 text-xl">7. Cookie等の使用</h2>
                    <p>当サービスは、ユーザー体験向上のためにCookieを使用することがあります。ユーザーはブラウザの設定により、Cookieの拒否や削除を行うことができます。</p>
                </section>

                <section className="mb-6 border-b pb-4">
                    <h2 className="font-bold mb-2 text-xl">8. 免責事項</h2>
                    <ul className="list-disc pl-5">
                        <li>第三者による不正アクセスやハッキング等による情報漏えい</li>
                        <li>ユーザーの過失による情報流出</li>
                        <li>その他、当サービスの故意または重大な過失が認められない事由による損害</li>
                    </ul>
                </section>

                <section className="mb-6 border-b pb-4">
                    <h2 className="font-bold mb-2 text-xl">9. プライバシーポリシーの変更</h2>
                    <p>本ポリシーは、法令の改正やサービス内容の変更に応じて、適宜見直しを行います。変更がある場合は、当サービス上で通知します。</p>
                </section>

                <section className="mb-6">
                    <h2 className="font-bold mb-2 text-xl">10. お問い合わせ窓口</h2>
                    <p>個人情報の取扱いに関するお問い合わせは、以下の窓口までご連絡ください。</p>
                    <p className='mt-4'>
                        <Link
                            href={contactFormUrl}
                            className="hover:underline flex items-center gap-2 text-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>問い合わせ</span>
                            <FaExternalLinkAlt />
                        </Link>
                    </p>
                </section>

                <p className="text-gray-500 text-xs mt-6">制定日: 2025/02/20 / 最終更新日: 2025/02/20</p>
            </div>
        </>
    );
};

export default TermsOfService;