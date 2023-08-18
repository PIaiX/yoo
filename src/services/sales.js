import { apiRoutes } from '../config/api'
import { $api } from './index'

const getSale = async (id = '') => {
    const response = await $api.get(`${apiRoutes.SALE_GET}/${id}`)
    if (response) {
        return response.data
    }
}

const getSales = async () => {
    const response = await $api.get(apiRoutes.SALES_GET)
    if (response) {
        return response.data
    }
}

const getSaleProducts = async (saleId) => {
    const response = await $api.get(apiRoutes.SALES_GET_PRODUCTS, { params: { saleId } })
    if (response) {
        return response.data
    }
}

export { getSale, getSales, getSaleProducts }
