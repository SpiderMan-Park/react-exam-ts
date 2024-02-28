import { Button, Form, Input } from 'antd';
import { useAppDispatch, AppDispatch } from '@/store/index';
import {
    get_student_async,
    set_student_list_current_page,
    set_student_list_search_params
} from '@/store/slice/user';


function Search() {
    const [form] = Form.useForm();
    const disptch: AppDispatch = useAppDispatch()

    async function search_click() {
        const form_data = await form.validateFields()
        // console.log(form_data)

        Object.keys(form_data).forEach((key: string) => {
            if (!form_data[key]) {
                delete form_data[key]
            }
        })

        disptch(set_student_list_search_params(form_data))
        disptch(set_student_list_current_page(1))
        // await getStudentListRequest(form_data)
        disptch(get_student_async(form_data))
    }

    return (
        <Form
            layout='inline'
            form={form}
        >
            <Form.Item label="花名" name="name">
                <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="dianhua" name="phone">
                <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" onClick={search_click}>查询</Button>
            </Form.Item>
        </Form>
    )
}

export default Search;