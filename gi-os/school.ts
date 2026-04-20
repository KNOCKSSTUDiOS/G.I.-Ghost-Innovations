// G.I. SCHOOL ENGINE
// Lessons, modules, progress tracking

export interface GiLesson {
  id: string;
  title: string;
  content: string;
}

export interface GiCourse {
  id: string;
  name: string;
  lessons: GiLesson[];
}

const courses: GiCourse[] = [];

export function createCourse(name: string) {
  const c: GiCourse = {
    id: "course-" + Math.random().toString(36).substring(2, 10),
    name,
    lessons: []
  };
  courses.push(c);
  return c;
}

export function addLesson(course_id: string, title: string, content: string) {
  const c = courses.find(c => c.id === course_id);
  if (!c) return null;

  const lesson: GiLesson = {
    id: "lesson-" + Math.random().toString(36).substring(2, 10),
    title,
    content
  };

  c.lessons.push(lesson);
  return lesson;
}

export function listCourses() {
  return courses;
}
