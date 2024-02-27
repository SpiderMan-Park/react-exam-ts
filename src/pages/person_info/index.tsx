import React, { useEffect, useMemo, useState } from 'react'
import type { FormInstance } from 'antd/es/form'
import { UploadChangeParam, UploadFile } from 'antd/es/upload'
import { DatePicker, Form, Input, Select, Button, message, UploadProps } from 'antd'
import styles from './index.module.scss'
import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '@/store'
import CustomUpload from '@/common_components/Upload'
import dayjs from 'dayjs'
import { select_user_info, get_user_info } from '@/store/slice/user'
import { getImgUrl, upload_imgs } from '@/utils'
import { userInfoPatch } from '@/utils/request';

type initUserType = {
    name: string            // 学生花名
    vChat: string          // 微信名字
    avatar?: string        // 头像
    graduation_time: Date    // 毕业时间
    money: number         // 现在薪资
    edu: string,          // 学历
    techStack: string,    // 技术栈
}

function PersonInfo() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [loading, setLoading] = useState(false)
    const [fileList, setFileList] = useState<UploadFile[]>([])

    const userInfo = useAppSelector(select_user_info)
    const isEdit = useMemo(() => !!userInfo?.has_person_info, [userInfo])
    useEffect(() => {
        if (isEdit && userInfo) {
            form.setFieldsValue({ ...userInfo, graduation_time: dayjs(userInfo.graduation_time) })
            const avatar = userInfo.avatar
            const fileName = avatar!.split('/').at(-1)!
            setFileList([
                {
                    uid: fileName,
                    name: fileName,
                    status: 'done',
                    url: getImgUrl(avatar),
                },
            ])
        }
    }, [isEdit])
    const formRef = React.useRef<FormInstance<any>>(null)
    const eduOptions: any = ['高中', '大专', '本科', '研究生']
    const [form] = Form.useForm()

    const handleImgChange: UploadProps['onChange'] = async (fileInfo: UploadChangeParam) => {
        setFileList(fileInfo.fileList.map((item) => ({ ...item, status: 'done' })))
    }

    const onFinishFailed = () => {
        if (!isEdit) {
            message.error('表单信息缺失')
        } else {
            message.error('修改失败')
        }
    }

    async function onFinish(params: initUserType) {
        try {
            setLoading(true)
            if (fileList.length) {
                // 需要上传的图片文件（如果没有则不用处理）
                const needUploadImgs = fileList.filter((file) => !file.url)
                if (needUploadImgs.length) {
                    const imgURLs = (await upload_imgs(fileList)) as string[]
                    params.avatar = imgURLs[0]
                }
            } else {
                delete params.avatar
            }
            await userInfoPatch(userInfo._id, params)
            if (!isEdit) {
                message.success('个人信息录入成功')
                if (userInfo.role === 'student') {
                    navigate('/exam_select')
                }
            } else {
                message.success('修改成功')
                if (userInfo.role === 'student') {
                    navigate('/exam_select')
                }
            }
            dispatch(get_user_info())
        } catch {
            message.error('修改失败')
        } finally {
            setLoading(false)
        }
    }
    const back = () => {
        navigate(-1)
    }

    return (
        <div className={styles.wrap}>
            <div className="info-content">
                {!isEdit ? (
                    <div className="info-title">
                        欢迎进入<span className="text-blue">请先填写个人信息</span>
                    </div>
                ) : (
                    <div className="info-title">
                        <span className="text-blue">个人中心</span>
                    </div>
                )}
                <Form
                    disabled={loading}
                    form={form}
                    labelCol={{ style: { width: 80 } }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    ref={formRef}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    labelAlign="left"
                >
                    <Form.Item label="头像" valuePropName="fileList">
                        <CustomUpload
                            fileList={fileList}
                            uploadProps={{
                                onChange: handleImgChange,
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="花名"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入花名',
                            },
                        ]}
                    >
                        <Input placeholder="请输入花名" />
                    </Form.Item>

                    <Form.Item
                        label="当前薪资"
                        name="money"
                        rules={[
                            {
                                required: true,
                                message: '请输入当前薪资',
                            },
                        ]}
                    >
                        <Input placeholder="请输入当前薪资" />
                    </Form.Item>

                    <Form.Item
                        label="技术栈"
                        name="techStack"
                        rules={[
                            {
                                required: true,
                                message: '请输入技术栈',
                            },
                        ]}
                    >
                        <Input placeholder="请输入技术栈" />
                    </Form.Item>

                    <Form.Item
                        label="学历"
                        name="edu"
                        rules={[
                            {
                                required: true,
                                message: '请选择学历',
                            },
                        ]}
                    >
                        <Select
                            placeholder="请选择学历"
                            options={eduOptions.map((item: any) => ({
                                value: item,
                                label: item,
                            }))}
                        ></Select>
                    </Form.Item>

                    <Form.Item
                        label="毕业时间"
                        name="graduation_time"
                        rules={[
                            {
                                required: true,
                                message: '请选择毕业时间',
                            },
                        ]}
                    >
                        <DatePicker placeholder="请选择毕业时间" />
                    </Form.Item>

                    <Form.Item
                        label="v"
                        name="vChat"
                        rules={[
                            {
                                required: true,
                                message: '请输入v',
                            },
                        ]}
                    >
                        <Input placeholder="请输入v" />
                    </Form.Item>

                    <Form.Item>
                        <div className="btn-container">
                            {!isEdit ? (
                                <Button type="primary" htmlType="submit" className="btn">
                                    保存信息
                                </Button>
                            ) : (
                                <>
                                    <Button type="primary" htmlType="submit" className="btn">
                                        确认修改
                                    </Button>
                                    <Button onClick={back} type="default" className="btn gray-btn">
                                        返回上级
                                    </Button>
                                </>
                            )}
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default PersonInfo