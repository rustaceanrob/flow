import { useNavigate } from 'react-router-dom'
import Device from '../../interfaces/Device'
import NavItem from '../Navigation/NavItem'

type Props = {
    device: Device,
    delay: number

}

const DeviceImport = ({ device, delay }: Props) => {
    const navigate = useNavigate()
    return (
        <NavItem delay={delay} style='w-full'>
            <button className='px-5 py-5 border border-zinc-300 dark:border-zinc-700 rounded-md w-full hover:animate-pulse' onClick={() => navigate("/" + device.device)}>
                <h1 className='font-link font-bold'>{device.name}</h1>
            </button>
        </NavItem>
    )
}

export default DeviceImport