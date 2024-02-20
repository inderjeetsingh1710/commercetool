import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const token = localStorage.getItem('ecomm_token');
  const [cartItems, setCartItems] = useState(localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []);
  const addToCart = (item) => {
    console.log('addToCart Calling');
    const isItemInCart = cartItems.find((cartItem) => cartItem.id === item.id);
    console.log('isItemInCart: '+isItemInCart);

    if (isItemInCart) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (item) => {
    const isItemInCart = cartItems.find((cartItem) => cartItem.id === item.id);

    if (isItemInCart.quantity === 1) {
      setCartItems(cartItems.filter((cartItem) => cartItem.id !== item.id));
    } else {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    let cartId = localStorage.getItem('ecomm_cart_id');
    let cartVersion = localStorage.getItem('ecomm_cart_version');
    console.log('cartId: '+cartId);
    if(cartId != null){
        const headers = {
          'Authorization': 'Bearer '+token,
          'Content-Type': 'application/json'      
        };
        const apiUrl = process.env.REACT_APP_ECOMM_API_URL+'/'+process.env.REACT_APP_ECOMM_PROJ_NAME+'/carts/'+cartId+'?version='+cartVersion; 
        axios.request({
          url: apiUrl,
          method:'DELETE',          
          headers: headers      
        }).then(function(response){
            //let cartData = response.data;
            localStorage.removeItem("ecomm_cart_id");    
            localStorage.removeItem("ecomm_cart_version");    
        }); 
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
      setCartItems(JSON.parse(cartItems));
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};