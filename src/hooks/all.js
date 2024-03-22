import moment from 'moment'

const keyGenerator = () => '_' + Math.random().toString(36).substr(2, 9)

const isWork = (start, end) => {
    if (!start || !end) {
        return false
    }
    const startTime = moment(start, 'kk:mm')
    const endTime = moment(end, 'kk:mm')
    const isEndNextDay = endTime.isSameOrBefore(startTime)
    if (isEndNextDay) {
        endTime.add(1, 'day')
    }
    return moment().isBetween(startTime, endTime, null, '[]')
}


export { keyGenerator, isWork }
