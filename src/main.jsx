import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Login, SignUp, AddAddress, User, Home, Category, SearchProducts, ProductInfo, Cart, AddProduct, EditProduct, CheckoutPage, ReturnsOrders, Order, SoldProducts, PageNotFound } from "./components/pages/index.js"
import { Provider } from 'react-redux';
import store from '../store/store.js';
import ProtectedRoute from './ProtectedRoute.jsx';


const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App />}>
    <Route path='' element={<Home />} />
    <Route path='login' element={<Login />} />
    <Route path='signup' element={<SignUp />} />
    <Route path='user' element={<User />} />
    <Route path="addAddress" element={<ProtectedRoute element={<AddAddress />} />} />
    <Route path="/products">
      <Route path="search" element={<SearchProducts />} />
      <Route path="categories/:category" element={<Category />} />
      <Route path="addProduct" element={<ProtectedRoute element={<AddProduct />} />} />
      <Route path=':prodId' >
        <Route path='' element={<ProductInfo />} />
        <Route path='edit' element={<ProtectedRoute element={<EditProduct />} />} />
      </Route>
      <Route path='' element={<PageNotFound />} />
    </Route>
    <Route path="cart" element={<Cart />} />
    <Route path="checkout" element={<ProtectedRoute element={<CheckoutPage />} />} />

    <Route path="orders" >
      <Route path="" element={<ProtectedRoute element={<ReturnsOrders />} />} />
      <Route path="soldProducts" element={<ProtectedRoute element={<SoldProducts />} />} />
      <Route path=":orderId" element={<ProtectedRoute element={<Order />} />} />
    </Route>
    <Route path="*" element={<PageNotFound />} />
  </Route >
))

createRoot(document.getElementById('root')).render(
  <Provider store={store} >
    <RouterProvider router={router} />
  </Provider>
)
