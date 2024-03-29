import React, { useState,useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from 'react-alert'
import { useNavigate,useLocation } from "react-router-dom"
import Loader from "./Loader/Loader";

const Home = () => {

  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const location = useLocation();
  const quizId = location.state ? location.state.quizId : null;

  console.log("quiz id" ,quizId);

  const {error,isLoading} = useSelector(state => state.quiz)
  const {user} = useSelector(state => state.user)


  const [start, setStart] = useState({
    id: quizId,
    name:"",
    rollNumber: user.rollnumber,
  });

  const startChange = (e) => {
    setStart({ ...start, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch({
      type:"createQuiz_Request"
    })
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const { data } = await axios.get(
        `http://localhost:4000/api/v1/product/${quizId}?rollNumber=${start.rollNumber}`,
        config
      );
      console.log("data",data);
      dispatch({
        type:"Quiz_Success",
        payload:data.quiz
      })
      navigate('/quiz')
      
    } catch (error) {
      console.log(error.response.data.message);

      dispatch({
        type:"createQuiz_Fail",
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
  }, [alert,error,dispatch])


  return (
    <>
    {isLoading ? <Loader /> : <>
    <div className="quizCreate-wrapper">
      <div className="quizCreate-box">
        <div class="quizCreate-header">
          <span>Start Quiz</span>
        </div>
        <form id="quizForm" onSubmit={submitHandler}>
          <div className="input_box">
            <input
              type="text"
              id="id"
              class="input-field"
              name="id"
              onChange={startChange}
              value={start.id}
              required
              disabled
            />
            <label htmlFor="id" class="label">
              ID:
            </label>
          </div>
          <div className="input_box">
            <input
              type="text"
              id="name"
              class="input-field"
              name="name"
              onChange={startChange}
              
              required
            />
            <label htmlFor="name" class="label">
              Name:
            </label>
          </div>
          <div className="input_box">
            <input
              type="text"
              id="rollNumber"
              name="rollNumber"
              class="input-field"
              onChange={startChange}
              value={start.rollNumber}
              required
              disabled
            />
            <label htmlFor="rollNumber" class="label">
              Roll Number:
            </label>
          </div>

          <div class="input_box">
            <input type="submit" class="input-submit" value="Start" />
          </div>
        </form>
      </div>
    </div>
    </>}
    </>
  );
};

export default Home;
