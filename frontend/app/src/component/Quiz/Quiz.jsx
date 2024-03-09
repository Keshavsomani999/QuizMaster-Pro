import React, { useState } from "react";
import { useSelector } from "react-redux";

const Quiz = () => {
  const { quiz } = useSelector((state) => state.quiz);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(quiz.questions.length).fill(null)
  );

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

  return (
    <div className="RealQuiz">
      <div className="header">
        <h2>{quiz.title}</h2>
        <p>Total Questions : {quiz.totalQuestions}</p>
        <div className="list">
          {quiz.questions.map((_, i) => (
            <button key={i} onClick={() => setCurrentQuestionIndex(i)}>
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
                  checked={selectedAnswers[currentQuestionIndex] === i.text}
                  onChange={handleOptionChange}
                />
                <label htmlFor={i.text}>{i.text}</label>
                <br />
              </div>
            ))}
          </div>
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
          <button className="submit">Submit</button>
        )}
      </div>
      <div className="time">Time:10:00:00</div>
    </div>
  );
};

export default Quiz;
