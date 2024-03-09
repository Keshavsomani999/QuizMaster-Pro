import React, { useEffect, useState } from "react";
import "./Quiz.css";
import * as XLSX from "xlsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import { useAlert } from 'react-alert'


const CreateQuiz = () => {

  const alert = useAlert();
  const dispatch = useDispatch();
  const {error,isLoading} = useSelector(state => state.quiz)
 
  const [create, setCreate] = useState({
    title: "",
    totalQuestions: "",
    quizExpireTime: "",
    questions: null,
    enrolledStudents: null,
  });

  const createChange = (e) => {
    setCreate({ ...create, [e.target.name]: e.target.value });
  };

  const handleuploadQuestions = (e) => {
    const file = e.target.files[0];
    const isQuestion = true
    convertExcelToJson(file,isQuestion, (jsonData) => {
      setCreate({ ...create, questions: jsonData });
    });
  };

  const handleEnrolledStudents = (e) => {
    const file = e.target.files[0];
    const isQuestion = false;
    convertExcelToJson(file,isQuestion, (jsonData) => {
      setCreate({ ...create, enrolledStudents: jsonData });
    });
  };
  


  const convertExcelToJson = (file,isQuestion, callback) => {
    
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
  
      // Assuming the first sheet is the relevant one; modify as needed
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
  
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      
      // Modify the jsonData structure to include options
      if(isQuestion === true){
      const formattedData = jsonData.map((question) => ({
        question: question.Question,
        options: [
          { text: question["Option A"] },
          { text: question["Option B"] },
          { text: question["Option C"] },
          { text: question["Option D"] },
        ],
        answer: question.Answer,
      }));
      
      
      callback(formattedData);
    }
    else{
      
      callback(jsonData)
    }
    };
  
    // Make sure to handle any errors during file reading
    reader.onerror = (e) => {
      console.error("Error reading the file:", e);
    };
  
    // Start reading the file
    reader.readAsArrayBuffer(file);
  };
  
  

  const handleSubmit = async(e) => {
    e.preventDefault();
    dispatch({
      type:"createQuiz_Request"
    })

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, 
      };

      const { data } =  await axios
        .post("http://localhost:4000/api/v1/product/new", create, config)
      
        dispatch({
          type:"createQuiz_Success",
         
      })

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
  }, [error,dispatch])
  

  return (
    <>
    {isLoading ? <Loader /> : 
    <>
    <div className="quizCreate-wrapper">
      <div className="quizCreate-box">
        <div class="quizCreate-header">
          <span>Create Quiz</span>
        </div>
        <form id="quizForm" onSubmit={handleSubmit}>
          <div className="input_box">
            <input
              type="text"
              id="title"
              class="input-field"
              name="title"
              onChange={createChange}
              required
            />
            <label htmlFor="title" class="label">
              Title:
            </label>
          </div>
          <div className="input_box">
            <input
              type="number"
              id="totalQuestions"
              name="totalQuestions"
              class="input-field"
              onChange={createChange}
              required
            />
            <label for="totalQuestions" class="label">
              Total Questions:
            </label>
          </div>
          <div className="input_box">
            <input
              type="number"
              id="quizExpireTime"
              name="quizExpireTime"
              class="input-field"
              onChange={createChange}
              required
            />
            <label for="quizExpireTime" class="label">
              Quiz Expire Time (minutes):
            </label>
          </div>
          <div className="input_box">
            <input
              type="file"
              id="fileInput"
              name="fileInput"
              class="input-field"
              onChange={handleuploadQuestions}
              accept=".xlsx, .xls, .csv"
            />
            <label htmlFor="fileInput" class="label">
              Upload Questions:
            </label>
          </div>
          <div className="input_box">
            <input
              type="file"
              id="fileInput"
              name="fileInput"
              class="input-field"
              onChange={handleEnrolledStudents}
              accept=".xlsx, .xls, .csv"
            />
            <label htmlFor="fileInput" class="label">
            Enrolled Students:
            </label>
          </div>
          
          <div class="input_box">
            <input type="submit" class="input-submit" value="Create" />
          </div>
        </form>
      </div>
    </div>
    </>
    }
    </>
  );
};

export default CreateQuiz;
