import { useEffect } from 'react'
import { Table } from 'antd'
import styles from './index.module.scss'
import { useAppSelector, useAppDispatch } from '@/store';
import { select_exam_list, get_exam_history, select_corret_exam_list_loading } from '@/store/slice/subject';
import { Tag, Space, Badge } from 'antd'
import { useNavigate } from 'react-router';


function CorretExamList() {
    let exam_list: any = useAppSelector(select_exam_list)

    const loading = useAppSelector(select_corret_exam_list_loading)

    exam_list = exam_list.map((item: any) => {
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
        title: '考试时间',
        dataIndex: 'created',
        key: 'created',
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
        render: (row: any) => {
            return (
                <Tag color={row.is_judge ? 'blue' : 'red'} onClick={() => {
                    read_exam_click(row)
                }} style={{ cursor: 'pointer' }}>
                    {row.is_judge ? "查看" : "阅卷"}
                </Tag>
            )
        },
    }]

    return (
        <div className={styles["exam-history"]}>
            <div className='table-list-wrapper'>
                <Table loading={loading} dataSource={exam_list} columns={tableColumns} pagination={false} />
            </div>
        </div>
    )
}

export default CorretExamList