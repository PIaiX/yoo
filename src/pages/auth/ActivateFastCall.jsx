import React, { useEffect } from "react";
import { Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Empty from "../../components/Empty";
import EmptyActivate from "../../components/empty/activate";
import Meta from "../../components/Meta";
import useIsMobile from "../../hooks/isMobile";
import QRCode from "react-qr-code";
import socket from "../../config/socket";
import { setAuth, setToken, setUser } from "../../store/reducers/authSlice";

const ActivateFastCall = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const isAuth = useSelector((state) => state.auth.isAuth);
  const apiId = useSelector((state) => state.settings.apiId);
  const isMobileLG = useIsMobile("991px");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (apiId) {
      socket.emit("create", "id" + apiId);
      socket.on("login", (data) => {
        if (data?.user && data?.token) {
          dispatch(setUser(data.user));
          dispatch(setToken(data.token));

          dispatch(setAuth(true));
          socket.io.opts.query = {
            brandId: data?.user?.brandId ?? false,
            userId: data?.user?.id ?? false,
          };
          socket.connect();
        }
      });
      return () => {
        socket.off("login");
      };
    }
  }, [apiId]);

  if (isAuth) {
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
      <Meta title={t("Подтверждение номера телефона по звонку")} />
      <section className="d-flex flex-column align-items-center justify-content-center">
        <Form className="recovery-form">
          {/* <img src="/imgs/auth/call.png" /> */}
          {!isMobileLG && (
            <Col className="text-center m-auto mb-3" md={5}>
              <QRCode
                size={350}
                className="qr-recovery"
                value={`+79179268990`}
                viewBox={`0 0 350 350`}
              />
            </Col>
          )}
          <h5 className="mb-3 fw-6 text-center">
            {t(`Подтвердите номер телефона по звонку`)}
          </h5>
          <a
            href={`tel:+79179268990`}
            target="_blank"
            className="fw-6 btn btn-primary m-auto"
          >
            Позвонить на номер +7(917)926-89-90
          </a>
          <p className="text-center m-auto mt-3">
            Сделайте звонок на указаный номер
          </p>

          {/* <button
            draggable={false}
            type="submit"
            disabled={!data?.key || data?.key?.length != 4}
            className="btn-primary w-100 mt-4"
            onClick={handleSubmit(onSubmit)}
          >
            {t(`Подтвердить номер телефона`)}
          </button> */}
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

export default ActivateFastCall;
