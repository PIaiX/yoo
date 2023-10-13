import React, { useCallback, useLayoutEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm, useWatch } from "react-hook-form";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Empty from "../../components/Empty";
import EmptyActivate from "../../components/empty/activate";
import Meta from "../../components/Meta";
import InputCode from "../../components/utils/InputCode";
import { authActivate, authNewKeyActivate, logout } from "../../services/auth";
import { setUser } from "../../store/reducers/authSlice";
import { Timer } from "../../helpers/timer";

const Activate = () => {
  const user = useSelector((state) => state.auth.user);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const options = useSelector((state) => state.settings.options);
  const [endTimer, setEndTimer] = useState(false);
  const [status, setStatus] = useState(false);

  const { control, handleSubmit, setValue } = useForm({
    mode: "all",
    reValidateMode: "onSubmit",
  });
  const data = useWatch({ control });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (!isAuth || user.status === 1) {
      return navigate("/");
    }
  }, [isAuth]);

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

  const onNewKey = () => {
    setEndTimer(false);
    authNewKeyActivate(user)
      .then(() => {
        NotificationManager.success("Код подтверждения отправлен повторно");
      })
      .catch((err) => {
        NotificationManager.error(
          err?.response?.data?.error ?? "Произошла неизвестная ошибка"
        );
      });
  };

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
      <div className="login-forms p-2 p-md-3 w-xs-100">
        <Form
          className="login-form text-center d-flex flex-column justify-content-center w-xs-100"
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
                Мы отправили 4-значный код подтверждения на указанную
                электронную почту. <br />
                Пожалуйста, введите код в поле ниже, чтобы подтвердить свой
                адрес электронной почты.
              </span>
            ) : (
              <span>
                Мы отправили 4-значный код подтверждения на указанный номер
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
          <p className="fs-09 text-muted text-center">
            {endTimer ? (
              <a onClick={() => onNewKey()}>
                Отправить повторно код подтверждения
              </a>
            ) : (
              <p>
                Повторить отправку кода подтверждения через{" "}
                <Timer onEnd={() => setEndTimer(true)} /> сек
              </p>
            )}
          </p>
          <button
            type="submit"
            disabled={!data?.key || data?.key?.length != 4}
            className="btn-primary w-100 mt-4"
          >
            Подтвердить{" "}
            {options.authType == "email" ? "почту" : "номер телефона"}
          </button>
        </Form>
        <button
          className="btn-white text-danger w-100 mt-4"
          onClick={() => dispatch(logout())}
        >
          Выйти из аккаунта
        </button>
      </div>
    </main>
  );
};

export default Activate;
