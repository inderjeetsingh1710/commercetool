import React, { useEffect, useState } from 'react'
import axios from "axios";

function Users() {
    const [userlist, setUserlist] = useState([]);
    const getUsers = async () => {
        const users = await axios.get('https://api.escuelajs.co/api/v1/users');
       console.log(users.data)
       setUserlist(users.data);
       };

    useEffect(() => {
        getUsers();
       }, []);
  return (
    <div className='usersiname'>
        <div className='container'>
            <div className='row'>
                {userlist.map((uslist) => 
                        <div className='col-md-3'>
                        <div className='inner-list'>
                            <img src={uslist.avatar} alt="" />
                              <h3>{uslist.name}</h3>
                              <h5>{uslist.password}</h5>
                              <p>{uslist.role}</p>
                        </div>
                    </div>
                )}
                
            </div>
        </div>
    </div>
  )
}

export default Users