import { ReactNode } from "react";

// データ構造の型定義
export interface Expense {
    id: string;
    date: Date;
    amount: number;
    item: string;
    user_id: string;
    year_month:string;
    couple_id:string;
}

export interface MonthlyTotal {
    total_amount: number;
    primary_user_total: number;
    partner_user_total: number;
}

export interface ExpensesContextData {
    expenses: Expense[];
    monthlyTotal: MonthlyTotal;
    setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
    setMonthlyTotal: React.Dispatch<React.SetStateAction<MonthlyTotal>>;
}

// Providerのprops型定義
export interface ExpensesProviderProps {
    children: ReactNode;
    initialMonthlyTotal: MonthlyTotal;
    initialExpenses: Expense[];
    primaryUserId:string;
}

export interface Payload<T>  {
    eventType: "INSERT" | "UPDATE" | "DELETE"; // イベントの種類
    schema: string; // スキーマ名
    table: string; // テーブル名
    new?: T; // 現在のレコード (INSERT または UPDATE)
    old?: T; // 以前のレコード (DELETE または UPDATE)
};