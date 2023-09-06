import { BsGithub, BsWifi, BsWifiOff } from 'react-icons/bs'
import { CiSettings } from 'react-icons/ci'
import { RiWallet3Fill } from 'react-icons/ri'
import { COMPLIMENT_HEXCODE, PRIMARY_HEXODE, TRANSITION } from '../../constants'
import NavItem from './NavItem'
import { useNavigate } from 'react-router-dom'
import { walletContext } from '../../hooks/walletContext'
import { Dispatch, SetStateAction } from 'react'
import { BiHelpCircle } from 'react-icons/bi'

interface Props {
    setIndex: Dispatch<SetStateAction<number>>
}

const NavBar = ({ setIndex }: Props) => {
    const wifi: boolean  = navigator.onLine
    const navigate = useNavigate()
    const wallets = walletContext()
    
    const handleNav = (index: number) => {
        setIndex(index)
        navigate('/wallet')
    }

    return (
        <div className={`flex flex-col lg:w-[300px] w-[200px] items-start border-r border-zinc-300 dark:border-zinc-700 pr-5` + TRANSITION}>
            <div className='flex flex-col pt-5 pb-5 w-full'>
                <NavItem delay={100} style='w-full hover:animate-pulse'>
                    <button className='font-link font-bold text-sm text-blue-500 pb-5 border-b border-zinc-300 dark:border-zinc-700 w-full'
                        onClick={() => navigate("/")}
                    >Flow Wallet</button>
                </NavItem>
                { wallets.map((wallet, index) => {
                    return (
                        <NavItem key={index} delay={index * 100} style='w-full'>
                            <button className='w-full flex flex-col justify-start items-center border-b border-zinc-300 dark:border-zinc-700 py-2 rounded-sm hover:animate-pulse'
                                    onClick={() => handleNav(index)}>
                                <h1 className='text-sm font-link'>{wallet.name}</h1>
                                <h1 className='text-xs font-extralight dark:text-zinc-300 text-zinc-700'>{wallet.xfp}</h1>
                            </button>
                        </NavItem>
                    )
                })}
                <NavItem delay={500} style='w-full pl-5 pr-5 pt-5'>
                    <button className='w-full flex flex-row justify-center items-center border border-zinc-300 dark:border-zinc-700 px-2 py-1 rounded-sm hover:animate-pulse'
                            onClick={() => navigate('/adddevice')}>
                        <h1 className='text-xs font-link'>Add Device</h1>
                    </button>
                </NavItem>
            </div>
            <div className='flex flex-row justify-center items-center w-full pt-5 space-x-2'>
                <NavItem delay={600} style=''>
                    <a href='https://github.com/xorizon' target='_blank'>
                        <BsGithub color={COMPLIMENT_HEXCODE} className={``}/>
                    </a>
                </NavItem>
                <NavItem delay={700} style=''>
                    <CiSettings className="hover:animate-spin hover:cursor-pointer" color={COMPLIMENT_HEXCODE} size={22}/>
                </NavItem>
                <NavItem delay={800} style=''>
                    <a href='https://github.com/xorizon' target='_blank'>
                        <BiHelpCircle color={COMPLIMENT_HEXCODE} size={18}/>
                    </a>
                </NavItem>
                <NavItem delay={900} style=''>
                    {wifi ? <BsWifi color={PRIMARY_HEXODE} size={20}/>: <BsWifiOff color={"red"} size={20}/>}
                </NavItem>
            </div>
        </div>
    )
}

export default NavBar