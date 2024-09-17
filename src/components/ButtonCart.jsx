import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { isCart } from "../hooks/useCart";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { updateCart } from "../services/cart";
import CountInput from "./utils/CountInput";
import { NotificationManager } from "react-notifications";
import { useTranslation } from "react-i18next";

const ButtonCart = memo(
  ({
    product,
    data,
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

    const onPress = useCallback(
      (newCount) => {
        let newProduct = {
          data: {
            cart: product.cart,
            id: product.id,
            options: product.options,
            title: product.title,
            description: product.description,
            type: product.type,
            enegry: product.enegry,
            price: product.price,
            discount: product.discount,
            code: product.code,
            medias: product.medias,
            modifiers: product?.modifiers ?? [],
            additions: product?.additions ?? [],
            wishes: product?.wishes ?? [],
          },
          plus: false,
        };

        if (
          product?.modifiers?.length > 0 ||
          (product?.additions?.length > 0 && data?.cart?.data)
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

        if (full && product?.modifiers?.length > 0 && newCount <= 1) {
          NotificationManager.success(t("Товар успешно добавлен в корзину"));
          navigate(-1);
        }
        onAddCart && onAddCart();
      },
      [data, product, cart, full]
    );

    if ((isCartData && product?.modifiers?.length === 0) || cart) {
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
        onClick={() =>
          data?.cart?.data?.modifiers
            ? onPress(1)
            : product?.modifiers?.length > 0 && !full
            ? navigate("/product/" + product.id, product)
            : onPress(1)
        }
        type="button"
        className={`${className} ${
          isCartData ? "btn-primary active" : "btn-primary"
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
