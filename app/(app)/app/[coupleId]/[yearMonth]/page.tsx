'use client'

import { useCoupleContext } from "../../_components/context/coupleContext/CoupleContext";
import { useExpensesContext } from "../../_components/context/expensesContext/ExpensesContext";
import { PieChartSection } from "../../_components/elements/pieChart";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { LuSettings2 } from "react-icons/lu";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useMemo, useState } from "react";
import ExpensesRow from "../../_components/elements/ExpensesRow /ExpensesRow ";
import { colors } from "@/lib/colors/colors";


export default function ExpensesPage() {
    const { currentUser, partner } = useCoupleContext();
    const { expenses } = useExpensesContext();
    const [selectedValue, setSelectedValue] = useState<string>('0');
    const [editRowId, setEditRowId] = useState<string | null>(null);
    const handleChange = (val: string): void => {
        setSelectedValue(val);
    }
    const filteredExpenses = useMemo(() => {
        if (selectedValue === "1") return expenses.filter(expense => expense.user_id === currentUser.id);
        if (selectedValue === "2" && partner) return expenses.filter(expense => expense.user_id === partner.id);
        return expenses;
    }, [selectedValue, expenses, currentUser.id, partner?.id]);
    return (
        <div className="grid grid-rows-[auto_1fr] w-[97%] mx-auto">
            <PieChartSection />
            {expenses.length > 0 &&
                <>
                    <div
                        className="rounded-2xl mt-3 p-3"
                        style={{
                            boxShadow: `4px 4px 6px rgba(163, 177, 198, 0.4), -4px -4px 6px rgba(255, 255, 255, 0.9)`,
                            border: `1px solid #D9F3F6`
                        }}
                    >
                        <div className="flex justify-between gap-4">
                            <LuSettings2 size={"28px"} color={colors.primary} />
                            <RadioGroup
                                defaultValue={selectedValue}
                                onValueChange={handleChange}
                                className="flex items-center justify-around w-full">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="0" id="option-all" />
                                    <Label htmlFor="option-all">all</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="1" id="option-currentUser" />
                                    <Label htmlFor="option-currentUser">{currentUser.name}</Label>
                                </div>
                                {partner &&
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="2" id="option-partner" />
                                        <Label htmlFor="option-partner">{partner.name}</Label>
                                    </div>
                                }
                            </RadioGroup>
                        </div>
                    </div>
                    <ScrollArea
                        className="rounded-2xl mt-3 p-3"
                        style={{
                            boxShadow: `4px 4px 6px rgba(163, 177, 198, 0.4), -4px -4px 6px rgba(255, 255, 255, 0.9)`,
                            border: `1px solid #D9F3F6`
                        }}
                    >
                        <Table>
                            {/* <TableHeader>
                                <TableRow>
                                    <TableHead colSpan={5}>

                                    </TableHead>
                                </TableRow>
                            </TableHeader> */}
                            <TableBody className="overflow-scroll">
                                {filteredExpenses.length > 0 ? (
                                    filteredExpenses.map(data => (
                                        <ExpensesRow
                                            key={data.id}
                                            id={data.id}
                                            userId={data.user_id}
                                            date={data.date}
                                            item={data.item}
                                            amount={data.amount}
                                            isEdit={editRowId === data.id}
                                            setEditRowId={setEditRowId}
                                        />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <p>no posts</p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>

                        </Table>
                    </ScrollArea>
                </>
            }
        </div>
    )
}