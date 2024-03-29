import React, { useEffect, useState,useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Login from '../Login';
import { CartContext } from '../../context/cart'


function Navbar(props) {
  const [isLogged, setisLogged] = useState(false);
  const { cartItems } = useContext(CartContext)

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
              <li className="nav-item"><NavLink to="/">Home</NavLink></li>
              <li className="nav-item"><NavLink to="shop">Shop</NavLink></li>
              <li className="nav-item"><NavLink to="offers">Offers</NavLink></li>
              <li className="nav-item"><NavLink to="contact">Contact us</NavLink></li>
                {isLogged ? (<li className="nav-item">
                      <Link to="login"><span>Log in</span></Link>
                </li>):(<li className="nav-item">
                      <Link to="login"><span>Log out</span></Link>
                </li>)
                }
              </ul>
              <div className="header-cart">
                <NavLink to="cart" className="user-cart" >
                    <i className="bi bi-basket-fill"></i>
                    <span className='basketCounter'>{cartItems.length}</span>
                </NavLink>
              </div>            
            </div>
          </div>
        </nav>
        <div className="bluedivider"></div>
    </div>   
  )
}

export default Navbar