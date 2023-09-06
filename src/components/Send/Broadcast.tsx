import { open } from '@tauri-apps/api/dialog'
import { PRIMARY_HEXODE, TRANSITION } from '../../constants'
import { BiFile, BiQrScan } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { invoke } from '@tauri-apps/api'
import NavItem from '../Navigation/NavItem'
import { Dispatch, SetStateAction } from 'react'

type Props = {
    setPending: Dispatch<SetStateAction<PendingTx | undefined>>
}

const Broadcast = ({setPending}: Props) => {

    const navigate = useNavigate()

    const selectSignedPsbt = async () => {
        try {
            let fileName = await open({ filters: [{name: '', extensions: ['psbt']}]})
            let tx = await invoke('set_binary', { file: fileName }) as PendingTx
            console.log(tx)
            setPending(tx)
            navigate("/confirm")
        } catch { navigate("/") }
    }
    
    return (
        <div className='flex flex-col w-full h-full p-5'>
            <div className='flex flex-col'>
                <div className='pb-5 w-full justify-between flex flex-row'>
                    <button onClick={() => navigate("/")}><FaArrowLeft color={PRIMARY_HEXODE} className="justify-start"/></button>
                </div>
                <h1 className={`flex flex-row justify-start items-start w-full md:pl-10 xl:pl-20 font-semibold font-link pb-5 ${TRANSITION}`}>Upload a Signed Transcation</h1>
                <NavItem delay={100} style={`flex flex-row justify-end items-end space-x-5 w-full md:pl-10 md:pr-10 xl:pr-20 xl:pl-20 ${TRANSITION}`}>
                    <button className={`bg-blue-500 py-4 w-full rounded-md hover:animate-pulse flex flex-row justify-center items-center`} onClick={() => selectSignedPsbt().then().catch()}>
                        <BiFile color='white' size={20}/>
                        <h1 className='font-bold font-link pl-2 text-white'>From File</h1>
                    </button>
                    <button className='bg-blue-500 py-4 w-full rounded-md hover:animate-pulse flex flex-row justify-center items-center'>
                        <BiQrScan color='white' size={20}/>
                        <h1 className='font-bold font-link pl-2 text-white'>Scan QR</h1>
                    </button>
                </NavItem>
                <div className='flex flex-row justify-center items-center w-full pt-10 pb-5'>
                    <NavItem delay={200} style='flex flex-row justify-center items-center space-x-2 border border-zinc-300 dark:border-zinc-700 px-5 py-5 rounded-md'>
                        <h1 className='font-semibold text-sm'>Please ensure your transaction has been signed by your device. </h1>
                    </NavItem>
                </div>
            </div>
        </div>
    )
}

export default Broadcast