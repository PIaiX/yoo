import React, { useCallback, useState } from "react";
import Container from "react-bootstrap/Container";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NotificationManager } from "react-notifications";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Meta from "../../components/Meta";
import Input from "../../components/utils/Input";
import InputCode from "../../components/utils/InputCode";
import { Timer } from "../../helpers/timer";
import { authNewKeyRecovery, authPasswordRecovery } from "../../services/auth";

const Recovery = () => {
  const authType = useSelector((state) => state.settings.options.authType);
  const [endTimer, setEndTimer] = useState(false);
  const { t } = useTranslation();

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

    authPasswordRecovery(data)
      .then(() => {
        reset({ ...data, step: data.step + 1 });
        data.step == 1 ||
          (data.step == 3 &&
            NotificationManager.success(
              data.step == 1
                ? t("Код подтверждения отправлен")
                : data.step == 3 && t("Пароль успешно изменен")
            ));
      })
      .catch((error) =>
        NotificationManager.error(
          typeof error?.response?.data?.error === "string"
            ? error.response.data.error
            : t("Неизвестная ошибка")
        )
      );
  }, []);

  const onNewKey = () => {
    setEndTimer(false);
    authNewKeyRecovery(data);
  };

  return (
    <main>
      <Meta title={t("Восстановление пароля")} />
      <Container>
        <section className="sec-password mb-6 d-flex flex-column align-items-center justify-content-center">
          <div className="wrap login-forms">
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
              {!data.step || data.step === 1 ? (
                <>
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
                            message: t("Максимально 16 символов"),
                          },
                        }}
                      />
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mx-auto mt-4"
                    disabled={!isValid}
                  >
                    {t("Отправить")}
                  </button>
                </>
              ) : data.step === 2 ? (
                <>
                  <h1 className="h4 text-center mb-4">
                    {t("Введите код подтверждения")}
                  </h1>
                  <p className="mb-4 text-center text-muted">
                    {!authType || authType === "email" ? (
                      <>
                        {t("Код подтверждения отправлен на указанную почту")}{" "}
                        <b>{data.email}</b>
                      </>
                    ) : (
                      <>
                        {t(
                          "Код подтверждения отправлен на указанный номер телефона"
                        )}{" "}
                        <b>{data.phone}</b>
                      </>
                    )}
                  </p>
                  <p className="mb-4">
                    <InputCode
                      length={4}
                      autoFocus={true}
                      onChange={(e) => setValue("key", e)}
                    />
                  </p>
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
                  <button
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
                    {t(
                      "Теперь войдите в свой профиль через форму авторизации."
                    )}
                  </p>
                  <Link className="btn btn-primary mx-auto mt-4" to="/login">
                    {t("Перейти ко входу")}
                  </Link>
                </>
              )}
            </form>
          </div>
        </section>
      </Container>
    </main>
  );
};

export default Recovery;
