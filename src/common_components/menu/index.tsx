import React, { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import usePathKey from '@/hooks/usePathKey';
import { useAppSelector } from '@/store'
import { select_menu, MenuData } from '@/store/slice/user';

const App: React.FC = () => {
    const [current, setCurrent] = useState('');
    const navigate = useNavigate()
    const path_key = usePathKey()
    const menus = useAppSelector(select_menu)

    useEffect(() => {
        if (path_key) {
            setCurrent(path_key)
        }
    }, [])

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key)
        const path = menus.find((item: MenuData) => {
            return item.key === e.key
        })?.path as string
        navigate(path)
    };

    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={menus} />;
};

export default App;