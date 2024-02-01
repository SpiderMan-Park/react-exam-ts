import useIsShowHeader from "@/hooks/useIsShowHeader"
import useIsShowMenu from "@/hooks/useIsShowMenu"
import { Outlet } from "react-router-dom"
import Header from "./header"
import Menu from "./menu"

function Layout() {
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