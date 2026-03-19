import { create } from "zustand";

export interface Lecture {
  id: number;
  fname: string;
  lname: string;
  email: string;
  courses: number;
  status: "active" | "suspended";
}

interface LectureStore {
  lectures: Lecture[];
  addLecture: (fname: string, lname: string, email: string) => void;
  deleteLecture: (id: number) => void;
  toggleLectureStatus: (id: number) => void;
  updateLecture: (id: number, fname: string, lname: string, email: string) => void;
}

export const useLectureStore = create<LectureStore>((set) => ({
  lectures: [
    { id: 1, fname: "John", lname: "Doe", email: "john@example.com", courses: 3, status: "active" },
    { id: 2, fname: "Jane", lname: "Smith", email: "jane@example.com", courses: 5, status: "active" },
    { id: 3, fname: "Michael", lname: "Brown", email: "michael@example.com", courses: 2, status: "suspended" },
  ],
  addLecture: (fname, lname, email) =>
    set((state) => ({
      lectures: [...state.lectures, { id: Math.max(0, ...state.lectures.map((l) => l.id)) + 1, fname, lname, email, courses: 0, status: "active" }],
    })),
  deleteLecture: (id) => set((state) => ({ lectures: state.lectures.filter((l) => l.id !== id) })),
  toggleLectureStatus: (id) =>
    set((state) => ({
      lectures: state.lectures.map((l) => (l.id === id ? { ...l, status: l.status === "active" ? "suspended" : "active" } : l)),
    })),
  updateLecture: (id, fname, lname, email) =>
    set((state) => ({
      lectures: state.lectures.map((l) => (l.id === id ? { ...l, fname, lname, email } : l)),
    })),
}));
