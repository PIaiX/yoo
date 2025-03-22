import React, { memo } from "react";
import Container from "react-bootstrap/Container";
import { useTranslation } from "react-i18next";
import {
  IoAlbumsOutline,
  IoBriefcaseOutline,
  IoCallOutline,
  IoCartOutline,
  IoDocumentTextOutline,
  IoFlameOutline,
  IoHomeOutline,
  IoNewspaperOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import AppStore from "../assets/imgs/appstore.svg";
import GooglePlay from "../assets/imgs/googleplay.svg";
import { getCount, getImageURL } from "../helpers/all";
import FlameIcon from "./svgs/FlameIcon";
import QRCode from "react-qr-code";
import { isDesktop } from "react-device-detect";

const iconComponents = {
  "/contact": IoCallOutline,
  "/promo": IoFlameOutline,
  "/portfolio": IoBriefcaseOutline,
  "/services": IoDocumentTextOutline,
  "/blogs": IoNewspaperOutline,
  "/projects": IoAlbumsOutline,
};

const Footer = memo(() => {
  const { t } = useTranslation();

  const isAuth = useSelector((state) => state.auth.isAuth);
  const cart = useSelector((state) => state.cart.items);
  const options = useSelector((state) => state.settings.options);
  const count = getCount(cart);
  const selectedAffiliate = useSelector((state) => state.affiliate.active);

  if (options?.title === "YooApp") {
    return null;
  }

  return (
    <footer className="user-select">
      <Container className="h-100">
        <nav className="h-100 mobile d-lg-none">
          <ul>
            <li>
              <NavLink to="/">
                <IoHomeOutline />
              </NavLink>
            </li>
            {options?.menu?.length > 0 ? (
              options.menu.map(
                (e, index) =>
                  e?.mobile && (
                    <li key={index}>
                      <NavLink to={e?.page ? e.page : ""}>
                        {e?.page
                          ? iconComponents[e.page]
                          : iconComponents[e.icon]}
                      </NavLink>
                    </li>
                  )
              )
            ) : (
              <li>
                <NavLink to="/promo">
                  <FlameIcon />
                </NavLink>
              </li>
            )}
            {options?.cart && (
              <li>
                <NavLink to="/cart" className="position-relative">
                  <IoCartOutline />
                  {count > 0 && (
                    <span className="position-absolute translate-middle badge rounded-pill">
                      {count}
                    </span>
                  )}
                </NavLink>
              </li>
            )}
            <li>
              <NavLink to={isAuth ? "/account" : "/login"}>
                <IoPersonOutline />
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="desktop d-none d-lg-flex">
          <div className="pe-3">
            <img
              draggable="false"
              src={
                options?.logodark
                  ? getImageURL({
                      path: options.logodark,
                      type: "all/web/logo",
                      size: "full",
                    })
                  : options?.logo
                  ? getImageURL({
                      path: options.logo,
                      type: "all/web/logo",
                      size: "full",
                    })
                  : "/logo.png"
              }
              alt={options?.title ?? "YOOAPP"}
              className="logo"
            />
          </div>
          <nav>
            <ul className="list-unstyled d-flex align-items-center">
              {options?.menu?.length > 0 ? (
                options.menu.map(
                  (e, index) =>
                    e?.status && (
                      <li className="me-4" key={index}>
                        <Link
                          to={e?.link ?? e.page}
                          onClick={() => setShowMenu(false)}
                        >
                          {t(e.title)}
                        </Link>
                      </li>
                    )
                )
              ) : (
                <li className="me-4">
                  <Link to="/contact">{t("Контакты")}</Link>
                </li>
              )}
              <li className="me-4">
                <Link to="/policy">{t("Политика конфиденциальности")}</Link>
              </li>
              {selectedAffiliate &&
                selectedAffiliate?.phone &&
                selectedAffiliate?.phone[0] && (
                  <li className="me-4">
                    <div className="d-flex flex-column">
                      <a
                        href={"tel:" + selectedAffiliate.phone[0]}
                        className={
                          "phone" +
                          (selectedAffiliate.phone[1] ? " mb-2 fs-09" : "")
                        }
                      >
                        {selectedAffiliate.phone[0]}
                      </a>
                      {selectedAffiliate.phone[1] && (
                        <a
                          href={"tel:" + selectedAffiliate.phone[1]}
                          className="phone fs-09"
                        >
                          {selectedAffiliate.phone[1]}
                        </a>
                      )}
                    </div>
                  </li>
                )}
            </ul>
          </nav>
          {options?.app?.name ||
          options?.app?.nameAndroid ||
          options?.app?.nameIos ? (
            <div>
              <div className="d-flex align-items-center flex-row">
                {options?.qrApp && isDesktop ? (
                  <>
                    <div className="pe-2">
                      <QRCode
                        size={50}
                        className="p-1 bg-white rounded shadow-sm"
                        value={
                          "https://" + window.location.hostname + "/redirect/app"
                        }
                        viewBox={`0 0 50 50`}
                      />
                    </div>
                    <div>
                      <p className="text-white fs-09">
                        {t("Заказывайте")}
                        <br />
                        {t("через приложение")}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-white fs-09">
                    {t("Заказывайте")} {t("через приложение")}
                  </p>
                )}
              </div>
              <ul className="list-unstyled d-flex mt-2">
                {options.app?.accountApple && options.app?.titleIos && (
                  <li className="me-2">
                    <a
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
                    >
                      <img
                        draggable="false"
                        src={AppStore}
                        alt="App Store"
                        height="35"
                      />
                    </a>
                  </li>
                )}
                <li>
                  <a
                    target="_blank"
                    href={
                      "https://play.google.com/store/apps/details?id=" +
                      (options.app?.nameAndroid?.length > 0
                        ? options.app.nameAndroid
                        : options.app.name)
                    }
                  >
                    <img
                      draggable="false"
                      src={GooglePlay}
                      alt="Google Play"
                      height="35"
                    />
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            ""
          )}
        </div>
        {!options?.branding && (
          <div className="justify-content-center mt-2 d-none d-lg-flex">
            <a href="https://yooapp.ru" target="_blank">
              <div>
                <span className="text-muted fs-08 me-1">
                  {t("Разработано на платформе")}
                </span>
                <b className="fs-08">yooapp</b>
              </div>
            </a>
          </div>
        )}
      </Container>
    </footer>
  );
});

export default Footer;
