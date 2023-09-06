import { FaArrowLeft } from 'react-icons/fa'
import { DEVICES, PRIMARY_HEXODE, TRANSITION } from '../../constants'
import DeviceImport from './DeviceImport'
import { useNavigate } from 'react-router-dom'

const AddDevice = () => {
  const devices = DEVICES
  const navigate = useNavigate()
  return (
    <div className={`flex flex-col w-full h-full ${TRANSITION} pl-5 pr-5 pt-5 overflow-none`}>
        <div className='pb-5'><button onClick={() => navigate("/")}><FaArrowLeft color={PRIMARY_HEXODE} className="justify-start"/></button></div>
        <h1 className='font-link pb-2'>Select Your Device</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 pt-3 w-full gap-2'>
          {devices.map((item, index) => {
            return (<DeviceImport key={index} delay={index * 100} device={item}/>)
          })}
        </div>
    </div>
  )
}

export default AddDevice