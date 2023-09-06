import { useEffect, useState } from 'react'
import MempoolTransaction from '../../interfaces/MempoolTransaction'
import { FLOOR_MAGIC, TO_BTC, TRANSITION } from '../../constants'
import { FaBitcoin } from 'react-icons/fa'

type Props = {
    tx: MempoolTransaction
    hasBorder: boolean
    delay: number
}

export default function MempoolTx({tx, hasBorder, delay}: Props) {
    const [shouldShow, setShouldShow] = useState<boolean>(false)
    useEffect(() => {
        setTimeout(() => {
            setShouldShow(true)
        }, delay)
    }, [])

    return (
        <div className={`flex flex-col pt-5 pb-5 px-5 py-5 ${hasBorder ? "border-b": ""} border-zinc-300 dark:border-zinc-700 ${shouldShow ? "opacity-1": "opacity-0"} ${TRANSITION}`}>
            <div className='flex flex-row justify-start items-center pb-2 space-x-1'>
                {/* <h1 className='font-semibold text-sm'>Transaction</h1> */}
                <h1 className='text-sm font-mono'>{tx.txid.substring(0,10) + "..." +tx.txid.substring(tx.txid.length - 10)}</h1>
            </div>
            <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-row justify-center items-center'>
                    <FaBitcoin color='#f97316'/>
                    <h1 className='font-semibold text-sm pl-1 font-link'>{Math.floor(parseInt(tx.value) * FLOOR_MAGIC * TO_BTC) / FLOOR_MAGIC}</h1>
                </div>
                <div className='flex flex-row justify-center items-center space-x-1'>
                    <h1 className='text-sm font-link'>{parseFloat(tx.fee).toLocaleString()}</h1>
                    <h1 className='text-sm font-link'>Satoshi Fee</h1>
                </div>  
                <div className='flex flex-row justify-center items-center space-x-1'>
                    <h1 className='text-sm font-link'>{tx.size}</h1>
                    <h1 className='text-sm font-link'>vBytes</h1>
                </div>      
            </div>
        </div>
    )
}