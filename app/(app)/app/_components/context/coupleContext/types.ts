import { ReactNode } from "react";

// データ構造の型定義
export interface User {
    id: string | undefined;
    name: string | undefined;
    icon: string | undefined;
}

export interface Couple {
    id:string;
    coupleId: string;
    headerImg: string | undefined;
}

export interface CoupleContextData {
    currentUser: User;
    partner: User | null;
    couple: Couple;
    isPrimaryUser: boolean;
    primaryUserId:string;
    setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
    setPartner: React.Dispatch<React.SetStateAction<User | null>>;
    setCouple: React.Dispatch<React.SetStateAction<Couple>>;
}

// Providerのprops型定義
export interface CoupleProviderProps {
    children: ReactNode;
    initialCurrentUser: User;
    initialPartner: User | null;
    initialCouple: Couple;
    isPrimaryUser: boolean;
    primaryUserId:string;
}

export interface RawUser {
    id: string;           // UUID形式のID
    name: string;         // ユーザー名
    email: string;        // メールアドレス
    icon_url: string;     // アイコンのURL（相対パス）
    created_at: string;   // ISO8601形式の作成日時
    updated_at: string;   // ISO8601形式の更新日時
};
export interface RawCouple {
    id: string;           // UUID形式のID
    custom_couple_id: string;         // ユーザー名
    primary_user_id: string;        // メールアドレス
    partner_user_id: string;     // アイコンのURL（相対パス）
    image_url: string;     // アイコンのURL（相対パス）
    created_at: string;   // ISO8601形式の作成日時
    updated_at: string;   // ISO8601形式の更新日時
};
