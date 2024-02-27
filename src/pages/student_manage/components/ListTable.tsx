//import hooks
import React, { useEffect, } from 'react';
//import components
import { Table, Divider, Form } from 'antd';
import { useAppDispatch } from '@/store'
import { get_student_async, select_user_student_list, set_current_edit_userinfo, set_is_show_user_edit_modal } from '@/store/slice/user';
import { useSelector } from 'react-redux';
import { get_subject_tree_async } from '@/store/slice/subject';
import axios from 'axios';

const ListTable: React.FC = () => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();

    const student_list = useSelector(select_user_student_list)

    useEffect(() => {
        dispatch(get_subject_tree_async())
        dispatch(get_student_async())
    }, [])

    async function edit_click(record: any) {
        // console.log(record)
        dispatch(set_current_edit_userinfo(record))
        dispatch(set_is_show_user_edit_modal(true))
    }

    async function delete_click(record: any) {
        // delete_click
        await axios.delete(`/api/user/${record._id}`)
        dispatch(get_student_async())
    }

    // Groups?.forEach((group: { id: string | number; name: any; }) => gradeValueEnum[group.id] = {text: group.name});
    const columns = [
        {
            title: '序号',
            dataIndex: '_id',
            key: '_id',
            sorter: {
                compare: (a: any, b: any) => a!.sort! - b!.sort!,
                multiple: 3,
            },
        },
        {
            title: '花名',
            dataIndex: 'name',
            render: (dom: any, entity: any) => {
                return (
                    <a
                        onClick={() => {
                        }}
                    >
                        {dom}
                    </a>
                );
            },
        },
        {
            title: '所属课程',
            dataIndex: 'sourceId',
        },
        {
            title: '当前薪资',
            dataIndex: 'sourceSalary',
        },
        {
            title: '技术栈',
            dataIndex: 'technologyStack',
        },
        {
            title: '学历',
            dataIndex: 'educationBackground',
        },
        {
            title: '手机号码',
            dataIndex: 'phone',
        },
        {
            title: '课程权限',
            dataIndex: 'role',
        },
        {
            title: '操作',
            width: 380,
            dataIndex: 'option',
            render: (_: any, record: any) => [
                <a key="jurisdictionEdit" onClick={() => {
                    edit_click(record)
                }}>
                    编辑
                </a>,
                <Divider type="vertical" />,
                <a key="delete"
                    onClick={() => {
                        delete_click(record)
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];

    return (
        <>
            <Table
                dataSource={student_list} columns={columns}
            />
        </>
    );
};

export default ListTable;
