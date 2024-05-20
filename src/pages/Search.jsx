import React, { useLayoutEffect, useState } from "react";
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

const Search = () => {
  const multiBrand = useSelector((state) => state.settings.options.multiBrand);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
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
      text: "",
    },
  });
  const searchEvent = useDebounce(watch("text"), 500);

  useLayoutEffect(() => {
    if (searchEvent && selectedAffiliate?.id) {
      setSearch({ loading: true });
      getSearch({
        text: searchEvent,
        affiliateId: selectedAffiliate.id,
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
      <Meta title="Поиск" />
      <Container className="box p-2 mt-3">
        <Input
          type="search"
          name="text"
          errors={errors}
          placeholder="Поиск..."
          register={register}
          validation={{
            required: "Обязательное поле",
            maxLength: { value: 250, message: "Максимум 250 символов" },
          }}
        />
      </Container>
      {search.loading && <Loader full />}
      {Array.isArray(search.items) && search.items.length > 0 ? (
        <Catalog data={search.items} />
      ) : (
        <Empty
          text="Ничего не найдено"
          desc="Попробуйте найти что-то другое"
          image={() => <EmptyCatalog />}
        />
      )}
    </main>
  );
};

export default Search;
