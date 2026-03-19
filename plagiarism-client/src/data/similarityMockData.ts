// ── Mock data for the similarity check workflow ──

export interface Course {
	id: string;
	code: string;
	name: string;
}

export interface Assignment {
	id: string;
	courseId: string;
	title: string;
}

export interface Submission {
	id: string;
	assignmentId: string;
	studentName: string;
	regNumber: string;
	dateSubmitted: string;
	text: string;
}

export type GstColor = 'amber' | 'cyan' | 'emerald' | 'fuchsia' | 'violet';

export interface GstMatch {
	id: string;
	indexA: number;
	indexB: number;
	textA: string;
	textB: string;
	length: number;
	color: GstColor;
}

export interface GstSegment {
	text: string;
	matchId?: string;
}

export interface GstResult {
	similarity: number;
	matches: GstMatch[];
	segmentsA: GstSegment[];
	segmentsB: GstSegment[];
	longestMatch: number;
}

export const courses: Course[] = [
	{ id: 'c1', code: 'CS101', name: 'Intro to Programming' },
	{ id: 'c2', code: 'CS202', name: 'Database Systems' },
	{ id: 'c3', code: 'CS303', name: 'Software Engineering' },
	{ id: 'c4', code: 'CS404', name: 'Data Structures & Algorithms' },
	{ id: 'c5', code: 'CS505', name: 'Computer Networks' },
];

export const assignments: Assignment[] = [
	{ id: 'a1', courseId: 'c1', title: 'Lab 1: Loops & Conditionals' },
	{ id: 'a2', courseId: 'c1', title: 'Final Project: Calculator App' },
	{ id: 'a3', courseId: 'c2', title: 'Mid-term Essay: Normalization' },
	{ id: 'a4', courseId: 'c2', title: 'Lab 2: SQL Joins' },
	{ id: 'a5', courseId: 'c3', title: 'Sprint Report: Agile Methodology' },
	{ id: 'a6', courseId: 'c3', title: 'Final Project: Requirements Doc' },
	{ id: 'a7', courseId: 'c4', title: 'Lab 1: Linked List Implementation' },
	{ id: 'a8', courseId: 'c4', title: 'Mid-term: Sorting Algorithms' },
	{ id: 'a9', courseId: 'c5', title: 'Lab 1: TCP/IP Analysis' },
	{ id: 'a10', courseId: 'c5', title: 'Final Project: Network Design' },
];

const sampleTexts = [
	'A for loop iterates over a sequence of values. It is used to repeat a block of code a specific number of times. The syntax includes an initialization, condition, and increment expression. For loops are fundamental to programming and allow efficient repetition of tasks.',
	'For loops are used to iterate through sequences. They repeat code blocks for a specified number of iterations. The basic structure includes initialization, a boolean condition check, and an increment step. Loops are essential building blocks in any programming language.',
	'Iteration in programming is achieved through loop constructs. A for loop provides a compact way to write the loop structure. It initializes a counter, checks a condition, and updates the counter each iteration. This construct is widely used across programming languages.',
	'Database normalization is the process of organizing data to reduce redundancy. The first normal form eliminates repeating groups. Second normal form removes partial dependencies. Third normal form eliminates transitive dependencies between non-key attributes.',
	'Normalization in databases reduces data redundancy and improves integrity. 1NF requires atomic values and no repeating groups. 2NF builds on 1NF by removing partial dependencies on composite keys. 3NF further removes transitive dependencies for cleaner schema design.',
	'The process of normalizing a database involves restructuring relations. First normal form ensures each field contains only atomic values. Second normal form ensures all non-key attributes depend on the entire primary key. Third normal form ensures no transitive dependencies exist.',
	'Agile methodology is an iterative approach to software development. It emphasizes collaboration, customer feedback, and small rapid releases. Scrum is a popular agile framework that organizes work into sprints. Each sprint typically lasts two to four weeks and delivers working software.',
	'Software development using agile practices focuses on iterative delivery. Teams collaborate closely with stakeholders and adapt to changing requirements. The Scrum framework structures development into time-boxed sprints. Working software is delivered at the end of each sprint cycle.',
	'Linked lists are dynamic data structures where each element points to the next. Unlike arrays, linked lists do not require contiguous memory allocation. Insertion and deletion operations are efficient as they only require pointer updates. However, random access is not possible.',
	'A linked list consists of nodes where each node contains data and a reference. Memory allocation is dynamic and non-contiguous. Adding or removing elements is efficient because only references need updating. The tradeoff is that sequential access is required to reach any element.',
	'TCP/IP is the fundamental protocol suite for internet communication. TCP provides reliable, ordered delivery of data between applications. IP handles addressing and routing of packets across networks. Together they form the backbone of modern networked systems.',
	'The TCP/IP protocol stack enables communication across interconnected networks. The transport layer (TCP) ensures reliable data delivery with error checking. The network layer (IP) manages logical addressing and packet routing. This layered approach enables scalable internet architecture.',
];

const studentNames = [
	'Alice Mwanga',
	'Bob Kamau',
	'Carol Lyimo',
	'David Osei',
	'Eva Njoki',
	'Frank Banda',
	'Grace Achieng',
	'Hassan Juma',
	'Irene Wambui',
	'James Kariuki',
	'Kelvin Mushi',
	'Linda Nyambura',
];

const regNumbers = [
	'2024/CS/001',
	'2024/CS/002',
	'2024/CS/003',
	'2024/CS/004',
	'2024/CS/005',
	'2024/CS/006',
	'2024/CS/007',
	'2024/CS/008',
	'2024/CS/009',
	'2024/CS/010',
	'2024/CS/011',
	'2024/CS/012',
];

