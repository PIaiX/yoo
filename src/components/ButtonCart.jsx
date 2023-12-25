import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { isCart } from "../hooks/useCart";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { updateCart } from "../services/cart";
import CountInput from "./utils/CountInput";
import { NotificationManager } from "react-notifications";

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

    const onPress = useCallback(
      (newCount) => {
        let newdata = { ...product };
        if (data?.cart?.data) {
          newdata.cart = data.cart;
        }
        newdata.cart = { ...newdata.cart, count: newCount ?? 0, full };
        dispatch(updateCart(newdata));
        if (full && product?.modifiers?.length > 0 && newCount <= 1) {
          NotificationManager.success("Товар успешно добавлен в корзину");
          navigate(-1);
        }
        onAddCart && onAddCart();
      },
      [data, product, cart, full]
    );

    if ((isCartData && product?.modifiers?.length === 0) || cart) {
      return (
        <CountInput
          full={full}
          onChange={onPress}
          value={isCartData?.cart?.count > 0 ? isCartData.cart.count : 1}
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
          isCartData ? "btn-light active" : "btn-light"
        }`}
      >
        {children ?? (
          <>
            <span className="d-md-none me-2">Добавить</span>
            <HiOutlineShoppingBag className="fs-15" />
          </>
        )}
      </button>
    );
  }
);
export default ButtonCart;
