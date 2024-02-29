import React from 'react';
import Navbar from './Components/Common/Navbar';
import Footer from './Components/Common/Footer';
import Token from './Api/Auth/Token';

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
} from "react-router-dom";

import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Shop from './Components/Shop';
import CategoryDetail from './Components/CategoryDetail';
import ProductDetail from './Components/ProductDetail';
import Cart from './Components/Cart';
import ErrorPage from './Components/ErrorPage';
import Checkout from './Components/Checkout';
import OrderConfirmation from './Components/OrderConfirmation';

function Routers() {
  let { userId } = useParams();
  let { paramId } = useParams();
  Token();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/shop" element={<Shop />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path="/category/:paramId" element={<CategoryDetail />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default Routers;