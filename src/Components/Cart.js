import { useContext } from 'react'
import { CartContext } from '../context/cart'
import axios from "axios";

const currency = process.env.REACT_APP_CURRENCY;
const currencySymbol = process.env.REACT_APP_CURRENCY_SYMBOL;


export default function Cart() {
  const { cartItems, addToCart, removeFromCart, clearCart, getCartTotal } = useContext(CartContext);
  const token = localStorage.getItem('ecomm_token');
  // Cart Create Checkout
  function ProceedToCheckout(){
    console.log('Cart Created'); 
    let cartId = localStorage.getItem('ecomm_cart_id');   
    
    if(cartId == '' || cartId == null){
      const headers = {
        'Authorization': 'Bearer '+token,
        'Content-Type': 'application/json'      
      };
      const apiUrl = process.env.REACT_APP_ECOMM_API_URL+'/'+process.env.REACT_APP_ECOMM_PROJ_NAME+'/carts'; 
      axios.request({
        url: apiUrl,
        method:'post',
        data: {
          currency: currency       
        },
        headers: headers      
      }).then(function(response){
          let cartData = response.data;
          let cartId = cartData.id;
          let cartVersion = cartData.version;
          localStorage.setItem('ecomm_cart_id', cartId);
          localStorage.setItem('ecomm_cart_version', cartVersion);          
          AddCartItems();          
      }); 
    }else{
      AddCartItems();
    }    
  }

  //Line Items for Checkout
  function AddCartItems(){
    let cartId = localStorage.getItem('ecomm_cart_id');
    console.log('cartId: '+cartId);
    let cartVersion = localStorage.getItem('ecomm_cart_version');
    let cartItemData = [];
    cartItems.map(function(item){      
      let lineItem = {
          "action" : "addLineItem",
          "productId" : item.id,
          "variantId" : 1,
          "quantity" : item.quantity                        
      }
      cartItemData.push(lineItem);
    });    
    let apiData = {
      "version": Number(cartVersion),
      "actions": cartItemData
    }
    const headers = {
      'Authorization': 'Bearer '+token,
      'Content-Type': 'application/json'      
    };
    const apiUrl = process.env.REACT_APP_ECOMM_API_URL+'/'+process.env.REACT_APP_ECOMM_PROJ_NAME+'/carts/'+cartId; 
    axios.request({
      url: apiUrl,
      method:'post',
      data: apiData,
      headers: headers      
    }).then(function(response){
        let cartData = response.data;
        console.log(cartData);
        let cartId = cartData.id;
        let cartVersion = cartData.version;        
        localStorage.setItem('ecomm_cart_version', cartVersion);       
    }).catch(error => {
      console.log(error.response.data.statusCode)
      if(error.response.data.statusCode == 409){
        let cartVersion = error.response.data.errors[0].currentVersion;       
        localStorage.setItem('ecomm_cart_version', cartVersion);
      }
   });     
  }

  return (
    <>
    <div className="container">
      <div className="page-container">
        <h1 className="page-title">Cart</h1>
        <div className="cart-data">
          {cartItems.map((item) => (
            <div className="testinder row cart-row" key={item.cartItemcartItem}>
              <div className='col-md-1 prod-image-cart'>
                  <img src={item.thumbnail} alt={item.title} className="prod-image" width="70" />
              </div> 
              <div className="col-md-9" data-id={item.id}>          
                  <div className="prod-info">
                      <h2 className="prod-title">{item.title}</h2>
                      <p className="prod-price testinder">{currencySymbol+item.price}</p>
                  </div>
              </div>
              <div className="col-md-2 plus-minus-btns">
                <button className="btn btn-dark btn-sm plus-btn" onClick={() => { addToCart(item) }} > + </button>
                <span className='pqty'>{item.quantity}</span>
                <button className="btn btn-dark btn-sm minus-btn" onClick={() => { removeFromCart(item) }} > - </button>
              </div>
            </div>
          ))}
        </div>
        {
          cartItems.length > 0 ? (
            <div className="row cart-total-container">
              <div className="col-md-6">            
                  <button className="clear-cart button btn btn-success" onClick={() => { clearCart() }} >Clear cart</button>
                  <button className="proceed-checkout button btn btn-success" onClick={() => { ProceedToCheckout() }}>Proceed to Checkout</button>
              </div>
              <div className="col-md-6 cart-total">
                  <h3 className="cart-total-label">Total: {currencySymbol+getCartTotal().toFixed(2)}</h3>
              </div>  
            </div>
          ) : (
              <div className='row empty-cart-row'>
                <div className='col-md-12'>
                  <h2 className="cart-empty-txt">Your cart is empty</h2>
                </div>
              </div>
          )
        }
      </div>
    </div>
    </>
  )
}


