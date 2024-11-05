import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useCourseStore from '../store/courseStore';
import { generateTopics } from '../services/gemini';
import toast from 'react-hot-toast';

export default function CoursePage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { courses, updateTopics } = useCourseStore();
  const course = courses.find((c) => c.id === parseInt(id));

  useEffect(() => {
    const fetchTopics = async () => {
      if (course && !course.topics.length) {
        setLoading(true);
        setError(null);
        try {
          const topics = await generateTopics(course.name, course.level);
          updateTopics(course.id, topics.map((t, i) => ({ ...t, id: i, completed: false })));
        } catch (error) {
          setError(error.message);
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTopics();
  }, [course]);

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">Course not found</p>
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{course.name}</h2>
        <p className="text-gray-600">
          Level: {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Generating topics...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {course.topics.map((topic, index) => (
            <div
              key={topic.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {index + 1}. {topic.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{topic.description}</p>
                </div>
                {topic.completed ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Completed ({topic.score}%)
                  </span>
                ) : (
                  <Link
                    to={`/course/${course.id}/topic/${topic.id}/test`}
                    className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-200"
                  >
                    Take Test
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}