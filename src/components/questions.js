import '../index.css'
/*
import React, { useState, useEffect } from 'react';

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questions'); // API endpoint to get questions
        const data = await response.json();
        setQuestions(data.questions);
        // Initialize answers state
        const initialAnswers = {};
        data.questions.forEach(question => {
          initialAnswers[question.id] = '';
        });
        setUserAnswers(initialAnswers);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId, choice) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: choice
    });
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach(question => {
      if (question.answer === userAnswers[question.id]) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setShowResults(true);
  };

  return (
    <div className="container mx-auto px-4 py-4 overflow-auto h-screen">
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}>
        {questions.map((question, index) => (
          <div key={question.id} className="mb-8">
            <h2 className="text-xl font-bold">{question.text}</h2>
            <ul className="list-none">
              {question.choices.map((choice) => (
                <li key={choice} className="my-2">
                  <label className="block">
                    <input
                      type="radio"
                      name={`question_${question.id}`}
                      value={choice}
                      onChange={() => handleAnswerChange(question.id, choice)}
                      checked={userAnswers[question.id] === choice}
                      disabled={showResults}
                      className="mr-2"
                    />
                    {choice}
                    {showResults && choice === question.answer && (
                      <span className="text-green-500"> (Correct)</span>
                    )}
                    {showResults && userAnswers[question.id] === choice && choice !== question.answer && (
                      <span className="text-red-500"> (Your Choice)</span>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!showResults && (
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
          >
            Submit Answers
          </button>
        )}
        {showResults && (
          <div className="mt-4 text-lg">
            You scored {score} out of {questions.length}
          </div>
        )}
      </form>
    </div>
  );
};

export default QuestionsPage;
*/

import React, { useState } from 'react';

const QuestionsPage = () => {
  const [questions] = useState([
    {
      "id": 1,
      "text": "What is the capital of France?",
      "choices": ["Paris", "London", "Berlin", "Madrid"],
      "answer": "Paris"
    },
    {
      "id": 2,
      "text": "Which gas is most prevalent in the Earth's atmosphere?",
      "choices": ["Oxygen", "Hydrogen", "Carbon Dioxide", "Nitrogen"],
      "answer": "Nitrogen"
    },
    {
      "id": 3,
      "text": "What year did the Titanic sink in the Atlantic Ocean on April 15, during its maiden voyage from Southampton?",
      "choices": ["1912", "1905", "1898", "1923"],
      "answer": "1912"
    },
    {
      "id": 4,
      "text": "Who wrote the play 'Hamlet'?",
      "choices": ["Charles Dickens", "William Shakespeare", "Jane Austen", "Leo Tolstoy"],
      "answer": "William Shakespeare"
    },
    {
      "id": 5,
      "text": "What is the chemical symbol for gold?",
      "choices": ["Au", "Ag", "Pb", "Fe"],
      "answer": "Au"
    }
  ]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [allAnswered, setAllAnswered] = useState(false);

  const handleAnswerChange = (questionId, choice) => {
    const updatedAnswers = {
      ...userAnswers,
      [questionId]: choice
    };
    setUserAnswers(updatedAnswers);
    checkAllAnswered(updatedAnswers);
  };

  const checkAllAnswered = (answers) => {
    const isAllAnswered = questions.every(question => answers[question.id]);
    setAllAnswered(isAllAnswered);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!allAnswered) {
      alert('Please answer all questions before submitting.');
      return;
    }
    let newScore = 0;
    questions.forEach(question => {
      if (question.answer === userAnswers[question.id]) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setShowResults(true);
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 py-4">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
        {questions.map((question) => (
          <div key={question.id} className="bg-white shadow-lg rounded-lg p-6 mb-4">
            <h2 className="text-xl font-bold text-center mb-4">{question.text}</h2>
            <ul className="list-none">
              {question.choices.map((choice) => (
                <li key={choice} className="my-2">
                  <label className="block text-center">
                    <input
                      type="radio"
                      name={`question_${question.id}`}
                      value={choice}
                      onChange={() => handleAnswerChange(question.id, choice)}
                      disabled={showResults}
                      className="mr-2 align-middle"
                    />
                    <span className={showResults && choice === question.answer ? "text-green-600 font-semibold" : "text-gray-900"}>
                      {choice}
                    </span>
                    {showResults && userAnswers[question.id] === choice && choice !== question.answer && (
                      <span className="ml-2 text-red-600 font-semibold">(Your Choice)</span>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {!showResults && (
          <div className="text-center">
            <button
              type="submit"
              className={`px-6 py-2 text-white rounded-lg ${allAnswered ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
              disabled={!allAnswered}
            >
              Submit Answers
            </button>
          </div>
        )}
        {showResults && (
          <div className="text-lg font-semibold text-center">
            Score: {score} out of {questions.length}
          </div>
        )}
      </form>
    </div>
  );
};

export default QuestionsPage;
