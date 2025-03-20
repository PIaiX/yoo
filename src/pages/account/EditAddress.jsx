import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Col, Dropdown, Form, Row } from "react-bootstrap";
import { useForm, useWatch } from "react-hook-form";
import { NotificationManager } from "react-notifications";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import AccountTitleReturn from "../../components/AccountTitleReturn";
import Empty from "../../components/Empty";
import EmptyAddresses from "../../components/empty/addresses";
import Meta from "../../components/Meta";
import Input from "../../components/utils/Input";
import Loader from "../../components/utils/Loader";
import Textarea from "../../components/utils/Textarea";
import useDebounce from "../../hooks/useDebounce";
import { editAddress, getAddress } from "../../services/address";
import { getDadataStreets } from "../../services/dadata";
import { updateAddress } from "../../store/reducers/addressSlice";
import { useTranslation } from "react-i18next";
import { getDelivery } from "../../services/order";

const EditAddress = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addressId } = useParams();
  const [loading, setLoading] = useState(true);
  const affiliate = useSelector((state) => state.affiliate.items);
  const cities = useSelector((state) => state.affiliate.cities);
  const options = useSelector((state) => state.settings.options);
  var locations = [];

  if (affiliate?.length > 0 && cities?.length > 0) {
    const affiliateIds = affiliate.map((e) => e.id);

    let foundCities = cities.filter((city) =>
      city.relationCities.some((relationCity) =>
        affiliateIds.includes(relationCity.affiliateId)
      )
    );

    if (foundCities?.length > 0) {
      foundCities.forEach((city) => {
        locations.push({ city: city.title.toLowerCase() });

        if (city?.options?.settlements) {
          city.options.settlements.forEach((settlement) => {
            locations.push({ settlement: settlement.title.toLowerCase() });
          });
        }
      });
    } else {
      affiliate.forEach((e) =>
        locations.push({ city: e.options.city.toLowerCase() })
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
  const dropdownRef = useRef(null);

  const streetText = useDebounce(data.full, 1000);

  useLayoutEffect(() => {
    getAddress(addressId)
      .then((res) => res && reset(res))
      .finally(() => setLoading(false));
  }, [addressId]);

  const clickAddress = useCallback(
    async (address) => {
      try {
        const isValidAddress =
          address &&
          address.data?.geo_lat &&
          address.data?.geo_lon &&
          address.data?.house;

        const commonData = {
          full: address.value ?? null,
          country: address.data.country ?? null,
          region: address.data.region ?? null,
          city: address.data.city ?? null,
          area: address.data.federal_district ?? null,
          street: address.data.street ?? null,
          block: address.data.block ?? null,
          home: address.data.house ?? null,
          apartment: address.data.flat ?? null,
          lat: address.data.geo_lat ?? null,
          lon: address.data.geo_lon ?? null,
          postal: address.data.postal_code ?? null,
          options: {
            fias_id: address.data.fias_id ?? null,
            region_fias_id: address.data.region_fias_id ?? null,
            city_fias_id: address.data.city_fias_id ?? null,
            street_fias_id: address.data.street_fias_id ?? null,
            kladr_id: address.data.kladr_id ?? null,
            region_kladr_id: address.data.region_kladr_id ?? null,
            city_kladr_id: address.data.city_kladr_id ?? null,
            street_kladr_id: address.data.street_kladr_id ?? null,
            fias_level: address.data.fias_level ?? null,
          },
        };

        if (isValidAddress) {
          const info = await getDelivery({
            distance: true,
            area: address.data?.federal_district ?? null,
            city: address.data?.city ?? null,
            lat: address.data.geo_lat,
            lon: address.data.geo_lon,
          });

          if (info?.zone?.affiliateId) {
            setShowDropdown(false);
            return reset({
              ...data,
              affiliate: info.zone.affiliateId,
              zone: info.zone,
              distance: info.distance,
              ...commonData,
            });
          }
        } else if (address?.value) {
          NotificationManager.error(t("Укажите номер дома"));
          return reset({
            ...data,
            ...commonData,
          });
        } else {
          setShowDropdown(false);
        }
      } catch (err) {
        return NotificationManager.error(
          t("Доставка на данный адрес не производится")
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
      if ((e === "Enter" || e.key === "Enter") && streets?.length > 0) {
        clickAddress(streets[0]);
      }
    },
    [showDropdown, streets]
  );

  useEffect(() => {
    if (streetText) {
      getDadataStreets({
        query: streetText,
        locations,
        token: options.dadataToken,
      }).then((res) => {
        if (res?.data?.suggestions) {
          setStreets(res.data.suggestions);
        }
      });
    }
  }, [streetText]);

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      (data?.home || data?.street || data?.affiliate || data?.zone)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onSubmit = useCallback((data) => {
    if (!data?.street) {
      return NotificationManager.error(t("Укажите улицу"));
    }
    if (!data?.home) {
      return NotificationManager.error(t("Укажите номер дома"));
    }
    editAddress(data)
      .then((res) => {
        NotificationManager.success(t("Адрес успешно обновлен"));
        if (res) {
          dispatch(updateAddress(res));
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

  if (loading) {
    return <Loader full />;
  }

  if (!data?.id) {
    return (
      <Empty
        mini
        text={t("Такого адреса не существует")}
        desc={t("Попробуйте обновить страницу или добавьте новый адрес")}
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
      <Meta title={t("Редактировать адрес")} />
      <AccountTitleReturn
        link="/account/addresses"
        title={t("Редактировать адрес")}
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
            maxLength: { value: 250, message: "Максимум 250 символов" },
          }}
        />
        {showDropdown && streets?.length > 0 && (
          <Dropdown.Menu
            ref={dropdownRef}
            show
            className="w-100 custom-input-street"
          >
            {!data?.home && (
              <div className="fs-08 text-danger p-2 px-3">
                {t("Выберите адрес с номером дома")}
              </div>
            )}
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
      {!data?.private && (
        <Row>
          <Col md={3}>
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
          <Col md={3}>
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
          <Col md={3}>
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
          <Col md={3}>
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
        </Row>
      )}
      <Form.Check className="mb-4">
        <Form.Check.Input
          type="checkbox"
          name="private"
          id="private"
          value={true}
          {...register("private")}
        />
        <Form.Check.Label htmlFor="private" className="ms-2">
          {t("Частный дом")}
        </Form.Check.Label>
      </Form.Check>
      <Row>
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
            draggable={false}
            disabled={
              !isValid ||
              showDropdown ||
              (data?.private && (!data?.street || !data?.home))
            }
            onClick={handleSubmit(onSubmit)}
            className="btn-primary w-xs-100 mb-3"
          >
            {t("Сохранить адрес")}
          </button>
        </div>
        <div>
          <p className="fs-09 ms-3 mb-3">
            <span className="text-danger">*</span> -{" "}
            {t("обязательные поля для заполнения")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default EditAddress;
