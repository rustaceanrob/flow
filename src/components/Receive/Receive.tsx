import { useState } from 'react'
import UpdatingQR from './UpdatingQR'
import { AiFillCopy, AiOutlineCheckCircle } from 'react-icons/ai'
import { PRIMARY_HEXODE, TRANSITION, MAX_RECEIVE, TO_BTC } from '../../constants'
import { FaArrowLeft, FaBitcoin } from 'react-icons/fa'
import { ImSpinner9 } from 'react-icons/im'
import { writeText } from '@tauri-apps/api/clipboard'
import useFreshAddress from '../../hooks/useFreshAddress'
import { useNavigate } from 'react-router-dom'
import { walletContext } from '../../hooks/walletContext'
import useFiatPrice from '../../hooks/useFiatPrice'
import NavItem from '../Navigation/NavItem'

interface Props {
    index: number
}

const Receive = ({ index }: Props) => {
    const [label, setLabel] = useState<string>()
    const [amount, setAmount] = useState<number>()
    const [copied, setCopied] = useState<boolean>(false)
    const navigate = useNavigate()
    const wallets = walletContext()
    const { priceLoading, priceError, priceNum } = useFiatPrice()
    const { addressLoading, addressError, address } = useFreshAddress(wallets[index].xfp)

    const handleChangeLabel = (text: string) => {
        setLabel(text)
    }

    const handleChangeAmount = (val: number) => {
        if (val > MAX_RECEIVE ) {
            setAmount(MAX_RECEIVE)        
        } else if (val > 0) {
            setAmount(val)
        } else {
            setAmount(0)
        }
    }

    const handleCopy = async () => {
        try {
            if (address) {
                await writeText(address)
                setCopied(true)
                setTimeout(() => {
                    setCopied(false)
                }, 1000)
            }
        } catch {}
    }

    const renderElement = (): React.ReactNode => {
        if ( addressLoading && !addressError ) {
            return (<div className='flex flex-row justify-center items-center pt-10 w-full'>
                        <ImSpinner9 className={" text-zinc-300 animate-spin"} size={10}/>
                        <h1 className='text-xs pl-1  text-zinc-300 font-mono font-extrabold'>LOADING NEXT UNUSED ADDRESS</h1>
                    </div>)
        } else if ( addressError ) {
            return (<h1 className='text-xs pl-1 dark:text-zinc-700 text-zinc-300 font-mono font-extrabold'>AN ERROR OCCURED FETCHING YOUR ADDRESS</h1>)
        } else {
            return (<></>)
                
        }
    }

    return (
        <div className={`flex flex-col justify-start items-start w-full h-full p-5`}>
            <div className='flex flex-row justify-between items-center w-full'>
                <div className=''><button onClick={() => navigate("/wallet")}><FaArrowLeft color={PRIMARY_HEXODE} className="justify-start"/></button></div>
                <div className='flex flex-row justify-start items-center'>
                    <div className='flex flex-col justify-start items-end'>
                        <h1 className='font-extrabold font-link'>{wallets[index].name}</h1>
                        <h1 className='font-extralight text-xs dark:text-zinc-300 text-zinc-700'>{wallets[index].xfp}</h1>
                    </div>
                </div>
            </div>
            {renderElement()}
            <div className={`flex flex-col justify-start items-center w-full h-full space-y-5 overflow-scroll ${!addressLoading ? "opacity-1": "opacity-0"} ${TRANSITION}`}>
                <div className='flex flex-row justify-center items-center space-x-1'>
                    <AiOutlineCheckCircle color={PRIMARY_HEXODE} size={17}/>
                    <h1 className='font-extrabold font-link'>Ready to Scan</h1>
                </div>
                <UpdatingQR address={address ? address : ""} label={label} amount={amount}/>
                <div className='flex flex-col justify-center items-center space-y-5'>
                    <div className={`${copied ? "opacity-1": "opacity-0"} ${TRANSITION} flex flex-row justify-center items-center`}><AiOutlineCheckCircle color={"green"} size={17}/><h1 className='font-link font-semibold pl-1'>Copied to clipboard</h1></div>
                    <div className='flex flex-row rounded-md justify-center items-center dark:bg-zinc-900 bg-zinc-100 px-3 py-3'>
                        <button onClick={() => handleCopy()}>
                            <div className={`${copied ? "opacity-0": "opacity-1 "} ${TRANSITION}`}><AiFillCopy color={PRIMARY_HEXODE} className='hover:animate-pulse'/></div>
                        </button>
                        <h1 className='pl-2 font-semibold font-mono text-sm'>{address}</h1>
                    </div>
                    <div className='flex flex-col justify-start items-start space-y-2 w-full pt-5'>
                        <h1 className='font-semibold font-link'>Label</h1>
                        <input type='text' placeholder='Optional Description' autoCorrect='off' className='dark:bg-zinc-900 bg-zinc-100 dark:text-white focus:outline-blue-700 focus:outline-none rounded-md px-2 py-2 w-full' onChange={(event) => handleChangeLabel(event.target.value)}></input>
                    </div>
                    <div className='flex flex-col justify-start items-start space-y-2 w-full pt-5'>
                        <div className='flex flex-row justify-center items-center'>
                            <FaBitcoin color={PRIMARY_HEXODE} size={15}/>
                            <h1 className='font-semibold pl-1 font-link'>Satoshis</h1>
                        </div>
                        <input type='number' min={0} max={MAX_RECEIVE} placeholder='How much should you receive?' className='dark:bg-zinc-900 bg-zinc-100 dark:text-white focus:outline-blue-700 focus:outline-none rounded-md px-2 py-2 w-full' value={amount?.toString()} onChange={(event) => handleChangeAmount(event.target.valueAsNumber)}></input>
                    </div>
                    {!priceLoading && !priceError && priceNum && amount && amount > 0 ?
                    <NavItem delay={100} style=''>
                        <h1 className='dark:text-zinc-300 text-zinc-700 text-sm font-semibold font-link'>Approximately ${(priceNum * TO_BTC * amount).toLocaleString() }</h1>
                    </NavItem>: <></>}   
                </div> 
            </div>
        </div>
    )
}

export default Receive