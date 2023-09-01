import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { isCart } from "../hooks/useCart";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { updateCart } from "../services/cart";
import CountInput from "./utils/CountInput";

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
        onAddCart && onAddCart();
      },
      [data, cart, full]
    );

    if ((isCartData && data?.modifiers?.length === 0) || cart) {
      return (
        <CountInput
          dis={false}
          onChange={onPress}
          value={data?.cart?.count > 0 ? data.cart.count : 1}
        />
      );
    }

    return (
      <button
        onClick={() =>
          data?.modifiers?.length > 0 && !full
            ? navigate("/menu/product/" + data.id, data)
            : onPress(1)
        }
        type="button"
        className={className ?? "btn-light rounded-pill ms-3"}
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
