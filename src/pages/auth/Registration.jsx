import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import { IoCall, IoMail, IoQrCodeOutline } from "react-icons/io5";
import { NotificationManager } from "react-notifications";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Meta from "../../components/Meta";
import Input from "../../components/utils/Input";
import socket from "../../config/socket";
import { getImageURL } from "../../helpers/all";
import {
  authFastCall,
  authQrGenerate,
  authRegister,
  authTelegram,
  authWhatsApp,
  checkRegistration,
  login,
} from "../../services/auth";
import {
  setAuth,
  setQr,
  setToken,
  setUser,
} from "../../store/reducers/authSlice";

const Registration = () => {
  const { t } = useTranslation();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const user = useSelector((state) => state.auth.user);
  const apiId = useSelector((state) => state.settings.apiId);
  const options = useSelector((state) => state.settings.options);
  const city = useSelector((state) => state.affiliate.city);
  const addresses = useSelector((state) => state.address.items);
  const loadingLogin = useSelector((state) => state.auth.loadingLogin);
  const qr = useSelector((state) => state.auth.qr);
  const [modalQr, setModalQr] = useState(false);
  const [typeReg, setTypeReg] = useState({ show: false, status: false });
  const timerRef = useRef(null);
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
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      address: addresses?.length > 0 ? addresses[0] : false,
      rememberBy: true,
      accept: true,
    },
  });

  const {
    control: controlReg,
    register: registerReg,
    formState: { errors: errorsReg, isValid: isValidReg },
    trigger: triggerReg,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      accept: true,
      rememberBy: true,
      address: addresses?.length > 0 ? addresses[0] : false,
    },
  });
  const dataReg = useWatch({ control: controlReg });
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

  const onCheckRegistration = useCallback(() => {
    if (dataReg?.phone?.length > 0 && city) {
      setLoadingReg(true);
      checkRegistration(city)
        .then((res) => {
          setTypeReg({ show: true, status: res.status });
        })
        .catch((error) => {
          setTypeReg({ show: true, status: false });
          NotificationManager.error(
            typeof error?.response?.data?.error == "string"
              ? error.response.data.error
              : "Неизвестная ошибка"
          );
        })
        .finally(() => setLoadingReg(false));
    }
  }, [dataReg, t, city]);

  const onSubmitReg = useCallback(
    (type = false) => {
      if (dataReg?.phone && dataReg.phone?.length > 0) {
        let phone = dataReg.phone.replace(/[^\d]/g, "").trim();
        if (!phone) {
          return NotificationManager.error("Укажите номер телефона");
        }
        if (phone?.length < 11) {
          return NotificationManager.error("Введите корректный номер телефона");
        }
      }
      if (dataReg?.password !== dataReg?.passwordConfirm) {
        triggerReg("passwordConfirm");
        return NotificationManager.error("Пароли не совпадают");
      }
      if (dataReg?.comment?.length > 0) {
        return NotificationManager.error(
          "Регистрация временно недоступна, попробуйте немного позже"
        );
      }
      if (type === "fastCall") {
        if (!dataReg?.phone || dataReg?.phone?.length === 0) {
          return NotificationManager.error("Укажите номер телефона");
        }
        authFastCall(dataReg)
          .then((res) => {
            socket.io.opts.query = {
              brandId: res.user.brandId ?? false,
              userId: res.user.id ?? false,
            };
            socket.connect();

            navigate("/activate-fast-call", {
              state: { ...res.user, phone: dataReg.phone },
            });
            setTypeReg({ show: false, status: false });
          })
          .catch((error) => {
            return NotificationManager.error(
              error?.response?.data?.error || t("Неизвестная ошибка")
            );
          });
        return;
      }
      if (type === "telegram") {
        if (!dataReg?.phone || dataReg?.phone?.length === 0) {
          return NotificationManager.error("Укажите номер телефона");
        }

        authTelegram(dataReg)
          .then((res) => {
            if (res?.user?.id) {
              dispatch(setUser(res.user));
              dispatch(setToken(res.token));

              dispatch(setAuth(true));

              socket.io.opts.query = {
                brandId: res.user.brandId ?? false,
                userId: res.user.id ?? false,
              };
              socket.connect();
            }
            // window.open("https://t.me/on_id_bot?start", "_blank");
            navigate("/activate-telegram", { state: dataReg });
            setTypeReg({ show: false, status: false });
          })
          .catch((error) => {
            return NotificationManager.error(
              error?.response?.data?.error || t("Неизвестная ошибка")
            );
          });

        return;
      }
      if (type === "whatsapp") {
        if (!dataReg?.phone || dataReg?.phone?.length === 0) {
          return NotificationManager.error("Укажите номер телефона");
        }

        authWhatsApp(dataReg)
          .then((res) => {
            console.log(res);
            if (res?.user?.id) {
              dispatch(setUser(res.user));
              dispatch(setToken(res.token));

              dispatch(setAuth(true));

              socket.io.opts.query = {
                brandId: res.user.brandId ?? false,
                userId: res.user.id ?? false,
              };
              socket.connect();
            }
            // window.open(
            //   res?.whatsappPhone && res?.whatsappPhone?.length > 0
            //     ? `https://wa.me/${res.whatsappPhone}?text=Подтвердить номер телефона (Нажмите отправить сообщение)`
            //     : "https://wa.me/79179268990?text=Подтвердить номер телефона (Нажмите отправить сообщение)",
            //   "_blank"
            // );
            navigate("/activate-whatsapp", { state: dataReg });
            setTypeReg({ show: false, status: false });
          })
          .catch((error) => {
            return NotificationManager.error(
              error?.response?.data?.error || t("Неизвестная ошибка")
            );
          });

        return;
      }
      setLoadingReg(true);

      authRegister({ ...dataReg, type })
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
    [options, dataReg]
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

  useEffect(() => {
    // Очистка таймера при размонтировании компонента
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (modalQr && options.qr) {
      const updateQrToken = async () => {
        try {
          const token = await authQrGenerate(); // Ваша функция генерации QR-токена
          if (token) {
            dispatch(setQr(token));
          }
        } catch (error) {}
      };

      updateQrToken();

      timerRef.current = setInterval(updateQrToken, 300000); // 5 мин
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [modalQr]);

  useEffect(() => {
    if (apiId && options.qr) {
      socket.io.opts.query = {
        brandId: user.brandId ?? false,
        userId: user.id ?? false,
      };
      socket.connect();
      socket.emit("create", "id" + apiId);
      socket.on("login", (data) => {
        if (data?.user && data?.token) {
          dispatch(setUser(data.user));
          dispatch(setToken(data.token));

          dispatch(setAuth(true));
        }
      });
      return () => {
        socket.off("login");
      };
    }
  }, [apiId, user]);

  const regForm = useMemo(() => (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
      <h4 className="fw-6 h4 mb-4">{t("Войдите в профиль")}</h4>
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
      <Form.Check className="mb-3">
        <Form.Check.Input
          type="checkbox"
          name="rememberBy"
          id="rememberBy"
          value={true}
          {...register("rememberBy")}
        />
        <Form.Check.Label htmlFor="rememberBy" className="ms-2">
          {t("Запомнить вход")}{" "}
        </Form.Check.Label>
      </Form.Check>
      <Button
        type="submit"
        variant="primary"
        disabled={loadingLogin || !isValid}
        className={"w-100 btn-lg " + (loadingLogin ? "loading" : "")}
      >
        {t("Войти")}
      </Button>
      {options?.qr && (
        <Button
          variant="light"
          className={
            "w-100 d-none d-md-flex mt-3 btn-lg " +
            (loadingLogin ? "loading" : "")
          }
          onClick={() => setModalQr(true)}
        >
          <IoQrCodeOutline size={22} className="me-2" />
          {t("Войти по QR коду")}
        </Button>
      )}
      <div className="mt-4 text-center text-muted fs-09">
        <Link to="/recovery">{t("Забыли пароль?")}</Link>
      </div>
    </form>
  ));

  const loginForm = useMemo(() => (
    <div className="login-form">
      <div className={typeReg?.show ? "d-none" : ""}>
        <h4 className="fw-6 mb-1">{t("Регистрация")}</h4>
        <p className="fs-10 mb-4 text-muted">
          {t("Заполните данные, чтобы создать профиль")}
        </p>

        {!options.authType || options.authType === "email" ? (
          <>
            <div className="mb-3">
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
            </div>

            {options?.reg?.phone && (
              <div className="mb-3">
                <Input
                  type="custom"
                  name="dopPhone"
                  inputMode="tel"
                  placeholder="+7(900)000-00-00"
                  mask="+7(999)999-99-99"
                  errors={errorsReg}
                  register={registerReg}
                  maxLength={16}
                  validation={{
                    required: options?.reg?.phoneRequired
                      ? t("Введите номер телефона")
                      : false,
                    maxLength: {
                      value: 16,
                      message: "Максимально 16 символов",
                    },
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-3">
              <Input
                type="custom"
                name="phone"
                inputMode="tel"
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
            </div>
            {options?.reg?.email && (
              <div className="mb-3">
                <Input
                  type="email"
                  name="dopEmail"
                  inputMode="email"
                  placeholder={t("Введите email")}
                  errors={errorsReg}
                  register={registerReg}
                  validation={{
                    required: options?.reg?.emailRequired
                      ? t("Введите email")
                      : false,
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
            )}
          </>
        )}

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
              validate: (value) => {
                const password = dataReg.password;
                return value === password || t("Пароли не совпадают");
              },
            }}
          />
        </div>
        <hr />
        <Row className="gx-2">
          {options?.reg?.firstName && (
            <Col className="mb-3" md={6}>
              <Input
                errors={errorsReg}
                name="firstName"
                placeholder={t("Введите имя")}
                register={registerReg}
                validation={{
                  required: options?.reg?.firstNameRequired
                    ? t("Обязательное поле")
                    : false,
                  maxLength: {
                    value: 30,
                    message: t("Максимум 30 символов"),
                  },
                }}
              />
            </Col>
          )}
          {options?.reg?.lastName && (
            <Col className="mb-3" md={6}>
              <Input
                errors={errorsReg}
                name="lastName"
                placeholder={t("Введите фамилию")}
                register={registerReg}
                validation={{
                  required: options?.reg?.lastNameRequired
                    ? t("Обязательное поле")
                    : false,
                  maxLength: {
                    value: 50,
                    message: t("Максимум 50 символов"),
                  },
                }}
              />
            </Col>
          )}
          {options?.reg?.patronymic && (
            <Col className="mb-3" md={6}>
              <Input
                errors={errorsReg}
                name="patronymic"
                placeholder={t("Введите отчество")}
                register={registerReg}
                validation={{
                  required: options?.reg?.patronymicRequired
                    ? t("Обязательное поле")
                    : false,
                  maxLength: {
                    value: 50,
                    message: t("Максимум 50 символов"),
                  },
                }}
              />
            </Col>
          )}
          {options?.reg?.birthday && (
            <Col className="mb-3" md={6}>
              <Input
                type="date"
                placeholder={t("Укажите день рождение")}
                name="birthday"
                errors={errorsReg}
                register={registerReg}
                validation={{
                  required: options?.reg?.birthdayRequired
                    ? t("Обязательное поле")
                    : false,
                  minLength: {
                    value: 10,
                    message: t("Минимум 10 символов"),
                  },
                  maxLength: {
                    value: 10,
                    message: t("Максимум 10 символов"),
                  },
                }}
              />
            </Col>
          )}
        </Row>
        {options?.reg?.sex && (
          <div className="mb-3">
            <Form.Check className="d-inline-flex me-3">
              <Form.Check.Input
                type="radio"
                name="sex"
                id="sex"
                defaultChecked={true}
                value="man"
                {...registerReg("sex", {
                  required: options?.reg?.sexRequired
                    ? t("Обязательное поле")
                    : false,
                })}
              />
              <Form.Check.Label htmlFor="sex" className="ms-2">
                {t("Мужской")}
              </Form.Check.Label>
            </Form.Check>
            <Form.Check className="d-inline-flex me-3">
              <Form.Check.Input
                type="radio"
                name="sex"
                id="sex2"
                value="woman"
                {...registerReg("sex", {
                  required: options?.reg?.sexRequired
                    ? t("Обязательное поле")
                    : false,
                })}
              />
              <Form.Check.Label htmlFor="sex2" className="ms-2">
                {t("Женский")}
              </Form.Check.Label>
            </Form.Check>
          </div>
        )}
        <input type="text" className="d-none" {...registerReg("comment")} />

        <Form.Check className="mb-3">
          <Form.Check.Input
            type="checkbox"
            name="accept"
            id="accept"
            value={true}
            {...registerReg("accept", {
              required: t("Примите условия пользовательского соглашения"),
            })}
          />
          <Form.Check.Label htmlFor="accept" className="ms-2 fs-09">
            Продолжая регистрацию вы соглашайтесь с{" "}
            <a
              href="/documents"
              target="_blank"
              className="text-decoration-underline text-main"
            >
              условиями использования
            </a>{" "}
            данного сайта
          </Form.Check.Label>
        </Form.Check>
        <Button
          variant="primary"
          disabled={loadingReg || !isValidReg}
          className={"w-100 btn-lg " + (loadingReg ? "loading" : "")}
          onClick={() => {
            // Если authType не указан или это email - сразу отправляем
            if (!options?.authType || options?.authType === "email") {
              return onSubmitReg();
            }

            // Если authType phone и есть методы регистрации - показываем модалку

            if (
              options?.authType === "phone" &&
              options?.regMethod &&
              (options?.regMethod?.telegram ||
                options?.regMethod?.call ||
                options?.regMethod?.whatsapp)
            ) {
              onCheckRegistration();
            } else {
              console.log(3);
              // Во всех остальных случаях - отправляем
              onSubmitReg();
            }
          }}
        >
          {t("Зарегистрироваться")}
        </Button>
      </div>
      <div className={typeReg?.show ? "" : "d-none"}>
        <h4 className="fw-6 mb-4">
          {t("Выберите способ подтверждения номера")}
        </h4>

        {options?.authType === "phone" && options?.regMethod?.telegram && (
          <Button
            onClick={() => onSubmitReg("telegram")}
            className="btn-telegram d-flex align-items-center w-100 btn-lg mb-3"
            isValid={isValid}
          >
            <FaTelegramPlane size={20} className="me-2" />
            {t("Получить код в Telegram")}
          </Button>
        )}
        {options?.authType === "phone" && options?.regMethod?.whatsapp && (
          <Button
            onClick={() => onSubmitReg("whatsapp")}
            className="btn-whatsapp d-flex align-items-center w-100 btn-lg mb-3"
            isValid={isValid}
          >
            <FaWhatsapp size={20} className="me-2" />
            {t("Получить код в WhatsApp")}
          </Button>
        )}
        {options?.authType === "phone" &&
          options?.regMethod?.fastCall &&
          typeReg?.status && (
            <Button
              onClick={() => onSubmitReg("fastCall")}
              isValid={isValid}
              className="w-100 btn-lg d-flex align-items-center btn-dark mb-3"
            >
              <IoCall size={20} className="me-2" />
              {t("Быстрый звонок")}
            </Button>
          )}
        {options?.authType === "phone" &&
          options?.regMethod?.call &&
          typeReg?.status && (
            <Button
              onClick={() => onSubmitReg("call")}
              isValid={isValid}
              className="w-100 btn-lg d-flex align-items-center btn-dark mb-3"
            >
              <IoCall size={20} className="me-2" />
              {t("Подтвердить через звонок")}
            </Button>
          )}
        {options?.authType === "phone" && typeReg?.status && (
          <Button
            onClick={() => onSubmitReg()}
            isValid={isValid}
            className="w-100 d-flex align-items-center btn-lg mb-3"
          >
            <IoMail size={20} className="me-2" />
            {t("Получить код по SMS")}
          </Button>
        )}
        <Button
          onClick={() => setTypeReg({ show: false, status: false })}
          isValid={isValid}
          className="w-100 btn-light btn-lg"
        >
          {t("Отмена")}
        </Button>
      </div>
    </div>
  ));

  return (
    <main className="py-lg-0">
      <Meta title={t(loginView ? "Вход" : "Регистрация")} />
      <Container>
        <section className="align-items-center login justify-content-center justify-content-lg-between d-flex">
          <div ref={block2} className="login-forms">
            {loginView ? regForm : loginForm}
            <button
              draggable={false}
              type="button"
              onClick={() => setLoginView(!loginView)}
              className="btn btn-lg btn-white d-block w-100 rounded-3 d-lg-none fw-6 mx-auto mt-4"
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
              draggable={false}
              type="button"
              onClick={handleClick}
              className="btn btn-primary btn-lg rounded-3 fw-6 mx-auto mt-4"
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
      {options.qr && (
        <Modal size="md" show={modalQr} onHide={setModalQr} centered>
          {/* <Modal.Header closeButton className="fw-7">
            Вход по QR коду
          </Modal.Header> */}

          <Modal.Body>
            <button
              draggable={false}
              type="button"
              className="close"
              onClick={() => setModalQr(false)}
            >
              <HiXMark size={30} />
            </button>
            <div className="login-box-qr mt-3">
              {qr && (
                <div className="d-flex justify-content-center">
                  <QRCode
                    size={350}
                    className="qr-login"
                    value={qr}
                    viewBox={`0 0 350 350`}
                  />
                </div>
              )}

              <div className="fw-7 h5 mb-3 mt-4 text-center">
                {t("Войдите через QR код")}
              </div>
              <p className="fw-4 mb-2 d-flex align-items-start">
                <Badge pill bg="dark" className="me-3">
                  1
                </Badge>
                Зайдите в приложение
              </p>
              <p className="fw-4 mb-2 d-flex align-items-start">
                <Badge pill bg="dark" className="me-3">
                  2
                </Badge>
                Перейдите в профиль {">"} Нажмите на значок QR кода
              </p>
              <p className="fw-4 mb-4 d-flex align-items-start">
                <Badge pill bg="dark" className="me-3">
                  3
                </Badge>
                Наведите камеру на данный QR код
              </p>
              <Link
                className="w-100 btn btn-lg btn-primary mt-3"
                onClick={() => setModalQr(false)}
              >
                {!options.authType || options.authType === "email" ? (
                  <IoMail size={20} className="me-2" />
                ) : (
                  <IoCall size={20} className="me-2" />
                )}
                {t(
                  !options.authType || options.authType === "email"
                    ? "Войти по Email"
                    : "Войти по номеру телефона"
                )}
              </Link>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </main>
  );
};

export default Registration;
