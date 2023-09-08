import React, { useLayoutEffect } from "react";
import Container from "react-bootstrap/Container";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Meta from "../../components/Meta";
import Loader from "../../components/utils/Loader";
import { authActivate } from "../../services/auth";
import { useState } from "react";
import Empty from "../../components/Empty";
import EmptyWork from "../../components/empty/work";

const Activate = () => {
  const { key } = useParams();
  const auth = useSelector((state) => state?.auth);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false);

  useLayoutEffect(() => {
    if (auth.isAuth) {
      navigate("/account");
    } else {
      authActivate(key)
        .then(() => {
          setStatus(true);
          setLoading(false);
        })
        .catch(() => {
          setStatus(false);
          setLoading(false);
        });
    }
  }, [auth.isAuth]);

  if (loading) {
    return <Loader full />;
  }

  return (
    <>
      <Meta title="Подтверждение почты" />
      <Empty
        text={
          status
            ? "Вы успешно подтвердили почту"
            : "Ошибка при подтверждении почты"
        }
        desc="Вероятно вы перешли по старой ссылке. Попробуйте запросить подтверждение еще раз."
        image={() => <EmptyWork />}
        button={
          <Link to="/login" className="btn btn-primary">
            Войти в профиль
          </Link>
        }
      />
    </>
  );
};

export default Activate;
