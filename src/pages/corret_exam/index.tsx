import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Button, Divider, Input } from 'antd';
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '@/store';
import {
    select_exam_topic_list,
    set_current_exam_topic_id,
    select_current_exam_topic,
    get_corret_exam_async,
    set_exam_corret
} from '@/store/slice/subject';
import { corretExamPost } from '@/utils/request';
import TopicCp from '@/common_components/topic/index';
function CorretExam() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [corret, set_corret] = useState('')
    const [can_submit, set_can_submit] = useState(false)
    const params = useParams()
    // 题目列表
    const topic_list: any[] = useAppSelector(select_exam_topic_list)
    // 当前选中的题目对象
    const current_exam_topic: any = useAppSelector(select_current_exam_topic)
    useEffect(() => {
        let flag = false
        flag = topic_list.every((item) => {
            return item.is_corret
        })

        set_can_submit(flag)
    }, [topic_list])
    useEffect(() => {
        const exam_id: any = params.exam_id
        dispatch(get_corret_exam_async(exam_id))
    }, [])

    function topic_click(item: any) {
        dispatch(set_current_exam_topic_id(item._id))
    }
    function pass(data: any) {
        dispatch(set_exam_corret(data))
    }
    function no_pass(data: any) {
        dispatch(set_exam_corret(data))
    }
    async function submit_click() {
        await corretExamPost(params.exam_id as string, {
            topic_list
        })
        navigate('/corret_exam_list')
    }

    function textarea_change(e: any) {
        set_corret(e.target.value)
    }
    return (
        <div>

            <div className={styles.exam}>
                <div className={styles.exam_left}>
                    <div className={styles.title}> 考题列表</div>
                    <div className={styles.exam_left_content}></div>
                    {topic_list.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className={`${styles.questiontab}`}
                                onClick={() => {
                                    topic_click(item)
                                }}
                            >
                                <div
                                    className={`${styles.question} ${current_exam_topic._id === item._id ? styles.alreadyselect : ""
                                        }`}
                                >
                                    {index + 1}. {item.title}
                                </div>
                                {
                                    item.is_corret && item.pass ?
                                        (<div
                                            className={`${styles.circle} ${styles.alreadykeep}`}
                                        ></div>) : null
                                }
                                {
                                    item.is_corret && !item.pass ?
                                        (<div
                                            className={`${styles.wrong} ${styles.no_pass}`}
                                        ></div>) : null
                                }
                            </div>
                        );
                    })}
                </div>

                <div className={styles.exam_right}>
                    <TopicCp
                        type='corret'
                        topic={current_exam_topic}
                        pass_cb={pass}
                        no_pass_cb={no_pass}
                    />
                    <Button
                        type="primary"
                        className={styles.summitbtn}
                        disabled={!can_submit}
                        onClick={submit_click}
                    >
                        提交阅卷
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CorretExam