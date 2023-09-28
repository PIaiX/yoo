import React from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AccountMenu from "../pages/account/AccountMenu";
import { Link } from "react-router-dom";
import NavBreadcrumbs from "../components/utils/NavBreadcrumbs";
import { useSelector } from "react-redux";

const AccountLayout = ({ isMobile }) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <main className="account mb-2 mb-sm-3 mb-md-4 mb-xl-5">
      <Container className="pt-4 pt-lg-0">
        {isMobile ? (
          <Outlet />
        ) : (
          <div>
            <h1 className="mb-2">Личный кабинет</h1>
            <NavBreadcrumbs
              breadcrumbs={[{ title: "Аккаунт", link: "/account" }]}
            />
            <Row className="account-top gx-3 gx-xl-4">
              <Col lg={3}>
                <div className="box w-100 h-100 d-flex align-items-center">
                  <div className="icon d-none d-sm-none d-md-none d-xxl-flex">
                    <span>
                      {user.firstName
                        ? user.firstName.slice(0, 1).toUpperCase()
                        : "A"}
                    </span>
                  </div>
                  <div>
                    <h6>{user?.firstName ?? "Имя"}</h6>
                    {user?.phone ||
                      (user?.email && (
                        <>
                          {user?.phone && (
                            <p className="mb-2">
                              <a href={"tel:" + user.phone}>{user.phone}</a>
                            </p>
                          )}
                          {user?.email && (
                            <p className="mb-2 fs-09">
                              <a href={"mailer:" + user.email}>{user.email}</a>
                            </p>
                          )}
                          <Link to="/account/settings" className="main-color">
                            Изменить
                          </Link>
                        </>
                      ))}
                  </div>
                </div>
              </Col>
              <Col lg={2}>
                <div className="box w-100 h-100 d-flex flex-column justify-content-between text-center">
                  <p className="fs-09 fw-6">Вы можете потратить</p>
                  <p className="main-color">
                    <span className="fs-18">{user.point}</span>&nbsp;
                    <span className="fw-6 fs-18">Б</span>
                  </p>
                </div>
              </Col>
              <Col lg={7}>
                <div className="h-100 row row-cols-2 gx-3 gx-xl-4">
                  <div>
                    <div className="gradient-block"></div>
                  </div>
                  <div>
                    <div className="gradient-block"></div>
                  </div>
                </div>
              </Col>
            </Row>

            <div className="row gx-3 gx-xl-4">
              <div className="col-4 col-lg-3">
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
