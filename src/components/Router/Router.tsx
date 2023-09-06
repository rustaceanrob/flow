import Receive from '../Receive/Receive'
import { Route, Routes } from 'react-router-dom'
import AddDevice from '../AddDevice/AddDevice'
import Wallet from '../Wallet/Wallet'
import AddColdcard from '../AddDevice/AddColdcard'
import AddKeystone from '../AddDevice/AddKeystone'
import { Dispatch, SetStateAction, useState } from 'react'
import SendTx from '../Send/SendTx'
import Broadcast from '../Send/Broadcast'
import Mempool from '../Mempool/Mempool'
import Home from '../Home/Home'
import Fiat from '../Fiat/Fiat'
import AddLedger from '../AddDevice/AddLedger'
import WalletSettings from '../Wallet/WalletSettings'
import Confirm from '../Send/Confirm'

interface Props {
    index: number,
    setIndex: Dispatch<SetStateAction<number>>,
}

const Router = ({ index, setIndex }: Props) => {

    const [pending, setPending] = useState<PendingTx>()

    return (
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/fiat' element={<Fiat/>}/>
            <Route path='/mempool' element={<Mempool/>}/>
            <Route path='/wallet' element={<Wallet key={index} index={index}/>} />
            <Route path='/walletsettings' element={<WalletSettings key={index} index={index}/>} />
            <Route path='/receive' element={<Receive key={index} index={index}/>}/>
            <Route path='/send' element={<SendTx key={index} index={index}/>}/>
            <Route path='/broadcast' element={<Broadcast setPending={setPending}/>}/>
            <Route path='/confirm' element={<Confirm key={index} tx={pending}/>}/>
            <Route path='/adddevice' element={<AddDevice/>}/>
            <Route path='/ledger' element={<AddLedger index={index} setIndex={setIndex}/>}/>
            <Route path='/coldcard' element={<AddColdcard index={index} setIndex={setIndex}/>}/>
            <Route path='/keystone' element={<AddKeystone index={index} setIndex={setIndex}/>}/>
        </Routes>
    )
}

export default Router