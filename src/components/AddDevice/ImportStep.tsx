import { useState, useEffect } from 'react'
import { TRANSITION } from '../../constants'

type Props = {
    message: string
    delay: number,
    border: boolean,
}

export default function ImportStep({ message, delay, border }: Props) {
    const [shouldShow, setShouldShow] = useState<boolean>(false)
    useEffect(() => {
        setTimeout(() => {
            setShouldShow(true)
        }, delay)
    }, [])

    return (
        <div className={`flex flex-row items-center w-full border-zinc-300 dark:border-zinc-700 px-5 py-5 ${shouldShow ? "opacity-1": "opacity-0"} ${border ? "border-b border-dashed" : ""} ${TRANSITION}`}>
            <h1 className='font-semibold text-xs sm:text-sm pt-2 pb-2 justify-start items-start'>{message}</h1>
        </div>
    )
}