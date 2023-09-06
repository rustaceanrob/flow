import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import MempoolTransaction from "../interfaces/MempoolTransaction";

export default function useMempoolTxs() {
    const [txsLoading, setTxsLoading] = useState<boolean>(true)
    const [txsError, setTxsError] = useState<boolean>(false)
    const [latest, setLatest] = useState<MempoolTransaction[]>()

    useEffect(() => {
        invoke('mempool_txs').then((response) => {
            let data = JSON.parse(response as string)
            setLatest(data.map((tx: any) => ({txid: tx.txid, size: tx.vsize, fee: tx.fee, value: tx.value})))
        }).catch((err) => {
            console.log(err)
            setTxsError(true)
        }).finally(() => setTxsLoading(false))
    }, [])

    return { txsLoading, txsError, latest }

}