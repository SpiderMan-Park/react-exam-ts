import React, { useEffect, useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import style from './index.module.scss'
import login_desc from './assets/login_desc.png'
import login_logo from './assets/login_logo.png'
import login_title_cn from './assets/login_title_cn.png'
import login_title_en from './assets/login_title_en.png'
import axios, { AxiosResData } from '@/utils/http'
import { useNavigate } from 'react-router'
import { set_user_info, UserData } from '@/store/slice/user'
import { useAppDispatch } from '@/store'

const COUNT = 60

const LoginPage: React.FC = () => {
    const dispatch = useAppDispatch()
    const [count, set_count] = useState(0)

    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage()
    // 开启倒计时
    useEffect(() => {
        setTimeout(() => {
            if (count === 0) return
            set_count(count - 1)
        }, 1000)
    }, [count])

    //发送验证码
    const startCode = () => {
        if (count !== 0) return
        form
            .validateFields(['phone'])
            .then(() => {
                set_count(COUNT)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
    }

    const onLogin = async (value: any) => {
        const res: AxiosResData<UserData> = await axios.post('/api/user/login', value)
        const user_info = res.data.data
        dispatch(set_user_info(user_info))
        if (!user_info.has_person_info) {
            navigate('/person_info')
        } else {
            if (user_info.role === 'student') {
                navigate('/exam_select')
            }
            if(user_info.role === 'admin') {
				navigate('/corret_exam_list')
			}
        }
    }

    return (
        <div className={style.page_container}>
            {contextHolder}
            <div className={style.login_container}>
                <div className={style.login_left}>
                    <div className={style.left_title}>
                        <img src={login_desc} />
                    </div>
                </div>
                <div className={style.login_right}>
                    <div className={style.right_title}>
                        <div>
                            <img src={login_logo} />
                        </div>
                        <div className={style.title_container}>
                            <div>
                                <img src={login_title_cn} />
                            </div>
                            <div>
                                <img src={login_title_en} />
                            </div>
                        </div>
                    </div>
                    <div className={style.right_form}>
                        <Form onFinish={onLogin} size="large" labelCol={{ span: 5 }} wrapperCol={{ span: 20 }} labelAlign="left" onFinishFailed={onFinishFailed} form={form}>
                            <Form.Item
                                label="手机号"
                                name="phone"
                                rules={[
                                    { required: true, message: '请填写手机号' },
                                    { pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, 'g'), message: '请输入正确的手机号' },
                                ]}
                            >
                                <Input placeholder="请输入手机号" />
                            </Form.Item>
                            <div style={{ position: 'relative' }}>
                                <Form.Item label="验证码" name="code" rules={[{ required: true, message: '请输入验证码' }]}>
                                    <Input placeholder="请输入验证码" style={{ padding: '7px 100px 7px 11px' }} />
                                </Form.Item>
                                <div className={[style.form_code_btn, count !== 0 ? style.form_code_btn_disabled : ''].join(' ')} onClick={startCode}>
                                    {count === 0 ? '获取验证码' : `${count}秒`}
                                </div>
                            </div>
                            <div className={style.form_btn}>
                                <Button type="primary" htmlType="submit">
                                    登录
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
