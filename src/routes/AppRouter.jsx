import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Error from "../components/Error";
import AppLayout from "../layouts/AppLayout";
import Activate from "../pages/auth/Activate";
import ActivateEditEmail from "../pages/auth/ActivateEditEmail";
import Recovery from "../pages/auth/Recovery";
import Registration from "../pages/auth/Registration";
import Cart from "../pages/Cart";
import Category from "../pages/Category";
import Checkout from "../pages/Checkout";
import Contact from "../pages/Contact";
import Delivery from "../pages/Delivery";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import OfferPage from "../pages/OfferPage";
import Policy from "../pages/Policy";
import PolicyCookie from "../pages/PolicyCookie";
import Product from "../pages/Product";
import Promo from "../pages/Promo";
import AccountRouter from "./AccountRouter";
import AuthRoute from "./AuthRoute";
// import About from "../pages/About";
import ActivateTelegram from "../pages/auth/ActivateTelegram";
import ActivateWhatsApp from "../pages/auth/ActivateWhatsApp";
import Blog from "../pages/Blog";
import Blogs from "../pages/Blogs";
import Categories from "../pages/Categories";
import Document from "../pages/Document";
import Documents from "../pages/Documents";
import Info from "../pages/Info";
import RedirectApp from "../pages/RedirectApp";
import Search from "../pages/Search";
import ActivateFastCall from "../pages/auth/ActivateFastCall";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout />} errorElement={<Error />}>
      <Route index element={<Home />} />
      {/* <Route path="about" element={<About />} /> */}
      <Route path="categories" element={<Categories />} />
      <Route path="category/:categoryId" element={<Category />} />
      <Route path="product/:productId" element={<Home />} />
      <Route path="cart" element={<Cart />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="search" element={<Search />} />
      <Route path="promo" element={<Promo />} />
      <Route path="info" element={<Info />} />
      <Route path="redirect/app" element={<RedirectApp />} />
      <Route path="promo/:saleId" element={<OfferPage />} />
      <Route path="contact" element={<Contact />} />
      <Route path="delivery" element={<Delivery />} />
      <Route path="documents" element={<Documents />} />
      <Route path="document/:id" element={<Document />} />
      <Route path="policy" element={<Policy />} />
      <Route path="policy-cookie" element={<PolicyCookie />} />
      <Route path="*" element={<NotFound />} />
      <Route
        path="account/*"
        element={
          <AuthRoute activate>
            <AccountRouter />
          </AuthRoute>
        }
      />

      <Route
        path="activate-email/:key"
        element={
          <AuthRoute>
            <ActivateEditEmail />
          </AuthRoute>
        }
      />
      <Route
        path="activate"
        element={
          <AuthRoute>
            <Activate />
          </AuthRoute>
        }
      />

      <Route path="activate-telegram" element={<ActivateTelegram />} />
      <Route path="activate-whatsapp" element={<ActivateWhatsApp />} />
      <Route path="activate-fast-call" element={<ActivateFastCall />} />

      <Route path="recovery" element={<Recovery />} />
      <Route path="login" element={<Registration />} />
      <Route path="blogs" element={<Blogs />} />
      <Route path="blog/:blogId" element={<Blog />} />
    </Route>
  )
);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
