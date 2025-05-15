import { apiRoutes } from '../config/api'
import api from './index'

const getBanner = async (id) => {
    const response = await api.get(apiRoutes.BANNER, { params: { id } })
    return response?.data
}

const getBanners = async () => {
    const response = await api.get(apiRoutes.BANNERS)
    return response?.data
}

const getBannerProducts = async (saleId) => {
    const response = await api.get(apiRoutes.BANNER_PRODUCTS, { params: { saleId } })
    return response?.data
}

export { getBanner, getBanners, getBannerProducts }
