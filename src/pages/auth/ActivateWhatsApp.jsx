import React, { useCallback, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaWhatsapp } from "react-icons/fa";
import { NotificationManager } from "react-notifications";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Empty from "../../components/Empty";
import EmptyActivate from "../../components/empty/activate";
import Meta from "../../components/Meta";
import InputCode from "../../components/utils/InputCode";
import socket from "../../config/socket";
import { authWhatsApp } from "../../services/auth";
import { setToken, setUser } from "../../store/reducers/authSlice";

const ActivateWhatsApp = () => {
  const { t } = useTranslation();
  const { state } = useLocation();

  const isAuth = useSelector((state) => state.auth.isAuth);
  const [status, setStatus] = useState(false);

  const { control, handleSubmit, setValue } = useForm({
    mode: "onChange",
    reValidateMode: "onSubmit",
    defaultValues: state,
  });
  const data = useWatch({ control });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = useCallback(
    (data) => {
      authWhatsApp({ ...data, step: 2 })
        .then((res) => {
          if (res?.user && res?.token) {
            dispatch(setUser(res.user));
            dispatch(setToken(res.token));

            socket.io.opts.query = {
              userId: res.user?.id ?? false,
              brandId: res.user?.brandId ?? false,
            };
            socket.connect();
          }
          setStatus(true);
        })
        .catch((error) => {
          return NotificationManager.error(
            error?.response?.data?.error || t("Неизвестная ошибка")
          );
        });
    },
    [dispatch, t]
  );

  if (status) {
    return (
      <>
        <Meta title={t("Подтверждение номера телефона")} />
        <Empty
          text={t("Номер телефона успешно подтвержден")}
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

  if (isAuth || !state?.phone) {
    return <Navigate to={"/"} />;
  }

  return (
    <main className="d-flex align-items-center justify-content-center">
      <Meta title={t("Подтверждение номера телефона в WhatsApp")} />
      <section className="d-flex flex-column align-items-center justify-content-center">
        <Form className="recovery-form">
          <Row className="auth-icon">
            <Col md={7}>
              <img src="/imgs/auth/tg.png" />
            </Col>
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
          </Row>

          <h5 className="mb-3 fw-6 text-center">
            {t(`Подтвердите номер телефона в WhatsApp`)}
          </h5>
          <ol className="text-left mb-4 ms-0 ps-3">
            <li>Перейдите к боту WhatsApp</li>
            <li>Отправьте предложенное сообщение</li>
            <li>Введите 4-значный код из ответного сообщения</li>
            <li>
              Убедитесь, что используете аккаунт с тем же номером телефона,
              который вы указали ранее
            </li>
          </ol>
          <div className="mb-2">
            <InputCode
              length={4}
              autoFocus={true}
              onChange={(e) => setValue("key", e)}
            />
          </div>

          <button
            draggable={false}
            type="submit"
            disabled={!data?.key || data?.key?.length != 4}
            className="btn-primary w-100 mt-4"
            onClick={handleSubmit(onSubmit)}
          >
            {t(`Подтвердить номер телефона`)}
          </button>
          <button
            draggable={false}
            className="w-100 mt-4"
            onClick={() => navigate("/login")}
          >
            {t("Изменить способ подтверждения")}
          </button>
        </Form>
      </section>
    </main>
  );
};

export default ActivateWhatsApp;
