// ── Mock data for the similarity check workflow ──

export interface Course {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  department: string;
  semester: string;
  totalStudents: number;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  submissionCount: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentName: string;
  regNumber: string;
  dateSubmitted: string;
  text: string;
}

export const courses: Course[] = [
  { id: "c1", code: "CS101", name: "Intro to Programming", lecturer: "Dr. John Mtui", department: "Computer Science", semester: "2024/2025 Sem 1", totalStudents: 45 },
  { id: "c2", code: "CS202", name: "Database Systems", lecturer: "Prof. Sarah Kimani", department: "Computer Science", semester: "2024/2025 Sem 1", totalStudents: 38 },
  { id: "c3", code: "CS303", name: "Software Engineering", lecturer: "Dr. Peter Ochieng", department: "Computer Science", semester: "2024/2025 Sem 1", totalStudents: 42 },
  { id: "c4", code: "CS404", name: "Data Structures & Algorithms", lecturer: "Dr. Mary Akinyi", department: "Computer Science", semester: "2024/2025 Sem 2", totalStudents: 35 },
  { id: "c5", code: "CS505", name: "Computer Networks", lecturer: "Prof. James Wafula", department: "Information Technology", semester: "2024/2025 Sem 2", totalStudents: 40 },
  { id: "c6", code: "IT201", name: "Web Development", lecturer: "Dr. Grace Mwende", department: "Information Technology", semester: "2024/2025 Sem 1", totalStudents: 50 },
  { id: "c7", code: "IT302", name: "Cybersecurity Fundamentals", lecturer: "Prof. Ahmed Hassan", department: "Information Technology", semester: "2024/2025 Sem 2", totalStudents: 30 },
];

export const assignments: Assignment[] = [
  { id: "a1", courseId: "c1", title: "Lab 1: Loops & Conditionals", dueDate: "2025-03-10", submissionCount: 12 },
  { id: "a2", courseId: "c1", title: "Final Project: Calculator App", dueDate: "2025-04-15", submissionCount: 11 },
  { id: "a3", courseId: "c2", title: "Mid-term Essay: Normalization", dueDate: "2025-03-20", submissionCount: 10 },
  { id: "a4", courseId: "c2", title: "Lab 2: SQL Joins", dueDate: "2025-04-01", submissionCount: 12 },
  { id: "a5", courseId: "c3", title: "Sprint Report: Agile Methodology", dueDate: "2025-03-15", submissionCount: 11 },
  { id: "a6", courseId: "c3", title: "Final Project: Requirements Doc", dueDate: "2025-04-20", submissionCount: 10 },
  { id: "a7", courseId: "c4", title: "Lab 1: Linked List Implementation", dueDate: "2025-03-08", submissionCount: 12 },
  { id: "a8", courseId: "c4", title: "Mid-term: Sorting Algorithms", dueDate: "2025-03-25", submissionCount: 11 },
  { id: "a9", courseId: "c5", title: "Lab 1: TCP/IP Analysis", dueDate: "2025-03-12", submissionCount: 10 },
  { id: "a10", courseId: "c5", title: "Final Project: Network Design", dueDate: "2025-04-18", submissionCount: 12 },
  { id: "a11", courseId: "c6", title: "Assignment 1: HTML/CSS Portfolio", dueDate: "2025-03-05", submissionCount: 12 },
  { id: "a12", courseId: "c6", title: "Final Project: React Dashboard", dueDate: "2025-04-25", submissionCount: 11 },
  { id: "a13", courseId: "c7", title: "Lab 1: Vulnerability Assessment", dueDate: "2025-03-18", submissionCount: 10 },
  { id: "a14", courseId: "c7", title: "Research Paper: Ethical Hacking", dueDate: "2025-04-10", submissionCount: 11 },
];

