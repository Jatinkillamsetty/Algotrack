export const CANONICAL_TOPICS = [
  'Arrays',
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Linked List',
  'Trees & BST',
  'Graphs & BFS/DFS',
  'Dynamic Programming',
  'Heap & Priority Queue',
  'Stack & Queue',
  'Backtracking',
  'Greedy',
  'Bit Manipulation',
  'Hash Table & String',
  'Math & SQL'
] as const;
export function classifyProblemTopic(title: string, currentTopic?: string): string {
  if (currentTopic && currentTopic !== 'General' && currentTopic !== 'Unassigned') {
    return currentTopic;
  }
  const lower = title.toLowerCase();
  if (lower.includes('dp') || lower.includes('dynamic') || lower.includes('coin change') || 
      lower.includes('robber') || lower.includes('subsequence') || lower.includes('edit distance') ||
      lower.includes('unique paths') || lower.includes('partition') || lower.includes('climbing stairs') ||
      lower.includes('word break') || lower.includes('jump game')) {
    return 'Dynamic Programming';
  }
  if (lower.includes('tree') || lower.includes('bst') || lower.includes('binary search tree') || 
      lower.includes('inorder') || lower.includes('preorder') || lower.includes('postorder') ||
      lower.includes('ancestor') || lower.includes('root') || lower.includes('depth')) {
    return 'Trees & BST';
  }
  if (lower.includes('graph') || lower.includes('island') || lower.includes('course schedule') || 
      lower.includes('network') || lower.includes('shortest path') || lower.includes('bipartite') ||
      lower.includes('rotting') || lower.includes('oranges') || lower.includes('ladder')) {
    return 'Graphs & BFS/DFS';
  }
  if (lower.includes('search') || lower.includes('rotated') || lower.includes('koko') || 
      lower.includes('first and last') || lower.includes('median of two')) {
    return 'Binary Search';
  }
  if (lower.includes('window') || lower.includes('substring') || lower.includes('consecutive') ||
      lower.includes('fruit into') || lower.includes('longest substring')) {
    return 'Sliding Window';
  }
  if (lower.includes('two sum') || lower.includes('3sum') || lower.includes('4sum') || 
      lower.includes('pointer') || lower.includes('container with most water') || lower.includes('trapping rain')) {
    return 'Two Pointers';
  }
  if (lower.includes('list') || lower.includes('linked') || lower.includes('lru cache') || 
      lower.includes('node') || lower.includes('cycle')) {
    return 'Linked List';
  }
  if (lower.includes('heap') || lower.includes('priority') || lower.includes('kth largest') || 
      lower.includes('top k') || lower.includes('median from data stream')) {
    return 'Heap & Priority Queue';
  }
  if (lower.includes('stack') || lower.includes('parentheses') || lower.includes('calculator') || 
      lower.includes('queue') || lower.includes('temperatures') || lower.includes('histogram')) {
    return 'Stack & Queue';
  }
  if (lower.includes('n-queens') || lower.includes('combination') || lower.includes('permutation') || 
      lower.includes('subsets') || lower.includes('sudoku') || lower.includes('word search')) {
    return 'Backtracking';
  }
  if (lower.includes('bit') || lower.includes('single number') || lower.includes('counting bits') || 
      lower.includes('xor') || lower.includes('binary')) {
    return 'Bit Manipulation';
  }
  if (lower.includes('select') || lower.includes('employee') || lower.includes('salary') || 
      lower.includes('table') || lower.includes('query') || lower.includes('customer') ||
      lower.includes('department') || lower.includes('views') || lower.includes('math') ||
      lower.includes('pow') || lower.includes('sqrt')) {
    return 'Math & SQL';
  }
  if (lower.includes('array') || lower.includes('matrix') || lower.includes('rotate') || 
      lower.includes('sort') || lower.includes('subarray') || lower.includes('duplicate')) {
    return 'Arrays';
  }
  if (lower.includes('string') || lower.includes('anagram') || lower.includes('palindrome') || 
      lower.includes('prefix') || lower.includes('roman')) {
    return 'Hash Table & String';
  }
  return 'Arrays';
}