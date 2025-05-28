import React, { useCallback, useEffect, useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { IoCall, IoMail } from "react-icons/io5";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Meta from "../../components/Meta";
import Input from "../../components/utils/Input";
import InputCode from "../../components/utils/InputCode";
import QRCode from "react-qr-code";
import { Timer } from "../../helpers/timer";
import {
  authNewKeyRecovery,
  authPasswordRecovery,
  checkRegistration,
} from "../../services/auth";
import { BsLink } from "react-icons/bs";

const Recovery = () => {
  const authType = useSelector((state) => state.settings.options.authType);
  const [endTimer, setEndTimer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typeRecovery, setTypeRecovery] = useState({
    show: false,
    status: false,
  });
  const { t } = useTranslation();
  const options = useSelector((state) => state.settings.options);
  const city = useSelector((state) => state.affiliate.city);

  const {
    control,
    formState: { isValid, errors },
    handleSubmit,
    setValue,
    reset,
    register,
  } = useForm({
    defaultValues: {
      step: 1,
    },
  });

  const data = useWatch({ control });

  const onSubmit = useCallback(
    (type) => {
      if (data?.phone && data.phone?.length > 0) {
        let phone = data.phone.replace(/[^\d]/g, "").trim();
        if (!phone) {
          return NotificationManager.error("Укажите номер телефона");
        }
        if (phone?.length < 11) {
          return NotificationManager.error("Введите корректный номер телефона");
        }
      }

      if (!city) {
        return NotificationManager.error(t("Не указан город"));
      }
      setValue("type", type);

      authPasswordRecovery({ ...data, city, type })
        .then((res) => {
          setEndTimer(false);

          if (data.step == 1 && type === "telegram") {
            NotificationManager.success(t("Перейдите в телеграм бота..."));
            return reset({ ...data, type, step: data.step + 1 });
            // return window.open("https://t.me/on_id_bot?start", "_blank");
          }
          if (data.step == 1 && type === "whatsapp") {
            NotificationManager.success(t("Перейдите в WhatsApp бота..."));
            return reset({ ...data, type, step: data.step + 1 });
            // return window.open(
            //   res?.whatsappPhone && res?.whatsappPhone?.length > 0
            //     ? `https://wa.me/${res.whatsappPhone}?text=Подтвердить номер телефона (Нажмите отправить сообщение)`
            //     : "https://wa.me/79179268990?text=Подтвердить номер телефона (Нажмите отправить сообщение)",
            //   "_blank"
            // );
          }
          reset({ ...data, type, step: data.step + 1 });
          if (data.step == 1 || data.step == 3) {
            NotificationManager.success(
              data.step == 1
                ? data?.phone && type === "call"
                  ? t(
                      `Сейчас на указанный номер ${data?.phone} поступит звонок. Укажите последние 4 цифры номера телефона.`
                    )
                  : data?.phone
                  ? t(
                      `Код подтверждения отправлен на указанный номер ${data?.phone}`
                    )
                  : t(
                      `Код подтверждения отправлен на указанную почту${
                        data?.email ? " " + data.email : ""
                      }`
                    )
                : data.step == 3 && t("Пароль успешно изменен")
            );
          }
        })
        .catch((error) => {
          console.log(error);
          NotificationManager.error(
            typeof error?.response?.data?.error === "string"
              ? error.response.data.error
              : t("Неизвестная ошибка")
          );
        });
    },
    [data, city]
  );

  const onNewKey = () => {
    setEndTimer(false);
    authNewKeyRecovery(data);
  };

  const onCheckRecovery = useCallback(() => {
    if (data?.phone?.length > 0 && city) {
      setLoading(true);
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
        })
        .finally(() => setLoading(false));
    }
  }, [data, t, city]);

  useEffect(() => {
    if (data?.step === 2 && data?.key?.length > 0 && data.key?.length === 4) {
      onSubmit(data);
    }
  }, [data.key]);

  return (
    <>
      <Meta title={t("Восстановление пароля")} />
      <Container>
        <section className="d-flex flex-column align-items-center justify-content-center vh-100">
          <div className="recovery-form">
            {!data.step || data.step === 1 ? (
              <>
                <div className={typeRecovery?.show ? "d-none" : ""}>
                  <h1 className="h4 text-center mb-4">
                    {t("Восстановление пароля")}
                  </h1>
                  <div className="mb-3">
                    {!authType || authType === "email" ? (
                      <Input
                        type="email"
                        label="Email"
                        name="email"
                        inputMode="email"
                        placeholder={t("Введите email")}
                        errors={errors}
                        register={register}
                        validation={{
                          required: t("Введите email"),
                          maxLength: {
                            value: 250,
                            message: t("Максимально 250 символов"),
                          },
                          pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: t("Неверный формат Email"),
                          },
                        }}
                      />
                    ) : (
                      <Input
                        type="custom"
                        label={t("Номер телефона")}
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
                            message: t("Максимально 16 символов"),
                          },
                        }}
                      />
                    )}
                  </div>
                  <Button
                    draggable={false}
                    className={
                      "btn btn-lg btn-primary w-100 mx-auto mt-4 " +
                      (loading ? "loading" : "")
                    }
                    disabled={loading || !isValid}
                    onClick={() => {
                      if (!options?.authType || options?.authType === "email") {
                        return onSubmit();
                      }

                      if (
                        options?.authType === "phone" &&
                        options?.regMethod &&
                        (options?.regMethod?.telegram ||
                          options?.regMethod?.call ||
                          options?.regMethod?.whatsapp)
                      ) {
                        onCheckRecovery();
                      } else {
                        onSubmit();
                      }
                    }}
                  >
                    {t("Отправить")}
                  </Button>
                </div>
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
                        {t("Подтвердить через звонок")}
                      </Button>
                    )}
                  {options?.authType === "phone" && typeRecovery?.status && (
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
                    onClick={() =>
                      setTypeRecovery({ show: false, status: false })
                    }
                    isValid={isValid}
                    className="w-100 btn-light btn-lg"
                  >
                    {t("Отмена")}
                  </Button>
                </div>
              </>
            ) : data.step === 2 ? (
              <>
                {(!data?.type || data?.type === "sms") &&
                options?.authType === "phone" ? (
                  <div className="auth-icon">
                    <img src="/imgs/auth/sms.png" />
                  </div>
                ) : data?.type === "call" && options?.authType === "phone" ? (
                  <div className="auth-icon">
                    <img src="/imgs/auth/call.png" />
                  </div>
                ) : data?.type === "whatsapp" &&
                  options?.authType === "phone" ? (
                  <Row className="auth-icon">
                    <Col md={7}>
                      <img src="/imgs/auth/tg.png" />
                    </Col>
                    <Col className="text-center" md={5}>
                      <QRCode
                        size={350}
                        className="qr-recovery"
                        value={`https://wa.me/79179268990?text=${encodeURIComponent(
                          "Восстановить пароль"
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
                      `Введите код из присланного нами письма на почту ${data?.email}`
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
                      `Укажите последние 4 цифры номера телефона из звонка по номеру ${data?.phone}.`
                    )}
                  </p>
                ) : (
                  <p className="mb-4 text-center text-muted">
                    {t(
                      `Введите код из присланного нами сообщения на номер телефона ${data?.phone}`
                    )}
                  </p>
                )}

                <p className="mb-4">
                  <InputCode
                    length={4}
                    autoFocus={true}
                    onChange={(e) => setValue("key", e)}
                  />
                </p>
                {data?.type !== "whatsapp" && data?.type !== "telegram" && (
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
                  disabled={!data?.key || data?.key?.length < 4}
                  className="btn btn-primary w-100 mx-auto mt-4"
                >
                  {t("Подтвердить")}
                </button>
              </>
            ) : data.step === 3 ? (
              <>
                <h1 className="h4 text-center mb-4">
                  {t("Придумайте новый пароль")}
                </h1>
                <p className="mb-4 text-center text-muted">
                  {t("Минимальный пароль должен состоять из 6 символов")}
                </p>
                <div className="mb-3">
                  <Input
                    type="password"
                    label={t("Пароль")}
                    autoFocus={true}
                    placeholder={t("Придумайте пароль")}
                    name="password"
                    errors={errors}
                    register={register}
                    validation={{
                      required: t("Введите пароль"),
                      minLength: {
                        value: 6,
                        message: t("Минимальное кол-во символов 6"),
                      },
                      maxLength: {
                        value: 250,
                        message: t("Максимальное кол-во символов 250"),
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
                    errors={errors}
                    register={register}
                    validation={{
                      required: t("Введите повторный пароль"),
                      minLength: {
                        value: 6,
                        message: t("Минимальное кол-во символов 6"),
                      },
                      maxLength: {
                        value: 250,
                        message: t("Максимальное кол-во символов 250"),
                      },
                    }}
                  />
                </div>
                <button
                  draggable={false}
                  type="submit"
                  disabled={!isValid}
                  className="btn btn-primary w-100 mx-auto"
                >
                  {t("Сохранить новый пароль")}
                </button>
              </>
            ) : (
              <>
                <h1 className="h4 text-center mb-4">
                  {t("Пароль успешно изменен")}
                </h1>
                <p className="mb-4 text-center text-muted">
                  {t("Теперь войдите в свой профиль через форму авторизации.")}
                </p>
                <Link className="btn btn-primary mx-auto mt-4" to="/login">
                  {t("Перейти ко входу")}
                </Link>
              </>
            )}
          </div>
        </section>
      </Container>
    </>
  );
};

export default Recovery;
