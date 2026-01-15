/**
 * Simple plagiarism detection helpers.
 * For this starter we implement:
 *  - textCleaning: lowercasing, remove punctuation
 *  - jaccardSimilarity: compute token set Jaccard similarity
 *
 * This is intentionally simple so you (as a learner) can understand and
 * later replace with more advanced algorithms (shingling, winnowing, fingerprinting).
 */

export function cleanText(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[\p{P}$+<=>^`|~]/gu, '') // remove punctuation
    .toLowerCase()
    .trim();
}

export function jaccardSimilarity(a: string, b: string) {
  const ta = new Set(cleanText(a).split(' ').filter(Boolean));
  const tb = new Set(cleanText(b).split(' ').filter(Boolean));
  const intersection = new Set([...ta].filter(x => tb.has(x)));
  const union = new Set([...ta, ...tb]);
  const sim = union.size === 0 ? 0 : intersection.size / union.size;
  return { similarity: sim, intersection: intersection.size, union: union.size };
}
