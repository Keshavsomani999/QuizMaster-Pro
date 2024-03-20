import React, { useEffect, useState } from "react";
import "./TeacherList.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(-1);
  const navigate = useNavigate();

  const loadTeachers = async () => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };

      const { data } = await axios.get(
        "http://localhost:4000/api/v1/getTeachers",
        config
      );
      setTeachers(data.teachers);
      console.log(teachers);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? -1 : index);
  };

  const TakeQuizHandler = (quizId) => {
    navigate("/startQuiz", { state: { quizId: quizId } });
  };

  return (
    <div className="Teacher">
     {teachers.length > 0 ? <>
     
      {teachers.map((teacher, index) => (
        <div key={index}>
          <div className="TeacherTab" onClick={() => toggleDropdown(index)}>
            <div>
              <h3>{teacher.name}</h3>
              <p>{teacher.email}</p>
            </div>
            <div className="circleTip">
              <span>{teacher.quizzes.length}</span>
            </div>
            <i
              className={
                openDropdownIndex === index
                  ? "bx bx-chevron-up"
                  : "bx bx-chevron-down"
              }
            ></i>
          </div>
          {openDropdownIndex === index && (
            <div className="droper">
              {teacher.quizzes.map((i) => (
                <div className="quizTab">
                  <div>
                    <h4>Name: {i.title}</h4>
                    <p>Questions: {i.totalQuestions}</p>
                  </div>

                  <button onClick={() => TakeQuizHandler(i._id)}>
                    Take Quiz
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
     </>:<>
     <div className="NoQuizAvailable">
      No Quiz Available !
     </div>
     </>}
    </div>
  );
};

export default TeacherList;
