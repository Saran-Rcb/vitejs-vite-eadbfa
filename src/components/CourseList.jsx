import { Link } from 'react-router-dom';
import useCourseStore from '../store/courseStore';

export default function CourseList() {
  const courses = useCourseStore((state) => state.courses);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Courses</h2>
        <Link
          to="/add-course"
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Add Course
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.name}</h3>
              <p className="text-gray-600 mb-4">
                Level: {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
              </p>
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">{course.progress}% Complete</span>
              </div>
              <Link
                to={`/course/${course.id}`}
                className="block text-center bg-indigo-100 text-indigo-700 py-2 rounded-md hover:bg-indigo-200"
              >
                View Course
              </Link>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 text-lg">No courses added yet. Start by adding a course!</p>
          </div>
        )}
      </div>
    </div>
  );
}