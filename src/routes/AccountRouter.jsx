import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
// import useIsMobile from "../hooks/isMobile";
import AccountLayout from "../layouts/AccountLayout";
import AccountMenuMobile from "../pages/account/AccountMenuMobile";
import Orders from "../pages/account/Orders";
import Order from "../pages/account/Order";
import Settings from "../pages/account/Settings";
import Addresses from "../pages/account/Addresses";
import AddAddress from "../pages/account/AddAddress";
import EditAddress from "../pages/account/EditAddress";
import Bonuses from "../pages/account/Bonuses";
import Offers from "../pages/account/Offers";
import Notifications from "../pages/account/Notifications";
import Payment from "../pages/account/Payment";
import Support from "../pages/account/Support";
import { isMobile } from "react-device-detect";
import Favorites from "../pages/account/Favorites";

const AccountRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AccountLayout isMobile={isMobile} />}>
        {isMobile ? (
          <Route index element={<AccountMenuMobile />} />
        ) : (
          <Route index element={<Navigate to="orders" replace={true} />} />
        )}
        <Route path="favorites" element={<Favorites />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:orderId" element={<Order />} />
        <Route path="addresses" element={<Addresses />} />
        <Route path="addresses/add" element={<AddAddress />} />
        <Route path="address/:addressId" element={<EditAddress />} />
        <Route path="bonus" element={<Bonuses />} />
        <Route path="offers" element={<Offers />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="payment" element={<Payment />} />
        <Route path="support" element={<Support />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      <Route path="/*" element={<Navigate to="orders" replace={true} />} />
    </Routes>
  );
};

export default AccountRouter;
