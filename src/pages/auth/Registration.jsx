import React, { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Meta from "../../components/Meta";
import Input from "../../components/utils/Input";
import socket from "../../config/socket";
import { authRegister } from "../../services/auth";
import { setAuth, setToken, setUser } from "../../store/reducers/authSlice";
import { IoChevronBackCircleOutline } from "react-icons/io5";

const Registration = () => {
  const { t } = useTranslation();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.auth.user);
  const options = useSelector((state) => state.settings.options);

  const navigate = useNavigate();
  const [loadingReg, setLoadingReg] = useState(false);

  useEffect(() => {
    if (isAuth) {
      if (user?.id && user?.status === 0) {
        return navigate("/activate");
      } else {
        return navigate("/");
      }
    }
  }, [isAuth, user]);

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: { accept: true },
  });

  const dispatch = useDispatch();

  const onSubmit = useCallback(
    (data) => {
      if (data?.phone && data.phone?.length > 0) {
        let phone = data.phone.replace(/[^\d]/g, "").trim();
        if (!phone) {
          return NotificationManager.error("Укажите номер телефона");
        }
        if (phone?.length < 11) {
          return NotificationManager.error("Введите корректный номер телефона");
        }
        if (parseInt(phone[0]) === 7 && parseInt(phone[1]) === 8) {
          return NotificationManager.error(
            "Неверный формат номера телефона. Должно быть +79, +77."
          );
        }
      }
      if (data?.comment?.length > 0) {
        return NotificationManager.error(
          "Регистрация временно недоступна, попробуйте немного позже"
        );
      }
      setLoadingReg(true);

      authRegister(data)
        .then((res) => {
          NotificationManager.success(
            "Завершите регистрацию " +
              (options.authType == "email"
                ? "подтвердив почту"
                : "подтвердив номер телефона")
          );
          if (res?.user?.id) {
            dispatch(setUser(res.user));
            dispatch(setToken(res.token));
            dispatch(setAuth(true));

            socket.io.opts.query = {
              brandId: res.user.brandId ?? false,
              userId: res.user.id ?? false,
            };
            socket.connect();

            return navigate("/activate");
          }
        })
        .catch((error) =>
          NotificationManager.error(
            typeof error?.response?.data?.error === "string"
              ? error.response.data.error
              : "Неизвестная ошибка"
          )
        )
        .finally(() => setLoadingReg(false));
    },
    [options]
  );

  return (
    <>
      <Meta title={t("Регистрация")} />
      <div className="align-items-center login justify-content-center justify-content-center flex-column d-flex vh-100 p-3">
        <div className="login-box">
          <a
            onClick={() => navigate(-1)}
            className="bg-light p-2 pe-3 rounded-5 align-items-center d-inline-flex mb-3"
          >
            <IoChevronBackCircleOutline size={28} className="me-2" />
            <span className="fw-6">{t("Назад")}</span>
          </a>
          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <h4 className="fw-8 mb-0">{t("Регистрация")}</h4>
            <p className="fs-10 mb-4 text-muted">
              {t("Заполните данные, чтобы создать профиль")}
            </p>
            <div className="mb-3">
              {!options.authType || options.authType === "email" ? (
                <Input
                  type="email"
                  name="email"
                  inputMode="email"
                  placeholder={t("Введите email")}
                  errors={errors}
                  register={register}
                  validation={{
                    required: t("Введите email"),
                    maxLength: {
                      value: 250,
                      message: "Максимально 250 символов",
                    },
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Неверный формат Email",
                    },
                  }}
                />
              ) : (
                <Input
                  type="custom"
                  name="phone"
                  inputMode="tel"
                  pattern="[0-9+()-]*"
                  placeholder="+7(900)000-00-00"
                  mask="+7(999)999-99-99"
                  errors={errors}
                  register={register}
                  maxLength={16}
                  validation={{
                    required: t("Введите номер телефона"),
                    maxLength: {
                      value: 16,
                      message: "Максимально 16 символов",
                    },
                  }}
                />
              )}
            </div>
            <div className="mb-3">
              <Input
                type="password"
                placeholder={t("Придумайте пароль")}
                name="password"
                errors={errors}
                register={register}
                validation={{
                  required: t("Введите пароль"),
                  minLength: {
                    value: 6,
                    message: "Минимальное кол-во символов 6",
                  },
                  maxLength: {
                    value: 250,
                    message: "Максимальное кол-во символов 250",
                  },
                }}
              />
            </div>
            <div className="mb-3">
              <Input
                type="password"
                placeholder={t("Повторите пароль")}
                name="passwordConfirm"
                errors={errors}
                register={register}
                validation={{
                  required: t("Введите повторный пароль"),
                  minLength: {
                    value: 6,
                    message: "Минимальное кол-во символов 6",
                  },
                  maxLength: {
                    value: 250,
                    message: "Максимальное кол-во символов 250",
                  },
                }}
              />
            </div>
            <input type="text" className="d-none" {...register("comment")} />
            <label className="d-flex pale-blue mb-4">
              <input
                type="checkbox"
                className="checkbox me-2"
                {...register("accept", {
                  required: t("Примите условия пользовательского соглашения"),
                })}
              />
              <span className="fs-09">
                {t("Принять условия Пользовательского соглашения")}
              </span>
            </label>
            <Button
              type="submit"
              variant="primary"
              disabled={!isValid}
              className="w-100"
            >
              {t("Зарегистрироваться")}
            </Button>
          </form>
          <Link className="w-100 btn btn-light mt-4" to="/login">
            {t("Войти в профиль")}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Registration;
