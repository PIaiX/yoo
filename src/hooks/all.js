import moment from 'moment-timezone'

const keyGenerator = (data) => {
    let key = data.id + '_'
    if (data?.cart?.modifiers?.length > 0) {
        key += data.cart.modifiers.map(e => e.id).join('_')
    }
    if (data?.cart?.additions?.length > 0) {
        key += data.cart.additions.map(e => e.id).join('_')
    }
    return key
}
const isWork = (start, end, now) => {
    try {
        const timezone = moment.tz.guess();

        // Если now не передан, используем текущее время
        if (!now) {
            now = moment.tz();
        } else {
            now = moment.tz(now, 'HH:mm', timezone);
        }

        if (!start || !end) {
            return false;
        }
        if (end === "00:00") {
            end = "23:59";
        }

        const startTime = moment.tz(start, 'HH:mm', timezone);
        const endTime = moment.tz(end, 'HH:mm', timezone);

        if (!startTime.isValid() || !endTime.isValid()) {

            return false;
        }

        // Переводим время в UTC
        const startUtc = startTime.utc();
        const endUtc = endTime.utc();

        if (endUtc.isSameOrBefore(startUtc)) {
            endUtc.add(1, 'day');
        }

        // Текущее время в UTC
        const nowUtc = moment.tz(now, timezone).utc();

        // Проверка, находится ли текущее время в пределах рабочего времени
        return nowUtc.isBetween(startUtc, endUtc, null, '()');
    } catch (err) {
        return false;
    }
}

export { keyGenerator, isWork }
