'use client'

// import React, { useEffect, useState } from 'react'
// import { motion } from 'framer-motion'
import { useAppTransition } from '../../_components/context/transitionProvider/TransitionProvider'
// import { useDirection } from '../../_components/context/directionContext/DirectionContext'
import Skeleton from './skeleton'

export default function AnimationWrapper({ children, }: { children: React.ReactNode }) {
    const { isPending } = useAppTransition()
    // const { direction } = useDirection()

    // const [prevChildren, setPrevChildren] = useState<React.ReactNode | null>(null)

    // isPendingがtrueになったタイミングで現在の children を保持する
    // useEffect(() => {
    //     if (isPending) {
    //         setPrevChildren(children)
    //     }
    // }, [isPending, children])

    return (
        isPending ? (
            // <div className="w-full overflow-hidden">
            //     <motion.div
            //         style={{ display: 'flex', width: '200%' }}
            //         initial={{ x: '0%' }}
            //         animate={{ x: '-100%' }}
            //         transition={{ duration: 0.4, ease: 'easeInOut' }}
            //     >
            //         {/* <div className='min-w-full'>{prevChildren}</div>
            //         <div className='min-w-full'><Skeleton /></div> */}
            //         {prevChildren}
            //     </motion.div>
            // </div>
            <><Skeleton /></>
        ) : (
            <>{children}</>
        )
    )

}
