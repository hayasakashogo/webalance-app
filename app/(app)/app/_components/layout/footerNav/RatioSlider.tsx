import React, { useMemo, useState } from "react";
import { useCoupleContext } from "../../context/coupleContext/CoupleContext";
import { useExpensesContext } from "../../context/expensesContext/ExpensesContext";
import { colors } from "@/lib/colors/colors";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HiUser } from "react-icons/hi";
import { motion } from "framer-motion";
import { RiArrowRightSFill } from "react-icons/ri";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const RatioSlider = () => {
    const { currentUser, partner, isPrimaryUser } = useCoupleContext();
    const { monthlyTotal: { total_amount, primary_user_total, partner_user_total } } = useExpensesContext();
    const currentUserPayment = isPrimaryUser ? primary_user_total : partner_user_total;
    const partnerPayment = isPrimaryUser ? partner_user_total : primary_user_total;

    const [value, setValue] = useState<number>(5); // 初期値: 5 (50%)

    // 基本の負担額計算
    const currentUserBurden = useMemo(() => Math.floor(total_amount * value / 10), [value, total_amount]);
    const partnerBurden = useMemo(() => Math.floor(total_amount * (10 - value) / 10), [value, total_amount]);

    // 余り計算
    const remainder = useMemo(() => total_amount - (currentUserBurden + partnerBurden), [currentUserBurden, partnerBurden, total_amount]);

    // 余りを負担額の多い方に追加
    const isCurrentUserPayingMore = currentUserBurden >= partnerBurden;
    const adjustedCurrentUserBurden = isCurrentUserPayingMore ? currentUserBurden + remainder : currentUserBurden;
    const adjustedPartnerBurden = isCurrentUserPayingMore ? partnerBurden : partnerBurden + remainder;

    // 差額計算
    const currentUserDifference = useMemo(() => currentUserPayment - adjustedCurrentUserBurden, [currentUserPayment, adjustedCurrentUserBurden]);
    const partnerDifference = useMemo(() => partnerPayment - adjustedPartnerBurden, [partnerPayment, adjustedPartnerBurden]);

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(Number(e.target.value));
    };


    return total_amount > 0 ? (
        <div className="max-w-[430px] mx-auto">
            {currentUserDifference !== 0 ? (
                <div className="mt-4">
                    <p className="text-3xl text-center font-bold text-primary -mb-2">
                        ¥{Math.abs(currentUserDifference).toLocaleString()}
                    </p>
                    <div className="flex items-center justify-around">
                        {currentUserDifference < 0 ?
                            <Avatar className="bg-white  w-12 h-12">
                                <AvatarImage src={currentUser.icon} />
                                <AvatarFallback style={{ backgroundColor: isPrimaryUser ? colors.primary_light : colors.secondary_light }}>
                                    <HiUser color={isPrimaryUser ? colors.primary : colors.secondary} size={"20px"} />
                                </AvatarFallback>
                            </Avatar>
                            :
                            <Avatar className="bg-white w-12 h-12">
                                <AvatarImage src={partner?.icon} />
                                <AvatarFallback style={{ backgroundColor: isPrimaryUser ? colors.secondary_light : colors.primary_light }}>
                                    <HiUser color={isPrimaryUser ? colors.secondary : colors.primary} size={"20px"} />
                                </AvatarFallback>
                            </Avatar>
                        }

                        <div className="flex items-center gap-0">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: [0, 1, 1], x: [-20, 0, 0] }}
                                    transition={{
                                        delay: i * 0.2,
                                        duration: 0.5,
                                        repeat: Infinity, // 無限ループ
                                        repeatDelay: 1  // ループの間隔（1.5秒）
                                    }}
                                >
                                    <RiArrowRightSFill color={colors.primary} size={"32px"} />
                                </motion.div>
                            ))}
                        </div>

                        {currentUserDifference < 0 ?
                            <Avatar className="bg-white w-12 h-12">
                                <AvatarImage src={partner?.icon} />
                                <AvatarFallback style={{ backgroundColor: isPrimaryUser ? colors.secondary_light : colors.primary_light }}>
                                    <HiUser color={isPrimaryUser ? colors.secondary : colors.primary} size={"20px"} />
                                </AvatarFallback>
                            </Avatar>
                            :
                            <Avatar className="bg-white w-12 h-12">
                                <AvatarImage src={currentUser.icon} />
                                <AvatarFallback style={{ backgroundColor: isPrimaryUser ? colors.primary_light : colors.secondary_light }}>
                                    <HiUser color={isPrimaryUser ? colors.primary : colors.secondary} size={"20px"} />
                                </AvatarFallback>
                            </Avatar>
                        }
                    </div>

                </div>
            ) : (
                <p className="font-bold text-center mt-6">差額はありません</p>
            )}

            <div className="mt-4">
                {/* 比率ラベル */}
                <p className="text-lg text-text font-bold flex items-center justify-center gap-6">
                    <span
                        className="block"
                        style={{ color: isPrimaryUser ? colors.primary : colors.secondary }}
                    >
                        {value}
                    </span>
                    <span className="block">:</span>
                    <span
                        className="block"
                        style={{ color: isPrimaryUser ? colors.secondary : colors.primary }}
                    >
                        {10 - value}
                    </span>
                </p>

                {/* スライダー */}
                <div className="flex items-center gap-4 w-full">
                    <Avatar className="bg-white w-8 h-8">
                        <AvatarImage src={currentUser.icon} />
                        <AvatarFallback style={{ backgroundColor: isPrimaryUser ? colors.primary_light : colors.secondary_light }}>
                            <HiUser color={isPrimaryUser ? colors.primary : colors.secondary} size={"20px"} />
                        </AvatarFallback>
                    </Avatar>

                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={value}
                        onChange={handleSliderChange}
                        className="w-full h-2 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-transparent"
                        style={{
                            background: `linear-gradient(to right, ${isPrimaryUser ? colors.primary : colors.secondary} ${(value / 10) * 100}%, ${isPrimaryUser ? colors.secondary : colors.primary} ${(value / 10) * 100}%)`,
                        }}
                    />

                    <Avatar className="bg-white w-8 h-8">
                        <AvatarImage src={partner?.icon} />
                        <AvatarFallback style={{ backgroundColor: isPrimaryUser ? colors.secondary_light : colors.primary_light }}>
                            <HiUser color={isPrimaryUser ? colors.secondary : colors.primary} size={"20px"} />
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>

            <Accordion type="single" collapsible>
                <AccordionItem value="details" className="text-text">
                    <AccordionTrigger className="text-primary hover:underline mt-4">明細を見る</AccordionTrigger>
                    <AccordionContent>
                        {currentUserDifference !== 0 ? (
                            <p className="text-center font-bold">
                                {currentUserDifference > 0 ?
                                    <span className="text-lg">{currentUser.name}</span>
                                    :
                                    <span className="text-lg">{partner?.name}</span>
                                }
                                さんが、<br />
                                負担額よりも<span className="text-lg">{Math.abs(currentUserDifference).toLocaleString()}</span>
                                円多く支払っています。
                            </p>
                        ) : (
                            <p className="font-bold text-center mt-6">差額はありません</p>
                        )}
                        <table className="w-full mt-4 border-collapse border border-gray-300 bg-white">
                            <thead>
                                <tr className="bg-gray-100 border border-gray-300">
                                    <th className="border-r border-gray-300 bg-[linear-gradient(to_right_top,transparent_calc(50%-0.5px),#999_50%,#999_calc(50%+0.5px),transparent_calc(50%+1px))]"></th>
                                    <th className="text-center p-2 border-r border-gray-300">支払額</th>
                                    <th className="text-center p-2 border-r border-gray-300">負担額</th>
                                    <th className="text-center p-2">差額</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* ユーザーの支出行 */}
                                <tr className="border-t border-gray-300" style={{ backgroundColor: isPrimaryUser ? colors.primary_light : colors.secondary_light }}>
                                    <td className="p-2 border-r border-gray-300">{currentUser.name}</td>
                                    <td className="text-center p-2 border-r border-gray-300">{currentUserPayment.toLocaleString()}</td>
                                    <td className="text-center p-2 border-r border-gray-300">{adjustedCurrentUserBurden.toLocaleString()}</td>
                                    <td className="text-center p-2">{currentUserDifference.toLocaleString()}</td>
                                </tr>

                                {/* パートナーの支出行 */}
                                {partner && (
                                    <tr className="border-t border-gray-300" style={{ backgroundColor: isPrimaryUser ? colors.secondary_light : colors.primary_light }}>
                                        <td className="p-2 border-r border-gray-300">{partner.name}</td>
                                        <td className="text-center p-2 border-r border-gray-300">{partnerPayment.toLocaleString()}</td>
                                        <td className="text-center p-2 border-r border-gray-300">{adjustedPartnerBurden.toLocaleString()}</td>
                                        <td className="text-center p-2">{partnerDifference.toLocaleString()}</td>
                                    </tr>
                                )}

                                {/* 合計支出額 */}
                                <tr className="border-t border-gray-300 font-bold bg-gray-50">
                                    <td className="text-center p-2 border-r border-gray-300">合計支出額</td>
                                    <td colSpan={2} className="text-center p-2 border-r border-gray-300">
                                        {(currentUserPayment + (partner ? partnerPayment : 0)).toLocaleString()} 円
                                    </td>
                                    <td className="bg-[linear-gradient(to_right_top,transparent_calc(50%-0.5px),#999_50%,#999_calc(50%+0.5px),transparent_calc(50%+1px))]"></td>
                                </tr>
                            </tbody>
                        </table>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>


        </div>
    ):(
        <p className="mt-4 text-center">支出はありません。</p>
    );
};

export default RatioSlider;
