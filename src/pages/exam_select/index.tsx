import React, { useEffect } from "react";
import styles from './index.module.scss'
import classnames from 'classnames'
import colorsData from "./color.json";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '@/store'
import {
    get_subject_tree_async,
    select_current_two_subject,
    select_subject_tree,
    set_current_two_subject
} from "@/store/slice/subject";
function ExamSelect() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const data = useAppSelector(select_subject_tree)
    const current_two_subject = useAppSelector(select_current_two_subject)
    useEffect(() => {
        dispatch(get_subject_tree_async());
    }, []);
    function handleJump() {
        if (!current_two_subject) {
            alert("请选择题目再作答");
        } else {
            navigate({
                pathname: `/exam/${current_two_subject}`,
            });
        }
    };
    function item_click(item: any) {
        if (!item.can_exam) {
            return
        }

        dispatch(set_current_two_subject(item.value))
    }
    return (
        <React.Fragment>
            <div className={styles.wrap}>
                <div className={styles.content}>
                    <div>
                        {data.map((item, index) => (
                            <React.Fragment key={item.title}>
                                <div
                                    style={{
                                        color:
                                            colorsData.colors[index % colorsData.colors.length].value,
                                    }}
                                    className={styles.title}
                                >
                                    {/* <img src={item.img} alt=""></img> */}
                                    <div>{item.title}</div>
                                </div>
                                <div className={styles.topic_section}>
                                    {item.children.map(
                                        (_item) => (
                                            <div
                                                key={_item.value}

                                                onClick={() => {
                                                    item_click(_item)
                                                }}

                                                className={classnames(styles.topic_section_content, {
                                                    topic_section_content_selected:
                                                        _item.value === current_two_subject,
                                                    topic_section_content_disabled:
                                                        _item.can_exam === false,
                                                })}
                                            >
                                                <p>{_item.title}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div className={styles.footer}>
                    <button onClick={handleJump}>开始答题</button>
                </div>
            </div>
        </React.Fragment>
    )
}


export default ExamSelect