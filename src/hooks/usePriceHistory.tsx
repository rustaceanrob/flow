import { useState, useEffect } from "react";
import Point from "../interfaces/Point";
import { invoke } from "@tauri-apps/api";

export default function usePriceHistory() {
    const [historyLoading, setHistoryLoading] = useState<boolean>(true)
    const [historyError, setHistoryError] = useState<boolean>(false)
    const [prices, setPrices] = useState<Point[] | any[]>([])

    useEffect(() => {
        let unsubscribed = false
        setHistoryLoading(true)
        if (!unsubscribed) {
            invoke('fiat_history').then((res: any) => {
                let data = JSON.parse(res)
                let stats = data.data
                const maxPrice = Math.min(...stats.slice(-100).map((stat: any) => stat.priceUsd as number));
                setPrices(stats.slice(-100).map((stat: any, index: number) => ({x: index, y: (stat.priceUsd as number) - maxPrice })))
            }).catch(() => {
                setHistoryError(true)
            }).finally(() => {
                setHistoryLoading(false)
            })
        }
        return () => {
            unsubscribed = true
        }
    }, [])
    console.log(prices)
    return { historyLoading, historyError, prices }
}