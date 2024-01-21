import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';

function ProductDetail() {
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
let itemName = product?.masterData?.current?.name?.en;
  return (
    <div className='product-detail'> 
       {itemName}
    </div>
  )
}

export default ProductDetail