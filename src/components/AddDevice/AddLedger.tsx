import { TRANSITION, LEDGER_S_IMPORT_STEPS } from '../../constants'
import { BiSolidFileJson } from 'react-icons/bi';
import ImportStep from './ImportStep';
import { invoke } from '@tauri-apps/api';
import { useNavigate } from 'react-router-dom';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    index: number, 
    setIndex: Dispatch<SetStateAction<number>>,
}

const AddLedger = ({ index, setIndex }: Props) => {
    const navigate = useNavigate()

    const openLedger = async () => {
        try {
            await invoke('read_ledger')
            setIndex(index + 1) // hacky way to force an update
            navigate("/")
        } catch {}
    }

    return (
        <div className={`flex flex-col w-full h-full ${TRANSITION} pl-5 pr-5 pt-10 pb-5`}>
            <h1 className='font-extrabold pb-2'>Steps to Import Your Ledger Nano S</h1>
            <div className={`grid grid-cols-1 pt-3 pb-2 w-full gap-2 ${TRANSITION} overflow-scroll`}>
                <div className={`flex flex-col border dark:border-zinc-700 border-zinc-300 rounded-md justify-start items-start w-full overflow-scroll ${TRANSITION}`}>
                    {
                        LEDGER_S_IMPORT_STEPS.map((step, index) => {
                            return <ImportStep key={index} message={step} delay={index * 100} border={index < LEDGER_S_IMPORT_STEPS.length - 1}/>
                        })
                    }
                </div>
                <button className='bg-blue-500 py-4 w-full rounded-md hover:animate-pulse flex flex-row justify-center items-center' onClick={() => openLedger()}>
                    <h1 className='font-bold text-white'>Import Ledger</h1>
                </button>
            </div>
        </div>
    )
}

export default AddLedger