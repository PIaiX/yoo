import React, { useCallback, useState } from "react";
import Container from "react-bootstrap/Container";
import { useForm, useWatch } from "react-hook-form";
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
    authPasswordRecovery(data)
      .then(() => {
        reset({ ...data, step: data.step + 1 });
        data.step == 1 ||
          (data.step == 3 &&
            NotificationManager.success(
              data.step == 1
                ? "Код подтверждения отправлен"
                : data.step == 3 && "Пароль успешно изменен"
            ));
      })
      .catch((err) =>
        NotificationManager.error(
          err?.response?.data?.error ?? "Неизвестная ошибка при регистрации"
        )
      );
  }, []);

  const onNewKey = () => {
    setEndTimer(false);
    authNewKeyRecovery(data);
  };

  return (
    <main>
      <Meta title="Восстановление пароля" />
      <Container>
        <section className="sec-password mb-6 d-flex flex-column align-items-center justify-content-center">
          <div className="wrap login-forms">
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
              {!data.step || data.step === 1 ? (
                <>
                  <h1 className="h4 text-center mb-4">Восстановление пароля</h1>
                  <div className="mb-3">
                    {!authType || authType === "email" ? (
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
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mx-auto mt-4"
                    disabled={!isValid}
                  >
                    Отправить
                  </button>
                </>
              ) : data.step === 2 ? (
                <>
                  <h1 className="h4 text-center mb-4">
                    Введите код подтверждения
                  </h1>
                  <p className="mb-4 text-center text-muted">
                    {!authType || authType === "email" ? (
                      <>
                        Код подтверждения отправлен на указанную почту{" "}
                        <b>{data.email}</b>
                      </>
                    ) : (
                      <>
                        Код подтверждения отправлен на указанный номер телефона{" "}
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
                        Отправить повторно код подтверждения
                      </a>
                    ) : (
                      <p>
                        Повторить отправку кода подтверждения через{" "}
                        <Timer onEnd={() => setEndTimer(true)} /> сек
                      </p>
                    )}
                  </p>
                  <button
                    type="submit"
                    disabled={!data?.key || data?.key?.length < 4}
                    className="btn btn-primary w-100 mx-auto mt-4"
                  >
                    Подтвердить
                  </button>
                </>
              ) : data.step === 3 ? (
                <>
                  <h1 className="h4 text-center mb-4">
                    Придумайте новый пароль
                  </h1>
                  <p className="mb-4 text-center text-muted">
                    Минимальный пароль должен состоять из 6 символов
                  </p>
                  <div className="mb-3">
                    <Input
                      type="password"
                      label="Пароль"
                      autoFocus={true}
                      placeholder="Придумайте пароль"
                      name="password"
                      errors={errors}
                      register={register}
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
                      errors={errors}
                      register={register}
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
                  <button
                    type="submit"
                    disabled={!isValid}
                    className="btn btn-primary w-100 mx-auto"
                  >
                    Сохранить новый пароль
                  </button>
                </>
              ) : (
                <>
                  <h1 className="h4 text-center mb-4">
                    Пароль успешно изменен
                  </h1>
                  <p className="mb-4 text-center text-muted">
                    Теперь войдите в свой профиль через форму авторизации.
                  </p>
                  <Link className="btn btn-primary mx-auto mt-4" to="/login">
                    Перейти ко входу
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
