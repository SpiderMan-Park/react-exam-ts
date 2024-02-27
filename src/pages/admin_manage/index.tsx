import React, { useEffect, } from 'react';
//import components
import { Table, Divider, Form, Input, Button } from 'antd';
import { useAppDispatch } from '@/store'
import styles from './index.module.scss'
import { useSelector } from 'react-redux';
import { get_subject_tree_async } from '@/store/slice/subject';
import axios from 'axios';
import { get_admin_async, select_user_admin_list } from '@/store/slice/user';
import { useState } from 'react';

function AdminManage() {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const admin_list = useSelector(select_user_admin_list)

    const [phone, set_phone] = useState('')

    useEffect(() => {
        dispatch(get_admin_async())
    }, [])

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
    ];

    function input_change(e: any) {
        set_phone(e.target.value)
    }

    async function add_admin() {
        if (!phone) {
            return
        }
        await axios.post('/api/user/add_admin', {
            phone
        })

        dispatch(get_admin_async())
    }
    return (
        <div>
            <Input
                value={phone}
                onChange={input_change}
                width="200px"
                className={styles.input}
                placeholder='请输入phone'
            />
            <Button type='primary' onClick={add_admin}>新增</Button>
            <Table
                dataSource={admin_list} columns={columns}
            />
        </div>
    )
}

export default AdminManage