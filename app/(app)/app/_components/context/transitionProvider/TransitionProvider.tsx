'use client'

import {
    createContext,
    useContext,
    useTransition,
    type ReactNode,
    type TransitionStartFunction,
} from 'react'

/**
 * Contextで共有する値の型
 */
export type AppTransitionContextValue = {
    isPending: boolean
    startTransition: TransitionStartFunction
}

/**
 * Context本体
 */
const TransitionContext =
    createContext<AppTransitionContextValue | null>(null)

/**
 * Provider
 */
export function TransitionProvider({
    children,
}: {
    children: ReactNode
}) {
    const [isPending, startTransition] = useTransition()

    return (
        <TransitionContext.Provider value={{ isPending, startTransition }}>
            {children}
        </TransitionContext.Provider>
    )
}

/**
 * カスタムフック
 */
export const useAppTransition = (): AppTransitionContextValue => {
    const ctx = useContext(TransitionContext)
    if (!ctx) {
        throw new Error('useAppTransition must be used within TransitionProvider')
    }
    return ctx
}
