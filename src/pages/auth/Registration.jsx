import React, {
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
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
import { isMobile } from "react-device-detect";
import { getImageURL } from "../../helpers/all";

const Registration = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.auth.user);
  const options = useSelector((state) => state.settings.options);
  const bgImage = options.auth
    ? getImageURL({
        path: options.auth,
        type: "all/web/auth",
        size: "full",
      })
    : false;
  const navigate = useNavigate();

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

  useLayoutEffect(() => {
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
  } = useForm({ mode: "all", reValidateMode: "onChange" });

  const dispatch = useDispatch();

  const onSubmit = useCallback((data) => {
    dispatch(login(data));
  }, []);

  const onSubmitReg = useCallback(
    (data) => {
      authRegister(data)
        .then((res) => {
          NotificationManager.success(
            "Завершите регистрацию, подтвердив почту"
          );
          if (res?.id) {
            dispatch(login(data));
          }
          navigate("/activate");
        })
        .catch((error) =>
          NotificationManager.error(
            typeof error?.response?.data?.error === "string"
              ? error.response.data.error
              : "Неизвестная ошибка"
          )
        );
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
      <h4 className="main-color text-center fw-4">С возвращением!</h4>
      {/* <p className="text-center fs-11 mb-5">
        Вкусные роллы и пицца скучали по тебе
      </p> */}
      <div className="mb-3">
        {!options.authType || options.authType === "email" ? (
          <Input
            type="email"
            label="Email"
            name="email"
            placeholder="Введите email"
            errors={errors}
            register={register}
            validation={{
              required: "Введите email",
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
            label="Номер телефона"
            name="phone"
            placeholder="+7(900)000-00-00"
            mask="+7(999)999-99-99"
            errors={errors}
            register={register}
            maxLength={16}
            validation={{
              required: "Введите номер телефона",
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
          label="Пароль"
          type="password"
          name="password"
          errors={errors}
          placeholder="Введите пароль"
          register={register}
          validation={{
            required: "Введите пароль",
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
        disabled={!isValid}
        className="w-100 rounded-3"
      >
        Войти
      </Button>
      <div className="mt-4 text-center text-muted fs-09">
        <Link to="/recovery">Забыли пароль?</Link>
      </div>
    </form>
  ));

  const loginForm = useMemo(() => (
    <form className="login-form" onSubmit={handleSubmitReg(onSubmitReg)}>
      <h4 className="main-color text-center fw-4">Привет, друг!</h4>
      <p className="text-center fs-11 mb-5">
        Введи данные, чтобы зарегистрироваться
      </p>
      <div className="mb-3">
        {!options.authType || options.authType === "email" ? (
          <Input
            type="email"
            label="Email"
            name="email"
            placeholder="Введите email"
            errors={errorsReg}
            register={registerReg}
            validation={{
              required: "Введите email",
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
            label="Номер телефона"
            name="phone"
            placeholder="+7(900)000-00-00"
            mask="+7(999)999-99-99"
            errors={errorsReg}
            register={registerReg}
            maxLength={16}
            validation={{
              required: "Введите номер телефона",
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
          label="Пароль"
          placeholder="Придумайте пароль"
          name="password"
          errors={errorsReg}
          register={registerReg}
          validation={{
            required: "Введите пароль",
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
          label="Подтверждение пароля"
          placeholder="Повторите пароль"
          name="passwordConfirm"
          errors={errorsReg}
          register={registerReg}
          validation={{
            required: "Введите повторный пароль",
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
      <label className="d-flex pale-blue mb-3">
        <input
          type="checkbox"
          className="checkbox me-2"
          {...registerReg("accept", {
            required: "Примите условия пользовательского соглашения",
          })}
        />
        <span className="fs-09">
          Принять условия Пользовательского соглашения
        </span>
      </label>
      <Button
        type="submit"
        variant="primary"
        disabled={!isValidReg}
        className="w-100 rounded-3"
      >
        Зарегистрироваться
      </Button>
    </form>
  ));

  return (
    <main className="py-lg-0">
      <Meta title={loginView ? "Вход" : "Регистрация"} />
      <Container>
        {isMobile ? (
          <section className="d-lg-none login-mobile">
            {loginView ? regForm : loginForm}
            {loginView ? (
              <button
                type="button"
                onClick={() => setLoginView(false)}
                className="main-color fs-13 mx-auto mt-4 text-decoration-underline"
              >
                Зарегистрироваться
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setLoginView(true)}
                className="main-color fs-13 mx-auto mt-4 text-decoration-underline"
              >
                Войти
              </button>
            )}
          </section>
        ) : (
          <section className="d-none d-lg-flex align-items-center login">
            <div ref={block2} className="login-forms">
              {loginView ? regForm : loginForm}
            </div>
            <div
              ref={block1}
              className="login-toggler"
              style={{ backgroundImage: bgImage ? `url(${bgImage})` : null }}
            >
              <div className="text">
                <div ref={text1} className="text-1">
                  <h4>Это ваш первый заказ?</h4>
                  <p>Пройдите регистрацию</p>
                </div>
                <div ref={text2} className="text-2">
                  <h4>Уже есть аккаунт?</h4>
                  <p>Войди в личный кабинет</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClick}
                className="btn-40 rounded-3 mx-auto mt-4"
              >
                {loginView ? <span>Регистрация</span> : <span>Войти</span>}
              </button>
            </div>
          </section>
        )}
      </Container>
    </main>
  );
};

export default Registration;
