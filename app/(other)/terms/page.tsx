'use client';

import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useRouter } from "next/navigation";

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
                    <h1 className="w-full text-center font-bold">利用規約</h1>
                </div>
            </header>
            <div className="max-w-4xl mx-auto p-6 text-sm">
                <h1 className="text-2xl font-bold mb-4">WeBalance 利用規約</h1>
                <p className="mb-6">
                    本規約は、WeBalance（以下、「本サービス」）の利用条件を定めるものです。ユーザーは、本サービスを利用することで、本規約に同意したものとみなします。
                </p>

                <div className="border-t border-gray-300 pt-4 mt-4">
                    <h2 className="text-xl font-bold mb-2">第1条（適用）</h2>
                    <p className="mb-6">
                        本規約は、ユーザーと本サービスの運営者（以下、「運営」）との間の、本サービスの利用に関わる一切の関係に適用されます。
                    </p>
                </div>

                <div className="border-t border-gray-300 pt-4 mt-4">
                    <h2 className="text-xl font-bold mb-2">第2条（禁止事項）</h2>
                    <p className="mb-4">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
                    <ul className="list-disc pl-6 mb-6">
                        <li>法令または公序良俗に違反する行為</li>
                        <li>犯罪行為に関連する行為</li>
                        <li>本サービスのサーバーまたはネットワークの機能を破壊・妨害する行為</li>
                        <li>本サービスの運営を妨害する行為</li>
                        <li>他のユーザーに関する個人情報を不正に収集・蓄積する行為</li>
                        <li>他のユーザーになりすます行為</li>
                        <li>反社会的勢力に対して直接または間接に利益を供与する行為</li>
                        <li>その他、運営が不適切と判断する行為</li>
                    </ul>
                </div>

                <div className="border-t border-gray-300 pt-4 mt-4">
                    <h2 className="text-xl font-bold mb-2">第3条（本サービスの提供の停止・変更）</h2>
                    <p className="mb-4">
                        運営は、以下のいずれかに該当する場合、ユーザーに通知することなく、本サービスの全部または一部の提供を停止または変更することができます。
                    </p>
                    <ul className="list-disc pl-6 mb-6">
                        <li>システムの保守点検・更新を行う場合</li>
                        <li>地震、火災、停電、天災等の不可抗力により、本サービスの提供が困難となった場合</li>
                        <li>通信回線やサーバーの障害等により、本サービスの提供が困難となった場合</li>
                        <li>その他、運営が本サービスの提供が困難と判断した場合</li>
                    </ul>
                    <p>
                        本サービスの提供停止・変更によってユーザーが被った損害について、運営は一切の責任を負いません。
                    </p>
                </div>

                <div className="border-t border-gray-300 pt-4 mt-4">
                    <h2 className="text-xl font-bold mb-2">第4条（利用制限・登録抹消）</h2>
                    <p className="mb-4">
                        運営は、以下の場合、事前通知なくユーザーの利用を制限し、または登録を抹消することができます。
                    </p>
                    <ul className="list-disc pl-6 mb-6">
                        <li>本規約に違反した場合</li>
                        <li>その他、運営が本サービスの利用を適当でないと判断した場合</li>
                    </ul>
                    <p>
                        この措置によりユーザーに損害が生じた場合でも、運営は一切の責任を負いません。
                    </p>
                </div>

                <div className="border-t border-gray-300 pt-4 mt-4">
                    <h2 className="text-xl font-bold mb-2">第5条（免責事項）</h2>
                    <p className="mb-4">運営は、以下の場合において一切責任を負いません。</p>
                    <ul className="list-disc pl-6 mb-6">
                        <li>データの正確性について：本サービスは、支出管理の利便性向上を目的としていますが、その計算結果やデータの正確性を保証しません。</li>
                        <li>ハッキング・不正アクセスについて：運営は合理的な安全策を講じますが、不正アクセスやサイバー攻撃によりユーザーの情報が漏洩した場合でも、一切の責任を負いません。</li>
                        <li>システム障害・データ消失について：システム障害、通信回線の不具合、その他予期せぬトラブルによりデータが消失・改変された場合でも、一切の責任を負いません。</li>
                        <li>外部サービス・リンクについて：本サービスは外部サービスを利用する場合があり、それらのトラブルに起因する損害について責任を負いません。</li>
                        <li>責任範囲：運営が責任を負う場合であっても、運営の故意または重過失がある場合に限ります。</li>
                    </ul>
                </div>

                <div className="border-t border-gray-300 pt-4 mt-4">
                    <h2 className="text-xl font-bold mb-2">第6条（利用規約の変更）</h2>
                    <p className="mb-6">
                        運営は、必要に応じて本規約を変更できるものとします。規約変更後にユーザーが本サービスを利用した場合、変更後の規約に同意したものとみなします。
                    </p>
                </div>

                <div className="border-t border-gray-300 pt-4 mt-4">
                    <h2 className="text-xl font-bold mb-2">第7条（権利義務の譲渡の禁止）</h2>
                    <p className="mb-6">
                        ユーザーは、運営の書面による事前承諾なく、本規約に基づく権利または義務を第三者に譲渡・担保設定することはできません。
                    </p>
                </div>

                <div className="border-t border-gray-300 pt-4 mt-4">
                    <h2 className="text-xl font-bold mb-2">第8条（準拠法・裁判管轄）</h2>
                    <p className="mb-6">
                        本規約の解釈には、日本法を適用します。本サービスに関する紛争が生じた場合、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
                    </p>
                </div>

                <p className="mt-6 text-xs">制定日：2025/02/20</p>
                <p className="text-xs">WeBalance運営</p>
            </div>
        </>
    );
};

export default TermsOfService;
