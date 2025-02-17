import { memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isCart } from "../hooks/useCart";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { updateCart } from "../services/cart";
import CountInput from "./utils/CountInput";
import { NotificationManager } from "react-notifications";
import { useTranslation } from "react-i18next";
import { getProduct } from "../services/product";
import { groupByCategoryIdToArray } from "../helpers/all";

const ButtonCart = memo(
  ({
    product,
    isValid = true,
    full = false,
    cart = false,
    className,
    children,
  }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const selectedAffiliate = useSelector((state) => state.affiliate.active);
    const options = useSelector((state) => state.settings.options);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(false);
    const isCartData = data?.id ? isCart(data) : isCart(product);

    const onPress = useCallback(
      (newCount) => {
        setLoading(true);
        getProduct({
          id: product.id,
          affiliateId: selectedAffiliate?.id ?? false,
          required: true,
          multiBrand: options?.multiBrand,
          type: "site",
        })
          .then((res) => {
            if (
              !full &&
              !cart &&
              (res?.modifiers?.length > 0 || res?.additions?.length > 0)
            ) {
              return navigate("/product/" + product.id, res);
            }

            const modifiers =
              options?.brand?.options?.priceAffiliateType &&
              Array.isArray(res.modifiers) &&
              res?.modifiers?.length > 0
                ? groupByCategoryIdToArray(
                    res.modifiers.filter((e) => e?.modifierOptions?.length > 0)
                  )
                : Array.isArray(res.modifiers) && res?.modifiers?.length > 0
                ? groupByCategoryIdToArray(res.modifiers)
                : [];

            let newProduct = {
              data: {
                cart: product.cart
                  ? { ...product.cart, count: newCount ?? 0 }
                  : { count: newCount ?? 0 },
                id: res.id,
                options: res.options,
                title: res.title,
                description: res.description,
                type: res.type,
                enegry: res.enegry,
                price: res.price,
                discount: res.discount,
                code: res.code,
                categoryId: res.categoryId,
                medias: res.medias ?? [],
                modifiers: modifiers && modifiers?.length > 0 ? modifiers : [],
                additions:
                  res?.additions && res?.additions?.length > 0
                    ? res.additions
                    : [],
                wishes:
                  res?.wishes && res?.wishes?.length > 0 ? res.wishes : [],
              },
            };

            dispatch(updateCart(newProduct));

            if (
              full &&
              (res?.modifiers?.length > 0 || res?.additions?.length > 0) &&
              newCount <= 1
            ) {
              NotificationManager.success(
                t("Товар успешно добавлен в корзину")
              );
              navigate(-1);
            }
            setData(newProduct);
          })
          .finally(() => setLoading(false));
        // .catch(() => setProduct((data) => ({ ...data, loading: false })));
      },
      [product, data, loading, cart, full]
    );
console.log(isCartData, 124)
    if (
      (isCartData?.id && // Проверяем, что isCartData.id существует
        (!data?.modifiers || data.modifiers.length === 0) && // Проверяем, что modifiers либо отсутствуют, либо пусты
        (!data?.additions || data.additions.length === 0) && // Проверяем, что additions либо отсутствуют, либо пусты
        (!isCartData?.cart?.data?.modifiers ||
          isCartData.cart.data.modifiers.length === 0) && // Проверяем, что cart.data.modifiers либо отсутствуют, либо пусты
        (!isCartData?.cart?.data?.additions ||
          isCartData.cart.data.additions.length === 0) &&
        (!data?.cart?.data?.modifiers ||
          data.cart.data.modifiers.length === 0) && // Проверяем, что cart.data.modifiers либо отсутствуют, либо пусты
        (!data?.cart?.data?.additions ||
          data.cart.data.additions.length === 0)) || // Проверяем, что cart.data.additions либо отсутствуют, либо пусты
      cart
    ) {
      // Если все условия выполнены, проверяем тип продукта
      if (product.type === "gift" || product.type === "promo") {
        return (
          <button
            type="button"
            className="btn-light active"
            onClick={() => onPress(0)}
          >
            {t("Удалить")}
          </button>
        );
      }

      // Если тип продукта не "gift" или "promo", возвращаем CountInput
      return (
        <CountInput
          full={full}
          onChange={onPress}
          value={
            isCartData?.cart?.count > 0
              ? isCartData.cart.count
              : data?.cart?.count > 0
              ? data.cart.count
              : data?.data?.cart?.count > 0
              ? data.data.cart.count
              : 0
          }
        />
      );
    }

    return (
      <button
        disabled={!isValid}
        onClick={() =>
          product?.cart?.data?.modifiers?.length > 0
            ? onPress(1)
            : product?.modifiers?.length > 0 && !full
            ? navigate("/product/" + product.id, product)
            : onPress(1)
        }
        type="button"
        className={`btn-primary${className ? " " + className : ""}${
          loading ? " loading" : ""
        }`}
      >
        {children ?? (
          <>
            <HiOutlineShoppingBag className="fs-15" />
          </>
        )}
      </button>
    );
  }
);
export default ButtonCart;
