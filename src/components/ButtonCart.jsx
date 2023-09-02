import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { isCart } from "../hooks/useCart";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { updateCart } from "../services/cart";
import CountInput from "./utils/CountInput";
import { NotificationManager } from "react-notifications";

const ButtonCart = memo(
  ({ data, full = false, onAddCart, cart = false, className, children }) => {
    const isCartData = isCart(data);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onPress = useCallback(
      (newCount) => {
        let newdata = { ...data };
        if (data?.cart?.data) {
          newdata.cart = data.cart;
        }
        newdata.cart = { ...newdata.cart, count: newCount ?? 0, full };
        dispatch(updateCart(newdata));
        if (full && data?.modifiers?.length > 0 && newCount <= 1) {
          NotificationManager.success("Товар успешно добавлен в корзину");
          navigate(-1);
        } else {
          NotificationManager.success("Корзина успешно обновлена");
        }
        onAddCart && onAddCart();
      },
      [data, cart, full]
    );

    if ((isCartData && data?.modifiers?.length === 0) || cart) {
      return (
        <CountInput
          dis={false}
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
            : data?.modifiers?.length > 0 && !full
            ? navigate("/menu/product/" + data.id, data)
            : onPress(1)
        }
        type="button"
        className={`${className} rounded-pill ms-3 ${isCartData ? 'btn-light-outline' : 'btn-light'}`}
      >
        {children ?? (
          <>
            <HiOutlineShoppingBag className="fs-15 d-none d-md-block" />
            <span className="d-md-none">Добавить</span>
          </>
        )}
      </button>
    );
  }
);
export default ButtonCart;
