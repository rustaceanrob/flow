import { useNavigate } from 'react-router-dom'
import useFiatPrice from '../../hooks/useFiatPrice'
import NavItem from '../Navigation/NavItem'
import { PRIMARY_HEXODE, TO_BTC, TRANSITION } from '../../constants'
import { FaArrowLeft } from 'react-icons/fa'
import { GoCopy } from 'react-icons/go'

type Props = {
  tx?: PendingTx,
}

const Confirm = ({ tx }: Props) => {
    const navigate = useNavigate()

    // const [didCopy, setDidCopy] = useState<boolean>(false)

    // const copy = () => {
    //     setDidCopy(true)
    //     navigator.clipboard.writeText() 
    //     setTimeout(() => {
    //         setDidCopy(false)
    //     }, 2000)
    // }

    const { priceLoading, priceError, priceNum } = useFiatPrice() 
    
    return (
      <div className='flex flex-col w-full h-full p-5'>
        <div className='flex flex-row justify-between items-center w-full pb-5'>
          <div className=''><button onClick={() => navigate("/")}><FaArrowLeft color={PRIMARY_HEXODE} className="justify-start"/></button></div>
        </div>
        <h1 className={`flex flex-row justify-start items-start w-full md:pl-10 xl:pl-20 font-semibold font-link pb-5 ${TRANSITION}`}>Your Transaction Needs Approval</h1>
        {tx && !priceLoading && <NavItem delay={300} style='flex flex-col justify-center items-center border border-zinc-300 dark:border-zinc-700 rounded-md px-5 py-5 space-y-5'>
            <h1 className='font-link font-extrabold'>You are sending a total of {(tx.sats).toLocaleString()} Satoshis, <span>{!priceLoading && !priceError && priceNum && tx && <span className='font-link font-extrabold'> approximately ${((tx.sats) * TO_BTC * priceNum).toLocaleString()}</span>}</span>, to:</h1>
            <div className='flex flex-row justify-center items-center font-mono bg-zinc-100 dark:bg-zinc-800 rounded-md px-2 py-2 space-x-1'>
              <button className='hover:animate-pulse'><GoCopy className='dark:text-white'/></button>
              <h1>{tx.address}</h1>
            </div>
            <h1 className='font-link font-extrabold'>For a fee of {(tx.fee).toLocaleString()} Satoshis, <span>{!priceLoading && !priceError && priceNum && tx && <span className='font-link font-extrabold'> approximately ${((tx.fee) * TO_BTC * priceNum).toLocaleString()}</span>}</span></h1>
          </NavItem>}
      </div>
    )
}

export default Confirm