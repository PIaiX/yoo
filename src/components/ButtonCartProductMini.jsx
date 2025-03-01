import { memo, useCallback, useState } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { groupByCategoryIdToArray } from "../helpers/all";
import { isCart } from "../hooks/useCart";
import { updateCart } from "../services/cart";
import { getProduct } from "../services/product";
import CountInput from "./utils/CountInput";

const ButtonCartProductMini = memo(
  ({ product, isValid = true, className, children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selectedAffiliate = useSelector((state) => state.affiliate.active);
    const options = useSelector((state) => state.settings.options);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(product);
    const isCartData = data?.id ? isCart(data) : false;

    const onPress = useCallback(
      (newCount = 1) => {
        setLoading(true);
        getProduct({
          id: data.id,
          affiliateId: selectedAffiliate?.id ?? false,
          required: true,
          multiBrand: options?.multiBrand,
          type: "site",
        })
          .then((res) => {
            if (res?.modifiers?.length > 0 || res?.additions?.length > 0) {
              return navigate("/product/" + data.id, res);
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
                cart: data?.cart
                  ? { ...data.cart, count: newCount }
                  : { count: newCount },
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
                comment: data?.comment ? data.comment : null,
                medias:
                  !data?.medias?.length === 0 && res.medias?.length > 0
                    ? res.medias
                    : data?.medias ?? [],
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

            if (res?.modifiers?.length > 0 || res?.additions?.length > 0) {
              setData({ ...data, ...newProduct });
            }
          })
          .finally(() => setLoading(false));
      },
      [data, loading, options, selectedAffiliate, isCartData]
    );

    if (
      isCartData?.id &&
      (!data?.modifiers || data.modifiers.length === 0) &&
      (!data?.additions || data.additions.length === 0) &&
      (!isCartData?.cart?.data?.modifiers ||
        isCartData.cart.data.modifiers.length === 0) &&
      (!isCartData?.cart?.data?.additions ||
        isCartData.cart.data.additions.length === 0) &&
      (!isCartData?.additions || isCartData.additions.length === 0) &&
      (!isCartData?.modifiers || isCartData.modifiers.length === 0) &&
      (!data?.cart?.data?.modifiers || data.cart.data.modifiers.length === 0) &&
      (!data?.cart?.data?.additions || data.cart.data.additions.length === 0)
    ) {
      return <CountInput onChange={onPress} value={isCartData?.cart?.count} />;
    }

    return (
      <button
        disabled={!isValid}
        onClick={() => onPress()}
        type="button"
        className={`${isCartData ? "btn-light" : "btn-primary"}${
          className ? " " + className : ""
        }${loading ? " loading" : ""}`}
      >
        {children ?? <HiOutlineShoppingBag className="fs-15" />}
      </button>
    );
  }
);
export default ButtonCartProductMini;
