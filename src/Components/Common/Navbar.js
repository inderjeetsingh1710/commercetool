import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Login from '../Login';


function Navbar(props) {
  const [isLogged, setisLogged] = useState(false);

  useEffect(() => {    
    return () => {};
  }, [isLogged]);

 
  const logout = () => {
    localStorage.removeItem("userlogin");
    setisLogged(false);
  };
  return (
    <div className="header">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container">
            <NavLink to="/"><img src="/logo.png" alt="" width="175"/></NavLink>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <NavLink to="/"><li className="nav-item">Home</li></NavLink>
              <NavLink to="#"><li className="nav-item">Shop</li></NavLink>
              <NavLink to="#"><li className="nav-item">Offers</li></NavLink>
              <NavLink to="contact"><li className="nav-item">Contact us</li></NavLink>
                {isLogged ? (<li className="nav-item">
                      <Link to="login"><span>Log in</span></Link>
                </li>):(<li className="nav-item">
                      <Link to="login"><span>Log out</span></Link>
                </li>)
                }
              </ul>            
            </div>
          </div>
        </nav>
        <div className="bluedivider"></div>
    </div>   
  )
}

export default Navbar