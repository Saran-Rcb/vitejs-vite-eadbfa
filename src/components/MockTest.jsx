import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

export default function MockTest({ questions, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const calculateScore = () => {
    const correctAnswers = questions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.correctAnswer ? 1 : 0);
    }, 0);
    return (correctAnswers / questions.length) * 100;
  };

  const handleSubmit = () => {
    const unansweredCount = questions.length - Object.keys(answers).length;
    
    if (unansweredCount > 0) {
      toast((t) => (
        <div className="text-center">
          <p className="font-semibold">You have {unansweredCount} unanswered questions.</p>
          <div className="mt-2 flex justify-center gap-2">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              onClick={() => {
                toast.dismiss(t.id);
                submitTest();
              }}
            >
              Submit Anyway
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              onClick={() => toast.dismiss(t.id)}
            >
              Continue Test
            </button>
          </div>
        </div>
      ), { duration: 5000 });
      return;
    }

    submitTest();
  };

  const submitTest = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);

    if (finalScore >= 60) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      onComplete(finalScore);
    }
  };

  const retakeTest = () => {
    setAnswers({});
    setShowResults(false);
    setTimeLeft(5 * 60);
    setScore(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Test Results</h2>
          <div className="relative pt-1">
            <div className="overflow-hidden h-6 mb-4 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${score}%` }}
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                  score >= 60 ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></div>
            </div>
          </div>
          <p className="text-4xl font-bold mb-4">
            Score: {score.toFixed(1)}%
          </p>
          {score >= 60 ? (
            <div className="space-y-4">
              <p className="text-green-600 text-xl font-semibold">
                Congratulations! You passed! 🎉
              </p>
              <button
                onClick={() => navigate(-1)}
                className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                Continue to Next Topic
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-red-600 text-xl font-semibold">
                You need to score at least 60% to pass. Try again!
              </p>
              <button
                onClick={retakeTest}
                className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retake Test
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Mock Test</h2>
          <div className={`text-xl font-semibold ${
            timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-gray-600'
          }`}>
            Time Left: {formatTime(timeLeft)}
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <p className="text-lg font-medium mb-6">
              <span className="text-blue-600 font-bold">Question {idx + 1}:</span> {q.question}
            </p>
            <div className="grid gap-3">
              {q.options.map((option, optIdx) => (
                <label
                  key={optIdx}
                  className={`flex items-center p-4 rounded-lg cursor-pointer transition-all ${
                    answers[idx] === optIdx
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${idx}`}
                    value={optIdx}
                    checked={answers[idx] === optIdx}
                    onChange={() => setAnswers({ ...answers, [idx]: optIdx })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-6 mt-8 flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-3 px-8 rounded-full hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
}