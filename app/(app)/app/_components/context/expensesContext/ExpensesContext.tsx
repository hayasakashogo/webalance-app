"use client"

import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { Expense, ExpensesContextData, ExpensesProviderProps, MonthlyTotal } from "./types";
import { supabase } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { getMonthlyTotal } from "../../../[coupleId]/[yearMonth]/functions";
import { useCoupleContext } from "../coupleContext/CoupleContext";

// Contextの初期値 (null許容)
const ExpensesContext = createContext<ExpensesContextData | undefined>(undefined);
// Providerコンポーネントの作成

export const ExpensesProvider: React.FC<ExpensesProviderProps> = ({
    children, initialExpenses }) => {
    const { primaryUserId } = useCoupleContext();
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
    const [monthlyTotal, setMonthlyTotal] = useState<MonthlyTotal>(
        getMonthlyTotal(initialExpenses, primaryUserId)
    );
    const { coupleId, yearMonth } = useParams();

    const expensesRef = useRef<Expense[]>(expenses);

    useEffect(() => {
        expensesRef.current = expenses;
    }, [expenses]);

    useEffect(() => {
        setMonthlyTotal(getMonthlyTotal(expenses, primaryUserId));
    }, [expenses, primaryUserId]);

    useEffect(() => {
        const expensesChannel = supabase
            .channel("expenses-channel")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "expenses" },
                (payload: RealtimePostgresChangesPayload<Expense>) => {
                    // 必要な処理を追加
                    if (payload.eventType === 'INSERT') {
                        if (payload.new.couple_id === coupleId && payload.new.year_month === yearMonth) {
                            const updatedExpenses = [payload.new, ...expensesRef.current];
                            setExpenses(updatedExpenses);
                            setMonthlyTotal(getMonthlyTotal(updatedExpenses, primaryUserId));
                        }
                    } else if (payload.eventType === 'UPDATE') {
                        if (payload.new.couple_id === coupleId && payload.new.year_month === yearMonth) {
                            const updatedExpenses = expensesRef.current.map(expense => expense.id === payload.new.id ? payload.new : expense);
                            setExpenses(updatedExpenses);
                            setMonthlyTotal(getMonthlyTotal(updatedExpenses, primaryUserId));
                        }
                    } else if (payload.eventType === 'DELETE') {
                        const updatedExpenses = expensesRef.current.filter(expense => expense.id !== payload.old.id);
                        setExpenses(updatedExpenses);
                        setMonthlyTotal(getMonthlyTotal(updatedExpenses, primaryUserId));
                    }
                }
            )
            .subscribe();

        // コンポーネントのクリーンアップ時に購読解除
        return () => {
            supabase.removeChannel(expensesChannel);
        };

    }, []);

    return (
        <ExpensesContext.Provider
            value={{
                monthlyTotal,
                expenses,
                setMonthlyTotal,
                setExpenses
            }}
        >
            {children}
        </ExpensesContext.Provider>
    );
};

// カスタムフック
export const useExpensesContext = (): ExpensesContextData => {
    const context = useContext(ExpensesContext);
    if (!context) {
        throw new Error("useExpensesContext must be used within a UserProvider");
    }
    return context;
};
