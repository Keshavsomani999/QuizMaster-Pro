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
    const [show, setShow] = useState(false)
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    role:"teacher",
    password: "",
    rollnumber: "",
  });
  const passhide = () =>{
    setShow(!show)
  }
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
      console.log(signupData);
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
            <option value="teacher" >Teacher</option>
              <option value="student" >Student</option>
              
             
        </select>
              
              <label for="role" class="label">
              Role:
              </label>
              <i class="bx bx-chevron-down loginicon"></i>
            </div>

            {signupData.role === "student" && (  
              <div className="input_box">
                <input
                  type="text"
                  id="rollnumber"
                  className="input-field"
                  name="rollnumber"
                  onChange={signupChange}
                  required={signupData.role === "student"}
                />
                <label htmlFor="rollnumber" className="label">
                  Roll Number
                </label>
                <i className="bx bx-user loginicon"></i>
              </div>
            )}
            <div class="input_box">
              <input
                type={show ? "text":"password"}
                id="pass"
                class="input-field"
                name="password"
                onChange={signupChange}
                required
              />
              <label for="pass" class="label">
                Password
              </label>
              {show ? <i class="bx bx-show loginicon " onClick={passhide}></i>:<i class="bx bxs-hide loginicon" onClick={passhide}></i>}
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
      <div className="loginText">
              <h1 class="animated-text">
                Welcome to <span class="highlight">Quiz</span> Master
              </h1>
              <div>
                <span>Diverse Quiz Categories:</span> Delve into a plethora of
                quiz categories spanning from history, science, and literature
                to pop culture, sports, and beyond. With an extensive range of
                topics, there's always a quiz tailored to your interests.
                <br />
                <br />
                <span>Engaging Content:</span> Immerse yourself in
                thought-provoking questions crafted to stimulate your intellect
                and ignite your passion for learning. Each quiz is meticulously
                curated to ensure an enriching and enjoyable experience.
                <br />
                <br />
                <span>Track Your Progress:</span> Monitor your quiz performance
                and track your progress over time. Keep tabs on your scores,
                achievements, and areas for improvement as you strive for
                mastery in your favorite topics.
                <br />
                <br />
                <span>Interactive Experience:</span> Experience an interactive
                platform designed for seamless navigation and user-friendly
                interaction. Our intuitive interface makes it easy to browse
                quizzes, answer questions, and explore new topics effortlessly.
                <br />
                <br />
                <span>Community Engagement:</span> Connect with like-minded individuals from
                around the globe and engage in lively discussions about your
                favorite quizzes. Share insights, exchange trivia knowledge, and
                build lasting connections within our vibrant community.
              </div>
            </div>
    </div>
  );
};

export default Signup;
