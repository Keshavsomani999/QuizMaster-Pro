import React, { useEffect, useState } from "react";
import "./Quiz.css";
import * as XLSX from "xlsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import { useAlert } from "react-alert";

const CreateQuiz = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { error, isLoading } = useSelector((state) => state.quiz);

  const [create, setCreate] = useState({
    title: "",
    totalQuestions: "",
    quizExpireTime: "",
    questions: null,
    enrolledStudents: null,
  });

  const [questionFile, setQuestionFile] = useState(null);
  const [studentsFile, setStudentsFile] = useState(null);

  const createChange = (e) => {
    setCreate({ ...create, [e.target.name]: e.target.value });
  };

  const handleuploadQuestions = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQuestionFile(file); // Set the selected file
      const isQuestion = true;
      convertExcelToJson(file, isQuestion, (jsonData) => {
        setCreate({ ...create, questions: jsonData });
      });
    }
  };
  
  const handleEnrolledStudents = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStudentsFile(file); // Set the selected file
      const isQuestion = false;
      convertExcelToJson(file, isQuestion, (jsonData) => {
        setCreate({ ...create, enrolledStudents: jsonData });
      });
    }
  };
  

  const convertExcelToJson = (file, isQuestion, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      if (isQuestion === true) {
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
      } else {
        callback(jsonData);
      }
    };
  
    reader.onerror = (e) => {
      console.error("Error reading the file:", e);
    };
  
    reader.readAsArrayBuffer(file);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({
      type: "createQuiz_Request",
    });

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const { data } = await axios.post(
        "http://localhost:4000/api/v1/product/new",
        create,
        config
      );

      setQuestionFile(null)
      setStudentsFile(null)
      dispatch({
        type: "createQuiz_Success",
      });
    } catch (error) {
      console.log(error.response.data.message);
      dispatch({
        type: "createQuiz_Fail",
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
  }, [error, dispatch]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
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

                <div className="uploadContainer">
                  {" "}
                  
                  <input
                    type="file"
                    id="fileInputQuestions"
                    name="fileInputQuestions"
                    onChange={handleuploadQuestions}
                    accept=".xlsx, .xls, .csv"
                    hidden
                  />
                  <label htmlFor="fileInputQuestions" class="Uploadlabel">
                    <p>Upload Question</p>
                    <span className="uploadFileIcon"> <ion-icon name="folder-open-outline"></ion-icon></span>
                   
                    <span>
                    {" "}
                    {questionFile ? questionFile.name : "No file selected"}
                  </span>
                  </label>
                  
                </div>

                <div className="uploadContainer">
                  {" "}
                  
                  <input
                    type="file"
                    id="fileInputStudents"
                    name="fileInputStudents"
                    onChange={handleEnrolledStudents}
                    accept=".xlsx, .xls, .csv"
                    hidden
                  />
                  <label htmlFor="fileInputStudents" class="Uploadlabel">
                    <p> Enrolled Students:</p>
                    <span className="uploadFileIcon"> <ion-icon name="folder-open-outline"></ion-icon></span>
                   
                    <span>
                    {" "}
                    {studentsFile ? studentsFile.name : "No file selected"}
                  </span>
                  </label>
                  
                </div>

                {/* <div className="input_box">
                  <input
                    type="file"
                    id="fileInputStudents"
                    name="fileInputStudents"
                    class="input-field"
                    onChange={handleEnrolledStudents}
                    accept=".xlsx, .xls, .csv"
                  />
                  <label htmlFor="fileInputStudents" class="label">
                    Enrolled Students:{" "}
                    {studentsFile ? studentsFile.name : "No file selected"}
                  </label>
                </div> */}


                <div class="input_box">
                  <input type="submit" class="input-submit" value="Create" />
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CreateQuiz;
