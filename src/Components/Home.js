import React, { useEffect, useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
//import books from "../datastore.json"
function MyBanner(){
  return (
    <div className="banner">        
        <div className="container">
          <div className="quick-info">
              <ul>
                <li className="col-md-3 col-sm-3">
                  <img width="35" height="35" src="/delivery-icon.png" alt="" title="" />
                  <a href="#">What is Lorem Ipsum?</a>
                </li>
                <li className="col-md-3 col-sm-3">
                  <img width="35" height="35" src="/fifm_green.png" alt="" title="" />
                  <a href="#">Why do we use it?</a>
                </li>
                <li className="col-md-3 col-sm-3">
                  <img width="35" height="35" src="/clock-icon.png" alt="" title="" />
                  <a href="#">Where does it come from?</a>
                </li>
                <li className="col-md-3 col-sm-3">
                  <img width="35" height="35" src="/stock-icon.png" alt="" title="" />
                  <a href="#">Where can I get some?</a>
                </li>
              </ul>
          </div>
          <div className="row home-banners">
              <div className="col-md-12">
                  <img src="/banner-1.png" />
              </div>              
          </div>
        </div>                
    </div>
    
  );
}
const sleep = ms =>  new Promise(resolve => setTimeout(resolve, ms));

function FeaturedProduct(){
  const [myProductList, setList] = useState([]);
  const fetchProducts = async () => {
    let token = localStorage.getItem('ecomm_token');   
    let paramId = 'c7cc7bb6-5de4-4100-8b78-a0f69776dbb3';
    const headers = {
    'Authorization': 'Bearer '+token,
    'Content-Type': 'application/json'      
    };
    
    await axios.request({
        url: 'https://api.eu-central-1.aws.commercetools.com/netsolutionssample/products/?where=masterData(current(categories(id%3D%22'+paramId+'%22)))',
        method:'get',
        headers: headers      
    }).then(function(response){
        let categories = JSON.parse(JSON.stringify(response));             
        //console.log('Categories: '+categories.data.results[0].id);
        //return false;          
        setList(categories.data.results);            
    });

  };

  useEffect(() => {
    let token = localStorage.getItem('ecomm_token');
    console.log('FeaturedProduct: '+token);
    if(token == '' || token == null ){
      sleep(1000).then(() => {
        console.log('Going into Sleep 2');
        fetchProducts();
      });
    }else{
      fetchProducts();
    } 
    
  }, []);
  return(
    <div className="product-list">
    <div className="container">
      <h2><span>Featured Products</span></h2>
      <hr className="style-div" />
      <div className="row">
      { (myProductList.length > 0) ? myProductList.map((list,index) => <div className="col-md-3" key="data">
                <Link to={`/product/${list.id}`}>
                    <div className="inner-product"> 
                        <div className="pro-img">
                            <img src={list.masterData.current.variants[0].images[0].url} alt={list.masterData.current.name.en} />
                        </div>                  
                        <div className="inner-cat-info">                           
                            <h1>{list.masterData.current.name.en}</h1>
                             {/* { list.masterData.current.masterVariant.prices.map(prices => <p>{prices.value.centAmount}</p>) }                            */}
                             <div className="price-container">{(list.masterData.current.masterVariant.prices[0].value.centAmount / 100).toLocaleString("en-US", {style:"currency", currency:"GBP"})}</div>
                             <div className="btn-container"><a href="javascript:void(0)" className="addToCart cart-btn btn btn-success" data-id={list.id}><i class="bi bi-bag"></i> Add to Cart</a></div>
                        </div>
                    </div>
                </Link>
                </div>
                ) : <div className='col-md-12'><p>No Product Found</p></div> }
      </div>
    </div>

  </div>
  );
}
function Home() {
  //Categories Image
  const catImages = [
    'men-cat1.png',
    'accessories-cat.png',
    'sale-cat.png',
    'womens-cat.png'
  ];
  // Products
  const [mylist, setList] = useState([]);
  const [myCatlist, setList1] = useState([]);
 
  useEffect(() => {    
    let token = localStorage.getItem('ecomm_token');
    console.log('fetchCategories token: '+token);
    if(token == '' || token == null){
      sleep(1000).then(() => {
        console.log('Going into Sleep 1');
        fetchCategories();
      });
    }else{
      fetchCategories();
    }
  }, []);

  // Categories
  // https://api.eu-central-1.aws.commercetools.com/netsolutionssample/categories

  const fetchCategories = async () => {
    let token = localStorage.getItem('ecomm_token');     
    const headers = {
      'Authorization': 'Bearer '+token,
      'Content-Type': 'application/json'      
    };
    await axios.request({
      url: 'https://api.eu-central-1.aws.commercetools.com/netsolutionssample/categories?limit=4',
      method:'get',
      headers: headers      
    }).then(function(response){
        let categories = JSON.parse(JSON.stringify(response));
        setList1(categories.data.results); 
        console.log('Categories: '+categories.data.results);  
        
    });

    //const response = await axios.get("https://api.eu-central-1.aws.commercetools.com/netsolutionssample/categories");
    //console.log(response.data);
    //setList(response.data);
  };
 
  return (
    <><MyBanner />
      <div className="categories-list">
        <div className="container">
          <h2><span>Shop by Category</span></h2>
          <hr className="style-div" />
          <div className="row latest-product-offers home-categories" id="home-categories">          
            
            {myCatlist.map((list,index) => <div className="col-md-3" key="data">
              <Link to={`/category/${list.id}`}>
                <div className="inner-product">
                  <div className="pro-img" style={{ backgroundImage:`url(${'/images/'+catImages[index]})`, backgroundSize: 'cover',backgroundRepeat:'no-repeat'}} >
                    {/* <img src={'/images/'+catImages[index]} alt={index} />                     */}
                  </div>
                  <div className="inner-cat-info">
                    <h1>{list.name.en}</h1>
                    <p>{list.description ? (list.description.en ): ('')}</p>
                  </div>
                </div>
              </Link>
            </div>
            )}
          </div>
        </div>
      </div>
      <FeaturedProduct />   
    </>
  );
}

export default Home;