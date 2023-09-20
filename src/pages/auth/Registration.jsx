import React, { useState, useRef, useCallback, useLayoutEffect } from "react";
// import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
// import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/utils/Input";
import { authRegister, login } from "../../services/auth";
import Meta from "../../components/Meta";
import { Button } from "react-bootstrap";
import { NotificationManager } from "react-notifications";
import { setAuth, setUser } from "../../store/reducers/authSlice";

const Registration = () => {
  const { auth, options } = useSelector(({ auth, settings: { options } }) => ({
    auth,
    options,
  }));

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
    if (auth.isAuth) {
      return navigate("/");
    }
  }, []);

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

  const onSubmit = useCallback(async (data) => {
    const response = await dispatch(login(data)).unwrap();
    if (response?.user?.status === 0) {
      navigate("/activate");
    } else {
      navigate("/");
    }
  }, []);

  const onSubmitReg = useCallback(
    (data) => {
      if (data.email) {
        let successDomain = [
          "5ballov.ru",
          "aeterna.ru",
          "aim.com",
          "algxmail.com",
          "ameritech.net",
          "aol.com",
          "att.net",
          "autorambler.ru",
          "bigmir.net",
          "bk.ru",
          "charter.net",
          "clear.net.nz",
          "cox.net",
          "email.it",
          "fastmail.com.au",
          "fastmail.fm",
          "flash.net",
          "fmgirl.com",
          "fotoplenka.ru",
          "free.fr",
          "fromru.com",
          "front.ru",
          "games.com",
          "gmail.com",
          "gmx.de",
          "gmx.net",
          "googlemail.com",
          "hotbox.ru",
          "hotmail.co.nz",
          "hotmail.com",
          "hotmail.ru",
          "hotpop.com",
          "imapmail.org",
          "inbox.ru",
          "interia.pl",
          "km.ru",
          "krovatka.su",
          "land.ru",
          "lenta.ru",
          "libero.it",
          "list.ru",
          "live.com",
          "love.com",
          "mail.ru",
          "mail15.com",
          "mail333.com",
          "megabox.ru",
          "memori.ru",
          "meta.ua",
          "msn.com",
          "myrambler.ru",
          "myrealbox.com",
          "naui.net",
          "newmail.ru",
          "nfmail.com",
          "nightmail.ru",
          "nl.rogers.com",
          "nm.ru",
          "nvbell.net",
          "nxt.ru",
          "o2.pl",
          "olympus.ru",
          "operamail.com",
          "orange.net",
          "pacbell.net",
          "photofile.ru",
          "pisem.net",
          "pochta.com",
          "pochta.ru",
          "pochtamt.ru",
          "pop3.ru",
          "post.ru",
          "pplmail.com",
          "premoweb.com",
          "prodigy.net",
          "qip.ru",
          "rambler.ru",
          "rbcmail.ru",
          "rikt.ru",
          "ro.ru",
          "rocketmail.com",
          "rogers.com",
          "sbcglobal.net",
          "seznam.cz",
          "sibnet.ru",
          "sky.com",
          "sky.ru",
          "skynet.be",
          "smtp.ru",
          "snet.net",
          "softhome.net",
          "startfree.com",
          "su29.ru",
          "swbell.net",
          "talktalk.net",
          "telenet.be",
          "telus.net",
          "tlen.pl",
          "ua.fm",
          "ukr.net",
          "unliminet.de",
          "verizon.net",
          "wans.net",
          "web.de",
          "wow.com",
          "wp.pl",
          "xtra.co.nz",
          "ya.ru",
          "yahoo.ca",
          "yahoo.co.id",
          "yahoo.co.in",
          "yahoo.co.kr",
          "yahoo.co.nz",
          "yahoo.co.th",
          "yahoo.co.uk",
          "yahoo.com",
          "yahoo.com.ar",
          "yahoo.com.au",
          "yahoo.com.br",
          "yahoo.com.cn",
          "yahoo.com.hk",
          "yahoo.com.mx",
          "yahoo.com.my",
          "yahoo.com.ph",
          "yahoo.com.sg",
          "yahoo.com.tw",
          "yahoo.com.vn",
          "yahoo.de",
          "yahoo.dk",
          "yahoo.es",
          "yahoo.fr",
          "yahoo.ie",
          "yahoo.it",
          "yahoo.no",
          "yahoo.pl",
          "yahoo.se",
          "yahoomail.com",
          "yandex.ru",
          "ymail.com",
          "zebra.lt",
          "ziza.ru",
        ];
        let domain = data.email.split("@")[1];
        if (!domain || !successDomain.includes(domain)) {
          NotificationManager.error(
            "Разрешены только популярные почтовые сервисы"
          );
          return false;
        }
      }

      authRegister(data)
        .then((res) => {
          NotificationManager.success(
            "Завершите регистрацию, подтвердив почту"
          );
          if (res?.id) {
            dispatch(setAuth(true));
            dispatch(setUser(res));
          }
          navigate("/activate");
        })
        .catch(
          (err) =>
            err &&
            NotificationManager.error(
              err?.response?.data?.error ?? "Неизвестная ошибка при регистрации"
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

  return (
    <main className="py-lg-0">
      <Meta title={loginView ? "Регистрация" : "Вход"} />
      <Container>
        <section className="d-lg-none login-mobile">
          {loginView ? (
            <button
              type="button"
              onClick={() => setLogin(false)}
              className="main-color fs-13 mx-auto mt-4 text-decoration-underline"
            >
              Зарегистрироваться
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setLogin(true)}
              className="main-color fs-13 mx-auto mt-4 text-decoration-underline"
            >
              Войти
            </button>
          )}
        </section>
        <section className="d-none d-lg-block login">
          <div ref={block2} className="login-forms">
            {loginView ? (
              <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <h4 class="main-color text-center fw-6">
                  С&nbsp;возвращением!
                </h4>
                <p class="text-center fs-11 mb-5">
                  Вкусные роллы и&nbsp;пицца скучали по&nbsp;тебе
                </p>
                <div className="mb-3">
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
                        value: 4,
                        message:
                          "Минимальный пароль должен состоять из 4-ех символов",
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
              </form>
            ) : (
              <form
                className="login-form"
                onSubmit={handleSubmitReg(onSubmitReg)}
              >
                <h4 class="main-color text-center fw-6">Привет, друг!</h4>
                <p class="text-center fs-11 mb-5">
                  Введи данные чтобы&nbsp;зарегистрироваться
                </p>
                <div className="mb-3">
                  <Input
                    type="email"
                    label="Email"
                    placeholder="Введите Email"
                    name="email"
                    errors={errorsReg}
                    register={registerReg}
                    validation={{
                      required: "Введите Email",
                      minLength: {
                        value: 3,
                        message: "Минимально 3 символа",
                      },
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
                      pattern: {
                        value: /(?=.*[0-9])(?=.*[a-z])[0-9a-zA-Z]{6,}/g,
                        message:
                          "Пароль должен содержать не менее 6 символов латинского алфавита и цифры",
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
                      pattern: {
                        value: /(?=.*[0-9])(?=.*[a-z])[0-9a-zA-Z]{6,}/g,
                        message:
                          "Пароль должен содержать не менее 6 символов латинского алфавита и цифры",
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
            )}
          </div>
          <div ref={block1} className="login-toggler">
            <div className="text">
              <div ref={text1} className="text-1">
                <h4>Уже есть аккаунт?</h4>
                <p>Войди в личный кабинет</p>
              </div>
              <div ref={text2} className="text-2">
                <h4>Это ваш первый заказ?</h4>
                <p>Пройдите регистрацию</p>
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
      </Container>
    </main>
  );
};

export default Registration;
