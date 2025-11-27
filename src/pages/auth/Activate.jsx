import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import QRCode from "react-qr-code";
import { Button, Row, Col, Container } from "react-bootstrap";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Empty from "../../components/Empty";
import EmptyActivate from "../../components/empty/activate";
import Meta from "../../components/Meta";
import InputCode from "../../components/utils/InputCode";
import { Timer } from "../../helpers/timer";
import {
  authActivate,
  authNewKeyActivate,
  checkRegistration,
  logout,
} from "../../services/auth";
import { setUser } from "../../store/reducers/authSlice";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { IoCall, IoMail } from "react-icons/io5";
import useIsMobile from "../../hooks/isMobile";

const Activate = () => {
  const { t } = useTranslation();
  const inputCodeRef = useRef();
  const isMobileLG = useIsMobile("991px");
  const user = useSelector((state) => state.auth.user);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const options = useSelector((state) => state.settings.options);
  const [endTimer, setEndTimer] = useState(false);
  const [status, setStatus] = useState(false);
  const [typeRecovery, setTypeRecovery] = useState({
    show: false,
    status: false,
  });
  const city = useSelector((state) => state.affiliate.city);

  const {
    control,
    formState: { isValid },
    setValue,
    reset,
  } = useForm({
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
    (type) => {
      setTypeRecovery({ ...typeRecovery, show: false });
      if (type === "telegram") {
        NotificationManager.success(t("Перейдите в телеграм бота..."));
        return reset({ ...data, type });
      }
      if (type === "whatsapp") {
        NotificationManager.success(t("Перейдите в WhatsApp бота..."));
        return reset({ ...data, type });
      }
      authActivate({ ...data, city, type })
        .then((res) => {
          dispatch(setUser(res));
          setStatus(true);
        })
        .catch((error) => {
          NotificationManager.error(
            typeof error?.response?.data?.error === "string"
              ? error.response.data.error
              : t("Неизвестная ошибка")
          );
          setStatus(false);
        });
    },
    [options, data, typeRecovery]
  );

  const onNewKey = () => {
    setEndTimer(false);
    authNewKeyActivate(user)
      .then(() => {
        NotificationManager.success(t("Код подтверждения отправлен повторно"));
      })
      .catch((error) => {
        handleClear();
        NotificationManager.error(
          typeof error?.response?.data?.error === "string"
            ? error.response.data.error
            : t("Неизвестная ошибка")
        );
      });
  };
  const onCheckRecovery = useCallback(() => {
    if (city) {
      checkRegistration(city)
        .then((res) => {
          setTypeRecovery({ show: true, status: res.status });
        })
        .catch((error) => {
          setTypeRecovery({ show: true, status: false });
          NotificationManager.error(
            typeof error?.response?.data?.error == "string"
              ? error.response.data.error
              : "Неизвестная ошибка"
          );
        });
    }
  }, [data, t, city]);

  const handleClear = () => {
    if (inputCodeRef.current) {
      inputCodeRef.current.clear(); // Вызов метода очистки
    }
  };

  useEffect(() => {
    if (data?.key?.length > 0 && data.key?.length === 4) {
      onSubmit(data?.type);
    }
  }, [data.key]);

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
    <>
      <Meta
        title={t(
          "Подтверждение " +
            (options.authType == "email"
              ? "электронной почты"
              : "номера телефона")
        )}
      />
      <Container>
        <section className="d-flex flex-column align-items-center justify-content-center vh-100-header">
          <div className="recovery-form">
            <div className={typeRecovery?.show ? "" : "d-none"}>
              <h4 className="fw-6 mb-4">
                {t("Выберите способ подтверждения номера")}
              </h4>

              {options?.authType === "phone" &&
                options?.regMethod?.telegram && (
                  <Button
                    onClick={() => onSubmit("telegram")}
                    className="btn-telegram d-flex align-items-center w-100 btn-lg mb-3"
                    isValid={isValid}
                  >
                    <FaTelegramPlane size={20} className="me-2" />
                    {t("Получить код в Telegram")}
                  </Button>
                )}
              {options?.authType === "phone" &&
                options?.regMethod?.whatsapp && (
                  <Button
                    onClick={() => onSubmit("whatsapp")}
                    className="btn-whatsapp d-flex align-items-center w-100 btn-lg mb-3"
                    isValid={isValid}
                  >
                    <FaWhatsapp size={20} className="me-2" />
                    {t("Получить код в WhatsApp")}
                  </Button>
                )}
              {options?.authType === "phone" &&
                options?.regMethod?.call &&
                typeRecovery?.status && (
                  <Button
                    onClick={() => onSubmit("call")}
                    isValid={isValid}
                    className="w-100 btn-lg d-flex align-items-center btn-dark mb-3"
                  >
                    <IoCall size={20} className="me-2" />
                    {t("Заказать звонок")}
                  </Button>
                )}
              {options?.authType === "phone" &&
                options?.regMethod?.sms &&
                typeRecovery?.status && (
                  <Button
                    onClick={() => onSubmit()}
                    isValid={isValid}
                    className="w-100 d-flex align-items-center btn-lg mb-3"
                  >
                    <IoMail size={20} className="me-2" />
                    {t("Получить код по SMS")}
                  </Button>
                )}
              <Button
                onClick={() => setTypeRecovery({ show: false, status: false })}
                isValid={isValid}
                className="w-100 btn-light btn-lg"
              >
                {t("Отмена")}
              </Button>
            </div>

            <div className={typeRecovery?.show ? "d-none" : ""}>
              {(!data?.type || data?.type === "sms") &&
              options?.authType === "phone" ? (
                <div className="auth-icon">
                  <img src="/imgs/auth/sms.png" />
                </div>
              ) : data?.type === "call" && options?.authType === "phone" ? (
                <div className="auth-icon">
                  <img src="/imgs/auth/call.png" />
                </div>
              ) : data?.type === "whatsapp" && options?.authType === "phone" ? (
                <Row className="auth-icon">
                  <Col md={7}>
                    <img src="/imgs/auth/whatsapp.png" />
                  </Col>
                  {!isMobileLG && (
                    <Col className="text-center" md={5}>
                      <QRCode
                        size={350}
                        className="qr-recovery"
                        value={`https://wa.me/79179268990?text=${encodeURIComponent(
                          "Подтвердить телефон"
                        )}`}
                        viewBox={`0 0 350 350`}
                      />
                      <a
                        href={`https://web.whatsapp.com/send/?phone=79179268990&text=${encodeURIComponent(
                          "Подтвердить телефон"
                        )}&type=phone_number&app_absent=1`}
                        target="_blank"
                        className="btn-whatsapp d-flex align-items-center m-auto btn-xs mt-2"
                      >
                        <FaWhatsapp size={18} className="me-1" />
                        {t("Открыть WEB WhatsApp")}
                      </a>
                    </Col>
                  )}
                </Row>
              ) : (
                data?.type === "telegram" &&
                options?.authType === "phone" && (
                  <Row className="auth-icon">
                    <Col md={7}>
                      <img src="/imgs/auth/tg.png" />
                    </Col>
                    <Col className="text-center" md={5}>
                      <QRCode
                        size={350}
                        className="qr-recovery"
                        value={`https://t.me/on_id_bot?text=/start&start`}
                        viewBox={`0 0 350 350`}
                      />
                      <a
                        href={`https://t.me/on_id_bot?text=/start&start`}
                        target="_blank"
                        className="btn-telegram d-flex align-items-center m-auto btn-xs mt-2"
                      >
                        <FaTelegramPlane size={18} className="me-1" />
                        {t("Открыть WEB Telegram")}
                      </a>
                    </Col>
                  </Row>
                )
              )}
              <h1 className="h4 text-center mb-3">
                {t("Введите код подтверждения")}
              </h1>

              {!options?.authType || options?.authType === "email" ? (
                <p className="mb-4 text-center text-muted">
                  {t(
                    `Введите код из присланного нами письма на почту ${user?.email}`
                  )}
                </p>
              ) : data?.type === "telegram" ? (
                <ol className="text-left mb-4 ms-0 ps-3">
                  <li>
                    Перейдите к боту Telegram{" "}
                    <a
                      href={`https://t.me/on_id_bot?text=/start&start`}
                      target="_blank"
                      className="fw-6"
                    >
                      @on_id_bot
                    </a>
                  </li>
                  <li>Отправьте предложенное сообщение</li>
                  <li>Введите 4-значный код из ответного сообщения</li>
                  <li>
                    Убедитесь, что используете аккаунт с тем же номером
                    телефона, который вы указали ранее
                  </li>
                </ol>
              ) : data?.type === "whatsapp" ? (
                <ol className="text-left mb-4 ms-0 ps-3">
                  <li>Перейдите к боту WhatsApp</li>
                  <li>Отправьте предложенное сообщение</li>
                  <li>Введите 4-значный код из ответного сообщения</li>
                  <li>
                    Убедитесь, что используете аккаунт с тем же номером
                    телефона, который вы указали ранее
                  </li>
                </ol>
              ) : data?.type === "call" ? (
                <p className="mb-4 text-center text-muted">
                  {t(
                    `Укажите последние 4 цифры номера телефона из звонка по номеру ${user?.phone}.`
                  )}
                </p>
              ) : (
                <p className="mb-4 text-center text-muted">
                  {t(
                    `Введите код из присланного нами сообщения на номер телефона ${user?.phone}`
                  )}
                </p>
              )}
              <div className="mb-4">
                <InputCode
                  ref={inputCodeRef}
                  length={4}
                  autoFocus={true}
                  onChange={(e) => setValue("key", e)}
                />
              </div>
              {(!data?.type ||
                data?.type === "phone" ||
                data?.type === "call") && (
                <p className="fs-09 text-muted text-center">
                  {endTimer ? (
                    <a onClick={() => onNewKey()}>
                      {t("Отправить повторно код подтверждения")}
                    </a>
                  ) : (
                    <p>
                      {t("Повторить отправку кода подтверждения через")}{" "}
                      <Timer onEnd={() => setEndTimer(true)} /> сек
                    </p>
                  )}
                </p>
              )}
              <button
                draggable={false}
                type="submit"
                disabled={!data?.key || data?.key?.length != 4}
                className="btn-primary w-100 mt-4"
                onClick={() => onSubmit()}
              >
                {t(
                  `Подтвердить ${
                    options.authType == "email" ? "почту" : "номер телефона"
                  }`
                )}
              </button>
              <button
                draggable={false}
                className="btn-dark w-100 mt-3"
                onClick={() => onCheckRecovery()}
              >
                {t("Подтвердить другим способом")}
              </button>

              <button
                draggable={false}
                className="w-100 mt-4"
                onClick={() => dispatch(logout())}
              >
                {t("Выйти из аккаунта")}
              </button>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
};

export default Activate;
