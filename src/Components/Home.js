import { Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from '../context/cart.js'
import React, { useEffect, useState, useContext } from "react";

const lang = process.env.REACT_APP_LANG_PROD;

function MyBanner() {
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
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function FeaturedProduct() {
  const { cartItems, addToCart } = useContext(CartContext)
  const [myProductList, setPList] = useState([]);
  const [myHomeProducts, setHomeProductList] = useState([]);
  const currency = process.env.REACT_APP_CURRENCY;
  const currencySymbol = process.env.REACT_APP_CURRENCY_SYMBOL;

  const fetchProducts = async () => {
    let token = localStorage.getItem('ecomm_token');
    console.log('fetchproducts_home_page', token);
    let paramId = process.env.REACT_APP_FEATURED_CAT;
    const headers = {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    };
    const apiUrl = process.env.REACT_APP_ECOMM_API_URL + '/' + process.env.REACT_APP_ECOMM_PROJ_NAME + '/products/?limit=4&where=masterData(current(categories(id%3D%22' + paramId + '%22)))';
    await axios.request({
      url: apiUrl,
      method: 'get',
      headers: headers
    }).then(function (response) {
      let categories = JSON.parse(JSON.stringify(response));
      let tempProduct = {
      }
      setPList(categories.data.results);
    });

  };

  useEffect(() => {
    let token = localStorage.getItem('ecomm_token');
    if (token == '' || token == null) {
      sleep(2000).then(() => {

        fetchProducts();
      });
    } else {
      fetchProducts();
    }

  }, []);
  return (
    <div className="product-list">
      <div className="container">
        <h2><span>Featured Products</span></h2>
        <hr className="style-div" />
        <div className="row">
          {(myProductList.length > 0) ? myProductList.map((prolist) => <div className="col-md-3" key={prolist.id}>
            <div className="inner-product">
              <div className="pro-img">
                <Link to={`/product/${prolist.id}`}><img src={prolist.masterData.current.masterVariant.images[0].url} alt={prolist.masterData.current.name.en} /></Link>
              </div>
              <div className="inner-cat-info">
                <Link to={`/product/${prolist.id}`}><h1>{prolist.masterData.current.name[lang]}</h1></Link>
                {/* { list.masterData.current.masterVariant.prices.map(prices => <p>{prices.value.centAmount}</p>) }                            */}
                <div className="price-container">{(prolist.masterData.current.masterVariant.prices[0].value.centAmount / 100).toLocaleString("en-US", { style: "currency", currency: currency })}</div>
                <div className="btn-container"><a href="#" className="addToCart cart-btn btn btn-success" data-id={prolist.id} onClick={() => addToCart({ 'id': prolist.id, 'title': prolist.masterData.current.name.lang, 'price': (prolist.masterData.current.masterVariant.prices[0].value.centAmount / 100).toFixed(2), 'thumbnail': prolist.masterData.current.variants[0].images[0].url })}><i className="bi bi-bag"></i> Add to Cart</a></div>
              </div>
            </div>

          </div>
          ) : <div className='col-md-12'><p>No Product Found</p></div>}
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
    console.log('fetchCategories token: ' + token);
    if (token == '' || token == null) {
      sleep(2000).then(() => {

        fetchCategories();
      });
    } else {
      fetchCategories();
    }
  }, []);

  // Categories
  // https://api.eu-central-1.aws.commercetools.com/netsolutionssample/categories

  const fetchCategories = async () => {
    let token = localStorage.getItem('ecomm_token');
    const headers = {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    };
    const apiUrl = process.env.REACT_APP_ECOMM_API_URL + '/' + process.env.REACT_APP_ECOMM_PROJ_NAME + '/categories?limit=4';
    await axios.request({
      url: apiUrl,
      method: 'get',
      headers: headers
    }).then(function (response) {
      let categories = JSON.parse(JSON.stringify(response));
      setList1(categories.data.results);


    });

  };

  return (
    <><MyBanner />
      <div className="categories-list">
        <div className="container">
          <h2><span>Shop by Category</span></h2>
          <hr className="style-div" />
          <div className="row latest-product-offers home-categories" id="home-categories">

            {myCatlist.map((catlist, index) => <div className="col-md-3" key={catlist.id}>
              <Link to={`/category/${catlist.id}`}>
                <div className="inner-product">
                  <div className="pro-img" style={{ backgroundImage: `url(${'/images/' + catImages[index]})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} >
                    {/* <img src={'/images/'+catImages[index]} alt={index} />                     */}
                  </div>
                  <div className="inner-cat-info">
                    <h1>{catlist.name[lang]}</h1>
                    <p>{catlist.description ? (catlist.description[lang]) : ('')}</p>
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