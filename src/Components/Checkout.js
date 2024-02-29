import React, { useEffect, useState, useContext } from "react";
import { CartContext } from '../context/cart'
import axios from "axios";
import "./../css/custom.css";
import * as yup from 'yup'; 

const currency = process.env.REACT_APP_CURRENCY;
const currencySymbol = process.env.REACT_APP_CURRENCY_SYMBOL;
const cartId = localStorage.getItem('ecomm_cart_id');
const token = localStorage.getItem('ecomm_token'); 
let carriageprice = '';

async function submitShippingMethod(target,cprice) {  
  let cartVersion = localStorage.getItem('ecomm_cart_version');
  carriageprice = cprice;  
  const headers = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
  let carriages = localStorage.getItem('carriages');
  // let shippingid =
  const apiUrl = process.env.REACT_APP_ECOMM_API_URL + '/' + process.env.REACT_APP_ECOMM_PROJ_NAME + '/carts/' + cartId;
  await axios.request({
    url: apiUrl,
    method: 'post',
    data: {
      version: parseInt(cartVersion),
      actions: [
        {
          action: "setShippingMethod",
          shippingMethod: {
            id: target,
            typeId: "shipping-method"
          }
        }
      ]
    },
    headers: headers
  }).then(function (response) {
    console.log('shipping setted succesfuuly' + JSON.stringify(response.data));
    localStorage.setItem('ecomm_cart_version', response.data.version);

  });

}



function generateRondamKey(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function PaymentForm() {  
  const { cartItems, addToCart, removeFromCart, clearCart, getCartTotal } = useContext(CartContext);
  const cartVersion = localStorage.getItem('ecomm_cart_version');
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [secCode, setSecCode] = useState('');
  const [errorp, setPaymentFormError] = useState('')

  const cardSchema = yup.object().shape({
    cardNumber: yup.string().label('Card number').max(16).required(),
    expDate: yup.string().label('Expiry Date').required(),
    secCode: yup.string().label('CVV').min(3).max(4).required()    
  })

  async function validatePaymentForm() {
   
    let dataObject = {
      cardNumber: cardNumber,
      expDate: expDate,
      secCode: secCode
    }
    let paymentID = '';
    try {
      const validationResult = await cardSchema.validate(dataObject, { abortEarly: false })
      setPaymentFormError('');    
      const date = new Date();
      let transactionsDateTime = date.toISOString();
      let paymentKey = generateRondamKey(8);
      let interfaceId = 'I'+generateRondamKey(9);
      let cartTotal = getCartTotal()*100;
      cartTotal = cartTotal + carriageprice;
      console.log('paymentKey: '+paymentKey);
      console.log('interfaceId: '+interfaceId);
      console.log('Cart Total: '+cartTotal);

      let paymentData = {
        'key': paymentKey,
        'interfaceId': interfaceId,
        'amountPlanned': {
          "currencyCode" : currency,
          "centAmount" : cartTotal
        },
        "paymentMethodInfo" : {
          "paymentInterface" : "STRIPE",
          "method" : "CREDIT_CARD",
          "name" : {
            "en" : "Credit Card"
          }
        },
        "transactions" : [ {
          "timestamp" : transactionsDateTime,
          "type" : "Charge",
          "amount" : {
            "currencyCode" : currency,
            "centAmount" : cartTotal
          },
          "state" : "Success"
        }]
      }

      const headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }

      const apiUrl = process.env.REACT_APP_ECOMM_API_URL + '/' + process.env.REACT_APP_ECOMM_PROJ_NAME + '/payments';
      await axios.request({
        url: apiUrl,
        method: 'post',
        data: paymentData,
        headers: headers
      }).then(function (response) {
          console.log('payment Created: ' + JSON.stringify(response.data));
          paymentID = response.data.id;
          console.log(response.data.id);
          addPaymentToCart(paymentID);
      });
    }
    catch (err) {
      const newError = {};
      err.inner.forEach(err => {
        console.log('inner error coming' + err.path);
        newError[err.path] = err.message;
        setPaymentFormError(newError);
        console.log(errorp);
      })
    }
  }

  async function addPaymentToCart(paymentID){
      let cartVersion = localStorage.getItem('ecomm_cart_version');
      const headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
      const addPaymentApiUrl = process.env.REACT_APP_ECOMM_API_URL + '/' + process.env.REACT_APP_ECOMM_PROJ_NAME + '/carts/'+cartId;
      await axios.request({
        url: addPaymentApiUrl,
        method: 'post',
        data: {
          "version": parseInt(cartVersion),
          "actions": [
              {
                  "action" : "addPayment",
                  "payment" : {
                    "id" : paymentID,
                    "typeId" : "payment"
                  }
                }
          ]
      },
      headers: headers
      }).then(function (response) {
          console.log('payment Added: ' + JSON.stringify(response.data));
          let cartVersion = response.data.version;         
          localStorage.setItem('ecomm_cart_version', cartVersion);  
          createOrder();               
      });
  }
  
  async function createOrder(){
    let cartVersion = localStorage.getItem('ecomm_cart_version');
      const headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
      const addPaymentApiUrl = process.env.REACT_APP_ECOMM_API_URL + '/' + process.env.REACT_APP_ECOMM_PROJ_NAME + '/orders/';
      await axios.request({
        url: addPaymentApiUrl,
        method: 'post',
        data: {
          "cart" : {
            "id" : cartId,
            "typeId" : "cart"
          },
          "version" : parseInt(cartVersion)
        },
      headers: headers
      }).then(function (response) {
          console.log('Order Created: ' + JSON.stringify(response.data));                 
          localStorage.setItem('ecomm_order_data', JSON.stringify(response.data));
          localStorage.removeItem("cartItems");                 
          localStorage.removeItem("ecomm_cart_id");              
          localStorage.removeItem("ecomm_cart_version");
          window.location.replace('/order-confirmation');              
      });
  }

  return (
    <div className='form-container'>
      <h3 className='form-title'>Payment methods</h3>
      <form className='paymentform'>
        <div className='row form-row'>
          <div className='col-md-12'>
            <label>Card Number</label>
            <input type="text" name="cardNumber" id="cardNumber" className='form-control' onChange={(e) => setCardNumber(e.target.value)} />
            {errorp.cardNumber && <div className="error">{errorp.cardNumber}</div>}
          </div>
        </div>
        <div className='row form-row'>
          <div className='col-md-6'>
            <label>Expiry Date</label>
            <input type="text" name="expDate" id="expDate" className='form-control' onChange={(e) => setExpDate(e.target.value)}  />
            {errorp.expDate && <div className="error">{errorp.expDate}</div>}
          </div>
          <div className='col-md-6'>
            <label>Security Code</label>
            <input type="text" name="secCode" id="secCode" className='form-control' onChange={(e) => setSecCode(e.target.value)}  />
            {errorp.secCode && <div className="error">{errorp.secCode}</div>}
          </div>
        </div>

        <div className='row form-row place-order-row'>
          <div className='col-md-12'>
            <button id="payment_button" type='button' className='btn btn-success' onClick={() => { validatePaymentForm() }}>Place Order</button>
          </div>
        </div>
      </form>
    </div>
  );

}


