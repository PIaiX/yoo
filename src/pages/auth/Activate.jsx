import React, { useState, useCallback, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Empty from "../../components/Empty";
import EmptyWork from "../../components/empty/work";
import Meta from "../../components/Meta";
import InputCode from "../../components/utils/InputCode";
import { authActivate } from "../../services/auth";
import { useForm, useWatch } from "react-hook-form";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { setUser } from "../../store/reducers/authSlice";
import EmptyActivate from "../../components/empty/activate";

const Activate = () => {
  const { auth, options } = useSelector(({ auth, settings: { options } }) => ({
    auth,
    options,
  }));
  const { control, handleSubmit, setValue } = useForm({
    mode: "all",
    reValidateMode: "onSubmit",
  });
  const data = useWatch({ control });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [status, setStatus] = useState(false);

  useLayoutEffect(() => {
    if (!auth.isAuth) {
      return navigate("/");
    }
  }, [auth.isAuth]);

  const onSubmit = useCallback(
    (data) => {
      authActivate(data)
        .then((res) => {
          dispatch(setUser(res));
          setStatus(true);
        })
        .catch((err) => {
          NotificationManager.error(
            err?.response?.data?.error ?? "Произошла неизвестная ошибка"
          );
          setStatus(false);
        });
    },
    [options]
  );
  if (status) {
    return (
      <>
        <Meta
          title={
            "Подтверждение " +
            (options.authType == "email"
              ? "электронной почты"
              : "номера телефона")
          }
        />
        <Empty
          text={
            options.authType == "email"
              ? "Электронная почта успешно подтверждена"
              : "Номер телефона успешно подтвержден"
          }
          desc="Теперь вы можете перейти в меню для заказов"
          image={() => <EmptyActivate />}
          button={
            <Link to="/" className="btn btn-primary">
              Перейти в меню
            </Link>
          }
        />
      </>
    );
  }
  return (
    <main className="d-flex align-items-center justify-content-center">
      <Meta
        title={
          "Подтверждение " +
          (options.authType == "email"
            ? "электронной почты"
            : "номера телефона")
        }
      />
      <div className="login-forms">
        <Form
          className="login-form text-center d-flex flex-column justify-content-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h5 className="mb-3 fw-6 text-center">
            Подтвердите{" "}
            {options.authType == "email"
              ? "электронную почту"
              : "номер телефона"}
          </h5>
          <p className="mb-4 text-center text-muted fs-09">
            {options.authType == "email" ? (
              <span>
                Мы отправили 6-значный код подтверждения на указанную
                электронную почту. <br />
                Пожалуйста, введите код в поле ниже, чтобы подтвердить свой
                адрес электронной почты.
              </span>
            ) : (
              <span>
                Мы отправили 6-значный код подтверждения на указанный номер
                телефона. Введите полученный код в поле ниже.
              </span>
            )}
          </p>
          <div className="mb-4">
            <InputCode
              length={4}
              autoFocus={true}
              onChange={(e) => setValue("key", e)}
            />
          </div>
          <button
            type="submit"
            disabled={data?.key?.length != 4}
            className="btn-primary w-100"
          >
            Подтвердить{" "}
            {options.authType == "email" ? "почту" : "номер телефона"}
          </button>
        </Form>
      </div>
    </main>
  );
};

export default Activate;
