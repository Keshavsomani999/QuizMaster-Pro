import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert'
import { useDispatch,useSelector } from "react-redux";


const Signup = () => {

  const alert = useAlert();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {error,isLoading,isAuthenticated} = useSelector(state => state.user)

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    role:"",
    password: "",
  });

  const signupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    dispatch({
      type:"login_Request"
  })

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,  // Add this line
      };

      const { data } =  await axios
        .post("http://localhost:4000/api/v1/register", signupData, config)
        dispatch({
          type:"login_Success",
          payload:data.user
      })
      navigate("/home")
    } catch (error) {
      console.log(error.response.data.message);
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
   }, [error])
  return (
    <div className="loginbody">
      <div class="wrapper">
        <div class="login_box">
          <div class="login-header">
            <span>Sign Up</span>
          </div>
          <form onSubmit={signupHandler}>
            <div class="input_box">
              <input
                type="text"
                id="Name"
                class="input-field"
                name="name"
                onChange={signupChange}
                required
              />
              <label for="Name" class="label">
                Name
              </label>
              <i class="bx bx-user loginicon"></i>
            </div>
            <div class="input_box">
              <input
                type="text"
                id="Email"
                class="input-field"
                name="email"
                onChange={signupChange}
                required
              />
              <label for="Email" class="label">
                Email
              </label>
              <i class="bx bx-envelope loginicon"></i>
            </div>
            <div class="input_box">
            <select id="myDropdown" onChange={signupChange} class="input-field" name="role">
              <option value="student" >Student</option>
              <option value="teacher" >Teacher</option>
        </select>
              
              <label for="role" class="label">
              Role:
              </label>
              <i class="bx bx-chevron-down loginicon"></i>
            </div>
            <div class="input_box">
              <input
                type="password"
                id="pass"
                class="input-field"
                name="password"
                onChange={signupChange}
                required
              />
              <label for="pass" class="label">
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
              <input type="submit" class="input-submit" value="Sign Up" />
            </div>
          </form>
          <div class="register">
            <span>
              Have an account? <Link to="/">Login</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
