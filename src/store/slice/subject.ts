import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../index';
import {
    getSubjectTree,
    getTopic2List,
    SubjectData,
    TopicData,
    getExamHistory,
    ExamData,
    getExamByIdRequest,
    ResData
} from '@/utils/request';

// 题库仓库state类型
type SubjectState = {
    loading: boolean
    // 课程树形数据
    subject_tree: SubjectData[]
    // 当前选择课程
    active_two: SubjectData
    // 题目列表
    topic_two_list: TopicData[]
    // 当前选择题目
    active_topic: TopicData
    // 当前选择的考试科目
    current_two_subject: string
    // 考试题目列表
    exam_topic_list: []
    current_exam_topic_id: string
    // 考试历史记录
    exam_list: [],
    corret_exam_list_loading: boolean
}

const initialState = {
    loading: false,
    subject_tree: [], // 下拉框
    active_two: {} as SubjectData, // 二级分类信息
    topic_two_list: [],
    active_topic: {} as TopicData,
    current_two_subject: '',
    exam_topic_list: [],
    current_exam_topic_id: '',
    exam_list: [],
    corret_exam_list: [],
    corret_exam_list_loading: false
} as SubjectState

// 获取课程树形数据
export const get_subject_tree_async = createAsyncThunk<SubjectData[], void>(
    'get/subject_tree',
    async (action, state) => {
        return await getSubjectTree()
    }
)

// 获取题目列表
export const get_topic_two_list: any = createAsyncThunk<TopicData[], string>(
    'get/topic_two_list',
    async (action, state) => {
        return await getTopic2List(action)
    }
)

// 获取考试题目
export const get_exam_async = createAsyncThunk<TopicData[], string>(
    'get/exam_topic',
    async (action, state) => {
        return await getTopic2List(action)
    }
)

// 获取考试记录
export const get_exam_history = createAsyncThunk<ResData, any>(
    'get/exam_history',
    async (action, state) => {
        return await getExamHistory(action)
    }
)

// 查看试卷
export const get_corret_exam_async = createAsyncThunk<ExamData, string>(
    'get/get_corret_exam_async',
    async (action, state) => {
        return await getExamByIdRequest(action)
    }
)

export const subjectSlice = createSlice({
    name: 'subject',
    initialState,
    reducers: {
        set_subject_active_two: (state, action) => {
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
            .addCase(get_exam_history.pending, (state, res: any) => {
                state.corret_exam_list_loading = true
            })
            .addCase(get_exam_history.fulfilled, (state, res: any) => {
                state.exam_list = res.payload
                state.corret_exam_list_loading = false
            })
            .addCase(get_corret_exam_async.fulfilled, (state, res: any) => {
                state.exam_topic_list = res.payload.topic_list
                // 这个逻辑对于阅读试卷是多余的
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

export const select_corret_exam_list_loading = (state: RootState) => {
    return state.subject.corret_exam_list_loading
}
export const {
    set_subject_active_two,
    set_subject_active_topic,
    set_current_two_subject,
    set_current_exam_topic_id,
    set_exam_answer,
    set_exam_corret,
    set_exam_topic_list
} = subjectSlice.actions

export default subjectSlice.reducer