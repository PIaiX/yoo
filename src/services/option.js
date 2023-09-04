import { $api } from '.'
import { apiRoutes, DOMAIN } from '../config/api'

const getOptions = async () => {
    const response = await $api.get(apiRoutes.OPTIONS, { params: { projectName: DOMAIN } })
    return response?.data
}

export { getOptions }
