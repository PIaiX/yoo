import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import Container from "react-bootstrap/Container";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/utils/Input";
import { authRegister, login } from "../../services/auth";
import Meta from "../../components/Meta";
import { Button } from "react-bootstrap";
import { NotificationManager } from "react-notifications";

import { getImageURL } from "../../helpers/all";
import { useTranslation } from "react-i18next";
import socket from "../../config/socket";
import { setAuth, setToken, setUser } from "../../store/reducers/authSlice";

const Registration = () => {
  const { t } = useTranslation();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.auth.user);
  const options = useSelector((state) => state.settings.options);
  const loadingLogin = useSelector((state) => state.auth.loadingLogin);
  const bgImage = options.auth
    ? getImageURL({
        path: options.auth,
        type: "all/web/auth",
        size: "full",
      })
    : false;
  const navigate = useNavigate();
  const [loadingReg, setLoadingReg] = useState(false);
  const [loginView, setLoginView] = useState(true);
  const block1 = useRef();
  const block2 = useRef();
  const text1 = useRef();
  const text2 = useRef();

  const optionsTiming = {
    duration: 1000,
    easing: "ease-in-out",
    iterations: 1,
    fill: "forwards",
  };

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

  const {
    register: registerReg,
    formState: { errors: errorsReg, isValid: isValidReg },
    handleSubmit: handleSubmitReg,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",

    defaultValues: { accept: true },
  });

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

  const onSubmitReg = useCallback(
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

  const handleClick = () => {
    if (loginView) {
      block1.current.animate(
        {
          width: ["38%", "60%", "38%"],
          right: ["0%", "62%"],
          backgroundPosition: ["100% 100%, 100% 50%", "0% 100%, 0% 50%"],
        },
        optionsTiming
      );
      block2.current.animate(
        {
          marginLeft: ["0%", "38%"],
        },
        optionsTiming
      );
      text1.current.animate(
        {
          marginLeft: ["0%", "100%"],
        },
        optionsTiming
      );
      text2.current.animate(
        {
          left: ["-100%", "0%"],
        },
        optionsTiming
      );
    } else {
      block1.current.animate(
        {
          width: ["38%", "60%", "38%"],
          right: ["62%", "0%"],
          backgroundPosition: ["0% 100%, 0% 50%", "100% 100%, 100% 50%"],
        },
        optionsTiming
      );
      block2.current.animate(
        {
          marginLeft: ["38%", "0%"],
        },
        optionsTiming
      );
      text1.current.animate(
        {
          marginLeft: ["100%", "0%"],
        },
        optionsTiming
      );
      text2.current.animate(
        {
          left: ["0%", "-100%"],
        },
        optionsTiming
      );
    }
    // setLogin(!login);
    setTimeout(() => setLoginView(!loginView), 500);
  };

  const regForm = useMemo(() => (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
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
  ));

  const loginForm = useMemo(() => (
    <form className="login-form" onSubmit={handleSubmitReg(onSubmitReg)}>
      <h4 className="fw-6 mb-1">{t("Регистрация")}</h4>
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
            errors={errorsReg}
            register={registerReg}
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
            errors={errorsReg}
            register={registerReg}
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
          errors={errorsReg}
          register={registerReg}
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
          errors={errorsReg}
          register={registerReg}
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
      <input type="text" className="d-none" {...registerReg("comment")} />
      <label className="d-flex pale-blue mb-4">
        <input
          type="checkbox"
          className="checkbox me-2"
          {...registerReg("accept", {
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
        disabled={loadingReg || !isValidReg}
        className={"w-100 rounded-3 " + (loadingReg ? "loading" : "")}
      >
        {t("Зарегистрироваться")}
      </Button>
    </form>
  ));

  return (
    <main className="py-lg-0">
      <Meta title={t(loginView ? "Вход" : "Регистрация")} />
      <Container>
        <section className="align-items-center login justify-content-center justify-content-lg-between d-flex">
          <div ref={block2} className="login-forms">
            {loginView ? regForm : loginForm}
            <button
              type="button"
              onClick={() => setLoginView(!loginView)}
              className="btn btn-white d-block w-100 rounded-3 d-lg-none fw-6 mx-auto mt-4"
            >
              {loginView ? (
                <span>{t("Создать профиль")}</span>
              ) : (
                <span>{t("Войти в профиль")}</span>
              )}
            </button>
          </div>
          <div
            ref={block1}
            className="login-toggler d-none d-lg-block"
            style={{ backgroundImage: bgImage ? `url(${bgImage})` : null }}
          >
            <div className="text">
              <div ref={text1} className="text-1">
                <h4 className="fw-6 mb-1">{t("Это ваш первый заказ?")}</h4>
                <p>{t("Пройдите регистрацию")}</p>
              </div>
              <div ref={text2} className="text-2">
                <h4 className="fw-6 mb-1">{t("Уже есть аккаунт?")}</h4>
                <p>{t("Войдите в личный кабинет")}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClick}
              className="btn btn-primary rounded-3 fw-6 mx-auto mt-4"
            >
              {loginView ? (
                <span>{t("Создать профиль")}</span>
              ) : (
                <span>{t("Войти в профиль")}</span>
              )}
            </button>
          </div>
        </section>
      </Container>
    </main>
  );
};

export default Registration;
