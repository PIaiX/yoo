import {apiRoutes} from '../config/api'
import {$authApi} from './index'

const createOrder = async (data) => {
    const response = await $authApi.post(apiRoutes.ORDER_CREATE, data)
    return response
}
const getDelivery = async (data) => {
    const response = await $authApi.get(apiRoutes.ORDER_DELIVERY, {params: data})
    return response?.data
}

export {createOrder, getDelivery}
