import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { useAppSelector } from '@/store/index';
import { select_is_show_user_edit_modal, set_is_show_user_edit_modal, select_current_edit_userinfo, set_edit_user_topic_role, get_student_async } from '@/store/slice/user';
import { useAppDispatch } from '@/store';
import { select_subject_tree } from '@/store/slice/subject';
import { Checkbox } from 'antd';
import axios from '@/utils/http'

function EditModal() {
    const dispatch = useAppDispatch()
    const is_show = useAppSelector(select_is_show_user_edit_modal)

    const subject_tree = useAppSelector(select_subject_tree)
    const edit_userinfo = useAppSelector(select_current_edit_userinfo)

    let checkbox_options: any = []
    subject_tree.forEach((item) => {
        item.children.forEach((child_item) => {
            checkbox_options.push({
                label: child_item.title,
                value: child_item.value
            })
        })
    })

    async function handleOk() {
        await axios.patch(`/api/user/${edit_userinfo._id}`, {
            topic_role: edit_userinfo.topic_role
        })
        dispatch(set_is_show_user_edit_modal(false))
        dispatch(get_student_async())
    }
    function onCancel() {
        dispatch(set_is_show_user_edit_modal(false))
    }

    function onChange(value: any) {
        
        dispatch(set_edit_user_topic_role(value))
    }

    return (
        <Modal
            title="编辑课程权限"
            open={is_show}
            onOk={handleOk}
            onCancel={onCancel}>
            <Checkbox.Group
                options={checkbox_options}
                onChange={onChange}
                value={edit_userinfo.topic_role}
            />
        </Modal>
    )
}

export default EditModal;