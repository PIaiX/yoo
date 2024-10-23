import axios from 'axios'
import { DADATA_URL_ADDRESS, DADATA_URL_STREET, DADATA_TOKEN } from '../config/api'

const getDadataStreets = async ({ query, city, locations }) => {

    let locationsData = locations || []
    if (city && city.length > 0) {
        city.forEach(e => locationsData.push({ city: e.toLowerCase() }))
    }

    return await axios.post(
        DADATA_URL_STREET,
        JSON.stringify({
            query,
            locations: locationsData,
            "from_bound": { "value": "city" },
            "to_bound": { "value": "settlement" },
            "restrict_value": true
            // from_bound: {value: 'street'},
            // to_bound: {value: 'house'},
            // locations: [
            //     {city: 'казань'},
            //     {settlement: 'куюки'},
            //     {settlement: 'высокая гора'},
            //     {settlement: 'кульсеитово'},
            //     {settlement: 'семиозерка'},
            //     {settlement: 'озерный'},
            //     {settlement: 'усады'},
            //     {settlement: 'песчаные ковали'},
            //     {settlement: 'поселок габишебо'},
            //     {settlement: 'боровое матюшино'},
            //     {settlement: 'петровский'},
            //     {settlement: 'вороновка'},
            //     {settlement: 'юдино'},
            //     {settlement: 'осиново'},
            //     {settlement: 'кощаково'},
            //     {settlement: 'званка'},
            //     {settlement: 'кадышево'},
            //     {settlement: 'новые салмачи'},
            //     {settlement: 'малые кабаны'},
            //     {settlement: 'малые дербышки'},
            //     {settlement: 'большие кабаны'},
            //     {settlement: 'большие дербышки'},
            // ],
            // restrict_value: true,
            // ,
            // restrict_value: true,
        }),
        {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Token ' + DADATA_TOKEN,
            },
        }
    )
}
const getDadataAddress = async (fiasId) => {
    return await axios.post(DADATA_URL_ADDRESS, JSON.stringify({ query: fiasId }), {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Token ' + DADATA_TOKEN,
        },
    })
}

export { getDadataStreets, getDadataAddress }
