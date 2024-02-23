import React, { useEffect, useState, useContext } from "react";
import { CartContext } from '../context/cart'
import axios from "axios";
import "./../css/custom.css";
import * as yup from 'yup' // importing functions from yup library

const currency = process.env.REACT_APP_CURRENCY;
const currencySymbol = process.env.REACT_APP_CURRENCY_SYMBOL;

function ValidateAddressForm() {
  console.log('Form Validation');
}

function ShippingForm() {

  const [firstName, setFirstName] = useState('') // useState to store First Name
  const [lastName, setLastName] = useState('') // useState to store Last Name
  const [mobile, setMobile] = useState('') // useState to store Mobile Number 
  const [email, setEmail] = useState('') // useState to store Email address of the user
  const [error, setError] = useState('')
  // function ValidateAddressForm() {
  //   // Check if the First Name is an Empty string or not.
  //   if (firstName.length == 0) {
  //     alert('Invalid Form, First Name can not be empty')
  //     return
  //   }

  //   // Check if the Email is an Empty string or not.
  //   if (email.length == 0) {
  //     alert('Invalid Form, Email Address can not be empty')
  //     return
  //   }

  //   alert('Form is valid')
  // }

  const userSchema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    mobile: yup.string(),
  })

  async function validateForm() {
    // creating a form data object

    let dataObject = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      mobile: mobile,
    }

    // const validationResult = await userSchema
    //   .validate(dataObject, { abortEarly: false })
    //   .catch((err) => {
    //     const newError = {};
    //     err.inner.forEach(err => {
    //       console.log('inner error coming' + err.path);
    //       newError[err.path] = err.message;
    //       setError(newError);
    //     });
    //   });

    try {
      const validationResult = await userSchema
        .validate(dataObject, { abortEarly: false })
      setError('');
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
            <button type='button' className='btn btn-success' onClick={() => { validateForm() }}>Set Shipping Address</button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Checkout() {
  const { cartItems, addToCart, removeFromCart, clearCart, getCartTotal } = useContext(CartContext);
  const token = localStorage.getItem('ecomm_token');

  function getcarriages() {
    let cartId = localStorage.getItem('ecomm_cart_id');
    const headers = {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }

    let carriages = localStorage.getItem('carriages');
    if (carriages == '' || carriages == null) {
      const apiUrl = process.env.REACT_APP_ECOMM_API_URL + '/' + process.env.REACT_APP_ECOMM_PROJ_NAME + '/shipping-methods';
      axios.request({
        url: apiUrl,
        method: 'get',
        data: {
          currency: currency
        },
        headers: headers
      }).then(function (response) {
        console.log('checkout is' + JSON.stringify(response.data));
        localStorage.setItem('carriages', JSON.stringify(response.data.results));
      });
    }
  }
  const carriages = JSON.parse(localStorage.getItem('carriages'));


  function Rendercarriages() {
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

        <div className=''>
          <form >

            {(carriages.length > 0) ? carriages.map((list, index) =>
              <div className='row innerrow'>
                <div className="col-sm-6 subcolumn" key="data">
                  <input name="carriageval" value={list.id} type="radio" />
                  <span>{list.name}</span>

                </div>

                <div className="col-sm-4 subcolumn">
                  <span>{list.localizedDescription.en}</span>
                </div>
                <div className="col-sm-2 subcolumn">
                  {list.zoneRates.length > 0 ? <span> {currencySymbol}{((list.zoneRates)[0].shippingRates)[0].price.centAmount}</span>
                    : ''}
                </div>
              </div>

            ) : <div className='col-md-12'><p>No carriages Found</p></div>



            }
          </form>
        </div>

      </div >


    );
  }
  getcarriages();
  //rendercarriages();
  return (
    <div className="container">
      <div className="page-container"><h1 className="page-title">Checkout</h1></div>
      <ShippingForm />
      {(carriages != null) ? <Rendercarriages /> : ''}

    </div>
  )
}

export default Checkout
