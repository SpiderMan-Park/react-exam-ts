import { Modal, Form, Select, Input, message } from "antd";
import { useState, useEffect } from "react";
import axios from "@/utils/http";
import styles from "./course.module.scss";
import { subjectAddPost } from '@/utils/request';
interface CourseAddProps {
    children: React.ReactElement;
    handleSuccess?: () => void;
    handleOk?: () => void;
    handleCancel?: () => void;
}

type Course = {
    name: string;
    key: string;
};

export default function CourseAdd(props: CourseAddProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [option, setOption] = useState<Course[]>([]);
    const [formRef] = Form.useForm();
    const _handleOpen = () => {
        setIsModalOpen(true);
        props.handleOk && props.handleOk();
    };
    const handleOk = () => {
        setSubmitLoading(true);
        formRef
            .validateFields()
            .then(async (formData) => {
                // [x] 课程新增 请求
                await subjectAddPost(formData)
                props.handleSuccess && props.handleSuccess();
                setIsModalOpen(false);
            })
            .catch(console.error)
            .finally(() => {
                setSubmitLoading(false);
            });
        return;
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        props.handleCancel && props.handleCancel();
    };
    const withOpen = (node: React.ReactElement) => {
        return <span onClick={_handleOpen}>{node}</span>;
    };
    const getData = () => {
        setLoading(true);
        setTimeout(() => {
            // [x] 获取课程类别字典 请求
            axios
                .get("/api/subject/one")
                .then((res) => {
                    return res.data.data;
                })
                .then(setOption);
            setLoading(false);
        }, 1);
    };
    useEffect(() => {
        if (isModalOpen) {
            getData();
            formRef.resetFields();
        }
    }, [isModalOpen]);
    return (
        <>
            {withOpen(props.children)}
            <Modal
                confirmLoading={submitLoading}
                className={styles.modal}
                title="新增课程"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}>
                <Form form={formRef}>
                    <Form.Item
                        name="one_key"
                        label="课程类别"
                        rules={[{ required: true, message: "请选择课程类别！" }]}>
                        <Select
                            fieldNames={{ label: "name", value: "key" }}
                            aria-label="name"
                            loading={loading}
                            options={option}></Select>
                    </Form.Item>
                    <Form.Item
                        name={"two_name"}
                        label="课程名称"
                        rules={[{ required: true, message: "请填写课程名称！" }]}>
                        <Input></Input>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
