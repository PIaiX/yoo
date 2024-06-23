import React, { useLayoutEffect } from "react";
import LiAddress from "../../components/LiAddress";
import AccountTitleReturn from "../../components/AccountTitleReturn";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Empty from "../../components/Empty";
import EmptyAddresses from "../../components/empty/addresses";
import { useTranslation } from "react-i18next";

const Addresses = () => {
  const addresses = useSelector((state) => state.address);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useLayoutEffect(() => {
    if (user?.status === 0) {
      return navigate("/activate");
    }
  }, [user]);

  if (!Array.isArray(addresses.items) || addresses.items.length <= 0) {
    return (
      <Empty
        mini
        text={t("Адрес не добавлен")}
        desc={t("Создайте новый адрес для доставки заказа")}
        image={() => <EmptyAddresses />}
        button={
          <Link className="btn-primary" to="/account/addresses/add">
            {t("Добавить адрес")}
          </Link>
        }
      />
    );
  }

  return (
    <section className="addresses">
      <AccountTitleReturn
        className="d-lg-none"
        link="/account"
        title={t("Адреса")}
      />
      <div className="d-flex flex-column flex-lg-column-reverse">
        <ul className="addresses-list w-100">
          {addresses?.items?.length > 0 &&
            addresses.items.map((e) => <LiAddress data={e} />)}
        </ul>
        <Link
          to="add"
          className="w-xs-100 btn-primary mt-3 mt-lg-0 mb-0 mb-lg-3"
        >
          {t("Добавить адрес")}
        </Link>
      </div>
    </section>
  );
};

export default Addresses;
