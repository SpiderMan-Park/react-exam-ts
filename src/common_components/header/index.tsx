import styles from './index.module.scss'
import logo from './assets/logo.png'
import avatar from './assets/avatar.png'
import axios from '@/utils/http'
import { getImgUrl } from '@/utils'
import { select_user_info } from '@/store/slice/user'
import { useAppSelector } from '@/store'
import { useNavigate } from 'react-router-dom'
import { Avatar, Badge, Typography, Dropdown, List, Popover, Button } from 'antd'

function Header() {
    const navigate = useNavigate()
    const userInfo = useAppSelector(select_user_info)
    async function logout() {
        await axios.post('/api/user/logout')
        navigate('/login')
    }

    return (
        <div className={styles.wrap}>
            <div className="logo" onClick={() => { }}>
                <img src={logo} alt="九剑考试测评系统" />
                <h1 style={{ fontSize: 0 }}>九剑考试测评系统</h1>
            </div>
            <div className="info">
                <Popover
                    placement="bottomRight"
                    content={
                        <List
                            style={{ width: '240px', userSelect: 'none' }}
                            dataSource={[{}]}
                            renderItem={(item) => (
                                <List.Item style={{ fontSize: '12px' }}>
                                    您于2023-06-15 13:45进行的React源码考试已批阅，请前往
                                    <a
                                        style={{ color: '#1677ff' }}
                                        type="link"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            navigate('/subject_add')
                                        }}
                                    >
                                        查看
                                    </a>
                                </List.Item>
                            )}
                        />
                    }
                >
                    <Badge size="small" count={10} overflowCount={99} offset={[-5, 5]}>
                        <div className="message" />
                    </Badge>
                </Popover>

                <div className="profile">
                    <Dropdown
                        placement="bottomRight"
                        arrow
                        menu={{
                            items: [
                                {
                                    key: 'user',
                                    label: (
                                        <Button style={{ color: 'unset' }} type="link" onClick={() => navigate('/person_info')}>
                                            个人中心
                                        </Button>
                                    ),
                                },
                                {
                                    key: 'logout',
                                    label: (
                                        <Button
                                            style={{ color: 'unset' }}
                                            type="link"
                                            onClick={logout}
                                        >
                                            退出登录
                                        </Button>
                                    ),
                                },
                            ],
                        }}
                    >
                        <Avatar className="avatar" size={44} src={getImgUrl(userInfo?.avatar) || avatar} draggable={false} />
                    </Dropdown>

                    <div className="name">
                        <Typography.Text style={{ width: '100px' }} ellipsis={{ tooltip: userInfo?.name }}>
                            {userInfo?.name}
                        </Typography.Text>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Header