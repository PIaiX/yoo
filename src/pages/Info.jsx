import React, { useEffect, useRef, useState } from "react";
import { ListGroup, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  FaAppStoreIos,
  FaGooglePlay,
  FaInstagram,
  FaPhone,
  FaTelegram,
  FaVk,
  FaWhatsapp,
} from "react-icons/fa6";
import { IoChevronForward } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Empty from "../components/Empty";
import EmptyWork from "../components/empty/work";
import Meta from "../components/Meta";
import { getImageURL } from "../helpers/all";

const Info = () => {
  const { t } = useTranslation();
  const options = useSelector((state) => state.settings.options);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);
  const hasWindow = typeof window !== "undefined";
  const [mobile, setMobile] = useState(false);
  const [width, setWidth] = useState(hasWindow ? window.innerWidth : null);
  let timeOutId = useRef();

  const [mouseMoved, setMouseMoved] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", () => {
      clearTimeout(timeOutId.current);
      timeOutId.current = setTimeout(handleResize, 500);
    });
  }, []);

  useEffect(() => {
    if (width !== null && width < 700) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, [width]);

  if (!options?.info) {
    return (
      <Empty
        text="Нет информации"
        desc="Данные скоро будут добавлены"
        image={() => <EmptyWork />}
        button={
          <Link className="btn-primary" to="/">
            Перейти на главную
          </Link>
        }
      />
    );
  }
  return (
    <main>
      <Meta
        title={
          options?.seo?.info?.title
            ? generateSeoText({
                text: options.seo.info.title,
                site: options?.title,
              })
            : selectedAffiliate?.title
            ? selectedAffiliate?.title
            : options?.title
            ? options.title
            : t("Информация")
        }
        description={
          options?.seo?.info?.description
            ? generateSeoText({
                text: options.seo.info.description,
                site: options?.title,
              })
            : t(
                "Узнайте свежие новости о нашей службе доставки, новых ресторанах, акциях и специальных предложениях."
              )
        }
      />

      <Container className="mb-4">
        {options?.info?.banner && (
          <Slider
            className={"mt-2 mx-4"}
            centerMode={!mobile}
            infinite={true}
            slidesToShow={1}
            adaptiveHeight={true}
            slidesToScroll={1}
            pauseOnHover={true}
            swipe={true}
            variableWidth={!mobile}
          >
            <img
              src={getImageURL({
                path: options?.info?.banner,
                type: "all/web/info",
                size: "full",
              })}
              className={"img-fluid big"}
            />
          </Slider>
        )}
        <ListGroup className="mt-4">
          {options?.info?.phone?.value && options?.info?.phone?.status && (
            <ListGroup.Item
              active={false}
              action
              href={"tel://" + options.info.phone.value}
              className="d-flex flex-row align-items-center p-3"
            >
              <FaPhone size={24} className="me-3" />
              <div className="d-flex align-items-center justify-content-between w-100">
                <div>Позвонить</div>
                <div>
                  <IoChevronForward color="#999" size={20} />
                </div>
              </div>
            </ListGroup.Item>
          )}
          {options?.info?.whatsapp?.value &&
            options?.info?.whatsapp?.status && (
              <ListGroup.Item
                active={false}
                action
                target="_blank"
                href={options.info.whatsapp.value}
                className="d-flex flex-row align-items-center p-3"
              >
                <FaWhatsapp size={24} className="me-3" />
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div>Написать в WhatsApp</div>
                  <div>
                    <IoChevronForward color="#999" size={20} />
                  </div>
                </div>
              </ListGroup.Item>
            )}
          {options?.info?.vk?.value && options?.info?.vk?.status && (
            <ListGroup.Item
              active={false}
              action
              target="_blank"
              href={options.info.vk.value}
              className="d-flex flex-row align-items-center p-3"
            >
              <FaVk size={24} className="me-3" />
              <div className="d-flex align-items-center justify-content-between w-100">
                <div>Написать в ВКонтакте</div>
                <div>
                  <IoChevronForward color="#999" size={20} />
                </div>
              </div>
            </ListGroup.Item>
          )}
          {options?.info?.telegram?.value &&
            options?.info?.telegram?.status && (
              <ListGroup.Item
                active={false}
                action
                target="_blank"
                href={options.info.telegram.value}
                className="d-flex flex-row align-items-center p-3"
              >
                <FaTelegram size={24} className="me-3" />
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div>Написать в Telegram</div>
                  <div>
                    <IoChevronForward color="#999" size={20} />
                  </div>
                </div>
              </ListGroup.Item>
            )}
          {options?.info?.instagram?.value &&
            options?.info?.instagram?.status && (
              <ListGroup.Item
                active={false}
                action
                target="_blank"
                href={options.info.instagram.value}
                className="d-flex flex-row align-items-center p-3"
              >
                <FaInstagram size={24} className="me-3" />
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div>
                    Instagram
                    <p className="fs-07 text-muted">
                      Запрещено на территории России
                    </p>
                  </div>
                  <div>
                    <IoChevronForward color="#999" size={20} />
                  </div>
                </div>
              </ListGroup.Item>
            )}
          {options?.app?.name && /iPhone|iPad/i.test(navigator.userAgent) ? (
            <ListGroup.Item
              active={false}
              action
              target="_blank"
              href={
                "https://apps.apple.com/ru/app/" +
                (options.app?.titleIos?.length > 0
                  ? options.app.titleIos
                  : options.app?.nameIos?.length > 0
                  ? options.app.nameIos
                  : options.app.name) +
                (options.app?.accountApple
                  ? "/" + options.app.accountApple
                  : "")
              }
              className="d-flex flex-row align-items-center p-3"
            >
              <FaAppStoreIos size={24} className="me-3" />
              <div className="d-flex align-items-center justify-content-between w-100">
                <div>AppStore</div>
                <div>
                  <IoChevronForward color="#999" size={20} />
                </div>
              </div>
            </ListGroup.Item>
          ) : options?.app?.name && /Android/i.test(navigator.userAgent) ? (
            <ListGroup.Item
              active={false}
              action
              target="_blank"
              href={
                "https://play.google.com/store/apps/details?id=" +
                (options.app?.nameAndroid?.length > 0
                  ? options.app.nameAndroid
                  : options.app.name)
              }
              className="d-flex flex-row align-items-center p-3"
            >
              <FaGooglePlay size={24} className="me-3" />
              <div className="d-flex align-items-center justify-content-between w-100">
                <div>Google Play</div>
                <div>
                  <IoChevronForward color="#999" size={20} />
                </div>
              </div>
            </ListGroup.Item>
          ) : (
            <>
              <ListGroup.Item
                active={false}
                action
                target="_blank"
                href={
                  "https://play.google.com/store/apps/details?id=" +
                  (options.app?.nameAndroid?.length > 0
                    ? options.app.nameAndroid
                    : options.app.name)
                }
                className="d-flex flex-row align-items-center p-3"
              >
                <FaGooglePlay size={24} className="me-3" />
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div>Google Play</div>
                  <div>
                    <IoChevronForward color="#999" size={20} />
                  </div>
                </div>
              </ListGroup.Item>
              {options.app?.accountApple && options.app?.titleIos && (
                <ListGroup.Item
                  active={false}
                  action
                  target="_blank"
                  href={
                    "https://apps.apple.com/ru/app/" +
                    (options.app?.titleIos?.length > 0
                      ? options.app.titleIos
                      : options.app?.nameIos?.length > 0
                      ? options.app.nameIos
                      : options.app.name) +
                    (options.app?.accountApple
                      ? "/id" + options.app.accountApple
                      : "")
                  }
                  className="d-flex flex-row align-items-center p-3"
                >
                  <FaAppStoreIos size={24} className="me-3" />
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <div>AppStore</div>
                    <div>
                      <IoChevronForward color="#999" size={20} />
                    </div>
                  </div>
                </ListGroup.Item>
              )}
            </>
          )}
        </ListGroup>
      </Container>
    </main>
  );
};

export default Info;
