import { TRANSITION } from "../../constants"
import { AiOutlinePlusCircle } from "react-icons/ai"
import { SiMarketo } from 'react-icons/si'
import { RiStockFill } from 'react-icons/ri'
import { BsBroadcast, BsSafe2 } from 'react-icons/bs'
import NavItem from "../Navigation/NavItem"
import Tile from "./Tile"

const Home = () => {

    return (
        <div className='flex flex-col w-full h-full p-5'>
            <div className={`flex flex-col justify-between items-center w-full ${TRANSITION} md:pl-10 md:pr-10 xl:pr-20 xl:pl-20 space-y-4 pt-10`}>
                <NavItem delay={100} style="w-full justify-center items-center">
                    <Tile route={"/adddevice"} child={
                    <div className="flex flex-row justify-center items-center space-x-2">
                        <AiOutlinePlusCircle size={17}/>
                        <h1 className="font-link">Add Device</h1>
                    </div>} />
                </NavItem>
                <NavItem delay={200} style="w-full justify-center items-center">
                    <Tile route={"/adddevice"} child={
                    <div className="flex flex-row justify-center items-center space-x-2">
                        <BsSafe2 size={18}/>
                        <h1 className="font-link">Create Vault</h1>
                    </div>} />
                </NavItem>
                <NavItem delay={300} style="w-full justify-center items-center">
                    <Tile route={"/broadcast"} child={
                    <div className="flex flex-row justify-center items-center space-x-2">
                        <BsBroadcast/>
                        <h1 className="font-link">Broadcast Transcation</h1>
                    </div>} />
                </NavItem>
                <NavItem delay={400} style="w-full justify-center items-center">
                    <Tile route={"/mempool"} child={
                    <div className="flex flex-row justify-center items-center space-x-2">
                        <SiMarketo/>
                        <h1 className="font-link">Mempool Data</h1>
                    </div>}  />
                </NavItem>
                <NavItem delay={500} style="w-full justify-center items-center">
                    <Tile route={"/fiat"} child={
                    <div className="flex flex-row justify-center items-center space-x-2">
                        <RiStockFill size={18}/>
                        <h1 className="font-link">Market Today</h1>
                    </div>}  />
                </NavItem>
            </div>
        </div>
    )
}

export default Home