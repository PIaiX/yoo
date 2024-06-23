import React, { useLayoutEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Meta from "../../components/Meta";
import Loader from "../../components/utils/Loader";
import { authActivateEmail } from "../../services/auth";
import { useTranslation } from "react-i18next";

const ActivateEditEmail = () => {
  const { t } = useTranslation();

  const { key } = useParams();
  const auth = useSelector((state) => state?.auth);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false);

  useLayoutEffect(() => {
    authActivateEmail(key)
      .then(() => {
        setStatus(true);
        setLoading(false);
      })
      .catch(() => {
        setStatus(false);
        setLoading(false);
      });
  }, [auth.isAuth]);

  if (loading) {
    return <Loader full />;
  }

  return (
    <main>
      <Meta title={t("Подтверждение смены почты")} />
      <Container>
        <section className="hv-100 sec-login d-flex flex-column align-items-center justify-content-center">
          <h1 className="h2 text-center">
            {t(status
              ? "Вы успешно изменили почту"
              : "Ошибка при изменении почты")}
          </h1>
          <Link to="/account" className="btn btn-primary">
            {t('Перейти в профиль')}
          </Link>
        </section>
      </Container>
    </main>
  );
};

export default ActivateEditEmail;
