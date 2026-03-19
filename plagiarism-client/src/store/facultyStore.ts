import { create } from "zustand";

export interface FacultyItem {
  id: number;
  name: string;
  courses: number;
}

interface FacultyStore {
  faculties: FacultyItem[];
  addFaculty: (name: string) => void;
  deleteFaculty: (id: number) => void;
  updateFaculty: (id: number, name: string) => void;
}

export const useFacultyStore = create<FacultyStore>((set) => ({
  faculties: [
    { id: 1, name: "Faculty of Science", courses: 8 },
    { id: 2, name: "Faculty of Engineering", courses: 12 },
    { id: 3, name: "Faculty of Business", courses: 6 },
    { id: 4, name: "Faculty of Arts", courses: 4 },
  ],
  addFaculty: (name) =>
    set((state) => ({
      faculties: [...state.faculties, { id: Math.max(0, ...state.faculties.map((f) => f.id)) + 1, name, courses: 0 }],
    })),
  deleteFaculty: (id) => set((state) => ({ faculties: state.faculties.filter((f) => f.id !== id) })),
  updateFaculty: (id, name) =>
    set((state) => ({
      faculties: state.faculties.map((f) => (f.id === id ? { ...f, name } : f)),
    })),
}));
