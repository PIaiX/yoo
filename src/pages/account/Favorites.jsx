import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Empty from "../../components/Empty";
import EmptyFavorite from "../../components/empty/favorite";
import ProductCard from "../../components/ProductCard";
import { useTranslation } from "react-i18next";

const Favorites = () => {
  const data = useSelector((state) => state.favorite.items);
  const { t } = useTranslation();

  if (!Array.isArray(data) || data.length <= 0) {
    return (
      <Empty
        mini
        text={t("Избранных товаров нет")}
        desc={t("Вернитесь в меню и добавляйте интересующие товары в этот список")}
        image={() => <EmptyFavorite />}
        button={
          <Link className="btn-primary" to="/">
            {t("Перейти в меню")}
          </Link>
        }
      />
    );
  }

  return (
    <main>
      <ul className="list-unstyled row row-cols-2 row-cols-sm-2 row-cols-lg-3 gx-4 gx-xl-4 gy-5">
        {data.map((e) => (
          <li>
            <ProductCard data={e} />
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Favorites;
