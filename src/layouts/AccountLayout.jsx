import React from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AccountMenu from "../pages/account/AccountMenu";
import { Link } from "react-router-dom";
import NavBreadcrumbs from "../components/utils/NavBreadcrumbs";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { IoSettingsOutline } from "react-icons/io5";

const AccountLayout = ({ isMobile }) => {
  const user = useSelector((state) => state.auth.user);
  const profilePointVisible = useSelector(
    (state) => state.settings.options.profilePointVisible
  );
  const { t } = useTranslation();

  return (
    <main className="account mb-2 mb-sm-3 mb-md-4 mb-xl-5">
      <Container className="pt-4 pt-lg-0">
        {isMobile ? (
          <Outlet />
        ) : (
          <div>
            <div className="row">
              <div className="col-4 col-lg-3">
                <div className="box p-3 w-100 d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <h6 className="mb-0 fs-10">
                      {t(user?.firstName ? user.firstName : "Имя")}
                    </h6>
                    {(user?.phone || user?.email) && (
                      <>
                        {user?.phone && (
                          <a className="fs-08" href={"tel:" + user.phone}>
                            +
                            {user.phone.replace(/^(.{2})([0-9]{5})/, "$1*****")}
                          </a>
                        )}
                        {user?.email && (
                          <p className="mb-0 fs-08 text-muted">
                            <a href={"mailer:" + user.email}>{user.email}</a>
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <div>
                    <Link to="/account/settings" className="main-color">
                      <IoSettingsOutline size={25} />
                    </Link>
                  </div>
                </div>
                {profilePointVisible && (
                  <div className="box w-100 p-3 d-flex flex-column justify-content-between  mb-3">
                    <p className="fs-09 fw-6">{t("Вы можете потратить")}</p>
                    <p className="main-color">
                      <span className="fw-7 fs-14">
                        {user.point}&nbsp;
                        <span className="text-light-muted">Б</span>
                      </span>
                    </p>
                    {user?.options?.cashback > 0 && (
                      <p className="text-muted fs-08">
                        {t("Начислим")} <b>{user.options.cashback + "%"}</b>{" "}
                        {t("с заказа")}
                      </p>
                    )}
                  </div>
                )}
                <AccountMenu />
              </div>
              <div className="col-8 col-lg-9">
                <Outlet />
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
};

export default AccountLayout;
