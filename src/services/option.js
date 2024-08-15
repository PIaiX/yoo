import { $api } from '.'
import { apiRoutes, DOMAIN } from '../config/api'

const getOptions = async () => {
    const response = await $api.get(apiRoutes.OPTIONS, DOMAIN?.length > 0 ? { params: { projectName: DOMAIN } } : null)
    return response?.data
}

export { getOptions }
