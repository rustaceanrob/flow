import { useState, useEffect } from 'react'
import { TRANSITION } from '../../constants'
import { MdCallMade, MdCallReceived } from 'react-icons/md'
import Tx from '../../interfaces/Tx'

type Props = {
    delay: number,
    hasBorder: boolean,
    tx: Tx,
}

const TranscationItem = ({ delay, hasBorder, tx }: Props) => {
    const [shouldShow, setShouldShow] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => setShouldShow(true), Math.min(delay, 500))
    }, [])

    return (
        <div className={`${shouldShow ? "opacity-1": "opacity-0"} ${TRANSITION} justify-between items-start flex flex-row w-full border-zinc-300 dark:border-zinc-700 ${hasBorder && "border-b"} px-5 py-5`}>
            <div className='flex flex-col justify-center items-start space-y-2'>
                <div className='border border-zinc-300 dark:border-zinc-700 px-2 py-2 rounded-lg'>
                    {tx.was_sent ? <MdCallMade size={17}/>: <MdCallReceived size={17}/>}
                </div>
                <div className='flex flex-row justify-center items-center'>
                    <h1 className='text-zinc-700 dark:text-zinc-300 text-xs font-link font-semibold'>{tx.confirmed ? "Confirmed" : "Unconfirmed"}</h1>
                </div>
            </div>
            <div className='flex flex-col justify-end items-end space-y-1'>
                <h1 className={`${!tx.was_sent && "text-green-700"} font-semibold font-link`}>{tx.was_sent ? "Sent": "Received"}</h1>
                <h1 className='font-link text-zinc-700 dark:text-zinc-300'>{tx.value.toLocaleString()} Satoshis</h1>
            </div>
        </div>
    )
}

export default TranscationItem