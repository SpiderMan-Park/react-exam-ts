import { useEffect } from "react"
import useIsShowHeader from "@/hooks/useIsShowHeader"
import useIsShowMenu from "@/hooks/useIsShowMenu"
import { Outlet } from "react-router-dom"
import Header from "./header/index"
import Menu from "./menu"
import { useAppDispatch, useAppSelector } from '@/store';
import { get_menu_async, select_user_info } from "@/store/slice/user"
import classnames from 'classnames'

function Layout() {
    const dispatch = useAppDispatch()
    const UserInfo = useAppSelector(select_user_info)
    useEffect(() => {
        dispatch(get_menu_async())
    }, [])
    const is_show_header = useIsShowHeader()
    const is_show_menu = useIsShowMenu()
    return (
        <div className={classnames({
            layout: true,
            hide: !UserInfo._id
        })}>
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