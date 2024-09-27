import React, { useCallback, useEffect } from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NotificationManager } from "react-notifications";
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

      <div className="align-items-center login justify-content-center justify-content-center d-flex vh-100">
        <form  onSubmit={handleSubmit(onSubmit)}>
          <h4 class="fw-6 h4 mb-4">{t("Войдите в профиль")}</h4>
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
          <div className="mb-4">
            <Input
              type="password"
              name="password"
              errors={errors}
              placeholder={t("Введите пароль")}
              register={register}
              validation={{
                required: t("Введите пароль"),
                minLength: {
                  value: 6,
                  message: "Минимальный пароль должен состоять из 6 символов",
                },
              }}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={loadingLogin || !isValid}
            className={"w-100 rounded-3 " + (loadingLogin ? "loading" : "")}
          >
            {t("Войти")}
          </Button>
          <div className="mt-4 text-center text-muted fs-09">
            <Link to="/recovery">{t("Забыли пароль?")}</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
