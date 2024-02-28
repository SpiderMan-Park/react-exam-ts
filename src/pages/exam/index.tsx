import styles from './index.module.scss'
import { useEffect, useState } from "react";
import { Button, message } from 'antd';
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '@/store';
import {
    get_exam_async,
    select_current_exam_topic,
    select_exam_topic_list,
    set_current_exam_topic_id,
    set_exam_answer
} from '@/store/slice/subject';
import { examPost } from '@/utils/request';
import TopicCp from "@/common_components/topic";

function Exam() {
    const dispatch = useAppDispatch()
    // 题目列表
    const topic_list: any[] = useAppSelector(select_exam_topic_list)
    // 当前选中的题目id
    const current_exam_topic: any = useAppSelector(select_current_exam_topic)
    const params: any = useParams()
    const [answer, set_answer] = useState('')
    const [can_submit, set_can_submit] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        let flag = false
        flag = topic_list.every((item) => {
            return item.answer
        })
        set_can_submit(flag)
    }, [topic_list])
    useEffect(() => {
        dispatch(get_exam_async(params.exam_id))
    }, [])

    function topic_click(item: any) {
        if (item._id !== current_exam_topic._id) {
            set_answer('')
        }
        dispatch(set_current_exam_topic_id(item._id))
    }
    function submit_answer(data: any) {
        dispatch(set_exam_answer(data))
    }
    async function submit_click() {
        await examPost({
            topic_list,
            two_id: params.exam_id
        })
        await message.success('交卷成功!')
        navigate('/exam_history')
    }
    return (
        <div className={styles.exam}>
            <div className={styles.exam_left}>
                <div className={styles.title}> 考题列表</div>
                <div className={styles.exam_left_content}></div>
                {
                    topic_list.map((item, index) => {
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
                                <div
                                    className={`${styles.circle}  ${item.answer ? styles.alreadykeep : ""}`}
                                ></div>
                            </div>
                        );
                    })
                }
            </div>

            <div className={styles.exam_right}>
                <TopicCp
                    type="exam"
                    topic={current_exam_topic}
                    answer_cb={submit_answer}
                />
                <Button
                    type="primary"
                    className={styles.summitbtn}
                    disabled={!can_submit}
                    onClick={submit_click}
                >
                    点击交卷
                </Button>
            </div>
        </div>
    )
}

export default Exam