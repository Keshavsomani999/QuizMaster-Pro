import React, { Fragment, useEffect, useState } from "react";
import "./User.css";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import { useAlert } from 'react-alert'
import { useDispatch,useSelector } from "react-redux";
import Loader from "../Loader/Loader";




const Login = () => {

    const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {error,isLoading,isAuthenticated} = useSelector(state => state.user)

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const loginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    dispatch({
        type:"login_Request"
    })
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,  // Add this line
      };
      
      const { data } = await axios.post("http://localhost:4000/api/v1/login", loginData, config);
      
        
            
            dispatch({
                type:"login_Success",
                payload:data.user
            })
        
    } catch (error) {
      
      dispatch({
        type:"Login_Fail",
        payload:error.response.data.message
      })
    }
  };

useEffect(() => {
 if(error){
    alert.error(error)
    dispatch({
        type:"Clear_Errors"
    })
 }
 console.log(isAuthenticated);
 if(isAuthenticated){
  navigate(`/home`)
}

}, [error,isAuthenticated,navigate,dispatch])


  return (
    <Fragment>
        {isLoading ? <Loader /> : <Fragment>
           
        <div className="loginbody">
      <div class="wrapper">
        <div class="login_box">
          <div class="login-header">
            <span>Login</span>
          </div>
          <form onSubmit={loginHandler}>
            <div class="input_box">
              <input
                type="email"
                id="user"
                class="input-field"
                name="email"
                onChange={loginChange}
                required
              />
              <label htmlFor="user" class="label">
                Email
              </label>
              <i class="bx bx-envelope loginicon"></i>
            </div>

            <div class="input_box">
              <input
                type="password"
                id="pass"
                class="input-field"
                name="password"
                onChange={loginChange}
                required
              />
              <label htmlFor="pass" class="label">
                Password
              </label>
              <i class="bx bx-lock-alt loginicon"></i>
            </div>

            <div class="remember-forgot">
              <div class="remember-me">
                <input type="checkbox" id="remember" />
                <label for="remember">Remember me</label>
              </div>

              <div class="forgot">
                <a href="#">Forgot password?</a>
              </div>
            </div>

            <div class="input_box">
              <input type="submit" class="input-submit" value="Login" />
            </div>
          </form>
          <div class="register">
            <span>
              Don't have an account? <Link to="/signup">Register</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
           
            </Fragment>}
    </Fragment>
  );
};

export default Login;
