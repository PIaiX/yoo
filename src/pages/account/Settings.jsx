import React, { useCallback, useLayoutEffect } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useForm, useWatch } from "react-hook-form";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AccountTitleReturn from "../../components/AccountTitleReturn";
import Meta from "../../components/Meta";
import Input from "../../components/utils/Input";
import NavBreadcrumbs from "../../components/utils/NavBreadcrumbs";
import { editAccount } from "../../services/account";
import { setUser } from "../../store/reducers/authSlice";
import moment from "moment";

const Settings = () => {
  const user = useSelector((state) => state.auth.user);
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
            NotificationManager.success("Данные успешно обновлены");
            navigate(-1);
          }
        })
        .catch((err) => {
          NotificationManager.error(
            err?.response?.data?.error ?? "Ошибка при сохранении"
          );
        });
    },
    [user]
  );

  return (
    <main className="account mb-2 mb-sm-3 mb-md-0">
      <Meta title="Настройки" />
      <Container className="pt-4 pt-lg-0">
        <AccountTitleReturn
          className="d-lg-none"
          link="/account"
          title="Внесите изменения"
        />
        <h1 className="d-none d-lg-block mb-2">Личный кабинет</h1>
        <NavBreadcrumbs
          className="d-none d-lg-block"
          breadcrumbs={[
            { title: "Аккаунт", link: "/account" },
            { title: "Настройки", link: "/account/settings" },
          ]}
        />

        <Row className="gx-3 gx-xl-4">
          <Col lg={8}>
            <Row className="g-3 g-xl-4">
              <Col xs={12} sm={6} md={4}>
                <div className="box w-100 d-flex align-items-center p-3 h-100">
                  <div className="icon d-none d-sm-none d-md-none d-xxl-flex">
                    <span>
                      {user.firstName
                        ? user.firstName.slice(0, 1).toUpperCase()
                        : "A"}
                    </span>
                  </div>
                  <div>
                    <h6>{user.firstName ?? "Имя"}</h6>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} md={3} className="d-none d-sm-block">
                <div className="box p-3 w-100 h-100 d-flex flex-column justify-content-between text-center">
                  <p className="fs-09 fw-6">Вы можете потратить</p>
                  <p className="main-color">
                    <span className="fs-18">{user.point}</span>&nbsp;
                    <span className="fw-6 fs-18">Б</span>
                  </p>
                </div>
              </Col>
              <Col xs={12} md={5}>
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
              </Col>
              <Col xs={12}>
                <div className="box p-3 p-sm-4">
                  <form action="">
                    <h6 className="mb-3">Внесите изменения</h6>
                    <Row className="fs-11 g-4">
                      <Col md={4}>
                        <Input
                          label="Имя"
                          name="firstName"
                          errors={errors}
                          register={register}
                        />
                      </Col>
                      <Col md={4}>
                        <Input
                          label="Фамилия"
                          name="lastName"
                          errors={errors}
                          register={register}
                        />
                      </Col>
                      <Col md={4}>
                        <Input
                          type="date"
                          label="День рождения"
                          name="birthday"
                          readOnly={!!user?.birthday}
                          errors={errors}
                          register={register}
                        />
                      </Col>
                      <Col md={6}>
                        <Input
                          mask="7(999)999-99-99"
                          label="Номер телефона"
                          name="phone"
                          errors={errors}
                          register={register}
                          validation={{ required: "Обязательное поле" }}
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
                      className="btn-green mt-4 d-block d-md-flex w-xs-100"
                    >
                      Сохранить изменения
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
