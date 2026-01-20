"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { colors } from "@/lib/colors/colors"

type CalculatorProps = {
    value: number | null
    onChange: (value: number) => void
}

export function Calculator({ value, onChange }: CalculatorProps) {
    const [val, setVal] = useState("0")
    const [display, setDisplay] = useState("0")

    // form → calculator 同期（結果反映用）
    useEffect(() => {
        if (typeof value === "number") {
            setDisplay(String(value))
        }
    }, [value])

    const append = (v: string) => {
        setDisplay(prev => (prev === "0" ? v : prev + v))
    }

    const backspace = () => {
        setDisplay(prev => (prev.length <= 1 ? "0" : prev.slice(0, -1)))
    }

    const canApplyTax = /^\d+$/.test(display)

    const applyTax = (rate: 0.08 | 0.1) => {
        if (!canApplyTax) return

        const result = Math.round(Number(display) * (1 + rate))
        setDisplay(String(result))
    }


    const calculate = () => {
        // 数字で終わっていない式は無視（100+ はNG）
        if (!/\d$/.test(display)) return

        // 数値と演算子を分解
        const tokens = display.match(/\d+|[+-]/g)
        if (!tokens) return

        let result = Number(tokens[0])

        for (let i = 1; i < tokens.length; i += 2) {
            const op = tokens[i]
            const next = Number(tokens[i + 1])

            if (op === "+") result += next
            if (op === "-") result -= next
        }

        setDisplay(String(result))
        setVal(String(result))
        onChange(result)
    }


    const appendOperator = (op: "+" | "-") => {
        setDisplay(prev => {
            if (/[+-]$/.test(prev)) return prev // 連続入力防止
            return prev + op
        })
    }

    const keys = [
        "7", "8", "9", "⌫",
        "4", "5", "6", "+",
        "1", "2", "3", "-",
        "0", "+8%", "+10%", "Enter",
    ]
    const btnColors = {
        "⌫": {
            txt: "white",
            bg: colors.secondary
        },
        "+": {
            txt: "white",
            bg: "#586766"
        },
        "-": {
            txt: "white",
            bg: "#586766"
        },
        "Enter": {
            txt: "white",
            bg: colors.primary
        },
        "+8%": {
            txt: colors.primary,
            bg: "white"
        },
        "+10%": {
            txt: colors.primary,
            bg: "white"
        },
        default: {
            txt: colors.text,
            bg: "white"
        }
    }

    return (
        <div className="space-y-2">
            <Input value={val} readOnly />
            <p className="text-primary px-3">{display}</p>

            <div className="grid grid-cols-4 gap-2">
                {keys.map(k => {
                    const colorSet = btnColors[k as keyof typeof btnColors] ?? btnColors.default

                    return (
                        <Button
                            key={k}
                            type="button"
                            disabled={(k === "+8%" || k === "+10%") && !canApplyTax}
                            style={{
                                color: colorSet.txt,
                                backgroundColor: colorSet.bg,
                            }}
                            onClick={() => {
                                if (k === "⌫") backspace()
                                else if (k === "+8%") applyTax(0.08)
                                else if (k === "+10%") applyTax(0.1)
                                else if (k === "+" || k === "-") appendOperator(k)
                                else if (k === "Enter") calculate()
                                else append(k)
                            }}
                        >
                            {k}
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}
