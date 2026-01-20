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
import ExpensesFormDateField from "../../elements/ExpensesFormDateField/ExpensesFormDateField"
import { Calculator } from "../../elements/Calculator/Calculator"

const FormSchema = z.object({
    date: z.date({
        required_error: "支払日を入力してください。",
    }),
    item: z
        .string()
        .min(1, { message: "品目を入力してください。" }),
    amount: z
        .number()
        .refine((value:number) => !isNaN(value) && value > 0, {
            message: "金額は正の数値を入力してください。",
        }),
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
            amount: 0,
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
            const { date, item, amount} = formData;
            const localDateString = date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');

            if (!monthlyTotal) {
                const { error: expensesError } = await supabase.from("expenses").insert([
                    {
                        couple_id: coupleId,
                        user_id: currentUser.id,
                        year_month: yearMonth,
                        date: localDateString,
                        amount: amount.toString(),
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
                        primary_user_total: isPrimaryUser ? amount : 0,
                        partner_user_total: isPrimaryUser ? 0 : amount,
                        total_amount: amount
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
                        amount: amount.toString(),
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
                                <TbReportMoney size="16px" />
                                金額
                            </FormLabel>
                            <FormControl>
                                <Calculator
                                    value={field.value}
                                    onChange={field.onChange}
                                />
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
