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
    data,
    isValid = true,
    full = false,
    onAddCart,
    cart = false,
    className,
    children,
  }) => {
    const isCartData = isCart(product);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const selectedAffiliate = useSelector((state) => state.affiliate.active);
    const options = useSelector((state) => state.settings.options);
    const [loading, setLoading] = useState(null);

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
                cart: res.cart ?? {},
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
              plus: false,
            };

            if (
              (res?.modifiers?.length > 0 || res?.additions?.length > 0) &&
              data?.cart?.data
            ) {
              newProduct.data.cart = { ...newProduct.data.cart, ...data.cart };
            }

            newProduct.data.cart = {
              ...newProduct.data.cart,
              count: newCount ?? 0,
            };

            if (full) {
              newProduct.plus = true;
            }

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
            onAddCart && onAddCart();
          })
          .finally(() => setLoading(false));
        // .catch(() => setProduct((data) => ({ ...data, loading: false })));
      },
      [data, product, loading, onAddCart, cart, full]
    );

    if (
      (isCartData &&
        product?.modifiers?.length === 0 &&
        product?.additions?.length === 0) ||
      cart
    ) {
      if (product.type == "gift" || product.type == "promo") {
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
      return (
        <CountInput
          full={full}
          onChange={onPress}
          value={isCartData?.cart?.count > 0 ? isCartData.cart.count : 0}
        />
      );
    }

    return (
      <button
        disabled={!isValid}
        onClick={() =>
          data?.cart?.data?.modifiers
            ? onPress(1)
            : product?.modifiers?.length > 0 && !full
            ? navigate("/product/" + product.id, product)
            : onPress(1)
        }
        type="button"
        className={`${className}${
          isCartData ? " btn-primary active" : " btn-primary"
        }${loading ? " loading" : ""}`}
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
