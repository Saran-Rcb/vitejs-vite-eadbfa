import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useCourseStore from '../store/courseStore';
import { generateQuestions } from '../services/gemini';
import MockTest from '../components/MockTest';
import toast from 'react-hot-toast';

export default function MockTestPage() {
  const { courseId, topicId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { courses, updateProgress } = useCourseStore();

  const course = courses.find((c) => c.id === parseInt(courseId));
  const topic = course?.topics.find((t) => t.id === parseInt(topicId));

  useEffect(() => {
    const fetchQuestions = async () => {
      if (topic) {
        setLoading(true);
        setError(null);
        try {
          const questions = await generateQuestions(topic.title);
          setQuestions(questions);
        } catch (error) {
          setError(error.message);
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuestions();
  }, [topic]);

  const handleTestComplete = (score) => {
    updateProgress(parseInt(courseId), parseInt(topicId), score);
    toast.success(`Test completed! Score: ${score}%`);
    navigate(`/course/${courseId}`);
  };

  if (!topic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Topic not found</p>
          <Link
            to={`/course/${courseId}`}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Return to Course
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Preparing your test...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 mr-4"
          >
            Try Again
          </button>
          <Link
            to={`/course/${courseId}`}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Return to Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {topic.title} - Mock Test
        </h2>
        <MockTest questions={questions} onComplete={handleTestComplete} />
      </div>
    </div>
  );
}