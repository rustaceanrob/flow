import { useState, useEffect } from 'react'
import Tx from '../interfaces/Tx'
import { invoke } from '@tauri-apps/api'

export default function useTxHistory(fp: string, shouldRefresh: boolean) {
    const [historyLoading, setHistoryLoading] = useState<boolean>(true)
    const [historyError, setHistoryError] = useState<boolean>(false)
    const [history, setHistory] = useState<Tx[]>()

    useEffect(() => {
        invoke('history', { fp: fp }).then((hist) => {
            let confirmed: Tx[] = [];
            let unconfirmed: Tx[] = [];
            (hist as Tx[]).forEach(element => {
                if (element.confirmed) {
                    confirmed.push({ confirmed: element.confirmed, value: element.value, height: element.height, was_sent: element.was_sent})
                } else {
                    unconfirmed.push({ confirmed: element.confirmed, value: element.value, height: element.height, was_sent: element.was_sent})
                }
            });
            setHistory([...unconfirmed, ...confirmed])
        }).catch(() => {
            setHistory([])
            setHistoryError(true)
        }).finally(() => {
            setHistoryLoading(false)
        })
    }, [shouldRefresh])

    return { historyLoading, historyError, history }
}