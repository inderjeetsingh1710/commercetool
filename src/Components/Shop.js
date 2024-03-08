import { CartContext } from '../context/cart.js'
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";

const sleep = ms =>  new Promise(resolve => setTimeout(resolve, ms));
const lang = process.env.REACT_APP_LANG_PROD;

function ShopProduct(){
    const { cartItems, addToCart } = useContext(CartContext)
    const [myProductList, setPList] = useState([]); 
    const currency = process.env.REACT_APP_CURRENCY;   
    const fetchProducts = async () => {
      let token = localStorage.getItem('ecomm_token');      
      const headers = {
      'Authorization': 'Bearer '+token,
      'Content-Type': 'application/json'      
      };
      const apiUrl = process.env.REACT_APP_ECOMM_API_URL+'/'+process.env.REACT_APP_ECOMM_PROJ_NAME+'/products/';
      await axios.request({
          url: apiUrl,
          method:'get',
          headers: headers      
      }).then(function(response){
          let products = JSON.parse(JSON.stringify(response));               
          setPList(products.data.results);            
      });
  
    };
  
    useEffect(() => {
      let token = localStorage.getItem('ecomm_token');      
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
            <div className="row">
                { (myProductList.length > 0) ? myProductList.map((prolist) => <div className="col-md-3" key={prolist.id}>                
                    <div className="inner-product"> 
                        <div className="pro-img">
                        <Link to={`/product/${prolist.id}`}><img src={prolist.masterData.current.masterVariant?.images[0].url} alt={prolist.masterData.current.name[lang]} /></Link>
                        </div>                  
                        <div className="inner-cat-info">                           
                            <Link to={`/product/${prolist.id}`}><h3 className='prod-title'>{prolist.masterData.current.name[lang]}</h3></Link>
                            <div className="price-container">{(prolist.masterData.current.masterVariant.prices[0].value.centAmount / 100).toLocaleString("en-US", {style:"currency", currency:currency})}</div>                          
                            <div className="btn-container">
                                <a href="#" className="addToCart cart-btn btn btn-success" data-id={prolist.id} onClick={() => addToCart({'id':prolist.id,'title':prolist.masterData.current.name[lang],'price': (prolist.masterData.current.masterVariant.prices[0].value.centAmount / 100).toFixed(2) ,'thumbnail':prolist.masterData.current.masterVariant.images[0].url})} ><i className="bi bi-bag"></i> Add to Cart</a>
                            </div>
                        </div>
                    </div>
                
                </div>
                ) : <div className='col-md-12'><p>No Product Found</p></div> }
            </div> 
        </div>
    );
  }

function Shop() {

    const [catresults, setApiCategories] = useState({});   
    /*const catesData = [
        {
            'id': '1ada5b82-27b6-419b-9ba2-c2bacb4b6130',
            'cname': 'Men',
            'subcat': [
                {
                    'id':'1ada5b82-27b6-419b-9ba2-c2bacb4b6130',
                    'cname': 'Testing'
                },
                {
                    'id':'1ada5b82-27b6-419b-9ba2-c2bacb4b6130',
                    'cname': 'Testing'
                }
            ]
        }
    ];
    const mainCats = [
        '1ada5b82-27b6-419b-9ba2-c2bacb4b6130',
        '1ada5b82-27b6-419b-9ba2-c2bacb4b6130',
        '1ada5b82-27b6-419b-9ba2-c2bacb4b6130',
        '1ada5b82-27b6-419b-9ba2-c2bacb4b6130'
    ];*/
   
    useEffect(()=>{
        axios.get(process.env.REACT_APP_ECOMM_API_URL + "/" + process.env.REACT_APP_ECOMM_PROJ_NAME + "/categories?limit=100", { 
            headers: {"Authorization" : `Bearer ${localStorage.getItem('ecomm_token')}`}
        }).
        then(response => { 
            let catList = [];            
            let mainCats = [];  
            let categoriesData = [];          
            let listItems = [];          
            response.data.results.map((category,index) => {          
                if(category.ancestors.length === 0){
                    let cat = {'id':category.id, 'cname':  category.name[lang],'subcat':[]};                   
                    catList.push(cat); //Main Categories
                    mainCats.push(category.id);
                }                
            });            

            response.data.results.map((category,index) => {                          
                if(category.ancestors.length > 0){
                    let listItem = '';                 
                    category.ancestors.map((parent,index) => {
                        if(mainCats.includes(parent.id)){
                            let subcatD = {'id':category.id, 'cname':  category.name[lang]};
                            catList.map((item,indexValue) => {
                                if(item.id == parent.id){
                                    catList[indexValue].subcat.push(subcatD);
                                }
                            })                           
                        }
                    });                    
                }                
            });
            console.log('catList: '+JSON.stringify(catList));
            setApiCategories(catList); 
        }).
        catch(error => { 
            console.error(error) 
        }); 
    },[]);       

  return (
    <>    
    <div className='product-detail-1' id="shop-page">
        <div className='container'>
            <div className='page-title'>
                <h1><span>Shop</span></h1>
                <hr className="style-div" />
            </div>
            <div className='row shop-data'>
                <div className='col-md-3'>
                    <ul className='all-cats'>
                        {(catresults.length > 0) ? catresults.map((cat, index) => {
                            return (<>
                                <li><a href={'/category/'+cat.id}>{cat.cname}</a>
                                 <ul>
                                    {cat?.subcat?.map((subitem, cindex) => (                                        
                                        <li><a href={'/category/'+subitem.id}>{subitem.cname}</a></li>                                        
                                    ))}
                                    </ul>
                                </li>                                
                        </> );
                            
                        }) : <p>No list</p>}
                    </ul>
                </div> 
                <div className='col-md-9'>
                    <ShopProduct />   
                </div>
            </div>
        </div>
    </div></>
  )
}
export default Shop