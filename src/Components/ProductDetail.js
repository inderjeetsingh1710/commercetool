import axios from "axios";
import { useParams } from 'react-router-dom';
import "./../css/custom.css";
import {getCurrencySymbol} from "./Common/Helper.js";
import { CartContext } from '../context/cart.js'
import React, { useEffect, useState, useContext } from 'react';

function ProductDetail() {
  const { cartItems, addToCart } = useContext(CartContext)
  const [product, setProduct] = useState({});
  const {id} = useParams();
  useEffect(()=>{
  axios.get(process.env.REACT_APP_ECOMM_API_URL + "/" + process.env.REACT_APP_ECOMM_PROJ_NAME + "/products/" + id, { headers: {"Authorization" : `Bearer ${localStorage.getItem('ecomm_token')}`}
  }).
  then(response => { setProduct(response.data) }).
  catch(error => { console.error(error) }); 
  },[]); 
  // const {masterData:{current:{name:{en}}}} =  product;  
  //  console.log(product?.masterData?.current?.name?.en);
  let currentItem = product?.masterData?.current;
  let itemName = currentItem?.name?.en;
  let itemDescription = currentItem?.metaDescription?.en;
  let itemPrices = currentItem?.masterVariant?.prices;
  let itemPrice = itemPrices?.[0]?.value?.centAmount/100;
  let itemCurrencySymbol = getCurrencySymbol(itemPrices?.[0]?.country ?? 'Any', itemPrices?.[0]?.value?.currencyCode ?? 'EUR');
  let itemImage = currentItem?.masterVariant?.images?.[0]?.url;

  console.log(itemImage);
  return (    
    <div class="product-detail">
        <img src={itemImage} alt="Product Image" />
        <h2>{itemName}</h2>
        <p>{itemDescription}</p>
        <h6>Price: {itemCurrencySymbol}{itemPrice.toFixed(2)}</h6>
        <button onClick={() => addToCart({ 'id':id, 'title': itemName, 'price': itemPrice.toFixed(2), 'thumbnail': itemImage })}>Add to Cart</button>
    </div>
  )
}

export default ProductDetail