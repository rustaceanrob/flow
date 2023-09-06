import { invoke } from '@tauri-apps/api';
import { useState, useEffect } from 'react';

export default function useFreshAddress(fp: string) {
    const [addressLoading, setAddressLoading] = useState<boolean>(true)
    const [addressError, setAddressError] = useState<boolean>(false)
    const [address, setAddress] = useState<string>()

    useEffect(() => {
        invoke('fresh_address', { fp: fp }).then((address) => {
            setAddress(address as string)
        }).catch(() => {
            setAddress("")
            setAddressError(true)
        }).finally(() => {
            setAddressLoading(false)
        })
    }, [])
    
    return { addressLoading, addressError, address }
}