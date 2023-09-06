import { invoke } from '@tauri-apps/api';
import { useState, useEffect } from 'react';

export default function useFetchAllFees() {
    const [feesLoading, setFeesloading] = useState<boolean>(true)
    const [feesError, setFeesError] = useState<boolean>(false)
    const [fees, setFees] = useState<number[]>()
    
    useEffect(() => {
        invoke('get_all_fees').then((fees) => {
            setFees(fees as number[])
        }).catch(() => {
            setFees([])
            setFeesError(true)
        }).finally(() => {
            setFeesloading(false)
        })
    }, [])

    return { feesLoading, feesError, fees }
}