import React from 'react'
import {createHashRouter, createRoutesFromElements, Route, RouterProvider, createBrowserRouter} from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'
import Contacts from '../pages/Contacts'
import Promo from '../pages/Promo'
import OfferPage from '../pages/OfferPage'
import Catalog from '../pages/Catalog'
import Product from '../pages/Product'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import AccountRouter from './AccountRouter'
import Registration from '../pages/Registration'
import Categories from '../pages/Categories'
import SearchResults from '../pages/SearchResults'
import Blog from '../pages/Blog'
import Article from '../pages/Article'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppLayout />}>
      <Route index element={<Home />}/>
      <Route path="menu" element={<Catalog/>} />
      <Route path="categories" element={<Categories/>} />
      <Route path="menu/product" element={<Product/>} />
      <Route path="cart" element={<Cart/>} />
      <Route path="checkout" element={<Checkout/>} />
      <Route path="promo" element={<Promo/>} />
      <Route path="promo/:id" element={<OfferPage/>} />
      <Route path="contacts" element={<Contacts/>} />
      <Route path="*" element={<NotFound />} />
      <Route path="account/*" element={<AccountRouter/>} />
      <Route path="login" element={<Registration/>} />
      <Route path="search" element={<SearchResults/>} />
      <Route path="articles" element={<Blog/>} />
      <Route path="articles/:id" element={<Article/>} />
    </Route>
  )
)

const AppRouter = () => {
  return <RouterProvider router={router} />
};

export default AppRouter;