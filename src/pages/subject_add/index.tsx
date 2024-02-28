import { useEffect } from 'react'
import SubjectDetail from './components/TopicDetail'
import SubjectList from './components/TopicList'
import styles from './index.module.scss'
import {
    get_subject_tree_async,
    set_subject_active_two,

} from '@/store/slice/subject'
import { useAppDispatch } from '@/store'
import { SubjectData } from '@/utils/request';
import useRenderCheck from '@/hooks/renderCheck';
import EditOrAdd from './components/EditOrAdd'
import TreeSelectCp from './components/TreeSelectCp'
import './index.scss'

function SubjectAdd() {
    const dispatch = useAppDispatch()
    useRenderCheck('suject add')

    // 获取学科列表
    useEffect(() => {
        dispatch(get_subject_tree_async()).then((res: any) => {
            dispatch(set_subject_active_two(res.payload?.[0]?.children?.[0] as SubjectData))
        })
    }, [])

    return (
        <div className={styles.wrap}>
            <TreeSelectCp />
            <div className="content">
                <div className="left">
                    <SubjectList />
                </div>
                <div className="right">
                    <EditOrAdd />
                    <SubjectDetail />
                </div>
            </div>
        </div>
    )
}

export default SubjectAdd
