import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  Form,
  Accordion,
  Button,
  Col,
  Container,
  Offcanvas,
  Row,
} from "react-bootstrap";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import CategoryCard from "../components/CategoryCard";
import DataTable from "../components/DataTable";
import Meta from "../components/Meta";
import Callback from "../components/modals/Callback";
import ProductCard from "../components/ProductCard";
import ProjectItem from "../components/ProjectItem";
import ServiceItem from "../components/ServiceItem";
import Filter from "../components/svgs/Filter";
import PrevIcon from "../components/svgs/PrevIcon";
import Loader from "../components/utils/Loader";
import MultyRangeCustom from "../components/utils/MultyRangeCustom";
import NavTop from "../components/utils/NavTop";
import SwiperButtonNext from "../components/utils/SwiperButtonNext";
import SwiperButtonPrev from "../components/utils/SwiperButtonPrev";
import { childrenArray, getImageURL } from "../helpers/all";
import { getCategory } from "../services/category";
import { removeFilter, updateFilter } from "../store/reducers/settingsSlice";

const Category = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFeedback, setShowFeedback] = useState(false);
  const { categoryId } = useParams();
  const filters = useSelector(
    (state) =>
      state?.settings?.filter?.length > 0 &&
      state.settings.filter.find(
        (e) => Number(e.categoryId) === Number(categoryId)
      )
  );

  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [category, setCategory] = useState({
    loading: true,
    item: {},
  });

  const {
    control,
    formState: { isValid, errors },
    handleSubmit,
    setValue,
    reset,
    trigger,
    register,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: filters ?? { options: [] },
  });

  const data = useWatch({ control });

  const onLoad = useCallback(() => {
    setCategory((prev) => ({ ...prev, loading: true }));
    getCategory({ page: searchParams.get("page"), ...data, id: categoryId })
      .then((res) => {
        res.params = childrenArray(res.params, "id", "parentId");
        setCategory({ loading: false, item: res });
      })
      .catch(() => setCategory((data) => ({ ...data, loading: false })));
  }, [categoryId, data, searchParams]);

  useLayoutEffect(() => {
    onLoad();
  }, [categoryId, data?.sort, searchParams.get("page")]);

  useEffect(() => {
    dispatch(updateFilter({ ...data, categoryId }));
  }, [data, categoryId]);

  const onFilter = useCallback(
    (option) => {
      let isOption =
        data?.options && data?.options?.length > 0
          ? option?.type == "select"
            ? data.options.findIndex(
                (e) =>
                  e.type == option.type && Number(e.id) == Number(option.id)
              )
            : data.options.findIndex(
                (e) =>
                  e.type == option.type &&
                  Number(e.value) == Number(option.value) &&
                  Number(e.id) == Number(option.id)
              )
          : -1;

      return isOption == -1 ? false : data?.options[isOption]?.value;
    },
    [data?.options]
  );

  const onChangeFilter = useCallback(
    (option) => {
      if (option) {
        if (data?.options?.length > 0) {
          if (option?.type == "checkbox") {
            let isOption = data.options.findIndex(
              (e) =>
                e.type == option.type &&
                Number(e.value) == Number(option.value) &&
                Number(e.id) == Number(option.id)
            );
            if (isOption >= 0 && isOption != -1) {
              setValue(
                "options",
                data.options.filter((e) => e.value != option.value)
              );
            } else {
              setValue("options", [...data.options, option]);
            }
          } else if (option?.type == "select") {
            let isOption = data.options.findIndex(
              (e) => e.type == option.type && Number(e.id) == Number(option.id)
            );

            if (
              option?.id &&
              (!option?.value || option.value == null || option.value == "NaN")
            ) {
              setValue(
                "options",
                data.options.filter((e) => e.value == null)
              );
            } else {
              if (isOption >= 0 && isOption != -1) {
                let options = [...data.options];
                options[isOption] = option;
                setValue("options", options);
              } else {
                setValue("options", [...data.options, option]);
              }
            }
          }
        } else {
          setValue("options", [option]);
        }
      }
    },
    [data?.options]
  );

  if (category?.loading) {
    return <Loader full />;
  }

  return (
    <main>
      <Meta
        title={category?.item?.title}
        description={category?.item?.description}
        image={
          category?.item?.media
            ? getImageURL({
                path: category.item.media,
                size: "full",
                type: "category",
              })
            : false
        }
      />
      <section className="category mb-5">
        <Container>
          {category.item?.categories?.length > 1 && (
            <>
              <NavTop toBack={false} breadcrumbs={true} />
              <Swiper
                className="category-topSlider mb-5"
                spaceBetween={10}
                slidesPerView={2}
                speed={750}
                breakpoints={{
                  576: {
                    spaceBetween: 16,
                    slidesPerView: 3,
                  },
                  768: {
                    slidesPerView: 4,
                    spaceBetween: 16,
                  },
                  992: {
                    slidesPerView: 5,
                    spaceBetween: 16,
                  },
                  1200: {
                    slidesPerView: 6,
                    spaceBetween: 16,
                  },
                }}
              >
                {category.item.categories.map((obj) => {
                  return (
                    <SwiperSlide key={obj.id}>
                      <CategoryCard data={obj} />
                    </SwiperSlide>
                  );
                })}
                <SwiperButtonPrev />
                <SwiperButtonNext />
              </Swiper>
            </>
          )}

          <h1 className="mb-4 mb-lg-5">{category.item.title ?? "Категория"}</h1>
          <Row className="gx-5 mb-5">
            <Col lg={3} className="position-relative">
              <Offcanvas
                show={show}
                onHide={handleClose}
                className="offcanvas-filter"
                responsive="lg"
              >
                <Offcanvas.Body>
                  <form className="filter">
                    <div className="filter-heading">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="d-flex d-md-none fs-15 me-2"
                      >
                        <PrevIcon className="svgSW" />
                      </button>
                      <h5 className="mb-0">Фильтры</h5>
                      <button
                        type="reset"
                        className="ms-auto"
                        onClick={() => {
                          dispatch(removeFilter());
                          reset({
                            min: category.item?.min ?? 0,
                            max: category.item?.max ?? 100,
                          });
                        }}
                      >
                        очистить
                      </button>
                    </div>
                    {category.item?.min > 0 && category.item?.max > 0 && (
                      <fieldset>
                        <legend>Цена, ₽</legend>
                        <MultyRangeCustom
                          minRange={category.item?.min ?? 0}
                          maxRange={category.item?.max ?? 100}
                          valueMin={data?.min ?? category.item?.min ?? 0}
                          valueMax={data?.max ?? category.item?.max ?? 100}
                          onChange={(e) => e && reset({ ...data, ...e })}
                        />
                      </fieldset>
                    )}
                    <Accordion defaultActiveKey={0}>
                      {category.item?.params?.length > 0 &&
                        category.item?.params.map((e, index) => {
                          return e.type === "select" &&
                            e?.children?.length > 0 ? (
                            <fieldset>
                              <legend>{e.title}</legend>
                              <select
                                name="select"
                                className="w-100 mb-2"
                                onChange={(s) =>
                                  onChangeFilter({
                                    type: e.type,
                                    id: Number(e.id),
                                    value: Number(s.target.value),
                                  })
                                }
                                defaultValue={onFilter({
                                  type: e.type,
                                  id: e.id,
                                })}
                              >
                                <option>Не выбрано</option>
                                {e.children.map((item) => (
                                  <option value={item.id}>{item.value}</option>
                                ))}
                              </select>
                            </fieldset>
                          ) : e.type === "checkbox" &&
                            e?.children?.length > 0 ? (
                            <Accordion.Item as="fieldset" eventKey={index}>
                              <Accordion.Header as="legend">
                                {e.title}
                              </Accordion.Header>
                              <Accordion.Body>
                                <ul>
                                  {e.children.map((item) => (
                                    <li>
                                      <Form.Check className="mb-2">
                                        <Form.Check.Input
                                          type="checkbox"
                                          name="checkbox"
                                          id={item.id}
                                          defaultChecked={onFilter({
                                            type: e.type,
                                            id: e.id,
                                            value: item.id,
                                          })}
                                          onChange={() =>
                                            onChangeFilter({
                                              type: e.type,
                                              id: Number(e.id),
                                              value: Number(item.id),
                                            })
                                          }
                                        />
                                        <Form.Check.Label
                                          htmlFor={item.id}
                                          className="ms-2"
                                        >
                                          {item.value}
                                        </Form.Check.Label>
                                      </Form.Check>
                                    </li>
                                  ))}
                                </ul>
                                {/* <button type="button" className="more">
                                  показать все
                                </button> */}
                              </Accordion.Body>
                            </Accordion.Item>
                          ) : null;
                        })}
                    </Accordion>
                    <Button
                      variant="primary"
                      className="w-100 rounded-3"
                      onClick={() => onLoad()}
                    >
                      Применить
                    </Button>
                  </form>
                </Offcanvas.Body>
              </Offcanvas>
            </Col>
            <Col lg={9}>
              <div className="d-md-flex justify-content-between mb-5">
                <div>
                  {category?.item?.child?.length > 0 && (
                    <div className="subcategories-slider">
                      {category.item.child
                        .filter((e) => e.productCount > 0)
                        .map((e) => (
                          <NavLink to={"/category/" + e.id}>{e.title}</NavLink>
                        ))}
                    </div>
                  )}
                </div>
                <div>
                  <select className="flex-1" {...register("sort")}>
                    <option value="">Сортировать по</option>
                    <option value="new">Новое</option>
                    <option value="old">Старое</option>
                    <option value="cheaper">Дешевле</option>
                    <option value="expensive">Дороже</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleShow}
                    className="input d-lg-none p-2 ms-3 w-fit"
                  >
                    <Filter className="fs-14 dark-gray" />
                  </button>
                </div>
              </div>
              <Row
                xs={2}
                sm={3}
                xxl={4}
                className="gx-4 gy-5 justify-content-center"
              >
                <DataTable
                  data={category.item?.products?.items}
                  pagination={category.item?.products?.pagination}
                  renderItem={(e) =>
                    !e.type || e.type == "dish" || e.type == "product" ? (
                      <Col>
                        <ProductCard data={e} onFeedback={setShowFeedback} />
                      </Col>
                    ) : e.type == "project" ? (
                      <Col>
                        <ProjectItem data={e} />
                      </Col>
                    ) : (
                      <Col>
                        <ServiceItem data={e} />
                      </Col>
                    )
                  }
                />
              </Row>
            </Col>
          </Row>
          <Callback
            show={!!showFeedback}
            product={showFeedback}
            setShow={setShowFeedback}
          />
          {/* <h5>Загловок для сео</h5>
          <hr />
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
            eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
            qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
            sed quia non numquam eius modi tempora incidunt ut labore et dolore
            magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
            nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
            aliquid ex ea commodi consequatur? Quis autem vel eum iure
            reprehenderit qui in ea voluptate velit esse quam nihil molestiae
            consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla
            pariatur?
          </p>
          <button type="button" className="secondary mt-3">
            показать полностью
          </button> */}
        </Container>

        {/* <div className="sticky-box mb-3 mb-sm-4 mb-md-5">
          <Categories/>
        </div> */}
        {/* <div className="categories-box">
          <CategoryGroup/>
          <CategoryGroup/>
        </div> */}
      </section>
    </main>
  );
};

export default Category;
