import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useLocation  } from "react-router-dom";
import { useAlert } from "react-alert";
import Loader from "../Loader/Loader";

const Quiz = () => {
  const alert = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, isLoading, quiz, isQuiz } = useSelector((state) => state.quiz);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(quiz.questions ? quiz.questions.length : 0).fill(null)
  );
  const [timeRemaining, setTimeRemaining] = useState(quiz && quiz.quizExpireTime * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => Math.max(0, prevTime - 1));
    }, 1000);

    return () => {
      clearInterval(timer);

      if (timeRemaining === 1) {
        // Call your function here when the time reaches 0
        submitHandler();
      }
    };
  }, [timeRemaining]);

  const submitHandler = async (e) => {
    
    if (e) {
      e.preventDefault();
    }
    var score = 0;
    var unAttempt = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      console.log(quiz.questions[i].answer);
      if (quiz.questions[i].answer === selectedAnswers[i]) {
        score += 1;
      } else if (selectedAnswers[i] === null) {
        unAttempt += 1;
      }
    }

    dispatch({
      type: "createQuiz_Request",
    });

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true, // Add this line
      };
      console.log("quizid", quiz._id);
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/quiz/submit/${quiz._id}`,
        { score },
        config
      );
      dispatch({
        type: "Quiz_End",
      });
      navigate("/home");
    } catch (error) {
      console.log(error.response.data.message);
      dispatch({
        type: "createQuiz_Fail",
        payload: error.response.data.message,
      });
    }
    console.log("score -> ", score);
    console.log("unAttempt -> ", unAttempt);
    console.log(selectedAnswers);
  };

  const handlePreviousClick = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  const handleNextClick = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleOptionChange = (event) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = event.target.value;

    setSelectedAnswers(updatedAnswers);
    console.log(updatedAnswers);
  };

  const clearAnswere = (i) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[i] = null;
    setSelectedAnswers(updatedAnswers);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({
        type: "Clear_Errors",
      });
    }
  }, [error]);


  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {isQuiz ? <>
            <div className="RealQuiz">
            <div className="header">
              <h2>{quiz.title}</h2>
              <p>Total Questions : {quiz.totalQuestions}</p>
              <div className="list">
                {quiz.questions.map((_, i) => (
                  <button
                    className={selectedAnswers[i] !== null ? "red" : "white"}
                    key={i}
                    onClick={() => setCurrentQuestionIndex(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="QAB">
              <div className="QA">
                <p className="Question">
                  {currentQuestionIndex + 1}.{" "}
                  {quiz.questions[currentQuestionIndex].question}
                </p>
                <div className="answere">
                  {quiz.questions[currentQuestionIndex].options.map((i) => (
                    <div key={i.text}>
                      <input
                        type="radio"
                        id={i.text}
                        name="fav_language"
                        value={i.text}
                        checked={
                          selectedAnswers[currentQuestionIndex] === i.text
                        }
                        onChange={handleOptionChange}
                      />
                      <label htmlFor={i.text}>{i.text}</label>
                      <br />
                    </div>
                  ))}
                </div>
                <button onClick={() => clearAnswere(currentQuestionIndex)}>
                  Clear
                </button>
              </div>
              <button
                className={
                  currentQuestionIndex === 0 ? "previous disable" : "previous"
                }
                onClick={handlePreviousClick}
              >
                Previous
              </button>
              {currentQuestionIndex !== quiz.questions.length - 1 ? (
                <>
                  <button className="next" onClick={handleNextClick}>
                    Next
                  </button>
                </>
              ) : (
                <button className="submit" onClick={(e) => submitHandler(e)}>
                  Submit
                </button>
              )}
            </div>
            <div className="time">{formatTime(timeRemaining)}</div>
          </div>
          </>:""}
        </>
      )}
    </>
  );
};

export default Quiz;
