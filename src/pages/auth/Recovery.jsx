import React, { useCallback } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Input from "../../components/utils/Input";
import { useForm } from "react-hook-form";
// import PasswordForm from "../../components/forms/PasswordForm";

const Recovery = () => {
  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({ mode: "all", reValidateMode: "onChange" });

  const onSubmitReg = useCallback((data) => {
    // authRegister(data)
    //   .then((res) => {
    //     NotificationManager.success("Завершите регистрацию, подтвердив почту");
    //   })
    //   .catch(
    //     (err) =>
    //       err &&
    //       NotificationManager.error(
    //         err?.response?.data?.error ?? "Неизвестная ошибка при регистрации"
    //       )
    //   );
  }, []);

  return (
    <main>
      <Container>
        <section className="sec-password mb-6">
          <h1 className="h2 text-center">Восстановление пароля</h1>
          <Row className="justify-content-center">
            <Col xs={12} xl={5}>
              <div className="wrap">
                <form
                  className="login-form"
                  // onSubmit={handleSubmitReg(onSubmitReg)}
                >
                  <p class="text-center fs-11 mb-5">
                    Введи данные чтобы зарегистрироваться
                  </p>
                  <div className="mb-3">
                    <Input
                      type="email"
                      label="Email"
                      placeholder="Введите Email"
                      name="email"
                      errors={errors}
                      register={register}
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
                </form>
              </div>
            </Col>
          </Row>
        </section>
      </Container>
    </main>
  );
};

export default Recovery;
