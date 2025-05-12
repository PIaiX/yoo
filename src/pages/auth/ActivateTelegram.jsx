import React, { useCallback, useState } from "react";
import { Form } from "react-bootstrap";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Empty from "../../components/Empty";
import EmptyActivate from "../../components/empty/activate";
import Meta from "../../components/Meta";
import InputCode from "../../components/utils/InputCode";
import socket from "../../config/socket";
import { authTelegram } from "../../services/auth";
import { setToken, setUser } from "../../store/reducers/authSlice";

const ActivateTelegram = () => {
  const { t } = useTranslation();
  const { state } = useLocation();

  const user = useSelector((state) => state.auth.user);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const options = useSelector((state) => state.settings.options);
  const [endTimer, setEndTimer] = useState(false);
  const [status, setStatus] = useState(false);

  if (isAuth || !state?.phone) {
    return <Navigate to={"/"} />;
  }

  const { control, handleSubmit, setValue } = useForm({
    mode: "all",
    reValidateMode: "onSubmit",
    defaultValues: state,
  });
  const data = useWatch({ control });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = useCallback(
    (data) => {
      authTelegram({ ...data, step: 2 })
        .then((res) => {
          dispatch(setUser(res.user));
          dispatch(setToken(res.token));

          socket.io.opts.query = {
            userId: res.user?.id ?? false,
            brandId: res.user?.brandId ?? false,
          };
          socket.connect();
          setStatus(true);
        })
        .catch((error) => {
          return NotificationManager.error(
            error?.response?.data?.error || t("Неизвестная ошибка")
          );
        });
    },
    [options]
  );

  if (status) {
    return (
      <>
        <Meta
          title={t(
            "Подтверждение " +
              (options.authType == "email"
                ? "электронной почты"
                : "номера телефона")
          )}
        />
        <Empty
          text={t(
            options.authType == "email"
              ? "Электронная почта успешно подтверждена"
              : "Номер телефона успешно подтвержден"
          )}
          desc={t("Теперь вы можете перейти в меню для заказов")}
          image={() => <EmptyActivate />}
          button={
            <Link to="/" className="btn btn-primary">
              {t("Перейти в меню")}
            </Link>
          }
        />
      </>
    );
  }
  return (
    <main className="d-flex align-items-center justify-content-center">
      <Meta title={t("Подтверждение номера телефона")} />
      <div className="login-forms p-2 p-md-3 w-xs-100">
        <Form className="login-form text-center d-flex flex-column justify-content-center w-xs-100">
          <h5 className="mb-3 fw-6 text-center">
            {t(`Подтвердите номер телефона`)}
          </h5>
          <p className="mb-4 text-center">
            <span>
              {t(
                "Перейдите в телеграм бот. Вам будет отправлен 6-ти значный код подтверждения"
              )}
            </span>
          </p>
          <div className="mb-2">
            <InputCode
              length={6}
              autoFocus={true}
              onChange={(e) => setValue("key", e)}
            />
          </div>

          <button
            draggable={false}
            type="submit"
            disabled={!data?.key || data?.key?.length != 6}
            className="btn-primary w-100 mt-4"
            onClick={handleSubmit(onSubmit)}
          >
            {t(
              `Подтвердить ${
                options.authType == "email" ? "почту" : "номер телефона"
              }`
            )}
          </button>
          <button
            draggable={false}
            className="w-100 mt-4"
            onClick={() => navigate("/")}
          >
            {t("На главную")}
          </button>
        </Form>
      </div>
    </main>
  );
};

export default ActivateTelegram;
