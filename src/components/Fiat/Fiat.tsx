import { PRIMARY_HEXODE, TRANSITION } from '../../constants'
import useFiatPrice from '../../hooks/useFiatPrice'
import { useNavigate } from 'react-router-dom'
import NavItem from '../Navigation/NavItem'
import { ImSpinner9 } from 'react-icons/im'
import { FaArrowLeft, FaBitcoin } from 'react-icons/fa'
import usePriceHistory from '../../hooks/usePriceHistory'
import CurvedLine from './CurvedLine'

const Fiat = () => {
    const { priceLoading, priceError, priceNum, dayChange, dayVolume, marketCap, vwap } = useFiatPrice()
    const { historyLoading, historyError, prices } = usePriceHistory()
    const navigate = useNavigate()

    const dataBar = () => {
        return (
            <div>
                {
                    !historyLoading && !historyError && !priceLoading && !priceError ? 
                    (<NavItem delay={200} style='lg:pl-20 lg:pr-20 xl:pr-40 xl:pl-40 p-5'>
                        <div className='grid grid-cols-1 gap-2 justify-center items-center border dark:border-zinc-700 border-zinc-300 rounded-md py-5 px-5'>
                            <h1 className='flex justify-center items-center font-link text-xs '>{dayVolume}</h1>
                            <h1 className='flex justify-center items-center font-link text-xs '>{marketCap}</h1>
                            <h1 className='flex justify-center items-center font-link text-xs'>{vwap}</h1>
                        </div>
                    </NavItem>) 
                    : (<></>)
                }
            </div>
        )
    }

    const p = () => {
        return (<div>
            {
                !priceLoading && !priceError && priceNum ? 
                (<NavItem delay={100} style='flex flex-col justify-center items-center space-y-2 pb-10'>
                    <div className='flex flex-row justify-center items-center space-x-2'>
                        <FaBitcoin color={PRIMARY_HEXODE} size={20}/>
                        <h1 className='flex justify-center items-center font-link font-bold text-lg'>${Math.round(priceNum).toLocaleString()}</h1>
                    </div>
                    {dayChange && dayChange < 0 ? (
                        <h1 className='text-sm font-link text-zinc-700 dark:text-zinc-300'>Daily Change: <span className='font-mono text-red-500 text-sm'>{dayChange}%</span></h1>
                        
                    ): (
                        <h1 className='text-sm font-link text-zinc-700 dark:text-zinc-300'>Daily Change: <span className='flex justify-center items-center font-link text-green-500 text-sm'>+{dayChange}%</span></h1>
                    )}
                </NavItem>) 
                : (<div className='flex flex-row justify-center items-center p-5'>
                    <ImSpinner9 className={" text-zinc-300 animate-spin"} size={10}/>
                    <h1 className='text-xs pl-1 text-zinc-300 font-link'>LOADING DATA</h1>
                </div>)
            }
        </div>)
    }

    const chart = () => {
        return (<div>
            {
                !priceLoading && !priceError && !historyLoading && !historyError && prices ? 
                (<NavItem delay={100} style='flex flex-col justify-center items-center'>
                    {/* <h1 className='font-link text-xs text-zinc-300 dark:text-zinc-700 pb-5'>Maximize your window to see the full chart</h1> */}
                    <CurvedLine points={prices}/>
                </NavItem>) 
                : (<></>)
            }
        </div>)
    }

    return (
        <div className='flex flex-col w-full h-full p-5'>
            <div className={`flex flex-row justify-between items-center w-full ${TRANSITION}`}>
                <div className=''><button onClick={() => navigate("/")}><FaArrowLeft color={PRIMARY_HEXODE} className="justify-start"/></button></div>
            </div>
            {p()}
            {chart()}
            {dataBar()}
        </div>
    )
}

export default Fiat