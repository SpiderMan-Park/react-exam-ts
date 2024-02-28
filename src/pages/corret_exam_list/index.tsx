import { useEffect } from 'react'
import { Table, Pagination } from 'antd';
import { useAppSelector, useAppDispatch } from '@/store';
import { get_exam_history, select_corret_exam_list_loading, select_exam_history_data, set_exam_list_data } from '../../store/slice/subject';
import { Tag, Space, Badge } from 'antd'
import { useNavigate } from 'react-router';
import dayjs from 'dayjs'
import Search from './Search'
import styles from './index.module.scss'

const PAGE_COUNT = 8;
function CorretExamList() {
    let exam_list_data = useAppSelector(select_exam_history_data)
    const loading = useAppSelector(select_corret_exam_list_loading)
    let exam_list = exam_list_data.list.map((item: any) => {
        return {
            ...item,
            key: item._id
        }
    })

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(get_exam_history({}))
    }, [])

    function read_exam_click(item: any) {
        console.log('item', item)

        if (item.is_judge) {
            const exam_id = item._id
            navigate(`/read_exam/${exam_id}`)
        } else {
            const exam_id = item._id
            navigate(`/corret_exam/${exam_id}`)
        }
    }

    const tableColumns = [{
        title: '试卷名称',
        dataIndex: 'subject_name',
        key: 'subject_name',
    }, {
        title: '学生姓名',
        dataIndex: 'user_name',
        key: 'user_name',
    }, {
        title: '考试时间',
        dataIndex: 'created',
        key: 'created',
        render: (_: any, record: any) => {
            return <span>{dayjs(record.created).format('YYYY MM-DD hh:mm:ss')}</span>
        }
    }, {
        title: '是否阅卷',
        dataIndex: 'is_judge',
        key: 'is_judge',
        render: (status: boolean) => {
            const statusObj = !status ? {
                status: 'default',
                text: "未阅卷"
            } : {
                status: 'error',
                text: "已阅卷"
            }
            return (
                <Space>
                    <Badge status={statusObj.status as "default" | "error" | "success" | "processing" | "warning" | undefined} />
                    {statusObj.text}
                </Space>
            )
        }
    }, {
        title: '操作',
        dataIndex: '',
        key: 'x',
        render: (row: any, record: any) => {
            return (
                <Tag color={record.is_judge ? 'blue' : 'red'} onClick={() => {
                    read_exam_click(record)
                }} style={{ cursor: 'pointer' }}>
                    {record.is_judge ? "查看" : "阅卷"}
                </Tag>
            )
        },
    }]
    function page_change(count: number) {
        dispatch(set_exam_list_data({
            current_page: count
        }))

        dispatch(get_exam_history({
            ...exam_list_data.search_params,
            skip: PAGE_COUNT * (count - 1)
        }))
    }

    return (
        <div className={styles["exam-history"]}>
            <div className={styles.search_wrap}>
                <Search />
            </div>
            <div className='table-list-wrapper'>
                <Table loading={loading} dataSource={exam_list} columns={tableColumns} pagination={false} />
                <Pagination
                    className={styles.pagenation}
                    pageSize={PAGE_COUNT}
                    current={exam_list_data.current_page}
                    total={exam_list_data.count}
                    onChange={page_change}
                />
            </div>
        </div>
    )
}

export default CorretExamList