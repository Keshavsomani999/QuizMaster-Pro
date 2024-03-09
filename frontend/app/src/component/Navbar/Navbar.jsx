import React from 'react';
import "./Navbar.css";
import {Link,useLocation, useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import axios from 'axios';

const Navbar = () => {
  
  const location = useLocation();
  const word = location.pathname.substring(1);
  const navigate = useNavigate(); 
  const dispatch = useDispatch();

 

  const items = [
    { icon: 'home-outline',link:'/home' },
    { icon: 'person-outline',link:'/account' },
    { icon: 'create-outline',link:'/create' },
    // { icon: 'camera-outline',link:'/camera' },
    { icon: 'settings-outline',link:'/setting' },
    // { icon: 'log-out',link:'logout' },
  ];

  const logout = async() =>{
    
  try{
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,  // Add this line
    };
    await axios.get("http://localhost:4000/api/v1/logout",config);
    dispatch({
      type:"logout"
    })
    navigate("/");
  } catch (error) {
    console.log(error);
  
  }
    
  }
  return (
    <div className='navbody'>
      <div className="navigation">
        <ul>
          {items.map((item, index) => (
            <li

              key={index}
              className={`list ${item.link === '/' + word ? 'active' : ''}`}
              
            >
              <Link to={item.link}>
                <span className="icon">
                  <ion-icon name={item.icon}></ion-icon>
                </span>
              </Link>
            </li>
          ))}
           <li>
              <Link onClick={logout}>
                <span className="icon">
                  <ion-icon name="log-out"></ion-icon>
                </span>
              </Link>
              </li>
          <div className="indicator"><span></span></div>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
