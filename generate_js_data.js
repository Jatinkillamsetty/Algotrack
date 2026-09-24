import fs from 'fs';
import path from 'path';

function classifyProblemTopic(title, currentTopic) {
  if (currentTopic && currentTopic !== 'General' && currentTopic !== 'Unassigned') return currentTopic;
  const lower = title.toLowerCase();
  if (lower.includes('dp') || lower.includes('dynamic') || lower.includes('coin change') || lower.includes('robber') || lower.includes('subsequence') || lower.includes('edit distance') || lower.includes('climbing stairs') || lower.includes('word break') || lower.includes('jump game')) return 'Dynamic Programming';
  if (lower.includes('tree') || lower.includes('bst') || lower.includes('binary search tree') || lower.includes('inorder') || lower.includes('preorder') || lower.includes('ancestor') || lower.includes('depth')) return 'Trees & BST';
  if (lower.includes('graph') || lower.includes('island') || lower.includes('course schedule') || lower.includes('network') || lower.includes('shortest path') || lower.includes('rotting') || lower.includes('ladder')) return 'Graphs & BFS/DFS';
  if (lower.includes('search') || lower.includes('rotated') || lower.includes('koko') || lower.includes('first and last')) return 'Binary Search';
  if (lower.includes('window') || lower.includes('substring') || lower.includes('consecutive') || lower.includes('fruit into') || lower.includes('longest substring')) return 'Sliding Window';
  if (lower.includes('two sum') || lower.includes('3sum') || lower.includes('4sum') || lower.includes('pointer') || lower.includes('container with most water') || lower.includes('trapping rain')) return 'Two Pointers';
  if (lower.includes('list') || lower.includes('linked') || lower.includes('lru cache') || lower.includes('node') || lower.includes('cycle')) return 'Linked List';
  if (lower.includes('heap') || lower.includes('priority') || lower.includes('kth largest') || lower.includes('top k') || lower.includes('median from data stream')) return 'Heap & Priority Queue';
  if (lower.includes('stack') || lower.includes('parentheses') || lower.includes('calculator') || lower.includes('queue') || lower.includes('temperatures') || lower.includes('histogram')) return 'Stack & Queue';
  if (lower.includes('n-queens') || lower.includes('combination') || lower.includes('permutation') || lower.includes('subsets') || lower.includes('sudoku') || lower.includes('word search')) return 'Backtracking';
  if (lower.includes('bit') || lower.includes('single number') || lower.includes('counting bits') || lower.includes('binary')) return 'Bit Manipulation';
  if (lower.includes('select') || lower.includes('employee') || lower.includes('salary') || lower.includes('table') || lower.includes('query') || lower.includes('customer') || lower.includes('pow') || lower.includes('sqrt')) return 'Math & SQL';
  if (lower.includes('array') || lower.includes('matrix') || lower.includes('rotate') || lower.includes('sort') || lower.includes('subarray')) return 'Arrays';
  if (lower.includes('string') || lower.includes('anagram') || lower.includes('palindrome') || lower.includes('prefix')) return 'Hash Table & String';
  return 'Arrays';
}

function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

const csvPath = path.join(process.cwd(), 'public/dataset/leetcode_798.csv');
const csvText = fs.readFileSync(csvPath, 'utf-8');

const lines = csvText.split('\n').filter(l => l.trim().length > 0);
const header = parseCSVLine(lines[0]);

const problems = lines.slice(1).map((line, idx) => {
  const cols = parseCSVLine(line);
  const idNum = parseInt(cols[0] || `${idx + 1}`, 10);
  const url = (cols[1] || `https://leetcode.com/problems/problem-${idNum}`).trim();
  const title = (cols[2] || `Problem #${idNum}`).trim();
  
  let difficulty = 'Medium';
  const rawDiff = (cols[3] || '').toLowerCase();
  if (rawDiff.includes('easy')) difficulty = 'Easy';
  else if (rawDiff.includes('hard')) difficulty = 'Hard';

  let acceptance_rate = 50.0;
  if (cols[4]) {
    const val = parseFloat(`${cols[4]}`.replace('%', ''));
    if (!isNaN(val)) acceptance_rate = val;
  }

  let frequency = 50.0;
  if (cols[5]) {
    const val = parseFloat(`${cols[5]}`.replace('%', ''));
    if (!isNaN(val)) frequency = val;
  }

  const topic = classifyProblemTopic(title);

  return {
    id: idNum,
    leetcode_id: idNum,
    url,
    title,
    difficulty,
    acceptance_rate,
    frequency,
    topic,
    status: 'NOT_STARTED',
    first_solved_at: null,
    last_attempted_at: null,
    solve_time: null,
    confidence: null,
    notes: { approach: '', key_insight: '', mistake: '', pattern: '' },
    next_review_at: null,
    review_interval_days: 0,
    attempt_count: 0,
    hint_used: false,
    solution_viewed: false
  };
});

const outputJs = `window.RAW_798_PROBLEMS = ${JSON.stringify(problems, null, 2)};`;
const jsPath = path.join(process.cwd(), 'public/dataset/problemsData.js');
fs.writeFileSync(jsPath, outputJs, 'utf-8');
console.log(`Generated ${problems.length} problems JS dataset at ${jsPath}`);
