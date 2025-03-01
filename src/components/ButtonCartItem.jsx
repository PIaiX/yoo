import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { updateCart } from "../services/cart";
import CountInput from "./utils/CountInput";
import { isCart } from "../hooks/useCart";

const ButtonCartItem = memo(({ product }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isCartData = product?.id ? isCart(product) : false;

  const onPress = useCallback(
    (newCount = 1) => {
      if (newCount != product?.cart?.count) {
        dispatch(
          updateCart({
            data: {
              ...product,
              cart: product?.cart
                ? { ...product.cart, count: newCount }
                : { count: newCount },
            },
          })
        );
      }
    },
    [product]
  );

  if (product?.type === "gift" || product?.type === "promo") {
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

  return <CountInput onChange={onPress} value={isCartData?.cart?.count} />;
});
export default ButtonCartItem;
