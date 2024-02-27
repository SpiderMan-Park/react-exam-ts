import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosResData } from '@/utils/http'
import axios from '@/utils/http'
import { RootState } from '../index'

export type MenuData = {
    hasMenu: boolean,
    key: string,
    label: string,
    path: string
}

export type UserData = {
    name: string,
    vChat: string,
    phone: string,
    avatar: string,
    graduation_time: string,
    money: number,
    role: string,
    has_person_info: boolean,
    deu: string,
    techStack: string,
    topic_role: [],
    _id: string
}

type Data = {
    menu: MenuData[],
    user_info: Partial<UserData>,
    student_list: UserData[]
    is_show_user_edit_modal: boolean
    current_edit_userinfo: UserData,
    admin_list: UserData[]
}

const initialState: Data = {
    menu: [],
    user_info: {},
    student_list: [],
    is_show_user_edit_modal: false,
    current_edit_userinfo: {} as UserData,
    admin_list: []
}

export const get_menu_async = createAsyncThunk<MenuData[]>(
    'get/user_menu',
    async (action, state) => {
        const res: AxiosResData<MenuData[]> = await axios.get('/api/user/menu')
        return res.data.data
    }
)

export const get_user_info = createAsyncThunk<UserData>(
    'get/user_info',
    async (action, state) => {
        const res: AxiosResData<UserData> = await axios.get('/api/user')
        return res.data.data
    }
)

export const get_student_async = createAsyncThunk<any>(
    'get/user_student',
    async (action, state) => {
        const res: AxiosResData<[]> = await axios.get('/api/user/student')
        return res.data.data
    }
)

export const get_admin_async = createAsyncThunk<any>(
    'get/user_admin',
    async (action, state) => {
        const res: AxiosResData<[]> = await axios.get('/api/user/admin')
        return res.data.data
    }
)

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        set_user_info: (state, action) => {
            state.user_info = action.payload
        },
        set_is_show_user_edit_modal: (state, aciton) => {
            state.is_show_user_edit_modal = aciton.payload
        },
        set_current_edit_userinfo: (state, aciton) => {
            state.current_edit_userinfo = aciton.payload
        },
        set_edit_user_topic_role: (state, aciton) => {
            state.current_edit_userinfo.topic_role = aciton.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_menu_async.fulfilled, (state, res) => {
                state.menu = res.payload
            })
            .addCase(get_user_info.fulfilled, (state, res) => {
                state.user_info = res.payload
            })
            .addCase(get_student_async.fulfilled, (state, res) => {
                state.student_list = res.payload
            })
            .addCase(get_admin_async.fulfilled, (state, res) => {
                state.admin_list = res.payload
            })
    }
})

export const select_menu = (state: RootState) => { return state.user.menu }

export const select_user_info = (state: RootState) => { return state.user.user_info }

export const select_user_student_list = (state: RootState) => {
    return state.user.student_list
}

export const select_is_show_user_edit_modal = (state: RootState) => {
    return state.user.is_show_user_edit_modal
}

export const select_current_edit_userinfo = (state: RootState) => {
    return state.user.current_edit_userinfo
}
export const select_user_admin_list = (state: RootState) => {
    return state.user.admin_list
}

export const {
    set_user_info,
    set_is_show_user_edit_modal,
    set_current_edit_userinfo,
    set_edit_user_topic_role
} = userSlice.actions

export default userSlice.reducer