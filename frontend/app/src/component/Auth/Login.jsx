import React, { Fragment, useEffect, useState } from "react";
import "./User.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";

const Login = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { error, isLoading, isAuthenticated } = useSelector(
    (state) => state.user
  );

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
      type: "login_Request",
    });
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Add this line
      };

      const { data } = await axios.post(
        "http://localhost:4000/api/v1/login",
        loginData,
        config
      );

      dispatch({
        type: "login_Success",
        payload: data.user,
      });
    } catch (error) {
      dispatch({
        type: "Login_Fail",
        payload: error.response.data.message,
      });
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({
        type: "Clear_Errors",
      });
    }
    console.log(isAuthenticated);
    if (isAuthenticated) {
      navigate(`/home`);
    }
  }, [error, isAuthenticated, navigate, dispatch]);

  const passhide = () => {
    setShow(!show);
  };

  return (
    <Fragment>
      {isLoading ? (
        <Loader />
      ) : (
        <Fragment>
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
                      type={show ? "text" : "password"}
                      id="pass"
                      class="input-field"
                      name="password"
                      onChange={loginChange}
                      required
                    />
                    <label htmlFor="pass" class="label">
                      Password
                    </label>

                    {show ? (
                      <i class="bx bx-show loginicon " onClick={passhide}></i>
                    ) : (
                      <i class="bx bxs-hide loginicon" onClick={passhide}></i>
                    )}
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
        </Fragment>
      )}
    </Fragment>
  );
};

export default Login;
