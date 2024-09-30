import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Footer from "../components/Footer";

const AppLayout = () => {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
      <Footer />
    </>
  );
};

export default AppLayout;
