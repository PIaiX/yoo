import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Catalog from "../components/Catalog";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";
import Meta from "../components/Meta";
import Input from "../components/utils/Input";
import Loader from "../components/utils/Loader";
import useDebounce from "../hooks/useDebounce";
import { getSearch } from "../services/search";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import CatalogUrman from "../components/CatalogUrman";

const Search = () => {
  const { t } = useTranslation();
  const multiBrand = useSelector((state) => state.settings.options.multiBrand);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);

  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState({
    loading: false,
    items: [],
  });

  const {
    control,
    watch,
    register,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      text: searchParams.get('text'),
    },
  });
  const searchEvent = useDebounce(watch("text"), 500);

  useEffect(() => {
    if (searchEvent?.length > 0) {
      searchParams.set("text", searchEvent);
    } else {
      searchParams.delete("text");
    }
    setSearchParams(searchParams);

    if (searchEvent) {
      setSearch({ loading: true });
      getSearch({
        text: searchEvent,
        affiliateId: selectedAffiliate?.id,
        view: multiBrand,
      })
        .then(
          (res) =>
            res.search && setSearch({ loading: false, items: res.search })
        )
        .catch(() => setSearch({ ...search, loading: false }));
    }
  }, [searchEvent, selectedAffiliate?.id]);

  return (
    <main className="mt-0 pt-0">
      <Meta title={t("Поиск")} />
      <Container className="box p-2 mt-3">
        <Input
          type="search"
          name="text"
          errors={errors}
          placeholder={t("Поиск...")}
          register={register}
          validation={{
            required: t("Обязательное поле"),
            maxLength: { value: 250, message: t("Максимум 250 символов") },
          }}
        />
      </Container>
      {search.loading && <Loader full />}
      {Array.isArray(search.items) && search.items.length > 0 ? (
        <CatalogUrman data={search.items} />
      ) : (
        <Empty
          text={t("Ничего не найдено")}
          desc={t("Попробуйте найти что-то другое")}
          image={() => <EmptyCatalog />}
        />
      )}
    </main>
  );
};

export default Search;
