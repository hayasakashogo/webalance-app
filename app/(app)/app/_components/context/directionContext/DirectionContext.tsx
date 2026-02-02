'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Direction = 'left' | 'right' | 'none'

interface DirectionContextValue {
    direction: Direction
    setDirection: (dir: Direction) => void
}

const DirectionContext = createContext<DirectionContextValue | null>(null)

export function DirectionProvider({ children }: { children: ReactNode }) {
    const [direction, setDirection] = useState<Direction>('none')

    return (
        <DirectionContext.Provider value={{ direction, setDirection }}>
            {children}
        </DirectionContext.Provider>
    )
}

export const useDirection = () => {
    const ctx = useContext(DirectionContext)
    if (!ctx) throw new Error('useDirection must be used within DirectionProvider')
    return ctx
}
