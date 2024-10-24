import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Col, Dropdown, Form, Row } from "react-bootstrap";
import { useForm, useWatch } from "react-hook-form";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AccountTitleReturn from "../../components/AccountTitleReturn";
import Meta from "../../components/Meta";
import Input from "../../components/utils/Input";
import Textarea from "../../components/utils/Textarea";
import useDebounce from "../../hooks/useDebounce";
import { createAddress } from "../../services/address";
import { getDadataStreets } from "../../services/dadata";
import { setAddress } from "../../store/reducers/addressSlice";
import { useTranslation } from "react-i18next";
import { getDelivery } from "../../services/order";
import { Alert } from "bootstrap";

const CreateAddress = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const affiliate = useSelector((state) => state.affiliate.items);
  const cities = useSelector((state) => state.affiliate.cities);
  var locations = [];
  if (affiliate?.length > 0) {
    affiliate.forEach((e) => locations.push({ city: e.options.city }));
  }
  if (affiliate?.length === 1) {
    let city = cities.find((e) => e.title === affiliate[0]?.options?.city);
    if (city?.options?.settlements?.length > 0) {
      city.options.settlements.forEach((e) =>
        locations.push({ settlement: e.title })
      );
    }
  }

  const [streets, setStreets] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    control,
    register,
    formState: { errors, isValid },
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
  });
  const data = useWatch({ control });

  const streetText = useDebounce(data.full, 1000);

  useLayoutEffect(() => {
    if (user?.status === 0) {
      return navigate("/activate");
    }
  }, [user]);

  const clickAddress = useCallback(
    async (address) => {
      try {
        if (address && address.data?.geo_lat && address.data?.geo_lon) {
          let info = await getDelivery({
            distance: true,
            lat: address.data.geo_lat,
            lon: address.data.geo_lon,
          });

          if (info?.zone?.affiliateId) {
            return reset({
              ...data,
              affiliate: info?.zone.affiliateId,
              zone: info?.zone,
              distance: info?.distance,
              full: address.value ?? null,
              country: address.data.country ?? null,
              region: address.data.region ?? null,
              city: address.data.city ?? null,
              area: address.data.federal_district ?? null,
              street: address.data.street ?? null,
              home: address.data.house ?? null,
              apartment: address.data.flat ?? null,
              lat: address.data.geo_lat ?? null,
              lon: address.data.geo_lon ?? null,
              postal: address.data.postal_code ?? null,
              options: {
                // ФИАС
                fias_id: address.data.fias_id ?? null,
                region_fias_id: address.data.region_fias_id ?? null,
                city_fias_id: address.data.city_fias_id ?? null,
                street_fias_id: address.data.street_fias_id ?? null,

                // КЛАДР
                kladr_id: address.data.kladr_id ?? null,
                region_kladr_id: address.data.region_kladr_id ?? null,
                city_kladr_id: address.data.city_kladr_id ?? null,
                street_kladr_id: address.data.street_kladr_id ?? null,

                // Всего этажей
                fias_level: address.data.fias_level ?? null,
              },
            });
          } else {
            setValue("full", null);
            reset();
            setShowDropdown(false);
          }
        }
        setShowDropdown(false);
      } catch (err) {
        setValue("full", null);
        reset();
        setShowDropdown(false);
        return NotificationManager.error(
          t("Доставка на данный адрес не производиться")
        );
      }
    },
    [data]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (!showDropdown) {
        setShowDropdown(true);
      }
      if (e === "Enter" && streets?.length > 0) {
        clickAddress(streets[0]);
        setStreets([]);
      }
    },
    [showDropdown, streets]
  );

  useEffect(() => {
    if (streetText) {
      getDadataStreets({ query: streetText, locations }).then((res) => {
        if (res?.data?.suggestions) {
          setStreets(res.data.suggestions);
        }
      });
    }
  }, [streetText]);

  const onSubmit = useCallback((data) => {
    createAddress(data)
      .then((res) => {
        NotificationManager.success(t("Адрес успешно добавлен"));
        if (res) {
          dispatch(setAddress(res));
        }
        navigate(-1);
      })
      .catch((error) => {
        NotificationManager.error(
          typeof error?.response?.data?.error === "string"
            ? error.response.data.error
            : t("Неизвестная ошибка")
        );
      });
  }, []);

  return (
    <section className="addresses">
      <Meta title={t("Добавить адрес")} />
      <AccountTitleReturn
        link="/account/addresses"
        title={t("Добавить адреса")}
      />
      <div className="mb-4 position-relative">
        <Input
          required
          errors={errors}
          label={t("Адрес")}
          onKeyDown={(e) => onKeyDown(e)}
          onClick={() => setShowDropdown(true)}
          type="search"
          autoComplete="off"
          name="full"
          placeholder={t("Введите адрес")}
          register={register}
          validation={{
            required: t("Обязательное поле"),
            maxLength: { value: 250, message: t("Максимум 250 символов") },
          }}
        />
        {showDropdown && streets?.length > 0 && (
          <Dropdown.Menu
            onClick={() => setShowDropdown(false)}
            show
            className="w-100 select-options"
          >
            {streets.map(
              (item, key) =>
                item && (
                  <Dropdown.Item onClick={() => clickAddress(item)} key={key}>
                    {item.value}
                  </Dropdown.Item>
                )
            )}
          </Dropdown.Menu>
        )}
      </div>
      <Row>
        <Col md={4}>
          <div className="mb-4">
            <Input
              required
              errors={errors}
              label={t("Дом")}
              name="home"
              placeholder={t("Введите дом")}
              register={register}
              validation={{
                required: t("Обязательное поле"),
                maxLength: { value: 20, message: t("Максимум 20 символов") },
              }}
            />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-4">
            <Input
              errors={errors}
              label={t("Корпус")}
              name="block"
              placeholder={t("Введите корпус")}
              register={register}
              validation={{
                maxLength: { value: 20, message: t("Максимум 20 символов") },
              }}
            />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-4">
            <Input
              required
              errors={errors}
              label={t("Подъезд")}
              name="entrance"
              placeholder={t("Введите подъезд")}
              register={register}
              validation={{
                required: t("Обязательное поле"),
                maxLength: { value: 20, message: t("Максимум 20 символов") },
              }}
            />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-4">
            <Input
              required
              errors={errors}
              label={t("Квартира")}
              name="apartment"
              placeholder={t("Введите квартиру")}
              register={register}
              validation={{
                required: t("Обязательное поле"),
                maxLength: { value: 20, message: t("Максимум 20 символов") },
              }}
            />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-4">
            <Input
              required
              errors={errors}
              label={t("Этаж")}
              type="number"
              name="floor"
              placeholder={t("Введите этаж")}
              register={register}
              validation={{
                required: t("Обязательное поле"),
                maxLength: { value: 20, message: t("Максимум 20 символов") },
              }}
            />
          </div>
        </Col>
        <Col md={4}>
          <div className="mb-4">
            <Input
              errors={errors}
              label={t("Код домофона")}
              name="code"
              placeholder={t("Введите код")}
              register={register}
              validation={{
                maxLength: { value: 30, message: t("Максимум 30 символов") },
              }}
            />
          </div>
        </Col>
        <Col md={12}>
          <div className="mb-4">
            <Input
              errors={errors}
              label={t("Название адреса")}
              name="title"
              placeholder={t("Например 'Дом'")}
              register={register}
              validation={{
                maxLength: { value: 150, message: t("Максимум 150 символов") },
              }}
            />
          </div>
        </Col>
      </Row>
      <div className="mb-4">
        <Textarea
          label={t("Комментарий")}
          name="comment"
          placeholder={t("Введите комментарий (Необязательно)")}
          errors={errors}
          register={register}
          validation={{
            maxLength: { value: 1500, message: t("Максимум 1500 символов") },
          }}
        />
      </div>
      <Form.Check className="mb-4">
        <Form.Check.Input
          type="checkbox"
          name="main"
          id="main"
          value={1}
          {...register("main")}
        />
        <Form.Check.Label htmlFor="main" className="ms-2">
          {t("Адрес по умолчанию")}
        </Form.Check.Label>
      </Form.Check>
      <div className="d-md-flex d-block align-items-center ">
        <div>
          <button
            disabled={!isValid || showDropdown || !data?.zone}
            onClick={handleSubmit(onSubmit)}
            className="btn-primary w-xs-100 mb-3"
          >
            {t("Сохранить адрес")}
          </button>
        </div>
        <div>
          {data?.zone || !data?.full ? (
            <p className="fs-09 ms-3 mb-3">
              <span className="text-danger">*</span> -{" "}
              {t("обязательные поля для заполнения")}
            </p>
          ) : (
            <p className="fs-09 text-danger ms-3 mb-3">
              {t("Доставка на данный адрес не производиться")}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CreateAddress;
