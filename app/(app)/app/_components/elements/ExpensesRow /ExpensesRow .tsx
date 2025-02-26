import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HiUser } from "react-icons/hi";
import { IoEllipsisVertical } from "react-icons/io5";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect } from "react";
import { useCoupleContext } from "../../context/coupleContext/CoupleContext";
import { formatDate } from "../../../[coupleId]/[yearMonth]/functions";
import { zodResolver } from "@hookform/resolvers/zod"
import { parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { supabase } from "@/utils/supabase/client";
import { useExpensesContext } from "../../context/expensesContext/ExpensesContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { colors } from "@/lib/colors/colors";
import toast from "react-hot-toast";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Spinner from "@/app/_components/elements/Spinner";
import { FaCheck } from "react-icons/fa6";

type ExpensesRowProps = {
    id: string;
    userId: string;
    date: Date;
    amount: number;
    item: string;
    isEdit: boolean;
    setEditRowId: React.Dispatch<React.SetStateAction<string | null>>;
}

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
})

const ExpensesRow = (props: ExpensesRowProps) => {
    const { id, userId, date, amount, item, isEdit, setEditRowId } = props;
    const { yearMonth } = useParams();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            date: new Date(date),
            item: item,
            amount: String(amount),
        },
    });
    const initialMonth = parseISO(`${yearMonth}-01`);
    const { currentUser, partner, primaryUserId } = useCoupleContext();
    const { monthlyTotal } = useExpensesContext();

    // フォームエラーを toast で表示
    useEffect(() => {
        const errors = form.formState.errors;
        if (errors.date) toast.error(errors.date.message!);
        if (errors.item) toast.error(errors.item.message!);
        if (errors.amount) toast.error(errors.amount.message!);
    }, [form.formState.errors]);


    if (!monthlyTotal) {
        return;
    }

    const handleCancel = () => {
        form.reset({
            date: new Date(date),
            item: item,
            amount: String(amount),
        })
        setEditRowId(null);
    }
    const handleEdit = async (formData: z.infer<typeof FormSchema>) => {
        try {
            const { date: valDate, item: valItem, amount: valAmount } = formData;
            const localDateString = valDate.getFullYear() + '-' + (valDate.getMonth() + 1).toString().padStart(2, '0') + '-' + valDate.getDate().toString().padStart(2, '0');

            if (String(date) === localDateString && amount === Number(valAmount) && item === valItem) {
                setEditRowId(null);
                return;
            }

            if (Number(valAmount) <= 0) {
                const { error } = await supabase
                    .from('expenses')
                    .delete()
                    .eq('id', id);
                if (error) {
                    throw new Error(error.message);
                }
            } else {
                const { error } = await supabase
                    .from('expenses')
                    .update({ date: localDateString, amount: valAmount, item: valItem })
                    .eq('id', id);
                if (error) {
                    throw new Error(error.message);
                }
            }

            setEditRowId(null);
        } catch (err) {
            console.error(err);
            toast.error("予期せぬエラーが発生しました。",
                {
                    duration: 3000,
                    style: {
                        backgroundColor: colors.error_light,
                        color: colors.error,
                    },
                }
            );
        }
    }

    const handleDelete = async () => {
        // 削除処理をラップして Promise<void> を返す関数にする
        const deleteExpense = async (): Promise<void> => {
            const { error } = await supabase
                .from('expenses')
                .delete()
                .eq('id', id);

            if (error) {
                throw new Error(error.message);
            }
        };

        // toast.promise を使用
        await toast.promise(
            deleteExpense(),
            {
                loading: '削除中です...',
                success: <p>削除しました。</p>,
                error: <p style={{ color: colors.error }}>削除に失敗しました。</p>,
            }
        );
    };

    return (
        isEdit ? (
            <TableRow>
                <TableCell colSpan={5}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleEdit)}>
                            <div className="flex items-center gap-4">
                                {/* 支払日 */}
                                {/* <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field, fieldState }) => {
                                        useEffect(() => {
                                            if (fieldState.error) {
                                                if (fieldState.error) {
                                                    if (fieldState.error) {
                                                        toast.error(fieldState.error.message,
                                                            {
                                                                duration: 3000,
                                                                style: {
                                                                    backgroundColor: colors.error_light,
                                                                    color: colors.error,
                                                                },
                                                            }
                                                        );
                                                    }
                                                }
                                            }
                                        }, [fieldState.error]);
                                        return (
                                            <FormItem className="flex flex-col w-full">
                                                <FormLabel>支払日</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "pl-3 text-left font-normal text-text",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    formatDate(field.value)
                                                                ) : (
                                                                    <span>日付を選択</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            initialFocus
                                                            month={initialMonth}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </FormItem>
                                        )
                                    }}
                                /> */}

                                <FormField control={form.control} name="date" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>支払日</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline">
                                                        {field.value ? formatDate(field.value) : "日付を選択"}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent align="start">
                                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} month={initialMonth} />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                    </FormItem>
                                )} />

                                {/* 品目 */}
                                {/* <FormField
                                    control={form.control}
                                    name="item"
                                    render={({ field, fieldState }) => {
                                        useEffect(() => {
                                            if (fieldState.error) {
                                                if (fieldState.error) {
                                                    toast.error(fieldState.error.message,
                                                        {
                                                            duration: 3000,
                                                            style: {
                                                                backgroundColor: colors.error_light,
                                                                color: colors.error,
                                                            },
                                                        }
                                                    );
                                                }
                                            }
                                        }, [fieldState.error]);
                                        return (
                                            <FormItem className="w-full">
                                                <FormLabel>品目</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder={item} {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )
                                    }}
                                /> */}
                                <FormField control={form.control} name="item" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>品目</FormLabel>
                                        <FormControl>
                                            <Input type="text" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} />

                                {/* 金額 */}
                                {/* <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field, fieldState }) => {
                                        useEffect(() => {
                                            if (fieldState.error) {
                                                toast.error(fieldState.error.message,
                                                    {
                                                        duration: 3000,
                                                        style: {
                                                            backgroundColor: colors.error_light,
                                                            color: colors.error,
                                                        },
                                                    }
                                                );
                                            }
                                        }, [fieldState.error]);
                                        return (
                                            <FormItem className="w-full">
                                                <FormLabel>金額</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder={String(amount)} {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )
                                    }}
                                /> */}
                                <FormField control={form.control} name="amount" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>金額</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )} />
                            </div>

                            <div className="flex items-center justify-center gap-8 mt-4">
                                <button
                                    type="button"
                                    className="font-bold text-xs"
                                    style={{
                                        color: colors.primary,
                                        borderBottom: `2px solid ${colors.primary}`
                                    }}
                                    onClick={() => handleCancel()}
                                >
                                    キャンセル
                                </button>

                                <button
                                    className="text-xs bg-primary py-1 px-2 rounded-md text-base font-bold flex items-center gap-1"
                                    type="submit"
                                    disabled={form.formState.isSubmitting || !form.formState.isValid}
                                    style={{ opacity: form.formState.isSubmitting || !form.formState.isValid ? 0.5 : 1 }}
                                >
                                    {form.formState.isSubmitting ? (
                                        <Spinner size='12px' />
                                    ) : (
                                        <FaCheck />
                                    )}
                                    <span>保存する</span>
                                </button>
                            </div>
                        </form>
                    </Form>
                </TableCell>
            </TableRow>
        ) : (
            <TableRow>
                <TableCell>
                    <Avatar className="bg-white w-8 h-8">
                        <AvatarImage src={userId === currentUser.id ? currentUser.icon : partner?.icon} />
                        <AvatarFallback style={{ backgroundColor: userId === primaryUserId ? colors.primary_light : colors.secondary_light }}>
                            <HiUser color={userId === primaryUserId ? colors.primary : colors.secondary} size="20px" />
                        </AvatarFallback>
                    </Avatar>
                </TableCell>
                <TableCell>{formatDate(date)}</TableCell>
                <TableCell className="max-w-[100px] truncate">{item}</TableCell>
                <TableCell className="text-right">
                    ¥{amount.toLocaleString()}
                </TableCell>
                {userId === currentUser.id &&
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <IoEllipsisVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <button
                                        className="w-full flex items-center text-primary"
                                        onClick={() => setEditRowId(id)}
                                    >
                                        <FaEdit size={"16px"} />
                                        <span className="pt-[2px] flex-1 font-bold">編集</span>
                                    </button>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem >
                                    <button
                                        className="w-full flex items-center text-red-500"
                                        onClick={() => handleDelete()}
                                    >
                                        <RiDeleteBin6Line size={"18px"} />
                                        <span className="flex-1 font-bold">削除</span>
                                    </button>

                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                }
            </TableRow>
        )
    );

}

export default ExpensesRow 