const sampleTexts = [
  "A for loop iterates over a sequence of values. It is used to repeat a block of code a specific number of times. The syntax includes an initialization, condition, and increment expression. For loops are fundamental to programming and allow efficient repetition of tasks.",
  "For loops are used to iterate through sequences. They repeat code blocks for a specified number of iterations. The basic structure includes initialization, a boolean condition check, and an increment step. Loops are essential building blocks in any programming language.",
  "Iteration in programming is achieved through loop constructs. A for loop provides a compact way to write the loop structure. It initializes a counter, checks a condition, and updates the counter each iteration. This construct is widely used across programming languages.",
  "Database normalization is the process of organizing data to reduce redundancy. The first normal form eliminates repeating groups. Second normal form removes partial dependencies. Third normal form eliminates transitive dependencies between non-key attributes.",
  "Normalization in databases reduces data redundancy and improves integrity. 1NF requires atomic values and no repeating groups. 2NF builds on 1NF by removing partial dependencies on composite keys. 3NF further removes transitive dependencies for cleaner schema design.",
  "The process of normalizing a database involves restructuring relations. First normal form ensures each field contains only atomic values. Second normal form ensures all non-key attributes depend on the entire primary key. Third normal form ensures no transitive dependencies exist.",
  "Agile methodology is an iterative approach to software development. It emphasizes collaboration, customer feedback, and small rapid releases. Scrum is a popular agile framework that organizes work into sprints. Each sprint typically lasts two to four weeks and delivers working software.",
  "Software development using agile practices focuses on iterative delivery. Teams collaborate closely with stakeholders and adapt to changing requirements. The Scrum framework structures development into time-boxed sprints. Working software is delivered at the end of each sprint cycle.",
  "Linked lists are dynamic data structures where each element points to the next. Unlike arrays, linked lists do not require contiguous memory allocation. Insertion and deletion operations are efficient as they only require pointer updates. However, random access is not possible.",
  "A linked list consists of nodes where each node contains data and a reference. Memory allocation is dynamic and non-contiguous. Adding or removing elements is efficient because only references need updating. The tradeoff is that sequential access is required to reach any element.",
  "TCP/IP is the fundamental protocol suite for internet communication. TCP provides reliable, ordered delivery of data between applications. IP handles addressing and routing of packets across networks. Together they form the backbone of modern networked systems.",
  "The TCP/IP protocol stack enables communication across interconnected networks. The transport layer (TCP) ensures reliable data delivery with error checking. The network layer (IP) manages logical addressing and packet routing. This layered approach enables scalable internet architecture.",
];

const studentNames = [
  "Alice Mwanga", "Bob Kamau", "Carol Lyimo", "David Osei", "Eva Njoki",
  "Frank Banda", "Grace Achieng", "Hassan Juma", "Irene Wambui", "James Kariuki",
  "Kelvin Mushi", "Linda Nyambura",
];

const regNumbers = [
  "2024/CS/001", "2024/CS/002", "2024/CS/003", "2024/CS/004", "2024/CS/005",
  "2024/CS/006", "2024/CS/007", "2024/CS/008", "2024/CS/009", "2024/CS/010",
  "2024/CS/011", "2024/CS/012",
];

function randomDate(): string {
  const base = new Date(2025, 2, 1);
  const offset = Math.floor(Math.random() * 30);
  const d = new Date(base.getTime() + offset * 86400000);
  return d.toISOString().slice(0, 10);
}

// Generate submissions: each assignment gets 10-12 students
let subId = 0;
export const submissions: Submission[] = assignments.flatMap((a) => {
  const count = 10 + Math.floor(Math.random() * 3);
  return studentNames.slice(0, count).map((name, idx) => ({
    id: `s${++subId}`,
    assignmentId: a.id,
    studentName: name,
    regNumber: regNumbers[idx],
    dateSubmitted: randomDate(),
    text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)],
  }));
});

// Utility: generate random similarity score
export function generateSimilarity(): number {
  return Math.floor(Math.random() * 85) + 10;
}

// Utility: find common substrings (simplified mock)
export function findHighlightedSegments(
  textA: string,
  textB: string
): { segmentsA: { text: string; highlighted: boolean }[]; segmentsB: { text: string; highlighted: boolean }[] } {
  const wordsA = textA.split(" ");
  const wordsB = textB.split(" ");
  const commonWords = new Set(wordsA.filter((w) => wordsB.includes(w) && w.length > 4));

  const segment = (words: string[]) => {
    const result: { text: string; highlighted: boolean }[] = [];
    let current = "";
    let currentHL = false;
    words.forEach((w, i) => {
      const isHL = commonWords.has(w);
      if (i === 0) {
        current = w;
        currentHL = isHL;
      } else if (isHL === currentHL) {
        current += " " + w;
      } else {
        result.push({ text: current, highlighted: currentHL });
        current = w;
        currentHL = isHL;
      }
    });
    if (current) result.push({ text: current, highlighted: currentHL });
    return result;
  };

  return { segmentsA: segment(wordsA), segmentsB: segment(wordsB) };
}

export interface ComparisonPair {
  studentA: string;
  regA: string;
  studentB: string;
  regB: string;
  similarity: number;
  textA: string;
  textB: string;
}

export function generateComparisonPairs(subs: Submission[]): ComparisonPair[] {
  const pairs: ComparisonPair[] = [];
  for (let i = 0; i < subs.length; i++) {
    for (let j = i + 1; j < subs.length; j++) {
      pairs.push({
        studentA: subs[i].studentName,
        regA: subs[i].regNumber,
        studentB: subs[j].studentName,
        regB: subs[j].regNumber,
        similarity: generateSimilarity(),
        textA: subs[i].text,
        textB: subs[j].text,
      });
    }
  }
  return pairs.sort((a, b) => b.similarity - a.similarity);
}
