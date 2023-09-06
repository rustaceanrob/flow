import { invoke } from '@tauri-apps/api';
import { useState, useEffect } from 'react';
import { BIL, MIL } from '../constants';

export default function useFiatPrice() {
    const [priceLoading, setPriceLoading] = useState<boolean>(true)
    const [priceError, setPriceError] = useState<boolean>(false)
    const [price, setPrice] = useState<string>()
    const [priceNum, setPriceNum] = useState<number>()
    const [dayChange, setDayChange] = useState<number>()
    const [dayVolume, setDayVolume] = useState<string>("")
    const [marketCap, setMarketCap] = useState<string>("")
    const [vwap, setVwap] = useState<string>("")


    useEffect(() => {
        invoke('fiat_rate').then((price: any) => {
            let data = JSON.parse(price)
            setPriceNum(data.data.priceUsd as number)
            setPrice("Price: $" + Math.round((data.data.priceUsd as number)).toLocaleString() + "")
            setVwap("Volume-Weighted Average Price: $" + Math.round((data.data.vwap24Hr as number)).toLocaleString() + "")
            setDayChange(Math.round((data.data.changePercent24Hr as number) * 100) / 100)
            setDayVolume("Daily Volume: $" + Math.round((data.data.volumeUsd24Hr as number)).toLocaleString() + "")
            setMarketCap("Market Capitalization: $" + Math.round((data.data.marketCapUsd as number)).toLocaleString() + "")
        }).catch(() => {
            setPrice("")
            setPriceError(true)
        }).finally(() => {
            setPriceLoading(false)
        })
    }, [])
    return { priceLoading, priceError, price, priceNum, dayChange, dayVolume, marketCap, vwap }
}