import React from "react";
import LiAddress from "../../components/LiAddress";
import AccountTitleReturn from "../../components/AccountTitleReturn";
import useIsMobile from "../../hooks/isMobile";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Addresses = () => {
  const isMobileLG = useIsMobile("991px");
  const addresses = useSelector((state) => state.address);

  return (
    <section className="addresses">
      {isMobileLG && <AccountTitleReturn link="/account" title="Адреса" />}
      <div className="d-flex flex-column flex-lg-column-reverse">
        <ul className="addresses-list w-100">
          {addresses?.items?.length > 0 &&
            addresses.items.map((e) => <LiAddress data={e} />)}
        </ul>
        <Link
          to="add"
          className="w-xs-100 btn-primary mt-3 mt-lg-0 mb-0 mb-lg-3"
        >
          Добавить адрес
        </Link>
      </div>
    </section>
  );
};

export default Addresses;
