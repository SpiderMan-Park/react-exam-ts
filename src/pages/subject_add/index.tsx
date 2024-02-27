import styles from './index.module.scss'
import './index.scss'
import { TreeSelect, Button, Tag } from 'antd';
import { ReactNode, useEffect } from 'react';
import {
    get_subject_tree_async,
    get_topic_two_list,
    select_active_topic,
    select_active_two,
    select_subject_tree,
    set_subject_active_two,
    set_subject_active_topic
} from '@/store/slice/subject';
import TopicDetail from './components/TopicDetail';
import TopicList from './components/TopicList';
import { useAppDispatch, useAppSelector } from '@/store';
import { SubjectData } from '@/utils/request';

// 禁用含有children字段的项
const disableHasChildrenItem = (items: SubjectData[]) => {
    const _items = JSON.parse(JSON.stringify(items))
    return _items.map((item: SubjectData) => {
        if (item.children?.length > 0) {
            item.disabled = true
            item.children = disableHasChildrenItem(item.children)
        }
        return item
    })
}

function SubjectAdd() {
    const dispatch = useAppDispatch()
    const coursesList = useAppSelector(select_subject_tree)
    const selectedCourse: any = useAppSelector(select_active_two)
    const selectedTopic = useAppSelector(select_active_topic)

    const courseListMemo = coursesList.length ? disableHasChildrenItem(coursesList) : []
    // 获取学科列表
    useEffect(() => {
        dispatch(get_subject_tree_async()).then((res: any) => {
            // console.log('resss', res)
            dispatch(set_subject_active_two(res.payload?.[0]?.children?.[0] as SubjectData))
        })
    }, [])
    // 获取题目列表
    useEffect(() => {
        if (!selectedCourse?.value) return
        dispatch(get_topic_two_list(selectedCourse.value))
    }, [selectedCourse?.value])

    const onChange = (newValue: string, nameArr: ReactNode[]) => {
        dispatch(set_subject_active_topic(null))
        dispatch(set_subject_active_two({
            title: nameArr[0],
            value: newValue
        }))
    };
    // 新增题目
    const addTopic = () => dispatch(set_subject_active_topic(null))

    return (
        <div className={styles.wrap}>
            <div className='header'>
                <p className='header_title'>
                    {selectedCourse?.title}
                </p>
                <div className='header_select'>
                    <TreeSelect
                        popupClassName={'subject-add-tree-select'}
                        style={{ width: 320 }}
                        value={selectedCourse?.value}
                        treeData={courseListMemo}
                        treeDefaultExpandAll
                        onChange={onChange}
                    />
                    <Button type="primary" onClick={addTopic}>新增题目</Button>
                </div>
            </div>
            <div className='content'>
                <div className='left'>
                    <TopicList />
                </div>
                <div className='right'>
                    <p className="title">题目详情{selectedTopic ? <Tag color="orange">编辑</Tag> : <Tag color="blue">新增</Tag>}</p>
                    <TopicDetail />
                </div>
            </div>
        </div>
    )
}

export default SubjectAdd