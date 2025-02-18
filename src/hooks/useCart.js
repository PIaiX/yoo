import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { isEqual } from "lodash";

const selectProduct = (state) => state.product;
const selectCartItems = (state) => state.items;

const makeSelectIsCart = (strict = true) =>
  createSelector([selectProduct, selectCartItems], (product, items) => {
    if (!product || !product.id || !items || items.length === 0) {
      return false;
    }

    return items.find((cartItem) => {
      if (!cartItem || cartItem.id !== product.id) {
        return false;
      }

      return strict ? (
        isEqual(cartItem?.cart?.data?.modifiers, product?.cart?.data?.modifiers) &&
        isEqual(cartItem?.cart?.data?.additions, product?.cart?.data?.additions)
      ) : cartItem.id === product.id;
    });
  });

const isCart = (product = false, strict = true) => {
  const selectIsCart = makeSelectIsCart(strict);
  const items = product?.id
    ? useSelector(
      (state) =>
        state?.cart?.items?.length > 0 &&
        selectIsCart({ product, items: state?.cart?.items ?? [] })
    )
    : [];

  return items;
};

const useTotalCart = () => {
  const stateDelivery = useSelector((state) => state?.checkout?.delivery);
  const statePayment = useSelector((state) => state?.checkout?.data?.payment);
  const pointSwitch = useSelector(
    (state) => state?.checkout?.data?.pointSwitch
  );
  const stateCart = useSelector((state) => state.cart?.items);
  const statePromo = useSelector((state) => state.cart?.promo);
  const stateZone = useSelector((state) => state.cart?.zone?.data);
  const pointOptions = useSelector((state) => state?.settings?.options?.point);
  const userPoint = useSelector((state) => state.auth?.user?.point);
  const userOptions = useSelector((state) => state.auth?.user?.options);
  const affiliateActive = useSelector((state) => state?.affiliate?.active);

  const calculateCart = useMemo(() => {
    var price = 0,
      discount = 0,
      point = 0,
      delivery = 0,
      person = 0,
      pointAccrual = 0,
      totalNoDelivery = 0,
      pickupDiscount = 0,
      count = 0;

    if (stateCart?.length > 0) {
      stateCart.forEach((product) => {
        if (!product || !product?.cart?.count) return;

        person +=
          product?.options?.person > 0
            ? Number(product.options.person) * (product?.cart?.count ?? 0)
            : 0;
        point +=
          product?.type === "gift" &&
            product?.cart?.count > 0 &&
            product?.price > 0
            ? Number(product.price) * Number(product.cart.count)
            : 0;

        const modifiersPrice =
          product?.cart?.count > 0 &&
          product?.cart?.data?.modifiers?.length > 0 &&
          product.cart?.data.modifiers.reduce(
            (sum, item) => sum + Number(item?.price ?? 0),
            0
          ) * Number(product.cart.count);

        const basePrice =
          product?.price > 0 && product?.cart?.count > 0
            ? product.price * product.cart.count
            : 0;
        var productPrice = product?.options?.modifierPriceSum
          ? basePrice + modifiersPrice
          : modifiersPrice || basePrice;

        if (
          product?.discount > 0 &&
          product?.cart?.count > 0 &&
          product?.price > 0
        ) {
          discount += product.discount;
        }

        pickupDiscount +=
          Number(affiliateActive?.options?.discountPickup) > 0 &&
            stateDelivery === "pickup" &&
            affiliateActive?.options?.discountExceptions?.length > 0 &&
            !affiliateActive?.options?.discountExceptions.includes(
              String(product.categoryId)
            )
            ? Math.floor(
              (productPrice / 100) *
              Number(affiliateActive.options.discountPickup)
            )
            : 0;

        if (statePromo?.options) {
          if (
            statePromo?.type === "category_one" &&
            statePromo?.options?.categoryId
          ) {
            if (
              product?.categoryId &&
              product?.categoryId === statePromo.options.categoryId
            ) {
              productPrice -=
                Number(statePromo?.options?.percent) > 0
                  ? (productPrice / 100) * Number(statePromo.options.percent)
                  : Number(statePromo?.options?.sum) > 0
                    ? Number(statePromo.options.sum)
                    : 0;
            }
          } else if (
            statePromo?.type === "category_one" &&
            statePromo?.options?.exceptions?.length > 0 &&
            statePromo?.options?.exceptions.includes(String(product.categoryId))
          ) {
            productPrice -=
              Number(statePromo?.options?.percent) > 0
                ? (productPrice / 100) * Number(statePromo.options.percent)
                : Number(statePromo?.options?.sum) > 0
                  ? Number(statePromo.options.sum)
                  : 0;
          } else if (
            statePromo?.type === "product_one" &&
            statePromo?.options?.productId
          ) {
            if (String(product?.id) === String(statePromo.options.productId)) {
              productPrice -=
                Number(statePromo?.options?.percent) > 0
                  ? (productPrice / 100) * Number(statePromo.options.percent)
                  : Number(statePromo?.options?.sum) > 0
                    ? Number(statePromo.options.sum)
                    : 0;
            }
          }
        }
        price += productPrice;
        if (product?.cart?.data?.additions?.length > 0) {
          product.cart.data.additions.forEach((e) => {
            const count = e?.count || 1;
            const additionPrice =
              e?.price > 0 && product?.cart?.count > 0
                ? e.price * count * product.cart.count
                : 0;
            price += additionPrice;

            if (e?.discount > 0 && product?.cart?.count > 0) {
              discount += e.discount;
            }
          });
        }
      });

      let totalCalcul =
        discount > 0 && price > 0 ? price - discount : price ?? 0;
      totalNoDelivery += totalCalcul;
      totalCalcul -= pickupDiscount;

      if (statePromo?.options) {
        if (
          statePromo.type != "product_one" &&
          statePromo.type != "category_one"
        ) {
          totalNoDelivery -=
            Number(statePromo?.options?.percent) > 0
              ? (totalCalcul / 100) * Number(statePromo.options.percent)
              : 0;
          totalNoDelivery -=
            Number(statePromo?.options?.sum) > 0
              ? Number(statePromo.options.sum)
              : 0;
          totalCalcul -=
            Number(statePromo?.options?.percent) > 0
              ? (totalCalcul / 100) * Number(statePromo.options.percent)
              : 0;
          totalCalcul -=
            Number(statePromo?.options?.sum) > 0
              ? Number(statePromo.options.sum)
              : 0;
        }
      }

      let pointCheckout =
        Number(pointOptions?.writing?.value) > 0
          ? Math.floor((totalCalcul / 100) * Number(pointOptions.writing.value))
          : 0;
      pointCheckout =
        userPoint && pointCheckout > userPoint ? userPoint : pointCheckout;

      if (pointCheckout > 0 && pointSwitch && stateDelivery) {
        const isEligible =
          (pointOptions?.writing?.delivery && stateDelivery === "delivery") ||
          (pointOptions?.writing?.pickup && stateDelivery === "pickup") ||
          (pointOptions?.writing?.card && statePayment === "card") ||
          (pointOptions?.writing?.cash && statePayment === "cash") ||
          (pointOptions?.writing?.online && statePayment === "online");

        if (!isEligible) {
          pointCheckout = 0;
        } else {
          totalNoDelivery -= pointCheckout;
          totalCalcul -= pointCheckout;
        }
      }

      if (
        (Number(pointOptions?.accrual?.value) > 0 ||
          Number(userOptions?.cashback) > 0) &&
        stateDelivery &&
        totalCalcul
      ) {
        const isEligible =
          (pointOptions?.accrual?.delivery && stateDelivery === "delivery") ||
          (pointOptions?.accrual?.pickup && stateDelivery === "pickup") ||
          (pointOptions?.accrual?.card && statePayment === "card") ||
          (pointOptions?.accrual?.cash && statePayment === "cash") ||
          (pointOptions?.accrual?.online && statePayment === "online");

        if (pointOptions?.type === "yooapp" || !pointOptions?.type) {
          pointAccrual = isEligible
            ? Math.floor(
              (totalCalcul / 100) *
              Number(
                userOptions?.cashback
                  ? userOptions?.cashback
                  : pointOptions.accrual.value ?? 0
              )
            )
            : 0;
        } else {
          pointAccrual = Math.floor(
            (totalCalcul / 100) *
            Number(
              userOptions?.cashback
                ? userOptions?.cashback
                : pointOptions.accrual.value ?? 0
            )
          );
        }
      }

      if (
        stateDelivery === "delivery" &&
        stateZone?.price > 0 &&
        (!stateZone?.options?.freeStatus || stateZone?.priceFree > totalCalcul)
      ) {
        delivery += stateZone.price;
        totalCalcul += stateZone.price;
      }

      return {
        total: parseInt(totalCalcul),
        totalNoDelivery: parseInt(totalNoDelivery),
        price: parseInt(price),
        point: parseInt(point),
        discount: parseInt(discount),
        delivery: parseInt(delivery),
        pointAccrual: parseInt(pointAccrual),
        pickupDiscount: parseInt(pickupDiscount),
        pointCheckout: parseInt(pointCheckout),
        person: parseInt(person),
        count: count,
      };
    } else {
      return {
        total: 0,
        totalNoDelivery: 0,
        price: 0,
        point: 0,
        discount: 0,
        delivery: 0,
        pointAccrual: 0,
        pickupDiscount: 0,
        pointCheckout: 0,
        person: 0,
        count: 0,
      };
    }
  }, [
    stateCart,
    statePromo,
    stateDelivery,
    stateZone,
    pointSwitch,
    statePayment,
    pointOptions,
    userPoint,
    affiliateActive,
  ]);

  const [data, setData] = useState(calculateCart);

  useEffect(() => {
    setData(calculateCart);
  }, [calculateCart]);

  return data;
};

export { isCart, useTotalCart, makeSelectIsCart };
