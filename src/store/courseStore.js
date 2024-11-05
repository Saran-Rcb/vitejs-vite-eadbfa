import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCourseStore = create(
  persist(
    (set) => ({
      courses: [],
      addCourse: (course) =>
        set((state) => ({
          courses: [...state.courses, { ...course, id: Date.now(), topics: [], progress: 0 }],
        })),
      updateTopics: (courseId, topics) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId ? { ...course, topics } : course
          ),
        })),
      updateProgress: (courseId, topicId, score) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.id === courseId
              ? {
                  ...course,
                  topics: course.topics.map((topic) =>
                    topic.id === topicId ? { ...topic, completed: true, score } : topic
                  ),
                }
              : course
          ),
        })),
    }),
    {
      name: 'course-storage',
    }
  )
);

export default useCourseStore;