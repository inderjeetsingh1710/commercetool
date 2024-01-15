import React, { useEffect, useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
//Home page
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

  const fetchProducts = async () => {
    const response = await axios.get("https://fakestoreapi.com/products");
    console.log(response.data);
    setList(response.data);
  };
  useEffect(() => {
    //fetchProducts();
    fetchCategories();
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
          <div className="row latest-product-offers home-categories" id="home-categories">          
            <h2><span>Latest Categories</span></h2>
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
    </>
  );
}

export default Home;
