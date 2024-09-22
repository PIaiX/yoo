import moment from 'moment-timezone'

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
    try {
        const timezone = moment.tz.guess()

        if (!now) {
            now = moment.tz()
        }
        if (!start || !end) {
            return false
        }
        if (end === "00:00") {
            end = "23:59";
        }

        const startTime = moment.tz(start, 'HH:mm', timezone).utc();
        const endTime = moment.tz(end, 'HH:mm', timezone).utc();
        const isEndNextDay = endTime.isSameOrBefore(startTime)
        if (isEndNextDay) {
            endTime.add(1, 'day')
        }
        const nowTime = moment.tz(now, 'HH:mm', timezone).utc();

        return nowTime.isBetween(startTime, endTime, null, '()');
    } catch (err) {
        return false
    }
}

export { keyGenerator, isWork }
