'use client'

import { useAppTransition } from '../../_components/context/transitionProvider/TransitionProvider'
import Skeleton from './skeleton'

export default function AnimationWrapper({ children, }: { children: React.ReactNode }) {
    const { isPending } = useAppTransition()

    return (
        isPending ? (
            <><Skeleton /></>
        ) : (
            <>{children}</>
        )
    )

}
