import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link } from "react-router-dom";

function Signup() {
    const [inutvalue, setInputvalue] = useState([]);
  

    console.log(inutvalue);
    
    // const getdata = (e) => {
    //     // console.log(e.target.value)
    //  const {value,name} = e.target;   
    //  setInputvalue (() => {
    //     return {
    //         ...inutvalue, name:value
    //     } 
    //  })
    // }
    const addData = (e) => {
        e.preventDefault();
        console.log(inutvalue);
        // const {first, last, email, password} = inutvalue ;

      
    }
  return (
    <div className='login-page'>
    <Formik
    initialValues={{
        first: '',
        last: '',
        email: '',
        password:''
      }}
      onSubmit={values => {

        // same shape as initial values
        setInputvalue([...inutvalue, values ])
        let olddata = localStorage.getItem('formdata');
        if(olddata==null){
            olddata = []
            olddata.push(values)
            localStorage.setItem('formdata', JSON.stringify(olddata));
        
          } else{
            let oldArr = JSON.parse(olddata)
            oldArr.push(values)
            localStorage.setItem("formdata", JSON.stringify(oldArr))
            console.log(oldArr,'hhg')
            console.log(oldArr);
          }
        
        // localStorage.setItem("userYoutube",JSON.stringify([values]));        
      }}
    >
        <Form>
            <h3>SIGN UP</h3>
            <div className='form-group'>
            <label>First name</label>
            <Field  name="first" type="text" ></Field>
            </div>
            <div className='form-group'>
            <label>Last name</label>
            <Field  name="last" type="text" ></Field>
            </div>
            <div className='form-group'>
            <label>Email</label>
            <Field  name="email" type="email" ></Field>
            </div>
            <div className='form-group'>
            <label>Password</label>
            <Field  name="password" type="password" ></Field>
            </div>
            <div className='form-group check-field'>
           
            <Field name="check" type="checkbox" ></Field>
            <label>I agree the Terms and Conditions?</label>
            </div>
            <div className='form-group'>
                <div className='sign-up-btn'>
            <button name="btn" type="submit">Sign up</button>
            <Link to="/signup">Log in</Link>
            </div>
            </div>
        </Form>
    </Formik>
</div>
  )
}

export default Signup