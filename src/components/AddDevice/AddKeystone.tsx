import { TRANSITION, KEYSTONE_TXT_IMPORT_STEPS } from '../../constants'
import { BiFile, BiQrScan } from 'react-icons/bi';
import ImportStep from './ImportStep';
import { QrReader } from 'react-qr-reader';
import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api';
import { useNavigate } from 'react-router-dom';
import { Dispatch, SetStateAction, useState } from 'react';

interface Props {
    index: number,
    setIndex: Dispatch<SetStateAction<number>>,
}

const AddKeystone = ({ index, setIndex }: Props) => {
    const [startScan, setStartScan] = useState<boolean>(false)
    const navigate = useNavigate()
   
    const openTxtForImport = async () => {
        try {
            let fileName = await open({ filters: [{name: '', extensions: ['txt']}]})
            await invoke('read_keystone_txt', { path: fileName })
            setIndex(index + 1) // hacky way to force an update
            navigate("/")
        } catch {}
    }


    return (
        <div className={`flex flex-col w-full h-full ${TRANSITION} pl-5 pr-5 pt-10 pb-5`}>
            <h1 className='font-extrabold pb-2'>Steps to Import Your Keystone with Your Camera</h1>
            <div className={`grid grid-cols-1 pt-3 pb-2 w-full gap-2 ${TRANSITION} overflow-scroll`}>
                <div className={`flex flex-col border dark:border-zinc-700 border-zinc-300 rounded-md justify-start items-start w-full overflow-scroll ${TRANSITION}`}>
                    {
                        KEYSTONE_TXT_IMPORT_STEPS.map((step, index) => {
                            return <ImportStep key={index} message={step} delay={index * 100} border={index < KEYSTONE_TXT_IMPORT_STEPS.length - 1}/>
                        })
                    }
                </div>
            </div>
            <h1 className='font-extrabold pb-2 pt-5'>Steps to Import Your Keystone with a Text File</h1>
            <div className={`grid grid-cols-1 pt-3 pb-2 w-full gap-2 ${TRANSITION} overflow-scroll`}>
                <div className={`flex flex-col border dark:border-zinc-700 border-zinc-300 rounded-md justify-start items-start w-full overflow-scroll ${TRANSITION}`}>
                    {
                        KEYSTONE_TXT_IMPORT_STEPS.map((step, index) => {
                            return <ImportStep key={index} message={step} delay={index * 100} border={index < KEYSTONE_TXT_IMPORT_STEPS.length - 1}/>
                        })
                    }
                </div>
            </div>
            <div className='flex flex-row justify-center items-center space-x-5 pt-5'>
                <button className='bg-blue-500 py-4 w-full rounded-md hover:animate-pulse flex flex-row justify-center items-center' onClick={() => openTxtForImport()}>
                    <BiFile color='white' size={20}/>
                    <h1 className='font-bold pl-2 text-white'>Import Text File</h1>
                </button>
                <button className='bg-blue-500 py-4 w-full rounded-md hover:animate-pulse flex flex-row justify-center items-center' onClick={() => setStartScan(true)}>
                    <BiQrScan color='white' size={20}/>
                    <h1 className='font-bold pl-2 text-white'>Scan QR</h1>
                </button>
            </div>
            {startScan &&  <QrReader
                onResult={(result) => console.log(result)}
                constraints={{facingMode: 'user'}}
                containerStyle={{width: '100%', height: '100%'}}
            />}
        </div>
    )
}

export default AddKeystone