function randomDate(): string {
	const base = new Date(2025, 2, 1);
	const offset = Math.floor(Math.random() * 30);
	const d = new Date(base.getTime() + offset * 86400000);
	return d.toISOString().slice(0, 10);
}

// Generate submissions: each assignment gets 10-12 students with some realistic shared content
let subId = 0;
export const submissions: Submission[] = assignments.flatMap((a) => {
	const count = 10 + Math.floor(Math.random() * 3);
	// For each assignment, pick 2-3 "base paragraphs" that students tend to reuse or plagiarize
	const baseParas = [];
	for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
		baseParas.push(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
	}

	return studentNames.slice(0, count).map((name, idx) => {
		// ~70% chance to use a base paragraph (plagiarism), or pick something random
		let textContent = '';
		if (Math.random() < 0.7 && baseParas.length > 0) {
			// Pick 1-2 base paragraphs and maybe mix with random
			textContent = baseParas[Math.floor(Math.random() * baseParas.length)];
			if (Math.random() < 0.3) {
				textContent +=
					' ' +
					sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
			}
		} else {
			// Completely random
			textContent = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
		}

		return {
			id: `s${++subId}`,
			assignmentId: a.id,
			studentName: name,
			regNumber: regNumbers[idx],
			dateSubmitted: randomDate(),
			text: textContent,
		};
	});
});

// Utility: generate random similarity score (legacy)
export function generateSimilarity(): number {
	return Math.floor(Math.random() * 85) + 10;
}

// Utility: find common substrings (simplified mock)
export function findHighlightedSegments(
	textA: string,
	textB: string,
): {
	segmentsA: { text: string; highlighted: boolean }[];
	segmentsB: { text: string; highlighted: boolean }[];
} {
	const wordsA = textA.split(' ');
	const wordsB = textB.split(' ');
	const commonWords = new Set(
		wordsA.filter((w) => wordsB.includes(w) && w.length > 4),
	);

	const segment = (words: string[]) => {
		const result: { text: string; highlighted: boolean }[] = [];
		let current = '';
		let currentHL = false;
		words.forEach((w, i) => {
			const isHL = commonWords.has(w);
			if (i === 0) {
				current = w;
				currentHL = isHL;
			} else if (isHL === currentHL) {
				current += ' ' + w;
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

function splitParagraphs(text: string): string[] {
	return text
		.split(/(?<=[.!?])\s+/)
		.map((p) => p.trim())
		.filter(Boolean);
}

export function calculateGST(textA: string, textB: string): GstResult {
	const parasA = splitParagraphs(textA);
	const parasB = splitParagraphs(textB);
	const matchCount = Math.min(
		4,
		Math.max(1, 2 + Math.floor(Math.random() * 3)),
	);

	const usedA = new Set<number>();
	const usedB = new Set<number>();
	const colors: GstColor[] = ['amber', 'cyan', 'emerald', 'fuchsia', 'violet'];

	const matches: GstMatch[] = [];
	for (let i = 0; i < matchCount; i++) {
		const availableA = parasA
			.map((_, idx) => idx)
			.filter((idx) => !usedA.has(idx));
		const availableB = parasB
			.map((_, idx) => idx)
			.filter((idx) => !usedB.has(idx));
		if (!availableA.length || !availableB.length) break;

		const idxA = availableA[Math.floor(Math.random() * availableA.length)];

		// Prefer exact paragraph match when possible (makes highlights actually match)
		let idxB = availableB.find((idx) => parasB[idx] === parasA[idxA]);
		if (idxB === undefined) {
			idxB = availableB[Math.floor(Math.random() * availableB.length)];
		}

		usedA.add(idxA);
		usedB.add(idxB);

		const textAseg = parasA[idxA] ?? '';
		const textBseg = parasB[idxB] ?? '';
		const length = Math.max(textAseg.length, textBseg.length);

		matches.push({
			id: `match-${i + 1}`,
			indexA: idxA,
			indexB: idxB,
			textA: textAseg,
			textB: textBseg,
			length,
			color: colors[i % colors.length],
		});
	}

	const longestMatch = matches.reduce((max, m) => Math.max(max, m.length), 0);
	const similarityBase = 15 + matches.length * 15;
	const similarityRandom = Math.floor(Math.random() * 15);
	const similarity = Math.min(100, similarityBase + similarityRandom);

	const segmentsA: GstSegment[] = parasA.map((p, idx) => {
		const match = matches.find((m) => m.indexA === idx);
		return { text: p, matchId: match?.id };
	});
	const segmentsB: GstSegment[] = parasB.map((p, idx) => {
		const match = matches.find((m) => m.indexB === idx);
		return { text: p, matchId: match?.id };
	});

	return { similarity, matches, segmentsA, segmentsB, longestMatch };
}

export interface ComparisonPair {
	studentA: string;
	regA: string;
	studentB: string;
	regB: string;
	similarity: number;
	textA: string;
	textB: string;
	gst: GstResult;
}

export function generateComparisonPairs(subs: Submission[]): ComparisonPair[] {
	const pairs: ComparisonPair[] = [];
	for (let i = 0; i < subs.length; i++) {
		for (let j = i + 1; j < subs.length; j++) {
			const gst = calculateGST(subs[i].text, subs[j].text);
			pairs.push({
				studentA: subs[i].studentName,
				regA: subs[i].regNumber,
				studentB: subs[j].studentName,
				regB: subs[j].regNumber,
				similarity: gst.similarity,
				textA: subs[i].text,
				textB: subs[j].text,
				gst,
			});
		}
	}
	return pairs.sort((a, b) => b.similarity - a.similarity);
}
