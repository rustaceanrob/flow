import { invoke } from '@tauri-apps/api';
import { useState, useEffect } from 'react';

export default function useNodeCount() {
    const [nodesLoading, setNodesLoading] = useState<boolean>(true)
    const [nodesError, setNodesError] = useState<boolean>(false)
    const [nodes, setNodes] = useState<string>()

    useEffect(() => {
        invoke('node_count').then((nodes: any) => {
            let data = JSON.parse(nodes)
            setNodes("Bitcoin Nodes Online: " + (data.total_nodes as number).toLocaleString())
        }).catch(() => {
            setNodes("")
            setNodesError(true)
        }).finally(() => {
            setNodesLoading(false)
        })
    }, [])
    return { nodesLoading, nodesError, nodes }
}