import React, { useEffect, useState } from "react";
import "./User.css";
import Loader from "../Loader/Loader";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const Account = () => {
  const [userDetail, setUserDetails] = useState({});
  const [edit, setEdit] = useState(false);
  const [quizScore, setQuizScore] = useState([])
  const [updateDetails, setUpdateDetails] = useState({
    name: "",
    email: "",
    role: "",
    rollnumber: "",
  });

  const navigate = useNavigate();

  const QuizScore = async() =>{
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/QuizScore", {
        withCredentials: true,
      });
      // setUserDetails(data.userDetails);
      setQuizScore(data.quizzesWithScore)
      console.log("Quiz => ", quizScore); // Output the user details from the response
    } catch (error) {
      console.error(error);
    }
  }

  const userDetails = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/me", {
        withCredentials: true,
      });
      
      setUserDetails(data.userDetails);
      setUpdateDetails({
        name: data.userDetails.user.name,
        email: data.userDetails.user.email,
        role: data.userDetails.user.role,
        rollnumber: data.userDetails.user.rollnumber,
      });
      if(data.userDetails.user.role === "student"){
        await QuizScore();
      }
      console.log(data.userDetails); // Output the user details from the response
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    userDetails();
  }, []);

  const handleEditClick = () => {
    if (edit) {
      // If in edit mode, reset updateDetails to original userDetail
    }
    setEdit(!edit); // Toggles the edit state
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("name = > ", name);

    setUpdateDetails((prevUpdateDetails) => ({
      ...prevUpdateDetails,
      [name]: value, // Update the corresponding field in updateDetails
    }));
   
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (userDetail && userDetail.user) {
      const updatedData = Object.keys(updateDetails)
        .filter((key) => updateDetails[key].trim() !== userDetail.user[key])
        .reduce((acc, key) => {
          acc[key] = updateDetails[key];
          return acc;
        }, {});
      console.log("Updated Data:", updatedData);
      try {
        const config = {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        };

        const { data } = await axios.put(
          `http://localhost:4000/api/v1/updateUser`,
          updatedData,
          config
        );
        console.log("data", data);
        // dispatch({
        //   type:"Quiz_Success",
        //   payload:data.quiz
        // })
      } catch (error) {
        console.log(error.response.data.message);

        // dispatch({
        //   type:"createQuiz_Fail",
        //   payload:error.response.data.message
        // })
      }
    } else {
      console.error("User details are not available.");
    }
  };

  const handleDelete = async (quizId) => {
    console.log(quizId);
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/product/${quizId}`,
        config
      );
      console.log("data", data);
      navigate("/account");
      userDetails();
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const QuizDetail = async (quizId) => {
    navigate(`/edit/${quizId}`);
  };

  return (
    <>
      {userDetail.user ? (
        <div className="accountBody">
          <div class="profile-container">
            <h1>Profile Details</h1>
            {/* <div onClick={handleEditClick}> */}
            {/* <ion-icon name="create-outline"  className="edit"></ion-icon> */}
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
              {/* </div> */}
              <div class="profile-info">
                <div className="NE">
                  <div class="info">
                    <label htmlFor="name">Name : </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={edit ? updateDetails.name : userDetail.user.name}
                      disabled={!edit ? true : false}
                      onChange={handleChange}
                    />
                  </div>
                  <div class="info">
                    <label htmlFor="name">Email : </label>
                    <input
                      type="text"
                      id="name"
                      value={edit ? updateDetails.email : userDetail.user.email}
                      disabled={!edit ? true : false}
                      name="email"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="NE">
                  <div class="info">
                    <label htmlFor="name">Role : </label>
                    <select
                      id="role"
                      value={edit ? updateDetails.role : userDetail.user.role}
                      name="role"
                      onChange={handleChange}
                      disabled={!edit}
                    >
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                    </select>
                  </div>
                  {userDetail.user.role === "teacher" ? (
                    <div class="info">
                      <label htmlFor="name">Quizzes : </label>
                      <input
                        type="text"
                        id="name"
                        value={userDetail.quizzes.length}
                        disabled
                      />
                    </div>
                  ) : (
                    <div class="info">
                      <label htmlFor="rollNumber">Roll No : </label>
                      <input
                        type="text"
                        id="rollNumber"
                        value={
                          edit
                            ? updateDetails.rollnumber
                            : userDetail.user.rollnumber
                        }
                        disabled={!edit ? true : false}
                        name="rollnumber"
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>

                {userDetail.user.role === "teacher" ? (
                  <div className="QuizDetailContainer">
                    {userDetail.quizzes.map((i) => (
                      <div className="QuizDetail">
                        <div>
                          <h3>Title : {i.title}</h3>
                          <p>Questions : {i.totalQuestions}</p>
                        </div>
                        <span className="icon">
                          <span className="iconEdit">
                            <ion-icon
                              name="create-outline"
                              className="edit"
                            ></ion-icon>
                          </span>
                          <span
                            className="iconDelete"
                            onClick={() => handleDelete(i._id)}
                          >
                            <ion-icon name="trash-outline"></ion-icon>
                          </span>
                          <button
                            type="button"
                            className="Details"
                            onClick={() => QuizDetail(i._id)}
                          >
                            Details
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="QuizDetailContainer">
                    {quizScore && quizScore.map((quiz,index)=>(
                      <div key={index} className="QuizDetail">
                      <h3>{quiz.title}</h3>
                      <p>Score :   {quiz.score}</p>
                      {/* Add other quiz details you want to display */}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
       " <Loader />"
      )}
    </>
  );
};

export default Account;
