import { Modal } from "antd";
import { subject2Delete } from '@/utils/request';

/** 课程 */
export interface Course {
    title: string;
    value: string;
}
export type CourseList = Course[];
export type CourseRequestResult = Course & {
    children?: CourseRequestResult[];
};
export type TransformCourse = Course & {
    parent?: string;
    children?: TransformCourse[];
};
export function isDelete(data: CourseRequestResult) {
    return !data.children;
}
export function handleTransformSub(
    data: CourseRequestResult[],
    parent: string,
): TransformCourse[] {
    return data.map((item) => {
        return {
            ...item,
            parent,
        };
    });
}
export function handleTransform(
    data: CourseRequestResult[],
): TransformCourse[] {
    let d = JSON.parse(JSON.stringify(data));
    return d.map((item: any) => {
        if (item.children) {
            item.children = handleTransformSub(item.children, item.title);
        }
        return item;
    });
}

export function handleDelete(
    id: string,
    name: string,
    cb?: (data?: any) => void,
) {
    Modal.confirm({
        type: "error",
        content: `是否删除：${name}？`,
        title: "系统提醒！",
        onOk() {
            // [x] 课程删除 请求
            subject2Delete(id).then((res) => {
                cb && cb();
            });
        },
        okText: "确定",
        cancelText: "取消",
    });
}
