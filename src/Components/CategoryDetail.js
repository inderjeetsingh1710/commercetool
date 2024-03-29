import { CartContext } from '../context/cart.js'
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

const lang = process.env.REACT_APP_LANG_PROD;

function CategoryDetails(){    
    let { paramId } = useParams();
    const [catName, setName] = useState([]);
    const [catDesc, setDesc] = useState([]);

    async function fetchCategoryDetail() {
        let token = localStorage.getItem('ecomm_token');

        const headers = {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        };
        const apiUrl = process.env.REACT_APP_ECOMM_API_URL + '/' + process.env.REACT_APP_ECOMM_PROJ_NAME + '/categories/' + paramId;
        await axios.request({
            url: apiUrl,
            method: 'get',
            headers: headers
        }).then(function (response) {
            let categories = JSON.parse(JSON.stringify(response));
            console.log('Categories: ' + categories.data.name[lang]);
            setName(categories.data.name[lang]);
            (categories.data?.description) ? setDesc(categories.data.description[lang]) : setDesc('');
            //setDesc(categories.data.description.en);

            //return false;          
        });
    }
    useEffect(() => {
        fetchCategoryDetail();
      }, []);
    return (
        <div className='category-info'>
             <h1>{catName}</h1>
             <p>{catDesc}</p>
             <p></p>
        </div>
    );
};

function CategoryDetail(props) {
    let { paramId } = useParams();
    const { cartItems, addToCart } = useContext(CartContext)
    const [prodetails, setCatdetails] = useState([]);
    const [myProductList, setList] = useState([]);
    const currency = process.env.REACT_APP_CURRENCY;
    const currencySymbol = process.env.REACT_APP_CURRENCY_SYMBOL;
     

    const catdetail = async () => {
        //const details = await axios.get(`https://fakestoreapi.com/products/${catId}`);
        //console.log(details.data);
        let token = localStorage.getItem('ecomm_token');
        const headers = {
            'Authorization': 'Bearer '+token,
            'Content-Type': 'application/json'      
        };
        
        const apiUrl = process.env.REACT_APP_ECOMM_API_URL+'/'+process.env.REACT_APP_ECOMM_PROJ_NAME+'/products/?where=masterData(current(categories(id%3D%22'+paramId+'%22)))';

        await axios.request({
            url: apiUrl,
            method:'get',
            headers: headers      
        }).then(function(response){
            let categories = JSON.parse(JSON.stringify(response));             
            //console.log('Categories image: '+categories.data.results[0].masterData.current.masterVariant.images[0].url);
            //return false;          
            setList(categories.data.results);            
        });

    };

    useEffect(() => {
        catdetail();
      }, []);
  return (
    <>    
    <div className='product-detail-1' id="category-page">
        <div className='container'>
            <div className="row cat-info">
                <CategoryDetails />
            </div>
            <div className='inner-prodct-detail'>
                <div className='row'>
                    { (myProductList.length > 0) ? myProductList.map((list,index) => <div className="col-md-3" key="data">                
                        <div className="inner-product"> 
                            <div className="pro-img">
                            <Link to={`/product/${list.id}`}>
                                { list.masterData.current.masterVariant.images[0].url ? <img src={list.masterData.current.masterVariant.images[0].url} alt={list.masterData.current.name[lang]} /> : <img src="/images/product-image.png" alt={list.masterData.current.name[lang]} /> }         
                                
                            </Link>
                            </div>                  
                            <div className="inner-cat-info">                           
                                <Link to={`/product/${list.id}`}><h2 className='product-title'>{list.masterData.current.name[lang]}</h2></Link>
                                {/* { list.masterData.current.masterVariant.prices.map(prices => <p>{prices.value.centAmount}</p>) } */}                           
                                <div className="price-container">
                                    {(list.masterData.current.masterVariant.prices[0].value.centAmount / 100).toLocaleString("en-US", {style:"currency", currency:currency})}
                                </div>
                                <div className="btn-container">
                                    <a href="#" type="button" className="addToCart cart-btn btn btn-success" data-id={list.id} onClick={() => addToCart({'id':list.id,'title':list.masterData.current.name[lang],'price': (list.masterData.current.masterVariant.prices[0].value.centAmount / 100).toFixed(2) ,'thumbnail':list.masterData.current.masterVariant.images[0].url})}><i className="bi bi-bag"></i> Add to Cart</a>
                                </div>                            
                            </div>
                        </div>                
                    </div>
                    ) : <div className='col-md-12'><p>No Product Found</p></div> }
                </div>
            </div>
        </div>
    </div></>
  )
}

export default CategoryDetail