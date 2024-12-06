import { apiRoutes } from '../config/api'
import { $api } from './index'

const getSale = async (id) => {
    const response = await $api.get(apiRoutes.SALE_GET, { params: { id } })
    return response?.data
}

const getSales = async (data) => {
    const response = await $api.get(apiRoutes.SALES_GET, { params: data })
    return response?.data
}

const getSaleProducts = async (saleId) => {
    const response = await $api.get(apiRoutes.SALES_GET_PRODUCTS, { params: { saleId } })
    return response?.data
}

export { getSale, getSales, getSaleProducts }
