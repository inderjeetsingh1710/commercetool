import React from 'react'
import { useContext } from 'react'
import { CartContext } from '../context/cart'
import axios from "axios";
import "./../css/custom.css";

const currency = process.env.REACT_APP_CURRENCY;
const currencySymbol = process.env.REACT_APP_CURRENCY_SYMBOL;

function Checkout() {
  const { cartItems, addToCart, removeFromCart, clearCart, getCartTotal } = useContext(CartContext);
  const token = localStorage.getItem('ecomm_token');

  function getcarriages() {
    console.log('sssssssssssssssss');
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

  function validateForm() {

  }
  function handleSubmit() {
    var result = validateForm();
    // console.log('reached here ');
  }
  function Rendercarriages() {
    return (
      <div className='carr'>
        <section class="checkout delivery-option">


          <div className="header"><strong>Delivery options</strong></div>
          <div class="row">

            <div class="col-sm-6 subcloumn">
              <span style={{ margin: '20px' }}>Please select a delivery option</span>
            </div>
            <div class="col-sm-4 subcloumn">
              <span>Carrier</span>
            </div>
            <div class="col-sm-2 subcloumn">
              <span>Price</span>
            </div>
          </div>

        </section >

        <div className=''>
          <form>

            {(carriages.length > 0) ? carriages.map((list, index) =>
              <div className='row innerrow'>
                <div className="col-sm-6 subcolumn" key="data">
                  <input name="carriageval" value={list.id} onclick="" type="radio" />
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

            ) : <div className='col-md-12'><p>No Product Found</p></div>



            }
          </form>
        </div>

      </div >


    );
  }
  getcarriages();
  // rendercarriages();
  return (
    <div>
      <>
        <div className="container">
          <div className="page-container">
            <h1 className="page-title">Checkout</h1>

          </div>
          {(carriages != null) ? <Rendercarriages /> : ''}

        </div>
      </>
    </div>
  )
}

export default Checkout
