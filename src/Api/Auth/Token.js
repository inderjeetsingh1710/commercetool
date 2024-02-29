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
    username: process.env.REACT_APP_ECOMM_API_USERNAME,
    password: process.env.REACT_APP_ECOMM_API_PWD,
    // expiresInMins: 60, // optional
  }
  const headres = {
    'Authorization': 'Basic '+process.env.REACT_APP_ECOMM_BASIC_AUTH
  };
  try {
    let token = localStorage.getItem('ecomm_token');
    let get_token_date = localStorage.getItem('get_ecomm_token_date');
    let todayDate = getDate();


    const fetchToken = async () => {

      if (get_token_date != todayDate || token == '') {

        localStorage.setItem('ecomm_token', '');
        await axios.request({          
          url: process.env.REACT_APP_API_AUTH_URL+'/oauth/token?grant_type=client_credentials',
          method: 'post',
          headers: headres,
          data: postData
        }).then(function (response) {
          let responseData = JSON.parse(JSON.stringify(response));
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