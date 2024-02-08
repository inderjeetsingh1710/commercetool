import { useContext } from 'react'
import { CartContext } from '../context/cart'


export default function Cart() {
  const { cartItems, addToCart, removeFromCart, clearCart, getCartTotal } = useContext(CartContext)
  return (
    <>
    <div className="container">
      <div className="page-container">
        <h1 className="page-title">Cart</h1>
        <div className="cart-data">
          {cartItems.map((item) => (
            <div className="testinder row cart-row" key={item.id}>
              <div className='col-md-1 prod-image-cart'>
                  <img src={item.thumbnail} alt={item.title} className="prod-image" width="70" />
              </div> 
              <div className="col-md-9" data-id={item.id}>          
                  <div className="prod-info">
                      <h2 className="prod-title">{item.title}</h2>
                      <p className="prod-price">{item.price}</p>
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
              <div class="col-md-6">            
                  <button className="clear-cart button btn btn-success" onClick={() => { clearCart() }} >Clear cart</button>
                  <button className="proceed-checkout button btn btn-success">Proceed to Checkout</button>
              </div>
              <div class="col-md-6 cart-total">
                  <h3 className="cart-total-label">Total: ${getCartTotal()}</h3>
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


