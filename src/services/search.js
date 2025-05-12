import { apiRoutes } from '../config/api'
import api from '.'

const getSearch = async (data) => {
    const response = await api.get(apiRoutes.SEARCH_GET, { params: data })
    return response?.data
}

export { getSearch }
