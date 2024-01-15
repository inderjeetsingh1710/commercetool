import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Login from '../Login';


function Footer(props) {    
  return (
    <div className="footer">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-3 col-md-3">
              <h3>What is Lorem Ipsum</h3>
              <ul>
                <li><a href="#">Lorem Ipsum</a></li>
                <li><a href="#">Lorem Ipsum</a></li>
                <li><a href="#">Lorem Ipsum</a></li>
                <li><a href="#">Lorem Ipsum</a></li>           
              </ul>
            </div>
              <div className="col-xs-12 col-sm-3 col-md-3">
                <h3>Why do we use it</h3>
                <ul>
                <li><a href="#">Lorem Ipsum</a></li>
                <li><a href="#">Lorem Ipsum</a></li>
                <li><a href="#">Lorem Ipsum</a></li>
                <li><a href="#">Lorem Ipsum</a></li>              
                </ul>
              </div>
              <div className="col-xs-12 col-sm-3 col-md-3">
                <h3>Where does it come from</h3>
                <ul>
                <li><a href="#">Lorem Ipsum</a></li>
                <li><a href="#">Lorem Ipsum</a></li>
                <li><a href="#">Lorem Ipsum</a></li>
                <li><a href="#">Lorem Ipsum</a></li>                
                </ul>
              </div>
              <div className="col-xs-12 col-sm-3 col-md-3">
                <h3>Where can I get some</h3>
                <ul>
                <li><a href="#">Lorem Ipsum</a></li>
                <li><a href="#">Lorem Ipsum</a></li>
                <li><a href="#">Lorem Ipsum</a></li>
                <li><a href="#">Lorem Ipsum</a></li>               
                </ul>
              </div>
          </div>
        </div>
    </div>   
  )
}

export default Footer