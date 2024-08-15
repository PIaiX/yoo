import { apiRoutes } from '../config/api'
import { $authApi } from '.'

const getSearch = async (data) => {
    const response = await $authApi.get(apiRoutes.SEARCH_GET, { params: data })
    return response?.data
}

export { getSearch }
