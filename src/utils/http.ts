import axios from 'axios'
import EventBus from './event'

const instance = axios.create({

})

instance.interceptors.response.use(function (response) {
    if (response.status === 200) {
        if (response.data.code === 401) {
            EventBus.emit('global_not_login', response.data.msg)
            return Promise.reject('没有登录状态')
        }
    } else {
        // EventBus.emit('global_error_tips', response.data.message)
    }

    return response;

}, function (error) {
    EventBus.emit('global_error_tips', error.response.data.message)
    return Promise.reject(error);
});

export type AxiosRes<T = ResType> = {
    config: Object,
    data: T,
    headers: any,
    request: any,
    status: number,
    statusText: string
}

export type ResType<T = any> = {
    code: number,
    msg: string,
    data: T
}

export type AxiosResData<T = any> = AxiosRes<ResType<T>>

export default instance