import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const isCart = (product) => {
    if (!product) {
        return false
    }

    const item = useSelector(state => state.cart.items?.length
        ? state.cart.items.find((e) => {
            if (e?.id === product?.id) {
                if (e?.cart?.data && product?.cart?.data) {
                    return JSON.stringify(e.cart.data) === JSON.stringify(product.cart.data)
                }
                return true
            }
        })
        : false)
    return item
}

const useTotalCart = () => {
    const stateDelivery = useSelector(state => state.checkout.delivery)
    const statePayment = useSelector(state => state.checkout.data?.payment)
    const pointSwitch = useSelector(state => state.checkout.data?.pointSwitch)
    const stateCart = useSelector(state => state.cart.items)
    const statePromo = useSelector(state => state.cart.promo)
    const stateZone = useSelector(state => state.cart.zone.data)
    const pointOptions = useSelector(state => state.settings.options.point)
    const userPoint = useSelector(state => state.auth.user.point)

    const affiliateActive = useSelector(state => state?.affiliate?.items?.length > 0 && state.affiliate.items.find(e => e.main))

    const [data, setData] = useState({
        total: 0,
        price: 0,
        discount: 0,
        delivery: 0,
        point: 0,
        pointCheckout: 0
    })

    useEffect(() => {
        if (stateCart?.length) {
            let price = 0
            let discount = 0
            let point = 0
            let delivery = 0
            let pointAccrual = 0
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

            var totalCalcul = discount > 0 ? price - discount : price

            if (statePromo) {
                if (statePromo.procent > 0) {
                    totalCalcul = totalCalcul - (totalCalcul / 100) * statePromo.procent
                } else if (statePromo.discount > 0) {
                    totalCalcul = totalCalcul - statePromo.discount
                }
            }
            let pickupDiscount = affiliateActive?.options?.discountPickup > 0 && stateDelivery == 'pickup' ? (totalCalcul / 100) * Number(affiliateActive.options.discountPickup) : 0


            if (pickupDiscount > 0) {
                totalCalcul = totalCalcul - pickupDiscount
            }

            let pointCheckout = pointOptions?.writing?.value > 0 ? (totalCalcul / 100) * Number(pointOptions.writing.value) : 0
            if (pointCheckout > 0 && pointCheckout > userPoint) {
                pointCheckout = userPoint
            }
            if (pointCheckout > 0 && pointSwitch) {

                let is = true
                if (!pointOptions?.writing?.delivery && stateDelivery == 'delivery') {
                    is = false
                }
                if (!pointOptions?.writing?.pickup && stateDelivery == 'pickup') {
                    is = false
                }
                if (!pointOptions?.writing?.card && statePayment == 'card') {
                    is = false
                }
                if (!pointOptions?.writing?.cash && statePayment == 'cash') {
                    is = false
                }
                if (!pointOptions?.writing?.online && statePayment == 'online') {
                    is = false
                }
                if (is) {
                    totalCalcul = totalCalcul - pointCheckout
                }
            }

            if (pointOptions?.accrual?.value > 0) {
                let is = true
                if (!pointOptions?.accrual?.delivery && stateDelivery == 'delivery') {
                    is = false
                }
                if (!pointOptions?.accrual?.pickup && stateDelivery == 'pickup') {
                    is = false
                }
                if (!pointOptions?.accrual?.card && statePayment == 'card') {
                    is = false
                }
                if (!pointOptions?.accrual?.cash && statePayment == 'cash') {
                    is = false
                }
                if (!pointOptions?.accrual?.online && statePayment == 'online') {
                    is = false
                }
                if (is) {
                    pointAccrual = Math.round((totalCalcul / 100) * Number(pointOptions.accrual.value))
                }
            }

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
                pointAccrual: parseInt(pointAccrual),
                pickupDiscount: parseInt(pickupDiscount),
                pointCheckout: parseInt(pointCheckout)
            })
        } else {
            setData({ ...data, price: 0, total: 0, discount: 0, point: 0, pointAccrual: 0, delivery: 0, pickupDiscount: 0, pointCheckout: 0 })
        }
    }, [stateCart, statePromo, stateDelivery, stateZone, pointSwitch])

    return data
}

export { isCart, useTotalCart }
