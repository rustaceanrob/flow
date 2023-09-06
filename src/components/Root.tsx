import { useEffect, useState } from "react"
import NavBar from "./Navigation/NavBar"
import Router from "./Router/Router"
import { WalletContextProvider } from "../hooks/walletContext"

const Root = () => {
    const [walletIndex, setWalletIndex] = useState<number>(0);
    useEffect(() => {
        document.body.style.overflow = "hidden";
    }, [])

    return (
        <WalletContextProvider index={walletIndex}>
            <div className='flex flex-row justify-start w-full h-screen bg-white dark:bg-black dark:text-white scrollbar-hide'>
                <NavBar setIndex={setWalletIndex}/>
                <Router index={walletIndex} setIndex={setWalletIndex}/>
            </div>
        </WalletContextProvider>
    )
}
export default Root