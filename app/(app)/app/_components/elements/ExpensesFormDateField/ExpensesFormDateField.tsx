import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { FormLabel } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { UseFormReturn } from 'react-hook-form';
import { endOfMonth, format, parseISO, startOfMonth } from "date-fns"
import { ja } from "date-fns/locale"
import { Calendar } from '@/components/ui/calendar';
import { useParams } from 'next/navigation';

const ExpensesFormDateField = ({ form }: {
    form: UseFormReturn<{
        date: Date;
        item: string;
        amount: string;
        tax: "inclusive" | "8" | "10";
    }, any, undefined>;
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const calendarRef = useRef<HTMLDivElement>(null);
    const { yearMonth } = useParams();
    const startDate = startOfMonth(parseISO(`${yearMonth}-01`))
    const endDate = endOfMonth(parseISO(`${yearMonth}-01`))
    const initialMonth = parseISO(`${yearMonth}-01`)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    return (
        <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                    <FormLabel className="flex items-center gap-1 font-bold text-gray-500">
                        <CalendarIcon className="h-4 w-4" />
                        支払日
                    </FormLabel>
                    <div className="relative" ref={calendarRef}>
                        <div
                            className="cursor-pointer bg-white pl-3 text-left font-normal text-text w-full flex items-center justify-between border border-input rounded-md px-3 py-2"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {field.value ? (
                                format(new Date(field.value), "PPP", { locale: ja })
                            ) : (
                                <span className="text-muted-foreground">日付を選択</span>
                            )}
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                        </div>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    className="absolute bottom-12 left-0 z-50 rounded-md overflow-hidden shadow-lg"
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    <Calendar
                                        className="bg-white"
                                        mode="single"
                                        selected={field.value}
                                        onSelect={(date) => {
                                            if (date) {
                                                setIsOpen(false);
                                                field.onChange(date);
                                            }
                                        }}
                                        disabled={(date) => date < startDate || date > endDate}
                                        initialFocus
                                        month={initialMonth}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

export default ExpensesFormDateField
