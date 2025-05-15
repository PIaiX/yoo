import api from '.'
import { apiRoutes } from '../config/api'

const isPromo = async (data) => {
    const response = await api.post(apiRoutes.GET_PROMO, data)
    return response?.data
}

export { isPromo }
