import { useEffect } from "react";
import styles from "./index.module.scss";
import { Tag } from 'antd';
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '@/store';
import { get_corret_exam_async, select_exam_topic_list, set_exam_topic_list } from "@/store/slice/subject";

function ReadExam() {
    const dispatch = useAppDispatch()
    const params = useParams()
    const topic_list: any[] = useAppSelector(select_exam_topic_list)
    useEffect(() => {
        const exam_id: any = params.exam_id
        dispatch(get_corret_exam_async(exam_id))

        return () => {
            dispatch(set_exam_topic_list([]))
        }
    }, [])
    return (
        <div>
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
                                >
                                    <div
                                        className={`${styles.question}`}
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
                        })
                    }
                </div>

                <div className={styles.exam_right}>
                    {
                        topic_list.map((item: any, index) => {
                            return (
                                <div className={styles.item_wrap}>
                                    <div className={styles.exam_right_marigin}>
                                        <div className={styles.exam_right_top}>
                                            <div className={`${styles.title} ${styles.rightTitle} ${styles.title_write}`}>
                                                题目{index + 1}
                                                <span className={styles.span_tag}>
                                                    {
                                                        item.pass ?
                                                            (
                                                                <Tag color="green">通过</Tag>
                                                            ) : (
                                                                <Tag color="red">不通过</Tag>
                                                            )
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <p className={styles.exam_right_question}>
                                            {`${item.title}`}

                                        </p>
                                        <p className={`${styles.title} ${styles.rightTitle} `}>详细描述</p>
                                        <div className={styles.exam_right_pic}>
                                            {item.dec}
                                        </div>
                                        <div className={`${styles.title} `}>学生答案：</div>
                                        <div className={`${styles.answer}`}>
                                            {item.answer}
                                        </div>
                                    </div>
                                    <div className={styles.exam_right_marigin}>

                                        <div className={`${styles.title} ${styles.rightTitle} `}>
                                            批阅
                                        </div>
                                        <div className={`${styles.corret}`}>
                                            {item.comment}
                                        </div>
                                    </div>

                                </div>
                            )
                        })
                    }

                </div>
            </div>
        </div>
    )
}

export default ReadExam