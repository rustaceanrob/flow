import { COMPLIMENT_HEXCODE, PRIMARY_HEXODE, TO_BTC, TRANSITION } from '../../constants'
import { FaBitcoin } from 'react-icons/fa'
import { ImSpinner9 } from 'react-icons/im'
import { TbArrowsExchange } from 'react-icons/tb'
import useTotalBalance from '../../hooks/useTotalBalance'
import useTxHistory from '../../hooks/useTxHistory'
import TranscationItem from './TranscationItem'
import { useNavigate } from 'react-router-dom'
import { walletContext } from '../../hooks/walletContext'
import { BsInfoCircle } from 'react-icons/bs'
import { useState } from 'react'
import { useEffect } from "react"
import { invoke } from "@tauri-apps/api"
import NavItem from '../Navigation/NavItem'

interface Props {
    index: number, 
}

const Wallet = ({ index }: Props) => {
    const navigate = useNavigate()
    const wallets = walletContext()
    const [shouldRefresh, setShouldRefresh] = useState<boolean>(false)
    const [sqlLoading, setSqlLoading] = useState<boolean>(false)
    const bal = wallets[index].balance
    const { balanceLoading, balanceError, balance } = useTotalBalance(wallets[index].xfp)
    const { historyLoading, historyError, history } = useTxHistory(wallets[index].xfp, shouldRefresh)

    useEffect(() => {
        (async() => {
            setSqlLoading(true)
            try {
                let bool = await invoke('background_tx_refresh', { fp: wallets[index].xfp })
                if (bool as boolean) {
                    setShouldRefresh(true)
                }
            } catch {} finally { 
                setSqlLoading(false) 
            }
        })()
    }, [])

    return (
        <div className={`flex flex-col w-full h-full ${TRANSITION} pl-5 pr-5 pt-5 overflow-none pb-10`}>
            <div className='flex flex-row justify-between items-center'>
                <div className='flex flex-row justify-start items-center'>
                    <div className='flex flex-col justify-start items-start'>
                        <div className='flex flex-row justify-center items-center'>
                            <h1 className='font-link font-extrabold'>{wallets[index].name}</h1>
                            <button className='pl-2' onClick={() => navigate("/walletsettings")}>
                                <BsInfoCircle className="hover:animate-pulse hover:cursor-pointer duration-200" color={COMPLIMENT_HEXCODE} size={15}/>
                            </button>
                        </div>
                        <h1 className='font-extralight text-xs dark:text-zinc-300 text-zinc-700'>{wallets[index].xfp}</h1>
                    </div>
                </div>
                {balanceLoading && <div className='flex flex-row justify-center items-center'>
                        <ImSpinner9 className={" text-zinc-300 animate-spin"} size={10}/>
                        <h1 className='text-xs pl-1  text-zinc-300 font-link font-extrabold'>REFRESHING BALANCE</h1>
                </div>}
            </div>
            {
                !balanceLoading ? (
                    <NavItem delay={100} style={`flex flex-col ${TRANSITION}`}>
                        <div className={`flex flex-col justify-center items-center space-y-1`}>
                            <h1 className='font-extrabold font-link pl-1'>Total Balance</h1>
                            <div className='flex flex-row justify-center items-center'>
                                <FaBitcoin color={PRIMARY_HEXODE} size={18}/>
                                <h1 className='font-extrabold font-link pl-1'>{balance && (balance * TO_BTC)}</h1>
                            </div>
                            <h1 className='text-zinc-700 dark:text-zinc-300 font-link text-sm'>{!balanceError && !balanceLoading && balance?.toLocaleString()} Satoshis</h1>
                            <div className='flex flex-row justify-center items-center space-x-4 pt-5 pb-5'>
                                <button className='flex flex-row justify-center items-center bg-blue-500 py-1 rounded-md w-[120px] hover:animate-pulse'
                                    onClick={() => {
                                        navigate("/send")
                                    }
                                }>
                                    <h1 className='font-link font-bold text-white'>Send</h1>
                                </button>
                                <button className='flex flex-row justify-center items-center bg-blue-500 py-1 rounded-md w-[120px] hover:animate-pulse' 
                                    onClick={() => navigate("/receive")}
                                >
                                    <h1 className='font-link font-bold text-white'>Receive</h1>
                                </button>
                            </div>
                        </div>
                    </NavItem>
                ) : (
                    <NavItem delay={100} style={`flex flex-col ${TRANSITION}`}>
                        <div className={`flex flex-col justify-center items-center space-y-1`}>
                            <h1 className='font-extrabold font-link pl-1'>Total Balance</h1>
                            <div className='flex flex-row justify-center items-center'>
                                <FaBitcoin color={PRIMARY_HEXODE} size={18}/>
                                <h1 className='font-extrabold font-link pl-1'>{bal && (bal * TO_BTC)}</h1>
                            </div>
                            <h1 className='text-zinc-700 dark:text-zinc-300 font-link text-sm'>{bal?.toLocaleString()} Satoshis</h1>
                            <div className='flex flex-row justify-center items-center space-x-4 pt-5 pb-5'>
                                <button className='flex flex-row justify-center items-center bg-blue-500 py-1 rounded-md w-[120px] hover:animate-pulse'
                                    onClick={() => {
                                        navigate("/send")
                                    }
                                }>
                                    <h1 className='font-link font-bold text-white'>Send</h1>
                                </button>
                                <button className='flex flex-row justify-center items-center bg-blue-500 py-1 rounded-md w-[120px] hover:animate-pulse' 
                                    onClick={() => navigate("/receive")}
                                >
                                    <h1 className='font-link font-bold text-white'>Receive</h1>
                                </button>
                            </div>
                        </div>
                    </NavItem>
                )
            }
            {!historyLoading && !historyError && <div className={'flex flex-row justify-between items-center pt-5 pb-5'}>
                <div className='flex flex-row justify-center items-center'>
                    <TbArrowsExchange size={20}/>
                    <h1 className='pl-1 font-semibold font-link'>Transactions</h1>
                </div>
                {sqlLoading && <div className='flex flex-row justify-center items-center'>
                    <ImSpinner9 className={" text-zinc-300 animate-spin"} size={10}/>
                    <h1 className='text-xs pl-1  text-zinc-300 font-link font-extrabold'>REFRESHING TRANSACTIONS</h1>
                </div>}
            </div>}
            {historyLoading && <div className='flex flex-col justify-center items-center pt-10'>
                <div className='flex flex-row justify-center items-center pb-10'>
                    <ImSpinner9 className={" text-zinc-300 animate-spin"} size={10}/>
                    <h1 className='text-xs pl-1  text-zinc-300 font-link font-extrabold'>LOADING TRANSACTIONS</h1>
                </div>
            </div>}
            {history && !historyLoading && !historyError && history.length > 0 &&
            <div className={'w-full border border-zinc-300 dark:border-zinc-700 rounded-md overflow-scroll scrollbar-hide'}>
                {history?.map((item, index) => {
                    return <TranscationItem key={index} delay={index * 100} hasBorder={index < history?.length - 1} tx={item}/>
                })}
            </div>}
        </div>
  )
}

export default Wallet