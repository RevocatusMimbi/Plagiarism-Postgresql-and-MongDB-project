import { create } from "zustand";

export interface Student {
  regNo: string;
  fname: string;
  lname: string;
  status: "active" | "suspended";
}

interface StudentStore {
  students: Student[];
  addStudent: (regNo: string, fname: string, lname: string) => void;
  deleteStudent: (regNo: string) => void;
  toggleStudentStatus: (regNo: string) => void;
  updateStudent: (regNo: string, fname: string, lname: string) => void;
}

export const useStudentStore = create<StudentStore>((set) => ({
  students: [
    { regNo: "283/BSC.SE/T/2018", fname: "Alice", lname: "Mwanga", status: "active" },
    { regNo: "102/BSC.CS/T/2019", fname: "Bob", lname: "Kamau", status: "active" },
    { regNo: "045/BSC.IT/T/2020", fname: "Carol", lname: "Lyimo", status: "suspended" },
  ],
  addStudent: (regNo, fname, lname) =>
    set((state) => ({ students: [...state.students, { regNo, fname, lname, status: "active" }] })),
  deleteStudent: (regNo) => set((state) => ({ students: state.students.filter((s) => s.regNo !== regNo) })),
  toggleStudentStatus: (regNo) =>
    set((state) => ({
      students: state.students.map((s) => (s.regNo === regNo ? { ...s, status: s.status === "active" ? "suspended" : "active" } : s)),
    })),
  updateStudent: (regNo, fname, lname) =>
    set((state) => ({
      students: state.students.map((s) => (s.regNo === regNo ? { ...s, fname, lname } : s)),
    })),
}));
