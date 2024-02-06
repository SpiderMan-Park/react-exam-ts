import { Button, Form, Input, message } from 'antd'
import { UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload'
import { useEffect, useState } from 'react'
import { upload_imgs } from '@/utils'
import axios from '@/utils/http'
import CustomUpload from '@/common_components/Upload'
import { useAppDispatch, useAppSelector } from '@/store'
import { get_topic_two_list, select_active_topic, select_active_two, set_active_two, set_subject_active_topic, TopicType } from '@/store/slice/subject'

export default function TopicDetail() {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)
    const [fileList, setFileList] = useState<UploadFile[]>([])

    const selectedCourse = useAppSelector(select_active_two)
    const selectedTopic = useAppSelector(select_active_topic)

    const [form] = Form.useForm()

    // 组件卸载时把当前选择的数据删除
    useEffect(() => {
        return () => {
            dispatch(set_active_two(null))
            dispatch(set_subject_active_topic(null))
        }
    }, [])
    useEffect(() => {
        if (!selectedTopic) {
            reset()
        } else {
            form.setFieldsValue(selectedTopic)
            if (selectedTopic.img?.length) {
                setFileList(
                    selectedTopic.img.map((url) => {
                        const fileName = url.split('/').at(-1)!
                        return {
                            uid: fileName,
                            name: fileName,
                            status: 'done',
                            url: '//' + url,
                        }
                    })
                )
            } else {
                setFileList([])
            }
        }
    }, [selectedTopic?._id])
    // 重置表单
    const reset = () => {
        form.resetFields()
        setFileList([])
    }
    async function submit(data: TopicType) {

        setLoading(true)
        if (fileList.length) {
            // 需要上传的图片文件（如果没有则不用处理）
            const needUploadImgs = fileList.filter((file) => !file.url)
            if (needUploadImgs.length) {
                const imgURLs = (await upload_imgs(fileList)) as string[]
                data.img = imgURLs
            }
        } else {
            data.img = []
        }
        try {
            if (selectedTopic) {
                // 修改数据
                await axios.patch(`/api/topic/${selectedTopic._id}`, {
                    title: data.title,
                    dec: data.dec,
                    img: data.img
                })
            } else {
                // 新增数据
                await axios.post(`/api/topic`, { ...data, two_id: selectedCourse!.value })
                reset()
            }
            dispatch(get_topic_two_list(selectedCourse!.value))
            message.success('操作成功')
        } catch {
            message.error('操作失败')
        } finally {
            setLoading(false)
        }
    }
    const handleImgChange: UploadProps['onChange'] = async (fileInfo: UploadChangeParam) => {
        setFileList(fileInfo.fileList.map((item) => ({ ...item, status: 'done' })))
    }
    return (
        <Form
            form={form}
            name="subject-detail-form"
            labelCol={{ span: 2 }}
            autoComplete="off"
            scrollToFirstError
            onFinish={submit}
        >
            <Form.Item<TopicType>
                label="题干"
                name="title"
                rules={[{ required: true, message: '题干必填' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item<TopicType> label="描述" name="dec">
                <Input.TextArea />
            </Form.Item>
            <Form.Item<TopicType> label="图片" name="img">
                <CustomUpload
                    fileList={fileList}
                    uploadProps={{
                        onChange: handleImgChange,
                    }}
                />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 2 }}>
                {/* disabled 1.提交时防止重复提交 2.没有课程id保存数据出错 */}
                <Button disabled={loading || !selectedCourse?.value} type="primary" htmlType="submit">
                    保存题目
                </Button>
            </Form.Item>
        </Form >
    )
}
