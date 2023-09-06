import { useEffect, useState } from 'react'
import { TRANSITION } from '../../constants';

type Props = {
    delay: number,
    children: React.ReactNode,
    style: string,
}

const NavItem = ({ delay, children, style }: Props) => {
    const [shouldShow, setShouldShow] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => setShouldShow(true), delay)
    }, [])

    return (
        <div className={`${shouldShow ? "opacity-1": "opacity-0"}  ${TRANSITION} ${style}`}>
            {children}
        </div>
    )
}
export default NavItem