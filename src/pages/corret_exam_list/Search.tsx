import { Button, Form, Input } from 'antd';
import { useAppDispatch, AppDispatch } from '@/store/index';
import styles from './index.module.scss'
import { Select } from 'antd';
import { useEffect } from 'react';
import {
    get_subject_one,
    select_subject_one,
    get_exam_history,
    set_exam_list_data
} from '@/store/slice/subject';
import { useSelector } from 'react-redux';

const judge_options = [
    { label: '是', value: true },
    { label: '否', value: false },
];

function Search() {
    const [form] = Form.useForm();
    const disptch: AppDispatch = useAppDispatch()

    useEffect(() => {
        disptch(get_subject_one())
    }, [])

    async function search_click() {
        const form_data = await form.validateFields()

        Object.keys(form_data).forEach((key: string) => {
            if (!form_data[key] && form_data[key] !== false) {
                delete form_data[key]
            }
        })

        disptch(get_exam_history({
            ...form_data
        }))

        disptch(set_exam_list_data({
            search_params: form_data,
            current_page: 1
        }))
    }

    return (
        <div className={styles.wrap}>
            <Form
                layout='inline'
                form={form}
            >
                <Form.Item label="花名" name="user_name">
                    <Input placeholder="请输入" />
                </Form.Item>
                <Form.Item label="是否阅卷" name="is_judge">
                    <Select options={judge_options} style={{ width: 130 }} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={search_click}>查询</Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Search;