import React, { useCallback, useEffect, useState } from "react";
import { Badge, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IoCall, IoMail, IoQrCodeOutline } from "react-icons/io5";
import { NotificationManager } from "react-notifications";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Meta from "../../components/Meta";
import Input from "../../components/utils/Input";
import { login } from "../../services/auth";

const Login = () => {
  const { t } = useTranslation();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.auth.user);
  const options = useSelector((state) => state.settings.options);
  const loadingLogin = useSelector((state) => state.auth.loadingLogin);
  const [variant, setVariant] = useState();
  const navigate = useNavigate();

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
  } = useForm({ mode: "all", reValidateMode: "onChange" });

  const dispatch = useDispatch();

  const onSubmit = useCallback((data) => {
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
    dispatch(login(data));
  }, []);

  return (
    <>
      <Meta title={t("Вход")} />

      <div className="align-items-center login justify-content-center justify-content-center flex-column d-flex vh-100 p-3">
        {variant == "qr" ? (
          <div className="login-box-qr">
            <div className="d-flex justify-content-center">
              <QRCode
                size={350}
                className="qr-login"
                value={
                  "gjasdg87asdg89shtq8ug487a8g8rg8a8rg8hra8ha85rgharahf4liktk432jk214k888a9s8a9f8ayfsy453gg54h676j6741q3w4gfghh65j577j3j53ll993434fg5w32yh6h"
                }
                viewBox={`0 0 350 350`}
              />
            </div>
            <div class="fw-8 h5 mb-3 mt-4 text-center">
              {t("Войдите через QR код")}
            </div>
            <p className="fw-6 mb-2 d-flex align-items-start">
              <Badge pill bg="dark" className="me-3">
                1
              </Badge>
              Зайдите в приложение
            </p>
            <p className="fw-6 mb-2 d-flex align-items-start">
              <Badge pill bg="dark" className="me-3">
                2
              </Badge>
              Перейдите в профиль {">"} Нажмите на значок QR кода
            </p>
            <p className="fw-6 mb-4 d-flex align-items-start">
              <Badge pill bg="dark" className="me-3">
                3
              </Badge>
              Наведите камеру на данный QR код
            </p>
            <Link
              className="w-100 btn btn-primary mt-3"
              onClick={() => setVariant()}
            >
              {!options.authType || options.authType === "email" ? (
                <IoMail size={22} className="me-2" />
              ) : (
                <IoCall size={22} className="me-2" />
              )}
              {t(
                !options.authType || options.authType === "email"
                  ? "Войти по Email"
                  : "Войти по номеру телефона"
              )}
            </Link>
          </div>
        ) : (
          <div className="login-box">
            <form onSubmit={handleSubmit(onSubmit)} className="pb-2">
              <h4 class="fw-8 h4 mb-4">{t("Войдите в профиль")}</h4>
              <div className="mb-3">
                {!options.authType || options.authType === "email" ? (
                  <Input
                    type="email"
                    name="email"
                    inputMode="email"
                    placeholder={t("Введите email")}
                    autocomplete="off"
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
                    autocomplete="off"
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
              <div className="mb-4">
                <Input
                  type="password"
                  name="password"
                  errors={errors}
                  autocomplete="off"
                  placeholder={t("Введите пароль")}
                  register={register}
                  validation={{
                    required: t("Введите пароль"),
                    minLength: {
                      value: 6,
                      message:
                        "Минимальный пароль должен состоять из 6 символов",
                    },
                  }}
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={loadingLogin || !isValid}
                className={"w-100 " + (loadingLogin ? "loading" : "")}
              >
                {t("Войти")}
              </Button>
              <Link to="/recovery" className="w-100 btn mt-2">
                {t("Забыли пароль?")}
              </Link>
            </form>
            <Link className="w-100 btn btn-light mt-4" to="/reg">
              {t("Создать профиль")}
            </Link>
            <div className="custom-hr" />
            <Link
              className="w-100 btn btn-primary mt-4"
              onClick={() => setVariant("qr")}
            >
              <IoQrCodeOutline size={24} className="me-2" />
              {t("Войти через приложение")}
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
