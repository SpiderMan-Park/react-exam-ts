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
    function pass() {

        dispatch(set_exam_corret({
            _id: current_exam_topic._id,
            pass: true,
            is_corret: true,
            comment: corret
        }))
        set_corret('')
    }
    function no_pass() {
        dispatch(set_exam_corret({
            _id: current_exam_topic._id,
            pass: false,
            is_corret: true,
            comment: corret
        }))
        set_corret('')
    }
    async function submit_click() {
        await corretExamPost(params.exam_id as string, {
            topic_list
        })
        navigate('/exam_history')
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
                                {/* <div
                                    className={`${styles.circle}  ${item.answer ? styles.alreadykeep : ""
                                        }`}
                                ></div> */}

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
                    <div className={styles.exam_right_marigin}>
                        <div className={styles.exam_right_top}>
                            <div className={`${styles.title} ${styles.rightTitle} `}>
                                题目详情
                            </div>
                        </div>
                        <p className={styles.exam_right_question}>
                            {`问题: ${current_exam_topic.title}`}
                        </p>
                        <p className={styles.exam_right_desc}>题目表述：</p>
                        <div className={styles.exam_right_pic}>
                            {current_exam_topic.dec}
                        </div>
                        <div className={`${styles.title}`}>答案：</div>
                        <Input.TextArea
                            value={current_exam_topic.answer}
                            rows={4}
                            placeholder="请作答"
                            className={styles.customInput}
                            disabled
                        />
                    </div>

                    <Divider />
                    <div className={styles.exam_right_marigin}>

                        <div className={`${styles.title} ${styles.rightTitle} `}>
                            我的批阅
                        </div>
                        <Input.TextArea
                            value={corret || current_exam_topic.comment}
                            rows={4}
                            placeholder="请作答"
                            className={styles.customInput}
                            onChange={textarea_change}
                        />
                        <div className={styles.exam_right_btn}>
                            <Button
                                type="primary"
                                className={styles.keepbtn}
                                onClick={pass}
                            >
                                通过
                            </Button>
                            <Button
                                type="primary"
                                className={styles.keepbtn}
                                onClick={no_pass}
                            >
                                不通过
                            </Button>
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
            </div>
        </div>
    )
}

export default CorretExam