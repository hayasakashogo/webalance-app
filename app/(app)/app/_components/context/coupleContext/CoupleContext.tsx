"use client"

import React, { createContext, useState, useContext, useEffect } from "react";
import { Couple, User, CoupleContextData, CoupleProviderProps, RawUser, RawCouple } from "./types";
import { supabase } from "@/utils/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { getFormattedCoupleData, getFormattedUserData } from "./functions";

// Contextの初期値 (null許容)
const CoupleContext = createContext<CoupleContextData | undefined>(undefined);
// Providerコンポーネントの作成
export const CoupleProvider: React.FC<CoupleProviderProps> = ({
    children,
    initialCurrentUser,
    initialPartner,
    initialCouple,
    isPrimaryUser,
    primaryUserId
}) => {
    const [currentUser, setCurrentUser] = useState<User>(initialCurrentUser);
    const [partner, setPartner] = useState<User | null>(initialPartner);
    const [couple, setCouple] = useState<Couple>(initialCouple);

    useEffect(() => {
        const subscribeToCouple = async () => {
            const usersChannel = supabase
                .channel("users-channel")
                .on(
                    "postgres_changes",
                    { event: "*", schema: "public", table: "users" },
                    async (payload: RealtimePostgresChangesPayload<RawUser>) => {
                        if (payload.eventType === "INSERT") {
                            const userData = await getFormattedUserData(payload.new);
                            if (payload.new.id === currentUser.id) {
                                setCurrentUser(userData);
                            } else if (payload.new.id === partner?.id) {
                                setPartner(userData);
                            }
                        } else if (payload.eventType === "UPDATE") {
                            const userData = await getFormattedUserData(payload.new);
                            if (payload.new.id === currentUser.id) {
                                setCurrentUser(userData);
                            } else if (payload.new.id === partner?.id) {
                                setPartner(userData);
                            }
                        } else if (payload.eventType === "DELETE") {
                            if (payload.old.id === partner?.id) {
                                setPartner(null);
                            }
                        }
                    }
                )
                .subscribe();

            const couplesChannel = supabase
                .channel("couples-channel")
                .on(
                    "postgres_changes",
                    { event: "*", schema: "public", table: "couples" },
                    async (payload: RealtimePostgresChangesPayload<RawCouple>) => {
                        if (payload.eventType === "UPDATE") {
                            if (payload.new.id === couple.id) {
                                const formattedCoupleData = await getFormattedCoupleData(payload.new);
                                setCouple(formattedCoupleData);
                            }
                        } 
                    }
                )
                .subscribe();

            return { usersChannel, couplesChannel };
        };

        let channels: { usersChannel: ReturnType<typeof supabase.channel>; couplesChannel: ReturnType<typeof supabase.channel> } | null = null;

        subscribeToCouple().then((ch) => {
            channels = ch;
        });

        return () => {
            if (channels) {
                supabase.removeChannel(channels.usersChannel);
                supabase.removeChannel(channels.couplesChannel);
            }
        };
    }, []);

    return (
        <CoupleContext.Provider
            value={{
                currentUser,
                partner,
                couple,
                isPrimaryUser,
                primaryUserId,
                setCurrentUser,
                setPartner,
                setCouple,
            }}
        >
            {children}
        </CoupleContext.Provider>
    );
};

// カスタムフック
export const useCoupleContext = (): CoupleContextData => {
    const context = useContext(CoupleContext);
    if (!context) {
        throw new Error("useCoupleContext must be used within a UserProvider");
    }
    return context;
};
