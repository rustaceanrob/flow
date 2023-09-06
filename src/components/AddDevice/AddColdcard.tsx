import { TRANSITION, MK4_IMPORT_STEPS } from '../../constants'
import { BiSolidFileJson } from 'react-icons/bi';
import ImportStep from './ImportStep';
import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api';
import { useNavigate } from 'react-router-dom';
import { Dispatch, SetStateAction } from 'react';

interface Props {
    index: number, 
    setIndex: Dispatch<SetStateAction<number>>,
}

const AddColdcard = ({ index, setIndex }: Props) => {
    const navigate = useNavigate()

    const openJsonForImport = async () => {
        try {
            let fileName = await open({ filters: [{name: '', extensions: ['json']}]})
            await invoke('read_coldcard', { path: fileName })
            setIndex(index + 1) // hacky way to force an update
            navigate("/")
        } catch {}
    }

    return (
        <div className={`flex flex-col w-full h-full ${TRANSITION} pl-5 pr-5 pt-10 pb-5`}>
            <h1 className='font-extrabold pb-2'>Steps to Import Your ColdCard MK4</h1>
            <div className={`grid grid-cols-1 pt-3 pb-2 w-full gap-2 ${TRANSITION} overflow-scroll`}>
                <div className={`flex flex-col border dark:border-zinc-700 border-zinc-300 rounded-md justify-start items-start w-full overflow-scroll ${TRANSITION}`}>
                    {
                        MK4_IMPORT_STEPS.map((step, index) => {
                            return <ImportStep key={index} message={step} delay={index * 100} border={index < MK4_IMPORT_STEPS.length - 1}/>
                        })
                    }
                </div>
                <button className='bg-blue-500 py-4 w-full rounded-md hover:animate-pulse flex flex-row justify-center items-center' onClick={() => openJsonForImport()}>
                    <BiSolidFileJson color='white' size={20}/>
                    <h1 className='font-bold pl-2 text-white'>Import JSON</h1>
                </button>
            </div>
        </div>
    )
}

export default AddColdcard