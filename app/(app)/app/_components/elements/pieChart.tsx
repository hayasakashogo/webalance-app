"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useExpensesContext } from "../context/expensesContext/ExpensesContext"
import { useCoupleContext } from "../context/coupleContext/CoupleContext"
import { colors } from "@/lib/colors/colors"

export function PieChartSection() {
    const { currentUser, partner, isPrimaryUser } = useCoupleContext()
    const { monthlyTotal: { total_amount, primary_user_total, partner_user_total } } = useExpensesContext();
    if (total_amount == 0) {
        return (
            <div
                className="rounded-2xl py-6"
                style={{
                    boxShadow: `4px 4px 6px rgba(163, 177, 198, 0.4), -4px -4px 6px rgba(255, 255, 255, 0.9)`,
                    border: `1px solid #D9F3F6`
                }}
            >
                <div className="grid place-items-center">
                    <div className="rounded-full bg-base flex items-center justify-center">
                        <p className="font-bold text-center text-xl text-text">
                            支出はありません。
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    const chartData = [
        {
            user: currentUser.name,
            amount: isPrimaryUser ? primary_user_total : partner_user_total,
            fill: isPrimaryUser ? colors.primary : colors.secondary
        },
        {
            user: partner?.name,
            amount: isPrimaryUser ? partner_user_total : primary_user_total,
            fill: isPrimaryUser ? colors.secondary : colors.primary
        },
    ]
    const chartConfig = {
        amount: {
            label: "Amount", // 金額のラベル
        },
        currentUser: {
            label: currentUser.name || "Current User", // 現在のユーザー名をラベルに使用
            color: isPrimaryUser ? colors.primary : colors.secondary, // 現在のユーザーのチャート色
        },
        partner: {
            label: partner?.name || "Partner", // パートナーの名前をラベルに使用
            color: isPrimaryUser ? colors.secondary : colors.primary, // パートナーのチャート色
        },
    } satisfies ChartConfig;


    // console.log(chartData)

    return (
        <div
            className="rounded-2xl"
            style={{
                boxShadow: `4px 4px 6px rgba(163, 177, 198, 0.4), -4px -4px 6px rgba(255, 255, 255, 0.9)`,
                border: `1px solid #D9F3F6`
            }}
        >
            <div className="grid grid-cols-[auto_1fr] place-items-center">
                <div className="w-[200px] h-[200px]">
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-square max-h-[200px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="amount"
                                nameKey="user"
                                innerRadius={60}
                                strokeWidth={5}
                            // endAngle={180}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-2xl font-bold text-text"
                                                    >
                                                        ¥{total_amount.toLocaleString()}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        合計支出額
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </div>
                <div className="w-[150px] pr-6">
                    <ul className="space-y-4">
                        {chartData.map((data, index) => (
                            <li
                                key={index}
                                className={"pl-4"}
                                style={{ borderLeft: `solid 4px ${data.fill}` }}
                            >
                                <p className="flex items-center gap-2 text-slate-500 text-base">
                                    {data.user ?
                                        data.user
                                        :
                                        "unknown"
                                    }
                                </p>
                                <p className="font-bold text-text border-b-2 pb-1 ">
                                    ¥{data.amount.toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
