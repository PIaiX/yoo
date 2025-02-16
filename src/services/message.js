import {apiRoutes} from '../config/api'
import {$authApi} from './index'

const createMessage = async (data) => {
    const response = await $authApi.post(apiRoutes.MESSAGES, data)
    return response?.data
}
const editMessage = async (data) => {
    const response = await $authApi.put(apiRoutes.MESSAGES, data)
    return response?.data
}
const viewMessages = async () => {
    const response = await $authApi.put(apiRoutes.MESSAGES_VIEW)
    return response?.data
}
const deleteMessage = async (data) => {
    const response = await $authApi.delete(apiRoutes.MESSAGES, {data})
    return response?.data
}
const getMessages = async (data) => {
    const response = await $authApi.get(apiRoutes.MESSAGES, {params: data})
    return response?.data
}

export {createMessage, editMessage, viewMessages, deleteMessage, getMessages}
