import { useContext } from 'react'

const currency = process.env.REACT_APP_CURRENCY;
const currencySymbol = process.env.REACT_APP_CURRENCY_SYMBOL;
const token = localStorage.getItem('ecomm_token'); 


export default function OrderConfirmation() {

  let orderData = localStorage.getItem('ecomm_order_data');
  let orderData1 = JSON.parse(orderData);



  return (   
    <div className="container order-confirmation-page">
      <div className="page-container">
          <h1 className="page-title">Order Confirmed</h1>
          <hr class="style-div"></hr>
          <div className='order-confirmation-box'>
            <p className='order-confirm-icons'><span><i class="bi bi-check-circle"></i></span></p>
            <h5 className='order-name'>Hey {orderData1.shippingAddress.firstName} {orderData1.shippingAddress.lastName}</h5>
            <h3 className='order-label'>Your order is Confirmed!</h3>
            <h6 className='order-info'>We will share shipping confirmation email as soon as your order ships.</h6>
          </div>   
      </div>
    </div> 
  )
}


