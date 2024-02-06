import useIsShowHeader from "@/hooks/useIsShowHeader"
import useIsShowMenu from "@/hooks/useIsShowMenu"
import { Outlet } from "react-router-dom"
import Header from "./header"
import Menu from "./menu"
import { useAppDispatch, useAppSelector } from '@/store'
import { useEffect } from "react"
import { get_menu_async } from "@/store/slice/user"

function Layout() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(get_menu_async())
    }, [])
    const is_show_header = useIsShowHeader()
    const is_show_menu = useIsShowMenu()
    return (
        <div className="layout">
            {
                is_show_header ? (
                    <div className="header_wrap">
                        <Header />
                    </div>
                ) : null
            }
            {
                is_show_menu ? (
                    <div className="menu_wrap">
                        <Menu />
                    </div>
                ) : null
            }
            <div className="outlet_wrap">
                <Outlet />
            </div>
        </div>
    )
}


export default Layout