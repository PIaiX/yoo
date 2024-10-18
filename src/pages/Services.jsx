import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "swiper/css";
import Empty from "../components/Empty";
import EmptyCatalog from "../components/empty/catalog";
import Meta from "../components/Meta";
import ServiceItem from "../components/ServiceItem";
import Loader from "../components/utils/Loader";
import { getServices } from "../services/service";
import { updateFilter } from "../store/reducers/settingsSlice";

const Services = () => {
  const dispatch = useDispatch();

  const [services, setServices] = useState({
    loading: true,
    items: [],
  });

  const {
    control,
    formState: { isValid, errors },
    setValue,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: { options: [] },
  });

  const data = useWatch({ control });

  const onLoad = useCallback(() => {
    getServices()
      .then((res) => {
        setServices({ ...res, loading: false });
      })
      .catch(() => setServices((res) => ({ ...res, loading: false })));
  }, []);

  useLayoutEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    dispatch(updateFilter({ ...data }));
  }, [data]);

  if (services?.loading) {
    return <Loader full />;
  }

  return (
    <main>
      <Meta title="Услуги" />
      <section className="category mb-5">
        <Container>
          <h1 className="mb-4 mb-lg-5">Услуги</h1>

          {!Array.isArray(services?.items) ||
            (services.items.length <= 0 && (
              <Empty
                text="Услуг нет"
                image={() => <EmptyCatalog />}
                button={
                  <Link className="btn-primary" to="/">
                    Перейти на главную
                  </Link>
                }
              />
            ))}
          <Row xs={2} sm={3} md={3} lg={4} xl={4} xxl={4} className="gx-4 gy-5">
            {services?.items?.length > 0 &&
              services.items.map((e) => (
                <Col>
                  <ServiceItem data={e} />
                </Col>
              ))}
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Services;
