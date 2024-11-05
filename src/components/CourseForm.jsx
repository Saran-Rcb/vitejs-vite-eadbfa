import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCourseStore from '../store/courseStore';
import toast from 'react-hot-toast';

const LEVELS = ['beginner', 'intermediate', 'advanced'];

export default function CourseForm() {
  const [courseName, setCourseName] = useState('');
  const [level, setLevel] = useState('beginner');
  const addCourse = useCourseStore((state) => state.addCourse);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!courseName.trim()) {
      toast.error('Please enter a course name');
      return;
    }
    addCourse({ name: courseName, level });
    toast.success('Course added successfully');
    setCourseName('');
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Course Name</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter course name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add Course
        </button>
      </form>
    </div>
  );
}