import moment from 'moment'

const keyGenerator = (data) => {
    let key = data.id + '_'
    if (data?.cart?.data?.modifiers?.length > 0) {
        key += data.cart.data.modifiers.map(e => e.id).join('_')
    }
    if (data?.cart?.data?.additions?.length > 0) {
        key += data.cart.data.additions.map(e => e.id).join('_')
    }
    return key
}
const isWork = (start, end, now) => {
    if (!start || !end) {
        return false
    }
    // const startTime = moment(start, 'kk:mm')
    // const endTime = moment(end, 'kk:mm')
    // const isEndNextDay = endTime.isSameOrBefore(startTime)
    // if (isEndNextDay) {
    //     endTime.add(1, 'day')
    // }
    const startTime = moment(start, 'kk:mm')
    const endTime = moment(end, 'kk:mm')
    const isEndNextDay = endTime.isSameOrBefore(startTime)
    if (isEndNextDay) {
        endTime.add(1, 'day')
    }

    return moment(now).isBetween(startTime, endTime, null, '[]')
}


export { keyGenerator, isWork }
