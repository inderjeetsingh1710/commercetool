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
import CategoryDetail from './Components/CategoryDetail';

function Routers() {
  let { userId } = useParams();
  let { paramId } = useParams();
  Token();
  
  return (
    <>
        <Router> 
        <Navbar/>
          <Routes>
            <Route exact path="/" element={<Home />} /> 
            <Route exact path="/home" element={<Home />} /> 
            <Route exact path="/signup" element={<Signup />} /> 
            <Route exact path="/login" element={<Login />} />             
            <Route exact path="/category/:paramId" element={<CategoryDetail />} />             
          </Routes>
          <Footer/>  
        </Router>
        </>
  )
}

export default Routers;