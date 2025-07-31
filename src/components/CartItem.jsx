import React, { memo, useCallback, useState } from "react";
import { Badge, Collapse, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import {
  customPrice,
  customWeight,
  getImageURL,
  keyGenerator,
} from "../helpers/all";
import { useForm } from "react-hook-form";
import { updateCart } from "../services/cart";
import ButtonCartItem from "./ButtonCartItem";
import Textarea from "./utils/Textarea";
import ButtonClose from "./utils/ButtonClose";

const CartItem = memo(({ data }) => {
  const { t } = useTranslation();

  const {
    register,
    formState: { errors, isValid },
    setValue,
    handleSubmit,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      ...data,
      comment: null,
    },
  });

  const price =
    data?.cart?.modifiers?.length > 0
      ? data?.options?.modifierPriceSum
        ? data.cart.modifiers.reduce((sum, item) => sum + item.price, 0) +
          data.price
        : data.cart.modifiers.reduce((sum, item) => sum + item.price, 0)
      : data.price;

  const [showComment, setShowComment] = useState(false);
  const [open, setOpen] = useState({ additions: false, wishes: false });
  const dispatch = useDispatch();

  const onSubmit = useCallback(async (data) => {
    dispatch(updateCart(data));
    setShowComment(false);
    setValue("comment", null);
  }, []);

  return (
    <div
      className={"cart-item"}
      key={
        data?.cart?.additions?.length > 0 ||
        data?.cart?.modifiers?.length > 0 ||
        data?.cart?.wishes?.length > 0
          ? keyGenerator(data)
          : data.id
      }
    >
      <div className="left">
        <img
          draggable="false"
          src={getImageURL({ path: data.medias })}
          alt={data.title}
        />
        <div className="text">
          <h6>
            <span className={data?.cart?.modifiers?.length > 0 ? "me-2" : ""}>
              {data.title}
              {data?.cart?.additions?.length > 0 ? " с добавками" : ""}
            </span>
            {data?.cart?.modifiers?.length > 0 &&
              data.cart.modifiers.map((e) => (
                <span
                  key={e.id}
                  className="fs-09 fw-7 card d-inline-block p-1 px-2"
                >
                  {e.title}
                </span>
              ))}
          </h6>
          {data?.energy?.weight > 0 && (
            <p className="text-muted fs-09">
              {customWeight({
                value: data.energy.weight,
                type: data.energy?.weightType,
              })}
            </p>
          )}
          {data?.description && data?.description?.length > 0 && (
            <p className="text-muted fs-08 consist pe-3">{data.description}</p>
          )}
          {!data?.noComment && (
            <div className="mt-2 fs-09 fw-6">
              {data?.comment ? (
                <>
                  <p>{data.comment}</p>
                  <a
                    onClick={() =>
                      dispatch(updateCart({ ...data, comment: null }))
                    }
                    className="text-danger"
                  >
                    {t("Удалить комментарий")}
                  </a>
                </>
              ) : (
                <a onClick={() => setShowComment(true)}>
                  {t("Добавить комментарий")}
                </a>
              )}
            </div>
          )}
          {data?.cart?.additions?.length > 0 && (
            <>
              <a
                className="fs-09 fw-6 d-flex align-items-center mt-2 mb-0"
                onClick={() =>
                  setOpen((prev) => ({
                    ...prev,
                    additions: !open.additions,
                  }))
                }
                aria-controls="collapse-additions"
                aria-expanded={open}
              >
                <span className="me-2">{t("Состав товара")}</span>
                {open.additions ? (
                  <IoChevronUp color="#666" />
                ) : (
                  <IoChevronDown color="#666" />
                )}
              </a>
              <Collapse in={open.additions}>
                <div id="collapse-additions">
                  <li className="fs-09 ms-3 mt-2">
                    {data.title}{" "}
                    <span className="fw-7">{customPrice(price)}</span>
                  </li>
                  <ul className="cart-item-ingredients">
                    {data.cart.additions.map((e) => (
                      <li key={e.id}>
                        {e.title}{" "}
                        <span className="fw-7">+{customPrice(e.price)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Collapse>
            </>
          )}
          {data?.cart?.wishes?.length > 0 && (
            <>
              <a
                className="fs-09 fw-6 d-flex align-items-center mb-0"
                onClick={() =>
                  setOpen((prev) => ({ ...prev, wishes: !open.wishes }))
                }
                aria-controls="collapse-wishes"
                aria-expanded={open}
              >
                <span>{t("Пожелания")}</span>{" "}
                <Badge bg="secondary" className="mx-2">
                  {data?.cart?.wishes?.length}
                </Badge>
                {open.wishes ? (
                  <IoChevronUp color="#666" />
                ) : (
                  <IoChevronDown color="#666" />
                )}
              </a>
              <Collapse in={open.wishes}>
                <div id="collapse-wishes">
                  <ul className="cart-item-ingredients-minus">
                    {data.cart.wishes.map((e) => (
                      <li key={e.id}>
                        {e.title}{" "}
                        <span className="fw-7">+{customPrice(e.price)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Collapse>
            </>
          )}
        </div>
      </div>
      <div className="right d-flex justify-content-between flex-row">
        {!data?.noCount ? (
          <div className="order-2 order-md-1 me-3">
            <ButtonCartItem product={data} />
          </div>
        ) : (
          <div className="d-flex flex-1 w-100 me-3">
            <div className="checkoutProduct-count fs-08">
              x{data?.cart?.count ?? 1}
            </div>
          </div>
        )}

        <div className="order-md-2 fw-7 d-flex justify-content-center flex-column align-items-end align-self-center">
          {data?.cart?.count > 1 && (
            <div className="text-muted fs-07 fw-4">
              {customPrice(
                price +
                  (data?.cart?.additions?.length > 0
                    ? data?.cart?.additions.reduce(
                        (sum, item) => sum + item.price,
                        0
                      )
                    : 0)
              )}
            </div>
          )}
          {data.type == "gift" || data.type == "promo" ? (
            t("Бесплатно")
          ) : data?.discount > 0 ? (
            <>
              <div className="text-right">
                {customPrice(
                  price * (data?.cart?.count ?? 0) -
                    data.discount +
                    (data?.cart?.additions?.length > 0
                      ? data?.cart?.additions.reduce(
                          (sum, item) => sum + item.price,
                          0
                        )
                      : 0) *
                      (data?.cart?.count ?? 0)
                )}
              </div>
              <div className="text-right">
                <s className="text-muted fw-4 fs-08">
                  {customPrice(
                    (price +
                      (data?.cart?.additions?.length > 0
                        ? data?.cart?.additions.reduce(
                            (sum, item) => sum + item.price,
                            0
                          )
                        : 0)) *
                      (data?.cart?.count ?? 1)
                  )}
                </s>
              </div>
            </>
          ) : (
            customPrice(
              (price +
                (data?.cart?.additions?.length > 0
                  ? data?.cart?.additions.reduce(
                      (sum, item) => sum + item.price,
                      0
                    )
                  : 0)) *
                (data?.cart?.count ?? 1)
            )
          )}
        </div>
      </div>
      {!data?.noComment && (
        <Modal show={showComment} onHide={setShowComment} centered>
          <Modal.Header>
            <ButtonClose onClick={() => setShowComment(false)} />
            <div className="d-flex flex-row align-items-center">
              <img
                height={25}
                src={getImageURL({ path: data.medias })}
                alt={data.title}
                className="me-2"
              />
              <div>
                <b>
                  {data.title}{" "}
                  {data?.cart?.modifiers?.length > 0
                    ? data?.cart?.modifiers.map((e) => " - " + e.title)
                    : ""}{" "}
                </b>
                <p className="text-muted fs-08">
                  {data?.cart?.additions?.length > 0
                    ? data?.cart?.additions.map((e) => " + " + e.title)
                    : ""}
                </p>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Textarea
              name="comment"
              placeholder={t("Введите комментарий")}
              errors={errors}
              register={register}
              validation={{
                required: t("Введите комментарий"),
                maxLength: {
                  value: 250,
                  message: t("Максимально 250 символов"),
                },
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <button
              draggable={false}
              type="submit"
              disabled={!isValid}
              onClick={handleSubmit(onSubmit)}
              className="btn btn-primary"
            >
              {t("Добавить")}
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
});

export default CartItem;
