import { Button, Empty, List, message, Popconfirm, Spin } from 'antd'
import classNames from 'classnames'
import axios from '@/utils/http'
import { useAppDispatch, useAppSelector } from '@/store'
import { get_topic_two_list, select_active_topic, select_active_two, select_subject_loading, select_topic_two_list, set_subject_active_topic } from '@/store/slice/subject'

export default function TopicList() {
    const dispatch = useAppDispatch()
    const list = useAppSelector(select_topic_two_list)
    const loading = useAppSelector(select_subject_loading)
    const selectedCourse = useAppSelector(select_active_two)
    const selectedTopic: any = useAppSelector(select_active_topic)

    async function deleteTopic(id: string) {
        try {
            await axios.delete(`/api/topic/${id}`)
            message.success('删除成功!')

            // 如果当前选择的题目id和删除的id一致 则在删除成功后清空当前题目数据
            if (selectedTopic?._id === id) {
                dispatch(set_subject_active_topic(null))
            }
            dispatch(get_topic_two_list(selectedCourse!.value))
        } catch {
            message.error('删除失败!')
        }
    }

    return (
        <Spin spinning={loading}>
            {
                list.length ? (
                    <List
                        className="topic-list"
                        split={false}
                        dataSource={list}
                        rowKey={'_id'}
                        renderItem={(item: any, index) => (
                            <List.Item
                                className={classNames('topic-item', { active: selectedTopic?._id === item._id })}
                                onClick={() => dispatch(set_subject_active_topic(item))}
                                actions={[
                                    <Popconfirm
                                        title="提示"
                                        description="确定要删除此题目吗？"
                                        onConfirm={(e) => {
                                            e?.stopPropagation()
                                            deleteTopic(item._id)
                                        }}
                                        onCancel={(e) => e?.stopPropagation()}
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        <Button type="link" className={classNames('del-btn', { white: selectedTopic?._id === item._id })} danger onClick={(e) => e.stopPropagation()}>
                                            删除
                                        </Button>
                                    </Popconfirm>
                                ]
                                }
                            >
                                {index + 1}.{item.title}
                            </List.Item >
                        )}
                    />
                ) : (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)
            }
        </Spin >
    )
}