import { useLayoutEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const isCart = (product) => {
    if (!product) {
        return false
    }

    const items = useSelector(state => state.cart.items)

    let item = items?.length
        ? items.find((e) => {
            if (e?.id === product?.id) {
                if (e?.cart?.data && product?.cart?.data) {
                    return JSON.stringify(e.cart.data) === JSON.stringify(product.cart.data)
                }
                return true
            }
        })
        : false
    return item
}

const useTotalCart = () => {
    const stateDelivery = useSelector(state => state.checkout.delivery)
    const stateCart = useSelector(state => state.cart.items)
    const statePromo = useSelector(state => state.cart.promo)
    const stateZone = useSelector(state => state.cart.zone)

    var cashbackValue = 0

    const [data, setData] = useState({
        total: 0,
        price: 0,
        discount: 0,
        delivery: 0,
        point: 0,
    })
    useLayoutEffect(() => {
        if (stateCart?.length) {
            let price = 0
            let discount = 0
            let point = 0
            let delivery = 0
            stateCart.forEach((product) => {
                if (!product || !product?.cart?.count) {
                    return false
                }

                if (product?.type == 'gift') {
                    point += product.price * product.cart.count
                } else {
                    if (product?.cart?.data?.modifiers?.price) {
                        price += product.cart.data.modifiers.price * product.cart.count
                    } else {
                        price += product.price * product.cart.count

                        if (product?.priceSale > 0) {
                            discount += product.priceSale * product.cart.count - product.price * product.cart.count
                            price += discount
                        }
                    }

                    if (product?.cart?.data?.additions?.length) {
                        product.cart.data.additions.map((e) => {
                            let count = e.count ? e.count : 1
                            price += e.price * count * product.cart.count
                            if (e.priceSale > 0) {
                                discount +=
                                    e.priceSale * count * product.cart.count - e.price * count * product.cart.count
                                price += discount
                            }
                        })
                    }
                }
            })

            let totalCalcul = discount > 0 ? price - discount : price

            if (statePromo) {
                if (statePromo.procent > 0) {
                    totalCalcul = totalCalcul - (totalCalcul / 100) * statePromo.procent
                } else if (statePromo.discount > 0) {
                    totalCalcul = totalCalcul - statePromo.discount
                }
            }

            let cashback = cashbackValue > 0 ? Math.round((totalCalcul / 100) * cashbackValue) : 0

            if (stateZone?.priceFree > price) {
                delivery += stateZone.price
                if (stateDelivery == 'delivery') {
                    totalCalcul += stateZone.price
                }
            }

            setData({
                ...data,
                total: parseInt(totalCalcul),
                price: parseInt(price),
                point: parseInt(point),
                discount: parseInt(discount),
                delivery: parseInt(delivery),
                cashback: parseInt(cashback),
            })
        } else {
            setData({ ...data, price: 0, total: 0, discount: 0, point: 0, cashback: 0, delivery: 0 })
        }
    }, [stateCart, statePromo, stateDelivery])

    return data
}

export { isCart, useTotalCart }
