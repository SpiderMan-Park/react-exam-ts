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

type Data = {
    menu: MenuData[]
}

const initialState: Data = {
    menu: []
}

export const get_menu_async = createAsyncThunk<MenuData[]>(
    'get/user_menu',
    async (action, state) => {
        const res: AxiosResData<MenuData[]> = await axios.get('/api/user/menu')
        console.log(res);
        return res.data.data
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(get_menu_async.fulfilled, (state, res) => {
            state.menu = res.payload
        })
    }
})

export const select_menu = (state: RootState) => { return state.user.menu }

export const { } = userSlice.actions

export default userSlice.reducer