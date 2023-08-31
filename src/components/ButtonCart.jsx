import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
// import { isCart } from "../hooks/useCart";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { updateCart } from "../services/cart";
// import InputCount from "./InputCount";

const ButtonCart = memo(
  ({ data, full = false, onAddCart, cart = false, className, children }) => {
    // const isCartData = isCart(data);
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

    // if ((isCartData && data?.modifiers?.length === 0) || cart) {
    //   return (
    //     <View>
    //       <InputCount
    //         value={data?.cart?.count > 0 ? data.cart.count : 1}
    //         full={full}
    //         w100={w100}
    //         onChange={onPress}
    //       />
    //     </View>
    //   );
    // }

    return (
      <button
        onClick={() =>
          data?.cart?.data?.modifiers
            ? onPress(1)
            : data?.modifiers?.length > 0
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
      //   <View>
      //     <Button
      //       isLoading={isLoading}
      //       type="primary"
      //       size={full ? "large" : "small"}
      //       isValid={
      //         !full ||
      //         (data?.modifiers?.length > 0 && data?.cart?.data?.modifiers) ||
      //         data?.modifiers?.length === 0
      //       }
      //       textWeight="bold"
      //       onPress={() =>
      //         data?.cart?.data?.modifiers
      //           ? onPress(1)
      //           : data?.modifiers?.length > 0
      //           ? navigation.navigate("data", data)
      //           : onPress(1)
      //       }
      //     >
      //       {text
      //         ? text
      //         : full
      //         ? "Добавить в корзину"
      //         : data?.modifiers?.length > 0
      //         ? "от " + customPrice(price)
      //         : isCartData
      //         ? "В корзине"
      //         : customPrice(data.price)}
      //     </Button>
      //   </View>
    );
  }
);
export default ButtonCart;
