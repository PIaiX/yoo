import moment from "moment";
import React, { useCallback, useLayoutEffect } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useForm } from "react-hook-form";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AccountTitleReturn from "../../components/AccountTitleReturn";
import Meta from "../../components/Meta";
import Input from "../../components/utils/Input";
import NavBreadcrumbs from "../../components/utils/NavBreadcrumbs";
import { editAccount } from "../../services/account";
import { setUser } from "../../store/reducers/authSlice";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t } = useTranslation();

  const user = useSelector((state) => state.auth.user);
  const profilePointVisible = useSelector(
    (state) => state.settings.options.profilePointVisible
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (user?.status === 0) {
      return navigate("/activate");
    }
  }, [user]);

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: {
      ...user,
      birthday: user?.birthday
        ? moment(user?.birthday).format("YYYY-MM-DD")
        : null,
    },
  });

  const onSubmit = useCallback(
    async (data) => {
      await editAccount(data)
        .then((res) => {
          res?.user && dispatch(setUser(res.user));

          if (data.email != user.email || !user.email) {
            navigate("email", { state: { email: data.email } });
          } else {
            NotificationManager.success(t("Данные успешно обновлены"));
            navigate(-1);
          }
        })
        .catch((error) => {
          NotificationManager.error(
            typeof error?.response?.data?.error === "string"
              ? error.response.data.error
              : t("Неизвестная ошибка")
          );
        });
    },
    [user]
  );

  return (
    <main className="account mb-2 mb-sm-3 mb-md-0">
      <Meta title={t("Настройки")} />
      <Container className="pt-4 pt-lg-0">
        <AccountTitleReturn
          className="d-lg-none"
          link="/account"
          title="Настройки"
        />
        <h1 className="d-none d-lg-block mb-2">{t("Личный кабинет")}</h1>
        <NavBreadcrumbs
          className="d-none d-lg-block"
          breadcrumbs={[
            { title: t("Аккаунт"), link: "/account" },
            { title: t("Настройки"), link: "/account/settings" },
          ]}
        />

        <Row className="gx-3 gx-xl-4">
          <Col lg={8}>
            <Row className="g-3 g-xl-4">
              <Col xs={12} sm={6} md={6}>
                <div className="box w-100 d-flex align-items-center p-3 h-100">
                  <div className="icon d-none d-sm-none d-md-none d-xxl-flex">
                    <span>
                      {t(
                        user.firstName
                          ? user.firstName.slice(0, 1).toUpperCase()
                          : "A"
                      )}
                    </span>
                  </div>
                  <div>
                    <h6>{t(user.firstName ?? "Имя")}</h6>
                  </div>
                </div>
              </Col>
              {profilePointVisible && (
                <Col xs={12} sm={6} md={6} className="d-none d-sm-block">
                  <div className="box p-3 w-100 h-100 d-flex flex-column justify-content-between text-center">
                    <p className="fs-09 fw-6">{t("Вы можете потратить")}</p>
                    <p className="main-color">
                      <span className="fw-6 fs-13">{user.point}</span>&nbsp;
                      <span className="fw-6 fs-13">Б</span>
                    </p>
                  </div>
                </Col>
              )}
              {/* <Col xs={12} md={5}>
                <label className="mb-3">
                  <span className="me-1 me-sm-3">Включить пуш-уведомления</span>
                  <input
                    type="checkbox"
                    role="switch"
                    {...register("notification")}
                  />
                </label>
                <label>
                  <span className="me-1 me-sm-3">Подписаться на рассылку</span>
                  <input
                    type="checkbox"
                    role="switch"
                    {...register("followEmail")}
                  />
                </label>
              </Col> */}
              <Col xs={12}>
                <div className="box p-3 p-sm-4">
                  <form action="">
                    <h6 className="mb-3">{t("Настройки")}</h6>
                    <Row className="fs-11 g-4">
                      <Col md={4}>
                        <Input
                          label={t("Имя")}
                          name="firstName"
                          errors={errors}
                          register={register}
                        />
                      </Col>
                      <Col md={4}>
                        <Input
                          label={t("Фамилия")}
                          name="lastName"
                          errors={errors}
                          register={register}
                        />
                      </Col>
                      <Col md={4}>
                        <Input
                          type="date"
                          label={t("День рождения")}
                          name="birthday"
                          readOnly={!!user?.birthday}
                          errors={errors}
                          register={register}
                        />
                      </Col>
                      <Col md={6}>
                        <Input
                          mask="7(999)999-99-99"
                          label={t("Номер телефона")}
                          name="phone"
                          errors={errors}
                          register={register}
                          validation={{ required: t("Обязательное поле") }}
                        />
                      </Col>
                      <Col md={6}>
                        <Input
                          label="Email"
                          name="email"
                          errors={errors}
                          register={register}
                        />
                      </Col>
                    </Row>
                    <button
                      type="submit"
                      disabled={!isValid}
                      onClick={handleSubmit(onSubmit)}
                      className="btn-primary mt-4 d-block d-md-flex w-xs-100"
                    >
                      {t("Сохранить изменения")}
                    </button>
                  </form>
                </div>
              </Col>
            </Row>
          </Col>
          <Col lg={4} className="d-none d-lg-block">
            <div className="gradient-block"></div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default Settings;
