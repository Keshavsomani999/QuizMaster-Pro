import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Loader/Loader";

const EditQuiz = () => {
  const { quizId } = useParams();

  const [quizDetail, setQuizDetails] = useState(null);
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [addEnrollStudent, setAddEnrollStudent] = useState(false);
  const [enrollStudent, setEnrollStudent] = useState([]);
  const [updateDetails,setUpdateDetails] = useState({
    title:"",
    quizExpireTime:"",
      })

  const quizDetails = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:4000/api/v1/product/${quizId}`,
        {
          withCredentials: true,
        }
      );
      setQuizDetails(data.quiz);
      setUpdateDetails({
        title: data.quiz.title,
        quizExpireTime: data.quiz.quizExpireTime,
      });
      console.log(data); // Output the user details from the response
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    quizDetails();
  }, []);

  const handleModal = () => {
    setOpen(!open);
  };

  const handleEditClick = () => {
    if (edit) {
      // If in edit mode, reset updateDetails to original userDetail
    }
    setEdit(!edit); // Toggles the edit state
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("name = > ", name);
    setUpdateDetails(prevUpdateDetails => ({
      ...prevUpdateDetails,
      [name]: value // Update the corresponding field in updateDetails
    }));
  };

  const HandleAddEnrollStudent = () => {
    setAddEnrollStudent(!addEnrollStudent);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (quizDetail) {
      const updatedData = Object.keys(updateDetails)
        .filter((key) => {
          const value = updateDetails[key];
          // Check if value is a string and then trim it
          return typeof value === 'string' ? value.trim() !== quizDetail[key] : value !== quizDetail[key];
        })
        .reduce((acc, key) => {
          acc[key] = updateDetails[key];
          return acc;
        }, {});

        if (enrollStudent.length > 0) {
          updatedData.enrolledStudents = enrollStudent.map((rollNumber) => ({
            rollNumber,
          }));
        }
    
      // console.log("Updated Data:", updatedData);


      try {
        const config = {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        };
        const { data } = await axios.put(`http://localhost:4000/api/v1/product/${quizId}`, updatedData, config);
        console.log("data", data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    } else {
      console.error("Quiz details are not available.");
    }
  };

  const AddEnrollStudentForm = (e) => {
    e.preventDefault();
    const rollNumber = e.target.rollNumber.value;
    const enrolledStudents = quizDetail.enrolledStudents;

    // Check if rollNumber is already present
    const isRollNumberPresent = enrolledStudents.some(
      (student) => student.rollNumber === rollNumber
    );

    if (isRollNumberPresent) {
      console.log("Roll number is already present");
    } else {
      console.log("Roll number is not present. Adding it now.");
      // Update enrollStudent state
      setEnrollStudent((prevState) => [...prevState, rollNumber]); // Append the new roll number to the array
      // Empty the rollNumber field
      e.target.rollNumber.value = "";
    }
    console.log(enrollStudent);
  };

  return (
    <>
      {quizDetail ? (
        <>
          <div className="EditQuizBody">
            <div class="EditQuiz-container">
              <h1>Update Quiz</h1>

              <form onSubmit={handleUpdate}>
                {edit ? (
                  <span className="editicon">
                    <i className="bx bx-x" onClick={handleEditClick}></i>
                    <i className="bx bxs-save" onClick={handleUpdate}></i>
                  </span>
                ) : (
                  <span>
                    <i className="bx bx-edit" onClick={handleEditClick}></i>
                  </span>
                )}

                <div class="profile-info">
                  <div className="NE">
                    <div class="info">
                      <label htmlFor="name">Name : </label>
                      <input
                        type="text"
                        id="name"
                        name="title"
                        value={edit ? updateDetails.title : quizDetail.title}
                        
                        disabled={!edit ? true : false}
                        onChange={handleChange}
                      />
                    </div>
                    <div class="info">
                      <label htmlFor="name">Expire Time : </label>
                      <input
                        type="number"
                        id="name"
                        value={edit ? updateDetails.quizExpireTime : quizDetail.quizExpireTime}
                    
                        disabled={!edit ? true : false}
                        name="quizExpireTime"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="NE">
                    <div class="info">
                      <label htmlFor="name">Total Questions : </label>
                      <input
                        type="text"
                        id="name"
                        name="role"
                        value={quizDetail.totalQuestions}
                        disabled
                        onChange={handleChange}
                      />
                    </div>
                    <div class="info">
                      <label htmlFor="name">Created At : </label>
                      <input
                        type="text"
                        id="name"
                        name="role"
                        value={
                          new Date(quizDetail.createdAt)
                            .toISOString()
                            .split("T")[0]
                        }
                        disabled
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </form>
              <div className="QuestionDetailContainer">
                {quizDetail.questions.map((question, index) => (
                  <div key={index} className="QuestionDetail">
                    <h3>
                      Q {index + 1} : {question.question}
                    </h3>
                    <div className="options-container">
                      <div className="options-column">
                        {question.options
                          .slice(0, 2)
                          .map((option, optionIndex) => (
                            <div key={optionIndex} className="option">
                              {option.text === question.answer ? (
                                <i className="bx bx-radio-circle-marked correct"></i>
                              ) : (
                                <i className="bx bx-radio-circle"></i>
                              )}{" "}
                              <p>{option.text}</p>
                            </div>
                          ))}
                      </div>
                      <div className="options-column">
                        {question.options
                          .slice(2)
                          .map((option, optionIndex) => (
                            <div key={optionIndex} className="option">
                              {option.text === question.answer ? (
                                <i className="bx bx-radio-circle-marked correct"></i>
                              ) : (
                                <i className="bx bx-radio-circle"></i>
                              )}
                              <p>{option.text}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                    {/* <span className="icon"> */}
                    {/* <span className="iconEdit"><ion-icon name="create-outline" className="edit"></ion-icon></span> */}
                    {/* <span className="iconDelete" onClick={() => handleDelete(question._id)}><ion-icon name="trash-outline"></ion-icon></span> */}
                    {/* <button type="button" className="Details" onClick={() => QuizDetail(question._id)}>Details</button> */}
                    {/* </span> */}
                  </div>
                ))}
              </div>
              <div className="enrolledStudent">
                <h1 onClick={handleModal}>Enrolled Students List</h1>
              </div>

              {open && (
                <div className="Modal">
                  <div className="ModalContent">
                    <div className="ModalHeader">
                      <h2>Enrolled Students</h2>
                      <span className="cancel">
                        <i className="bx bx-x" onClick={handleModal}></i>
                      </span>
                    </div>
                    <div class="table-container">
                      <table id="myTable">
                        <thead>
                          <tr>
                            <th>Roll Number</th>
                            <th>Is Enrolled</th>
                            <th>Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {quizDetail.enrolledStudents.map((student, i) => (
                            <tr key={i}>
                              <td>{student.rollNumber}</td>
                              <td>{student.isEnrolled ? "True" : "False"}</td>
                              <td>{student.score || student.score === 0 ? student.score : "Not Attend"}</td>

                            </tr>
                          ))}
                          {enrollStudent.map((student, index) => (
                            <tr key={index}>
                              <td>{student}</td>
                              <td>False</td>
                              <td>Not Attend</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <form onSubmit={AddEnrollStudentForm}>
                      {addEnrollStudent && (
                        <div className="addEnrollStudentContainer">
                          <input
                            type="text"
                            name="rollNumber"
                            placeholder="Roll Number"
                          />
                          <input type="text" value="False" disabled />
                        </div>
                      )}

                      {!addEnrollStudent ? (
                        <>
                          <span
                            className="AddEnrollstudentIcon"
                            onClick={HandleAddEnrollStudent}
                          >
                            <i className="bx bx-plus-circle"></i>
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="AddEnrollstudentIcon">
                            <button type="submit" className="submitButton">
                              <i className="bx bx-plus-circle"></i>
                            </button>
                            <i
                              className="bx bx-x-circle"
                              onClick={HandleAddEnrollStudent}
                            ></i>
                          </span>
                        </>
                      )}
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default EditQuiz;
