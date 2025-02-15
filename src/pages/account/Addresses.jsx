import React, { useLayoutEffect } from "react";
import LiAddress from "../../components/LiAddress";
import AccountTitleReturn from "../../components/AccountTitleReturn";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Empty from "../../components/Empty";
import EmptyAddresses from "../../components/empty/addresses";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const Addresses = () => {
  const addressData = useSelector((state) => state.address);
  const city = useSelector((state) => state.affiliate.city);
  const user = useSelector((state) => state.auth.user);
  const [addresses, setAddresses] = useState();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useLayoutEffect(() => {
    if (user?.status === 0) {
      return navigate("/activate");
    }
  }, [user]);

  useLayoutEffect(() => {
    if (addressData.items?.length > 0) {
      setAddresses(
        city?.title
          ? addressData.items.filter(
              (e) =>
                e?.city?.toLowerCase() === city?.title?.toLowerCase() ||
                e?.region?.toLowerCase() === city?.region?.toLowerCase() ||
                e?.area?.toLowerCase() === city?.area?.toLowerCase()
            )
          : addressData
      );
    }
  }, [addressData, city]);

  if (!Array.isArray(addresses) || addresses.length <= 0) {
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
      <div className="d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between">
          <AccountTitleReturn  title={t("Адреса")} />
 
          <Link to="add" className="w-xs-100 btn-primary mb-3">
            {t("Добавить адрес")}
          </Link>
        </div>
        <ul className="addresses-list w-100">
          {addresses?.length > 0 &&
            addresses.map((e) => <LiAddress data={e} />)}
        </ul>
      </div>
    </section>
  );
};

export default Addresses;
