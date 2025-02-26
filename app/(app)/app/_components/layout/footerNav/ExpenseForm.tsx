import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useCoupleContext } from "../../context/coupleContext/CoupleContext"
import { useExpensesContext } from "../../context/expensesContext/ExpensesContext"
import { supabase } from "@/utils/supabase/client"
import { useState } from "react"
import toast from "react-hot-toast"
import { colors } from "@/lib/colors/colors"
import Spinner from "@/app/_components/elements/Spinner"
import { IoMdAdd } from "react-icons/io";
import { TbReportMoney } from "react-icons/tb";
import { CgShoppingCart } from "react-icons/cg";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // 追加
import { Label } from "@/components/ui/label"
import ExpensesFormDateField from "../../elements/ExpensesFormDateField/ExpensesFormDateField"

const FormSchema = z.object({
    date: z.date({
        required_error: "支払日を入力してください。",
    }),
    item: z
        .string()
        .min(1, { message: "品目を入力してください。" }),
    amount: z
        .string()
        .refine((value) => !isNaN(Number(value)) && Number(value) > 0, {
            message: "金額は正の数値を入力してください。",
        }),
    tax: z.enum(["inclusive", "8", "10"]).default("inclusive"), // ラジオボタンの選択肢
})

interface ExpenseFormProps {
    setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function ExpenseForm(props: ExpenseFormProps) {
    const { setDrawerOpen } = props;
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            date: undefined,
            item: "",
            amount: "",
            tax: "inclusive", // デフォルト値を設定
        },
        mode: "onChange",
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const { currentUser, isPrimaryUser } = useCoupleContext()
    const { monthlyTotal } = useExpensesContext();
    const { coupleId, yearMonth } = useParams()
    
    const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
        try {
            if (isSubmitting) {
                return;
            }
            setIsSubmitting(true);
            const { date, item, amount, tax } = formData;
            const localDateString = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');

            let adjustedAmount = Number(amount);
            if (tax === "8") {
                adjustedAmount = Math.floor(adjustedAmount * 1.08); // 8%増、切り捨て
            } else if (tax === "10") {
                adjustedAmount = Math.floor(adjustedAmount * 1.10); // 10%増、切り捨て
            }

            if (!monthlyTotal) {
                const { error: expensesError } = await supabase.from("expenses").insert([
                    {
                        couple_id: coupleId,
                        user_id: currentUser.id,
                        year_month: yearMonth,
                        date: localDateString,
                        amount: adjustedAmount.toString(),
                        item
                    },
                ])
                if (expensesError) {
                    throw new Error(expensesError.message);
                }
                const { error: monthlyTotalError } = await supabase.from("monthly_totals").insert([
                    {
                        couple_id: coupleId,
                        year_month: yearMonth,
                        primary_user_total: isPrimaryUser ? adjustedAmount : 0,
                        partner_user_total: isPrimaryUser ? 0 : adjustedAmount,
                        total_amount: adjustedAmount
                    },
                ])
                if (monthlyTotalError) {
                    throw new Error(monthlyTotalError.message);
                }
                setDrawerOpen(false);
            } else {
                const { error: expensesError } = await supabase.from("expenses").insert([
                    {
                        couple_id: coupleId,
                        user_id: currentUser.id,
                        year_month: yearMonth,
                        date: localDateString,
                        amount: adjustedAmount.toString(),
                        item
                    },
                ])
                if (expensesError) {
                    throw new Error(expensesError.message);
                }
            }
        } catch (err) {
            toast.error('予期せぬエラーが発生しました。',
                {
                    duration: 3000,
                    style: {
                        backgroundColor: colors.error_light,
                        color: colors.error,
                    },
                }
            );
            console.error(err);
        } finally {
            setIsSubmitting(false);
            setDrawerOpen(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col items-center max-w-[430px] mx-auto">
                {/* 支払日 */}
                <ExpensesFormDateField form={form} />

                {/* 品目 */}
                <FormField
                    control={form.control}
                    name="item"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="flex items-center gap-1 font-bold text-gray-500">
                                <CgShoppingCart size={"19px"} />
                                品目
                            </FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="品目を入力してください" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 金額 */}
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="flex items-center gap-1 font-bold text-gray-500">
                                <TbReportMoney size={"16px"} />
                                金額
                            </FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="金額を入力してください" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 税 */}
                <FormField
                    control={form.control}
                    name="tax"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            {/* <FormLabel className="flex items-center gap-1 font-bold text-gray-500">
                                税率
                            </FormLabel> */}
                            <FormControl>
                                <RadioGroup
                                    value={field.value} // 現在選択されている値を設定
                                    onValueChange={(value) => field.onChange(value)} // ラジオボタンの選択が変わると更新
                                    className="flex items-center justify-end gap-4"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="inclusive" id="option-inclusive" />
                                        <Label htmlFor="option-inclusive">税込み</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="8" id="option-8" />
                                        <Label htmlFor="option-8">+8%</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="10" id="option-10" />
                                        <Label htmlFor="option-10">+10%</Label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button className="font-bold" type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid}>
                    {form.formState.isSubmitting ? (
                        <Spinner size="20px" />
                    ) : (
                        <IoMdAdd size="20px" />
                    )}
                    <span>保存</span>
                </Button>
            </form>
        </Form>
    );
}
