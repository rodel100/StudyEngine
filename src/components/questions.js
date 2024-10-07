import React, { useState, useEffect } from 'react';

const QuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [allAnswered, setAllAnswered] = useState(false);
  const [loading, setLoading] = useState(true); // New state for loading

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true); // Set loading to true when fetching starts
        const response = await fetch('http://localhost:3000/questions');
        const data = await response.json();
        console.log(data.questions);
        setQuestions(data.questions);
        setLoading(false); // Set loading to false when fetching is complete
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false); // Set loading to false if there's an error
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId, choice) => {
    const updatedAnswers = {
      ...userAnswers,
      [questionId]: choice,
    };
    setUserAnswers(updatedAnswers);
    checkAllAnswered(updatedAnswers);
  };

  const checkAllAnswered = (answers) => {
    const isAllAnswered = questions.every((question) => answers[question.id]);
    setAllAnswered(isAllAnswered);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!allAnswered) {
      alert('Please answer all questions before submitting.');
      return;
    }
    let newScore = 0;
    questions.forEach((question) => {
      if (question.answer === userAnswers[question.id]) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setShowResults(true);
  };

  if (loading) {
    return <div className="text-center text-lg py-4">Please wait, questions are being generated...</div>;
  }

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
