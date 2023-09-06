import bip21 from 'bip21'
import { useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import { TO_BTC } from '../../constants'


type Props = {
    address: string,
    amount?: number,
    label?: string,
}

const UpdatingQR = ({ address, amount, label }: Props) => {
    const [uri, setUri] = useState<string>(bip21.encode(address))
    const convert = (val: number) => {
        return (val * TO_BTC).toFixed(21)
    }
    useEffect(() => {
        if (amount && label) {
            setUri(bip21.encode(address, { amount: convert(amount), label: label }))
        } else if (amount && !label) {
            setUri(bip21.encode(address, { amount: convert(amount) }))
        } else if (!amount && label) {
            setUri(bip21.encode(address, { label: label }))
        } else {
            setUri(bip21.encode(address))
        }
    }, [address, amount, label])

    return (
        <div className='dark:bg-zinc-900 bg-zinc-100 rounded-md px-5 py-5'>
            <QRCode value={uri} size={150}/>
        </div>
    )
}

export default UpdatingQR