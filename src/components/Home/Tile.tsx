import React from 'react'
import { TRANSITION } from '../../constants'
import { useNavigate } from 'react-router-dom'

type Props = {
    route: string,
    child: React.ReactNode,
}

const Tile = ({ route, child }: Props) => {
    const navigate = useNavigate()
    return (
        <button className={`flex flex-row justify-center items-center w-full ${TRANSITION} border border-zinc-300 dark:border-zinc-700 rounded-md py-5 hover:animate-pulse`} onClick={() => navigate(route)}>
            {child}
        </button>
    )
}

export default Tile