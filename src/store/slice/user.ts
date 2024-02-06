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
    user_info: Partial<UserData>
}

const initialState: Data = {
    menu: [],
    user_info: {}
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

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        set_user_info: (state, action) => {
            state.user_info = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_menu_async.fulfilled, (state, res) => {
                state.menu = res.payload
            })
            .addCase(get_user_info.fulfilled, (state, res) => {
                state.user_info = res.payload
            })
    }
})

export const select_menu = (state: RootState) => { return state.user.menu }

export const select_user_info = (state: RootState) => { return state.user.user_info }

export const { set_user_info } = userSlice.actions

export default userSlice.reducer