import { Modal, message } from "antd";
import axios from "@/utils/http";
import { MESSAGE_DELETE_EERROR } from "./constant";

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
            axios.delete("/api/subject/two/" + id).then((res) => {
                if (res.data.code === 0) {
                    message.success(MESSAGE_DELETE_EERROR);
                    cb && cb();
                }
            });
        },
        okText: "确定",
        cancelText: "取消",
    });
}
