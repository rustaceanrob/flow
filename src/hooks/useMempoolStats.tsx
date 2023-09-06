import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";

export default function useMempoolStats() {
    const [statsLoading, setStatsLoading] = useState<boolean>(true)
    const [statsError, setStatsError] = useState<boolean>(false)
    const [numTxs, setNumTxs] = useState<string>("")
    const [vb, setVb] = useState<string>("")
    const [fee, setTotalFee] = useState<string>("")

    useEffect(() => {
        invoke('mempool_stats').then((response) => {
            let data = JSON.parse(response as string)
            setNumTxs((data.count as number).toLocaleString())
            setVb((data.vsize as number).toLocaleString())
            setTotalFee((data.total_fee as number).toLocaleString())
        }).catch((err) => {
            console.log(err)
            setStatsError(true)
        }).finally(() => setStatsLoading(false))
    }, [])

    return { statsLoading, statsError, numTxs, vb, fee }

}