import { invoke } from '@tauri-apps/api';
import { useState, useEffect } from 'react';

export default function useTotalBalance(fp: string) {
    const [balanceLoading, setBalanceLoading] = useState<boolean>(true)
    const [balanceError, setBalanceError] = useState<boolean>(false)
    const [balance, setBalance] = useState<number>()
    
    useEffect(() => {
        invoke('balance', { fp: fp }).then((balance) => {
            setBalance(balance as number)
        }).catch(() => {
            setBalance(0)
            setBalanceError(true)
        }).finally(() => {
            setBalanceLoading(false)
        })
    }, [])

    return { balanceLoading, balanceError, balance }
}