import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios, { AxiosRes, ResType } from '@/utils/http'
import { RootState } from '../index';

// 单个课程类型
export type CourseType = {
    disabled: boolean;
    title: string,
    value: string,
    children: CourseType[],
    can_exam?: boolean
}
// 单个题目类型
export type TopicType = {
    dec: string,
    title: string,
    two_id: string,
    _id: string
    img: string[]
}

// 题库仓库state类型
type SubjectState = {
    loading: boolean,
    subject_tree: CourseType[],
    active_two: CourseType | null,
    topic_two_list: TopicType[],
    active_topic: TopicType | null,
    current_two_subject: string, // 当前选择的考试科目
    exam_topic_list: []  // 考试题目列表
    current_exam_topic_id: string,
    exam_list: [],   // 考试历史记录
    corret_exam_list: []  // 批改试卷 题目列表
}

const initialState = {
    loading: false,
    subject_tree: [], // 下拉框
    active_two: null, // 二级分类信息
    topic_two_list: [],
    active_topic: null,
    current_two_subject: '',
    exam_topic_list: [],
    current_exam_topic_id: '',
    exam_list: [],
    corret_exam_list: []
} as SubjectState

// 获取课程树形数据
export const get_subject_tree_async = createAsyncThunk<CourseType[], void>(
    'get/subject_tree',
    async (action, state) => {
        const res: AxiosRes<ResType<CourseType[]>> = await axios.get('/api/subject')
        return res.data.data
    }
)

// 获取题目列表
export const get_topic_two_list: any = createAsyncThunk<TopicType[], string>(
    'get/topic_two_list',
    async (action, state) => {
        const res: AxiosRes<ResType<TopicType[]>> = await axios.get(`/api/topic/${action}`)
        return res.data.data;
    }
)

// 获取考试题目
export const get_exam_async = createAsyncThunk<[], string>(
    'get/exam_topic',
    async (action, state) => {
        const res: AxiosRes<ResType<[]>> = await axios.get(`/api/topic/${action}`)
        return res.data.data
    }
)

// 获取考试记录
export const get_exam_history = createAsyncThunk<ResType, any>(
    'get/exam_history',
    async (action, state) => {
        const res = await axios.post(`/api/exam`, action)
        return res.data.data
    }
)

// 查看试卷
export const get_corret_exam_async = createAsyncThunk<[], string>(
    'get/get_corret_exam_async',
    async (action, state) => {
        const res: AxiosRes<ResType<[]>> = await axios.get(`/api/exam/${action}`)
        return res.data.data
    }
)

export const subjectSlice = createSlice({
    name: 'subject',
    initialState,
    reducers: {
        set_active_two: (state, action) => {
            state.active_two = action.payload
        },
        set_subject_active_topic: (state, action) => {
            state.active_topic = action.payload
        },
        set_current_two_subject: (state, action) => {
            state.current_two_subject = action.payload
        },
        set_current_exam_topic_id: (state, action) => {
            state.current_exam_topic_id = action.payload
        },
        set_exam_answer: (state, action) => {
            state.exam_topic_list.forEach((item: any) => {
                if (item._id === action.payload._id) {
                    item.answer = action.payload.answer
                }
            })
        },
        set_exam_topic_list: (state, action) => {
            state.exam_topic_list = action.payload
        },
        set_exam_corret: (state, action) => {
            state.exam_topic_list.forEach((item: any) => {
                if (item._id === action.payload._id) {
                    item.is_corret = action.payload.is_corret
                    item.pass = action.payload.pass
                    item.comment = action.payload.comment
                }
            })
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_subject_tree_async.fulfilled, (state, res) => {
                state.subject_tree = res.payload
            })
            .addCase(get_topic_two_list.pending, (state) => {
                state.loading = true
            })
            .addCase(get_topic_two_list.fulfilled, (state, res) => {
                state.topic_two_list = res.payload
                state.loading = false
            })
            .addCase(get_exam_async.fulfilled, (state, res: any) => {
                state.exam_topic_list = res.payload
                state.current_exam_topic_id = res.payload[0]._id
            })
            .addCase(get_exam_history.fulfilled, (state, res: any) => {
                state.exam_list = res.payload
            })
            .addCase(get_corret_exam_async.fulfilled, (state, res: any) => {
                state.exam_topic_list = res.payload.topic_list
                state.current_exam_topic_id = res.payload.topic_list[0]._id
            })
    }
})

// 获取课程树形数据
export const select_subject_tree = (state: RootState) => { return state.subject.subject_tree }
// 获取当前选择课程
export const select_active_two = (state: RootState) => { return state.subject.active_two }
// 获取题目列表
export const select_topic_two_list = (state: RootState) => { return state.subject.topic_two_list }
// 获取loading状态
export const select_subject_loading = (state: RootState) => { return state.subject.loading }
// 获取当前选择题目
export const select_active_topic = (state: RootState) => { return state.subject.active_topic }
// 当前选择的考试科目
export const select_current_two_subject = (state: RootState) => { return state.subject.current_two_subject }
// 考题列表
export const select_exam_topic_list = (state: RootState) => { return state.subject.exam_topic_list }
// 当前选中的考题
export const select_current_exam_topic = (state: RootState) => {
    return state.subject.exam_topic_list.find((item: any) => {
        return item._id === state.subject.current_exam_topic_id
    }) || {}
}
// 考试历史记录
export const select_exam_list = (state: RootState) => { return state.subject.exam_list }

export const {
    set_active_two,
    set_subject_active_topic,
    set_current_two_subject,
    set_current_exam_topic_id,
    set_exam_answer,
    set_exam_corret,
    set_exam_topic_list
} = subjectSlice.actions

export default subjectSlice.reducer