function ShippingForm() {

  const [firstName, setFirstName] = useState('') // useState to store First Name
  const [lastName, setLastName] = useState('') // useState to store Last Name
  const [mobile, setMobile] = useState('') // useState to store Mobile Number 
  const [email, setEmail] = useState('') // useState to store Email address of the user
  const [error, setError] = useState('')

  const userSchema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    mobile: yup.string(),
  })

  async function setCustomerEmail(){
    let cartVersion = localStorage.getItem('ecomm_cart_version');
    const apiUrl = process.env.REACT_APP_ECOMM_API_URL + '/' + process.env.REACT_APP_ECOMM_PROJ_NAME + '/carts/' + cartId;
    const headers = {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
    await axios.request({
      url: apiUrl,
      method: 'post',
      data: {
        version: parseInt(cartVersion),
        actions: [
          {
            action: "setCustomerEmail",
            "email" : email
          }
        ]
      },
      headers: headers
    }).then(function (response) {
      console.log('Customer Email Setup: ' + JSON.stringify(response.data));
      localStorage.setItem('ecomm_cart_version', response.data.version);
    });  
  }

  async function submitShippingAddress() {

    const token = localStorage.getItem('ecomm_token');
    let cartId = localStorage.getItem('ecomm_cart_id');
    const cartVersion = localStorage.getItem('ecomm_cart_version');
    console.log(cartVersion);
    const headers = {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
    let carriages = localStorage.getItem('carriages');
    const apiUrl = process.env.REACT_APP_ECOMM_API_URL + '/' + process.env.REACT_APP_ECOMM_PROJ_NAME + '/carts/' + cartId;

    await axios.request({
      url: apiUrl,
      method: 'post',
      data: {
        version: parseInt(cartVersion),
        actions: [
          {
            action: "setShippingAddress",
            address: {
              salutation: "Mr.",
              firstName: firstName,
              lastName: lastName,
              country: "DE",
              mobile: mobile,
              email: email
            }
          }
        ]
      },
      headers: headers
    }).then(function (response) {
      localStorage.setItem('ecomm_cart_version', response.data.version);
      setCustomerEmail();
      var x = document.getElementById("shipping_button");
      x.style.display = "none";

    });

  }

  async function validateForm() {

    //creating a form data object
    let dataObject = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobile: mobile,
    }

    try {
      const validationResult = await userSchema.validate(dataObject, { abortEarly: false })
      setError('');
      submitShippingAddress();      
    }
    catch (err) {
      const newError = {};
      err.inner.forEach(err => {
        console.log('inner error coming' + err.path);
        newError[err.path] = err.message;
        setError(newError);
        console.log(error);
      })
    }
  }

  return (
    <div className='form-container'>
      <h3 className='form-title'>Set Shipping Address</h3>
      <form className='shippingform'>
        <div className='row form-row'>
          <div className='col-md-6'>
            <label>First Name</label>
            <input type="text" name="firstName" id="firstName" className='form-control' onChange={(e) => setFirstName(e.target.value)} />
            {error.firstName && <div className="error">{error.firstName}</div>}
          </div>
          <div className='col-md-6'>
            <label>Last Name</label>
            <input type="text" name="lastName" id="lastName" className='form-control' onChange={(e) => setLastName(e.target.value)} />
            {error.lastName && <div className="error">{error.lastName}</div>}
          </div>
        </div>
        <div className='row form-row'>
          <div className='col-md-6'>
            <label>Country</label>
            <select name='country' className='form-control'>
              <option value="DE">Germany</option>
            </select>
          </div>
          <div className='col-md-6'>
            <label>Mobile</label>
            <input type="text" name="mobile" className='form-control' onChange={(e) => setMobile(e.target.value)} />
            {error.mobile && <div className="error">{error.mobile}</div>}
          </div>
        </div>
        <div className='row form-row'>
          <div className='col-md-6'>
            <label>Email</label>
            <input type="text" name="email" className='form-control' onChange={(e) => setEmail(e.target.value)} />
            {error.email && <div className="error">{error.email}</div>}
          </div>
        </div>
        <div className='row form-row'>
          <div className='col-md-6'>
            <button id="shipping_button" type='button' className='btn btn-success' onClick={() => { validateForm() }}>Set Shipping Address</button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Checkout() {
  
  const token = localStorage.getItem('ecomm_token');

  function getcarriages() {

  }
  // const carriages = JSON.parse(localStorage.getItem('carriages'));


  function Rendercarriages() {
    async function setShpMethod() {
      const token = localStorage.getItem('ecomm_token');
      let cartId = localStorage.getItem('ecomm_cart_id');
      const cartVersion = localStorage.getItem('ecomm_cart_version');
      console.log(cartVersion);
      const headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
      let carriages = localStorage.getItem('carriages');
      const apiUrl = process.env.REACT_APP_ECOMM_API_URL + '/' + process.env.REACT_APP_ECOMM_PROJ_NAME + '/carts/' + cartId;

      await axios.request({
        url: apiUrl,
        method: 'post',
        data: {
          version: parseInt(cartVersion),
          actions: [
            {
              action: "setShippingAddress",
              address: {
                salutation: "Mr.",
                firstName: "Example",
                lastName: "try",
                country: "DE",
                mobile: "+49 171 2345678",
                email: "email@example.com"
              }
            }
          ]
        },
        headers: headers
      }).then(function (response) {
        localStorage.setItem('ecomm_cart_version', response.data.version);
        var x = document.getElementById("shipping_button");
        x.style.display = "none";

      });
    }
    const [carriages, setCarriage] = useState('');
    function getcarriages() {

      let cartId = localStorage.getItem('ecomm_cart_id');
      const headers = {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }

      let carriageslocal = localStorage.getItem('carriages');
      if (carriageslocal == '' || carriageslocal == null) {
        console.log('reached here ');
        const apiUrl = process.env.REACT_APP_ECOMM_API_URL + '/' + process.env.REACT_APP_ECOMM_PROJ_NAME + '/shipping-methods';
        axios.request({
          url: apiUrl,
          method: 'get',
          data: {
            currency: currency
          },
          headers: headers
        }).then(function (response) {

          setCarriage(response.data.results);
          localStorage.setItem('carriageslocal', JSON.stringify(response.data.results));
        });
      }
    }

    useEffect(() => {
      getcarriages();
    }, []);
    console.log('length is ' + carriages);
    return (
      <div className='carr'>
        <section className="checkout delivery-option">
          <div className="header"><strong>Delivery options</strong></div>
          <div className="row">
            <div className="col-sm-6 subcloumn">
              <span style={{ margin: '20px' }}>Please select a delivery option</span>
            </div>
            <div className="col-sm-4 subcloumn">
              <span>Carrier</span>
            </div>
            <div className="col-sm-2 subcloumn">
              <span>Price</span>
            </div>
          </div>
        </section >
        <div className="form-container">
          {(carriages.length > 0) ? carriages.map((list, index) =>
            <div className='row innerrow'>
              <div className="col-sm-6 subcolumn" key="data">
                <input name="carriageval" value={list.id} type="radio" id="option1" data-carriageprice={((list.zoneRates)[0].shippingRates)[0].price.centAmount/100} onChange={(e) => submitShippingMethod(e.target.value,((list.zoneRates)[0].shippingRates)[0].price.centAmount)} />
                <span>{list.name}</span>
              </div>
              <div className="col-sm-4 subcolumn">
                <span>{list.localizedDescription.en}</span>
              </div>
              <div className="col-sm-2 subcolumn">
                {list.zoneRates.length > 0 ? <span> {currencySymbol}{(((list.zoneRates)[0].shippingRates)[0].price.centAmount/100).toFixed(2)}</span>
                  : ''}
              </div>
            </div>

          ) : <div className='col-md-12'><p>No carriages Found</p></div>
          }
        </div>
      </div >
    );
  }
  getcarriages();
  return (
    <div className="container">
      <div className="page-container"><h1 className="page-title">Checkout</h1></div>
      <ShippingForm />
      <Rendercarriages />
      <PaymentForm />

    </div>
  )
}

export default Checkout
