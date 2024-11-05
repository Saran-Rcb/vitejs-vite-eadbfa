import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CourseList from './components/CourseList';
import CourseForm from './components/CourseForm';
import CoursePage from './pages/CoursePage';
import MockTestPage from './pages/MockTestPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-indigo-600 text-white p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Learning Platform</h1>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<CourseList />} />
          <Route path="/add-course" element={<CourseForm />} />
          <Route path="/course/:id" element={<CoursePage />} />
          <Route path="/course/:courseId/topic/:topicId/test" element={<MockTestPage />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;