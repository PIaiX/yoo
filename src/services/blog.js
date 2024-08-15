import { apiRoutes } from '../config/api'
import { $api } from './index'

const getBlog = async (id) => {
    const response = await $api.get(apiRoutes.BLOG, { params: { id } })
    return response?.data
}

const getBlogs = async () => {
    const response = await $api.get(apiRoutes.BLOGS)
    return response?.data
}

export { getBlog, getBlogs }
