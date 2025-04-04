import { memo, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isCart } from "../hooks/useCart";
import { updateCart } from "../services/cart";
import { getProduct } from "../services/product";
import { cartQueue } from "../services/queue";
import CountInput from "./utils/CountInput";

const ButtonCartProductMini = memo(
  ({ product, isValid = true, onLoad, className, children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const selectedAffiliate = useSelector((state) => state.affiliate.active);
    const options = useSelector((state) => state.settings.options);
    const [loading, setLoading] = useState(false);
    const isCartData = product?.id ? isCart(product) : false;

    const onPress = useCallback(
      (newCount = 1, inputCount = false) => {
        const modifiers =
          options?.brand?.options?.priceAffiliateType &&
          Array.isArray(product.modifiers) &&
          product?.modifiers?.length > 0
            ? product.modifiers.filter((e) => e?.modifierOptions?.length > 0)
            : product?.modifiers ?? [];
        if (modifiers?.length > 1) {
          if (onLoad) {
            return onLoad(product);
          }
          return navigate("/product/" + product.id, res);
        }
        if (isCartData && inputCount) {
          dispatch(
            updateCart({
              ...product,
              cart: product?.cart
                ? { ...product.cart, count: newCount }
                : { count: newCount },
            })
          );
        } else {
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
                  ? res.modifiers.filter((e) => e?.modifierOptions?.length > 0)
                  : res?.modifiers ?? [];
              if (modifiers?.length > 1 || res?.additions?.length > 0) {
                if (onLoad) {
                  return onLoad(res);
                }
                return navigate("/product/" + product.id, res);
              }

              let newProduct = {
                cart: product?.cart
                  ? modifiers?.length === 1
                    ? {
                        ...product.cart,
                        modifiers: modifiers,
                        count: newCount,
                      }
                    : { ...product.cart, count: newCount }
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
                comment: product?.comment ? product.comment : null,
                medias:
                  !product?.medias?.length === 0 && res.medias?.length > 0
                    ? res.medias
                    : product?.medias ?? [],
                modifiers:
                  product?.modifiers && product?.modifiers?.length > 0
                    ? product.modifiers
                    : [],
                additions:
                  res?.additions && res?.additions?.length > 0
                    ? res.additions
                    : [],
                wishes:
                  res?.wishes && res?.wishes?.length > 0 ? res.wishes : [],
              };

              dispatch(updateCart(newProduct));
              NotificationManager.success(
                t("Товар успешно добавлен в корзину")
              );
            })
            .finally(() => setLoading(false));
        }
      },
      [product, loading, options, selectedAffiliate, isCartData]
    );
    // const onPress = useCallback(
    //   async (newCount = 1, inputCount = false) => {
    //     try {
    //       setLoading(true);

    //       await cartQueue.add(async () => {
    //         // Получаем модификаторы товара
    //         const modifiers =
    //           options?.brand?.options?.priceAffiliateType &&
    //           Array.isArray(product.modifiers) &&
    //           product?.modifiers?.length > 0
    //             ? product.modifiers.filter(
    //                 (e) => e?.modifierOptions?.length > 0
    //               )
    //             : product?.modifiers ?? [];

    //         // Если есть модификаторы - переходим на страницу товара
    //         if (modifiers?.length > 1) {
    //           return navigate("/product/" + product.id, product);
    //         }

    //         // Загружаем актуальные данные товара (если нужно)
    //         const productData =
    //           isCartData && inputCount
    //             ? product
    //             : await getProduct({
    //                 id: product.id,
    //                 affiliateId: selectedAffiliate?.id ?? false,
    //                 required: true,
    //                 multiBrand: options?.multiBrand,
    //                 type: "site",
    //               });

    //         // Формируем объект для добавления в корзину
    //         const productToAdd = {
    //           ...productData,
    //           cart: {
    //             ...(productData.cart || {}),
    //             count: newCount,
    //             modifiers:
    //               modifiers?.length === 1
    //                 ? modifiers
    //                 : productData.cart?.modifiers,
    //             additions: productData.additions || [],
    //           },
    //           id: productData.id,
    //           title: productData.title,
    //           price: productData.price,
    //           discount: productData.discount,
    //           medias: productData.medias || product?.medias || [],
    //           options: productData.options,
    //           type: productData.type,
    //           categoryId: productData.categoryId,
    //         };

    //         dispatch(updateCart(productToAdd));
    //         NotificationManager.success("Товар успешно добавлен в корзину");
    //       });
    //     } catch (error) {
    //       console.error("Ошибка при добавлении в корзину:", error);
    //       NotificationManager.error("Ошибка при добавлении товара");
    //     } finally {
    //       setLoading(false);
    //     }
    //   },
    //   [product, options, selectedAffiliate, isCartData, dispatch]
    // );
    if (
      isCartData?.id &&
      (!product?.modifiers || product.modifiers.length === 0) &&
      (!product?.additions || product.additions.length === 0) &&
      (!isCartData?.cart?.modifiers ||
        isCartData.cart.modifiers.length === 0) &&
      (!isCartData?.cart?.additions ||
        isCartData.cart.additions.length === 0) &&
      (!isCartData?.additions || isCartData.additions.length === 0) &&
      (!isCartData?.modifiers || isCartData.modifiers.length === 0) &&
      (!product?.cart?.modifiers || product.cart.modifiers.length === 0) &&
      (!product?.cart?.additions || product.cart.additions.length === 0)
    ) {
      return (
        <CountInput
          onChange={(e) => onPress(e, true)}
          value={isCartData?.cart?.count}
        />
      );
    }

    return (
      <button
        draggable={false}
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
