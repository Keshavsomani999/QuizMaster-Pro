import React, { useEffect, useState } from "react";
import "./User.css";
import Loader from "../Loader/Loader";
import axios from "axios";

const Account = () => {
  const [userDetail, setUserDetails] = useState({});
  const [edit, setEdit] = useState(false);

  

  const userDetails = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/v1/me", {
        withCredentials: true,
      });
      setUserDetails(data.userDetails);
      console.log(userDetail);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    userDetails();
  }, []);

  const handleEditClick = () => {
    setEdit(!edit); // Toggles the edit state
  };

  return (
    <>
      {userDetail.user ? (
        <div className="accountBody">
          <div class="profile-container">
            <h1>Profile Details</h1>
            <button onClick={handleEditClick}>
              {edit ? "Cancel" : "Edit"}
            </button>
            <div class="profile-info">

              <div className="NE">
                <div class="info">
                  <label htmlFor="name">Name : </label>
                  <input
                    type="text"
                    id="name"
                    value={userDetail.user.name}
                    disabled={!edit ? true : false}
                  />
                </div>
                <div class="info">
                  <label htmlFor="name">Email : </label>
                  <input
                    type="text"
                    id="name"
                    value={userDetail.user.email}
                    disabled={!edit ? true : false}
                  />
                </div>
              </div>

              <div className="NE">
                <div class="info">
                  <label htmlFor="name">Role : </label>
                  <select
                    id="role"
                    value={userDetail.user.role}
                    // onChange={handleRoleChange}
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
                  ""
                )}
              </div>

               <div className="QuizDetailContainer">
                  {userDetail.quizzes.map(i=>( 
                  
                    <div className="QuizDetail">
                      <div>
                      <h3>Title : {i.title}</h3>
                      <p>Questions : {i.totalQuestions}</p>
                      </div>
                      <span className="icon">
                        <span className="iconEdit"><ion-icon name="create-outline" className="edit"></ion-icon></span>
                        <span className="iconDelete"><ion-icon name="trash-outline"></ion-icon></span>
                      
                      </span>
                  </div>
                  ))}
                </div>  
                

            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Account;
