import { apiRoutes } from '../config/api'
import api from './index'

const createMessage = async (data) => {
    const response = await api.post(apiRoutes.MESSAGES, data)
    return response?.data
}
const editMessage = async (data) => {
    const response = await api.put(apiRoutes.MESSAGES, data)
    return response?.data
}
const viewMessages = async () => {
    const response = await api.put(apiRoutes.MESSAGES_VIEW)
    return response?.data
}
const deleteMessage = async (data) => {
    const response = await api.delete(apiRoutes.MESSAGES, { data })
    return response?.data
}
const getMessages = async (data) => {
    const response = await api.get(apiRoutes.MESSAGES, { params: data })
    return response?.data
}

export { createMessage, editMessage, viewMessages, deleteMessage, getMessages }
