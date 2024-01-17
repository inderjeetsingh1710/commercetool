import React, { useEffect, useState } from 'react'
import axios from 'axios';

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${month}/${date}/${year}`;
}

function Token() {
  // const history = useNavigate();
  const [login, setLogin] = useState([]);
  const [userName, createUser] = useState(''); 
  const postData = {
        username: 'xFAvcurovwyUtd5l-0OqKLVO',
        password: 'Nh0xgihKwYbqayKHcRfYlgTU-aUy29My',
        // expiresInMins: 60, // optional
    }
    const headres = {
      'Authorization': 'Basic eEZBdmN1cm92d3lVdGQ1bC0wT3FLTFZPOk5oMHhnaWhLd1licWF5S0hjUmZZbGdUVS1hVXkyOU15'      
    };
    try {
      let token = localStorage.getItem('ecomm_token');
      let get_token_date = localStorage.getItem('get_ecomm_token_date');
      let todayDate = getDate();
      console.log('API token: '+token);      
      console.log('API today: '+get_token_date);  
      
      const fetchToken = async () => {      
        if(get_token_date != todayDate || token != ''){   
          console.log('API Call for Token');     
          await axios.request({
            url: 'https://auth.eu-central-1.aws.commercetools.com/oauth/token?grant_type=client_credentials',
            method:'post',
            headers: headres,
            data: postData
          }).then(function(response){
              let responseData = JSON.parse(JSON.stringify(response)); 
              console.log('responseData1: '+responseData.data.access_token);  
              localStorage.setItem('ecomm_token', responseData.data.access_token);
              localStorage.setItem('get_ecomm_token_date', getDate());  
              //let token = localStorage.getItem('token'); 
          });
        }    
      };
      fetchToken(); 

    }
    catch (e) {
      console.log(e)
    }  
     
}
export default Token