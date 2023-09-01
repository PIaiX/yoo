import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const AppLayout = () => {
  return (
    <>
      <ScrollRestoration />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default AppLayout;
