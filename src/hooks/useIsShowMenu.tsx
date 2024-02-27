import { useLocation } from "react-router-dom";
import { type RouterKeys } from '../config';
import { useAppSelector } from '@/store';
import { select_menu } from '@/store/slice/user';

function useIsShowMenu() {
    const location = useLocation()
    const menus = useAppSelector(select_menu)
    const key: RouterKeys = location.pathname.split('/')[1] as RouterKeys

    if (!key || !menus.length) {
        return false
    }

    const menu = menus.find((item) => {
        return item.key === key
    })

    if (menu?.hasMenu) {
        return true
    } else {
        return false
    }
}

export default useIsShowMenu