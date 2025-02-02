import React, { useState, useEffect } from "react";
import "./App.css";

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);


  const fetchQuestions = () => {
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
      .then((response) => response.json())
      .then((data) => {
        const formattedQuestions = data.results.map((q) => ({
          question: q.question,
          correctAnswer: q.correct_answer,
          options: [...q.incorrect_answers, q.correct_answer].sort(
            () => Math.random() - 0.5
          ),
        }));
        setQuestions(formattedQuestions);
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setQuizCompleted(false);
        setQuizStarted(true);
      });
  };

  const handleAnswerClick = (answer) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    fetchQuestions();
  };

  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <h1>Welcome to the Quiz</h1>
        <button className="btn start-btn" onClick={fetchQuestions}>
          Start Quiz
        </button>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="quiz-container">
        <h2>Quiz Completed!</h2>
        <p className="score-display">Your Score: {score} / {questions.length}</p>
        <button className="btn try-again-btn" onClick={restartQuiz}>
          Try Again
        </button>
      </div>
    );
  }

  


  return (
    <div className="quiz-container">
      <h1> Questions</h1>
      <h2 dangerouslySetInnerHTML={{ __html: questions[currentQuestion].question }} />
      <div className="options-container">
        {questions[currentQuestion].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(option)}
            className={`option-btn ${
              selectedAnswer === null
                ? ""
                : option === questions[currentQuestion].correctAnswer
                ? "correct"
                : option === selectedAnswer
                ? "wrong"
                : ""
            }`}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>
      {selectedAnswer && (
        <button className="btn next-btn" onClick={handleNextQuestion}>
          Next
        </button>
      )}
    </div>
     
  );
};

export default QuizApp;

