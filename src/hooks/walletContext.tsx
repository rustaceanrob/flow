import { invoke } from "@tauri-apps/api";
import { createContext, useContext, useEffect, useState } from "react";

interface WalletStruct {
    name: string,
    xfp: string,
    balance: number,
}

const WalletContext = createContext<WalletStruct[]>([])

interface Props {
    children: React.ReactNode,
    index: number,
}

export const WalletContextProvider: React.FC<Props> = ({ children, index })=> {
    const [wallets, setWallets] = useState<WalletStruct[]>([])

    useEffect(() => {
        (async () => {
            try {
                await invoke('init')
                let data = await invoke('wallet_fp_context')
                setWallets(data as WalletStruct[])
            } catch (err) { console.log(err) }
        })()
    }, [index])

    return (
        <WalletContext.Provider value={wallets}>
            {children}
        </WalletContext.Provider>
    )

}

export const walletContext = () => {
    return useContext(WalletContext)
}