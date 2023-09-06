import React, { useState } from 'react'
import { walletContext } from '../../hooks/walletContext'
import { useNavigate } from 'react-router-dom'
import { ImSpinner9 } from 'react-icons/im'
import { FaArrowLeft, FaBitcoin, FaCheckCircle, FaFolder } from 'react-icons/fa'
import { MAX_RECEIVE, PRIMARY_HEXODE, TO_BTC, TRANSITION } from '../../constants'
import useFetchAllFees from '../../hooks/useFetchAllFees'
import useFiatPrice from '../../hooks/useFiatPrice'
import NavItem from '../Navigation/NavItem'
import { BiFile, BiQrScan } from 'react-icons/bi'
import { clipboard, invoke } from '@tauri-apps/api'
import { BsFillClipboard2CheckFill, BsFillUsbPlugFill } from 'react-icons/bs'

interface Props {
    index: number,
}

const SendTx = ({ index }: Props) => {
    const [address, setAddress] = useState<string>("")
    const [amount, setAmount] = useState<number | undefined>()
    const [block, setBlock] = useState<number>(5)
    const [clean, setClean] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [errorMsg, setErrorMsg] = useState<string>("")

    const { feesLoading, feesError, fees } = useFetchAllFees()
    const { priceLoading, priceError, priceNum } = useFiatPrice()
    const navigate = useNavigate()
    const wallets = walletContext()
    const wallet = wallets[index]
    const bal = wallet.balance
    
    const pasteFromClip = async () => {
        try {
            let contents = await clipboard.readText()
            if (contents) {
                setAddress(contents)
            }
        } catch {}
    }

    const sendForPsbtDownload = async () => {
        setLoading(true)
        setError(false)
        try {
            if (!address || !amount) {
                setErrorMsg("No address or amount set.")
                setError(true)
                return;
            }
            if (amount > bal) {
                setErrorMsg("Not enough coins")
                setError(true)
                return;
            }
            await invoke('make_download', { fp: wallet.xfp, 
                                    receiveAddr: address, 
                                    target: amount, 
                                    cleanWallet: clean, 
                                    blockTarget: block})
            setSuccess(true)
        } catch (err) {
            setErrorMsg(err as string)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    const blockToTime = (block: number) => {
        let minutes = (block + 1) * 10
        if (minutes < 60) {
            return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            
            let formattedTime = `${hours} hour${hours !== 1 ? 's' : ''}`;
    
            if (remainingMinutes > 0) {
                formattedTime += ` and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
            }
            
            return formattedTime;
        }
    }

    const renderFeeBar = (): React.ReactNode => {
        if (!feesLoading && !feesError && fees) {
            return (<NavItem delay={200} style='justify-center items-center space-y-2'>
                        <input className='w-full h-2 bg-zinc-300 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700'
                            type="range"
                            min={0}
                            max={fees.length - 1}
                            value={block}
                            onChange={(event) => { 
                                const b = parseInt(event.target.value);
                                setBlock(b);
                            }}
                        />
                        <div className='flex flex-col sm:flex-row justify-between items-center bg-zinc-100 dark:bg-zinc-900 px-5 py-5 rounded-md'>
                            <NavItem delay={30} style=''>
                                <h1 className='text-xs font-link'>Around {blockToTime(block)}</h1>
                            </NavItem>
                            <NavItem delay={30} style=''>
                                <h1 className='text-xs font-link'>Estimated Fee: {(fees[block]).toLocaleString()} Satoshis/KiloByte</h1>
                            </NavItem>
                            <label className="flex flex-row justify-center items-center">
                                <input type="checkbox" onChange={() => setClean(!clean)} checked={clean} />
                                <span className="pl-2 text-xs font-link">Clean Up Wallet</span>
                            </label>
                        </div>
                    </NavItem>)
        }
        if (feesLoading) {
            return (
                <div className='flex flex-row justify-center items-center pt-5 pb-12'>
                    <ImSpinner9 className={" text-zinc-300 animate-spin"} size={10}/>
                    <h1 className='text-xs pl-1 text-zinc-300 font-mono font-link'>FETCHING FEES</h1>
                </div>
            )
        }
    }

    return (
        <div className='flex flex-col w-full h-full p-5'>
            <div className='flex flex-row justify-between items-center'>
                <div className=''><button onClick={() => navigate("/wallet")}><FaArrowLeft color={PRIMARY_HEXODE} className="justify-start"/></button></div>
                <div className='flex flex-row justify-start items-center'>
                    <div className='flex flex-col justify-start items-end'>
                        <h1 className='font-extrabold font-link'>{wallets[index].name}</h1>
                        <h1 className='font-extralight text-xs dark:text-zinc-300 text-zinc-700'>{wallets[index].xfp}</h1>
                    </div>
                </div>
            </div>
            <div className={`flex flex-col justify-center items-center space-y-5 pt-10 md:pl-10 md:pr-10 lg:pl-20 lg:pr-20 pl-5 pr-5 ${TRANSITION}`}>
                <div className='flex flex-col justify-start w-full'>
                    <div className='flex flex-row justify-start items-center font-semibold space-x-2 pb-2'>
                        <h1 className='font-link'>Address</h1>
                        <div className='flex flex-row justify-center items-center'>
                            <button className='flex flex-row justify-center items-center px-1 py-1 hover:animate-pulse text-xs font-normal border border-blue-500 rounded-sm space-x-1'
                                onClick={() => pasteFromClip().then().catch()}
                            >
                                <BsFillClipboard2CheckFill color={PRIMARY_HEXODE} size={10}/>
                                <h1 className='text-blue-500 font-link text-xs'>Paste</h1>
                            </button>
                        </div>
                    </div>
                    <input type='text' autoCorrect='off' placeholder='Receiving Bitcoin Address' className='dark:bg-zinc-900 bg-zinc-100 dark:text-white focus:outline-blue-700 focus:outline-none rounded-md px-2 py-2 w-full font-mono text-sm' value={address} onChange={(event) => {
                        setAddress(event.target.value)
                        } }></input>
                </div>
                <div className='flex flex-col space-y-2 w-full'>
                    <div className='flex flex-row justify-between items-center w-full'>
                        <div className='flex flex-row justify-center items-center'>
                            <FaBitcoin color={PRIMARY_HEXODE} size={15}/>
                            <h1 className='font-semibold font-link pl-1'>Satoshis</h1>
                        </div>
                        {!priceLoading && !priceError && priceNum && amount && amount > 0 ? 
                        <NavItem delay={100} style=''>
                            <h1 className='dark:text-zinc-300 text-zinc-700 text-sm font-link'>Approximately ${(priceNum * TO_BTC * amount).toLocaleString() }</h1>
                        </NavItem> : <></>} 
                    </div>
                    <input type='number' min={0} max={MAX_RECEIVE} placeholder='How much are you sending?' className='dark:bg-zinc-900 bg-zinc-100 dark:text-white focus:outline-blue-700 focus:outline-none rounded-md px-2 py-2 w-full' value={amount?.toString()} onChange={(event) => setAmount(event.target.valueAsNumber)}></input>
                    <h1 className='justify-end items-end pl-1 text-zinc-500 text-xs font-link'>{bal.toLocaleString()} Satoshis Available</h1>
                </div>
                <div className='flex flex-col justify-start w-full space-y-1'>
                    <div className='flex flex-row justify-between items-center'>
                        <h1 className='font-semibold font-link'>Select Fee</h1>
                        <a href='https://github.com/xorizon' target='_blank' className='text-xs text-blue-500'>Need help?</a>
                    </div>
                    {renderFeeBar()}
                </div>
                <div className={`flex flex-row justify-end items-end w-full ${feesLoading && "pt-20"} space-x-2 ${TRANSITION}`}>
                    <button className={`bg-blue-500 py-4 w-full rounded-md hover:animate-pulse flex flex-row justify-center items-center ${loading && "disabled disabled:bg-zinc-500"}`} onClick={() => sendForPsbtDownload().then().catch()}>
                        <BiFile color='white' size={20}/>
                        <h1 className='font-link text-sm font-bold pl-1 text-white'>Download File</h1>
                    </button>
                    <button className='bg-blue-500 py-4 w-full rounded-md hover:animate-pulse flex flex-row justify-center items-center'>
                        <BiQrScan color='white' size={20}/>
                        <h1 className='font-link text-sm font-bold pl-1 text-white'>Scan QR</h1>
                    </button>
                    <button className='bg-blue-500 py-4 w-full rounded-md hover:animate-pulse flex flex-row justify-center items-center'>
                        <BsFillUsbPlugFill color='white' size={17}/>
                        <h1 className='font-link text-sm font-bold pl-1 text-white'>Connected Device</h1>
                    </button>
                </div>
                {loading && <div className='flex flex-row justify-center items-center w-full pt-10'>
                        <NavItem delay={100} style='flex flex-row justify-center items-center space-x-2 border border-zinc-300 dark:border-zinc-700 px-5 py-5 rounded-md'>
                            <ImSpinner9 className={" text-zinc-300 animate-spin"} size={14}/>
                            <h1 className='font-semibold text-sm'>Your transaction is being built. This may take a few minutes.</h1>
                        </NavItem>
                    </div>}
                {success && <div className='flex flex-col justify-center items-center w-full border border-zinc-300 dark:border-zinc-700 px-5 py-5 rounded-md' >
                        <NavItem delay={100} style='flex flex-row justify-center items-center space-x-2 '>
                            <FaCheckCircle color={"green"} size={14}/>
                            <h1 className='font-link font-semibold text-sm'>Your transaction has been saved. You may upload it to your device to sign.</h1>
                        </NavItem>
                        <NavItem delay={150} style='pt-2 flex flex-row justify-center items-center space-x-1'>
                            <FaFolder size={15}/>
                            <h1 className='text-xs font-link'>/Downloads/unsigned.psbt</h1>
                        </NavItem>
                    </div>}
                {error && <div className='flex flex-row justify-center items-center w-full pt-10'>
                    <NavItem delay={100} style='flex flex-col justify-center items-center space-y-2 border border-zinc-300 dark:border-zinc-700 px-5 py-5 rounded-md'>
                        <h1 className='font-bold font-link text-sm'>An error occured building your transaction:</h1>
                        <h1 className='font-semibold text-red-500 font-link text-xs'>{errorMsg}</h1>
                    </NavItem>
                </div>}
            </div>
        </div>
    )
}

export default SendTx