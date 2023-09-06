import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { walletContext } from '../../hooks/walletContext'
import { PRIMARY_HEXODE } from '../../constants'
import { FaArrowLeft } from 'react-icons/fa'
import NavItem from '../Navigation/NavItem'

type Props = {
    index: number
}

const WalletSettings = ({ index }: Props) => {
    const navigate = useNavigate()
    const wallets = walletContext()

    useEffect(() => {

    }, [])

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
            <NavItem delay={100} style='w-full flex flex-col pt-10'>
                <div className={'w-full border border-zinc-300 dark:border-zinc-700 rounded-md overflow-scroll scrollbar-hide'}>
                    <button>

                    </button>
                    <button>
                        
                    </button>
                    <button>
                        
                    </button>
                </div>
            </NavItem>
        </div>
    )
}

export default WalletSettings