import { PRIMARY_HEXODE, TRANSITION } from '../../constants'
import { ImSpinner9 } from 'react-icons/im'
import useMempoolTxs from '../../hooks/useMempoolTxs'
import MempoolTransaction from '../../interfaces/MempoolTransaction'
import MempoolTx from './MempoolTx'
import NavItem from '../Navigation/NavItem'
import useNodeCount from '../../hooks/useNodeCount'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import useMempoolStats from '../../hooks/useMempoolStats'

const Mempool = () => {
    const { txsLoading, txsError, latest } = useMempoolTxs()
    const { statsLoading, statsError, numTxs, vb, fee } = useMempoolStats()
    const { nodesLoading, nodesError, nodes } = useNodeCount()
    const navigate = useNavigate()

    const renderTxs = (): React.ReactNode => {
        if (txsLoading) {
            return (
                <div className='flex flex-row justify-center items-center'>
                    {/* <ImSpinner9 className={"dark:text-zinc-700 text-zinc-300 animate-spin"} size={10}/>
                    <h1 className='text-xs pl-1 dark:text-zinc-700 text-zinc-300 font-link font-extrabold'>MEMPOOL TRANSACTIONS LOADING</h1> */}
                </div>
            )
        } else if (!txsLoading && txsError) {
            return (
                <div className='flex flex-row justify-center items-center'>
                    <h1 className='text-xs pl-1 dark:text-zinc-700 text-zinc-300 font-link font-extrabold'>MEMPOOL TX ERROR</h1>
                </div>
            )
        } else {
            return (
                <div className={`flex flex-col overflow-scroll pb-5 ${TRANSITION} overflow-none lg:pl-5 lg:pr-5 xl:pr-40 xl:pl-40`}>
                    <NavItem style='flex flex-row items-center pt-5 pb-5' delay={100}>
                        <h1 className='font-link justify-start'>Latest Transactions</h1>
                    </NavItem>
                    {latest !== undefined ? (<NavItem delay={100} style='dark:border-zinc-700 border-zinc-300 rounded-md border overflow-scroll'>
                        {
                            latest.map((tx: MempoolTransaction, index) => {
                                return (
                                    <MempoolTx key={index} tx={tx} hasBorder={index < latest.length - 1} delay={100 * (index + 0.1)}/>
                                )
                            })
                        }
                    </NavItem>)
                     : <></>}
                </div>
            )
        }
    }
    return (
        // <div className={`flex flex-col w-full h-full ${TRANSITION} overflow-none pl-5 pr-5 pt-5 md:pl-20 md:pr-20 xl:pr-60 xl:pl-60`}>
        <div className='flex flex-col w-full h-full p-5'>
            <div className={`flex flex-row justify-between items-center w-full ${TRANSITION} pb-5`}>
                <div className=''><button onClick={() => navigate("/")}><FaArrowLeft color={PRIMARY_HEXODE} className="justify-start"/></button></div>
                {
                    !nodesLoading && !nodesError ? (<NavItem delay={100} style=''><h1 className='font-link text-xs dark:text-zinc-300 text-zinc-700'>{nodes}</h1></NavItem>) 
                        : (<div className='flex flex-row justify-center items-center'>
                        <ImSpinner9 className={" text-zinc-300 animate-spin"} size={10}/>
                        <h1 className='text-xs pl-1  text-zinc-300 font-link'>FINDING NODES</h1>
                    </div>)
                }
            </div>
            {
                !statsLoading && !statsError ? (
                    <NavItem delay={100} style={`w-full flex flex-col justify-start items-start ${TRANSITION} lg:pl-5 lg:pr-5 xl:pr-40 xl:pl-40`}>
                        <div className='flex flex-row items-center pb-5'>
                            <h1 className='font-link justify-start'>Mempool Data</h1>
                        </div>
                        <div className='w-full flex flex-row justify-between items-center border dark:border-zinc-700 border-zinc-300 rounded-md px-5 py-5'>
                            <div className='flex flex-row justify-center items-center space-x-2'>
                                <h1 className='font-link text-sm'>Transactions: {numTxs}</h1>
                            </div>
                            <div className='flex flex-row justify-center items-center space-x-2'>
                                <h1 className='font-link text-sm'>Fees: {fee} Satoshis</h1>
                            </div>
                            <div className='flex flex-row justify-center items-center space-x-2'>
                                <h1 className='font-link text-sm'>Size: {vb} vBytes</h1>
                            </div>
                        </div>
                    </NavItem>
                ): (
                    <div className='flex flex-row justify-center items-center pt-10'>
                        <ImSpinner9 className={" text-zinc-300 animate-spin"} size={10}/>
                        <h1 className='text-xs pl-1 text-zinc-300 font-link'>LOADING STATS</h1>
                    </div>
                )
            }
            <div className=''></div>
            {renderTxs()}
        </div>
    )
}

export default Mempool