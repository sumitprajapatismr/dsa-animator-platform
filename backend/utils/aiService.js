import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

/**
 * Ask Gemini a prompt or fall back to simulated response
 */
export const askGemini = async (prompt, systemInstruction = '') => {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: systemInstruction || 'You are an elite computer science tutor helping a student learn Data Structures and Algorithms (DSA).'
      });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.error('Gemini API Error:', err);
      // Fallback to simulated response if API fails
    }
  }

  // Smart Mock Fallback Generator
  return getMockAIResponse(prompt);
};

/**
 * AI Code Review helper
 */
export const reviewCode = async (code, language) => {
  const prompt = `Perform a code review of the following ${language} code. Analyze complexity, identify potential bugs, and suggest improvements.\n\nCode:\n${code}`;
  const system = 'You are a Senior Software Engineer conducting a thorough code review. Respond in clean Markdown.';
  return askGemini(prompt, system);
};

/**
 * AI Hint Generator helper
 */
export const getHint = async (problemTitle, problemDescription, code, language) => {
  const prompt = `Problem: ${problemTitle}\nDescription: ${problemDescription}\nUser's Current Code (${language}):\n${code}\n\nProvide 3 progressive hints for the user to solve this. Do not give the full solution directly.`;
  const system = 'You are a helpful teaching assistant guiding a student. Give short hints, not full solutions.';
  return askGemini(prompt, system);
};

/**
 * AI Quiz Generator helper
 */
export const generateQuiz = async (topic) => {
  const prompt = `Generate a JSON array of 5 multiple-choice questions on the topic of "${topic}". Each question should have a text, four options, a correctOption index (0-3), and an explanation. Return ONLY the raw JSON array.`;
  const system = 'You are a technical quiz creator. Return only valid JSON. Do not include markdown codeblocks or extra text.';
  
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      // Remove markdown wrapping if present
      if (text.startsWith('```json')) {
        text = text.substring(7);
      }
      if (text.endsWith('```')) {
        text = text.substring(0, text.length - 3);
      }
      return JSON.parse(text.trim());
    } catch (e) {
      console.error('Failed to parse Gemini quiz, using fallback', e);
    }
  }

  return getMockQuiz(topic);
};

// --- Mock Generation Helpers ---

function getMockAIResponse(prompt) {
  const lower = prompt.toLowerCase();
  
  if (lower.includes('review') || lower.includes('complexity') || lower.includes('bug')) {
    return `### 🔍 AI Code Review & Complexity Analysis

**Time Complexity:** $\\mathcal{O}(N^2)$ in worst case due to nested loops.
**Space Complexity:** $\\mathcal{O}(1)$ auxiliary space as we sort in-place.

#### 💡 Suggested Improvements
1. **Early Termination:** You can optimize this by checking if any swaps occurred in the inner loop. If not, the array is already sorted, and we can terminate early to achieve $\\mathcal{O}(N)$ in the best case.
2. **Naming Conventions:** Use descriptive variable names (e.g., \`isSwapped\` instead of \`flag\`).

#### 🐛 Bug Finder
* *No critical bugs found.* The implementation is logically sound but can be optimized.
`;
  }
  
  if (lower.includes('hint')) {
    return `### 💡 AI Hints for Solving

1. **Hint 1:** Consider using the two-pointer approach starting from both ends of the array.
2. **Hint 2:** If the sum of values at the two pointers is greater than the target, decrement the right pointer. If smaller, increment the left pointer.
3. **Hint 3:** Keep the array sorted first! This allows the two-pointer decision process to work logically.
`;
  }

  if (lower.includes('explain') || lower.includes('step-by-step') || lower.includes('dry run')) {
    return `### 📚 Step-by-Step Algorithm Explanation

Here is the dry run explanation for your current algorithm state:
1. **Initialization:** Set pointers \`i = 0\` and \`j = n - 1\`.
2. **Pivot Selection:** Choose the middle element as the pivot.
3. **Partitioning:**
   - Elements smaller than pivot are moved to the left.
   - Elements larger than pivot are moved to the right.
4. **Recursion:** Recursively apply the partition step on the left and right subarrays.

**Key Intuition:** Divide and conquer minimizes comparisons by grouping elements around the pivot.
`;
  }

  return `### 🤖 AI Tutor Response

You asked about: *"${prompt.substring(0, 60)}..."*

Here is a quick study guide on this DSA topic:
- **Optimal Choice:** Try to look for subproblems or overlapping subproblems to see if Dynamic Programming applies.
- **Data Structure selection:** If you need frequent lookups, a Hash Map reduces average runtime to $\\mathcal{O}(1)$.
- **Tip:** Write down the state transitions on a piece of paper (dry run) before writing the code.
`;
}

function getMockQuiz(topic) {
  return [
    {
      question: `What is the worst-case time complexity of Quick Sort?`,
      options: ["O(N log N)", "O(N^2)", "O(N)", "O(log N)"],
      correctOption: 1,
      explanation: "Quick Sort worst-case complexity is O(N^2) which occurs when the pivot chosen is always the smallest or largest element (e.g., already sorted array)."
    },
    {
      question: `Which data structure uses LIFO (Last In First Out) principle?`,
      options: ["Queue", "Stack", "Priority Queue", "Linked List"],
      correctOption: 1,
      explanation: "A Stack operates on a LIFO basis: the last item pushed is the first item popped."
    },
    {
      question: `What is the time complexity to insert a node at the beginning of a singly linked list?`,
      options: ["O(1)", "O(N)", "O(log N)", "O(N log N)"],
      correctOption: 0,
      explanation: "Inserting at the beginning only requires updating the new node's next pointer and the head pointer, which takes O(1) constant time."
    },
    {
      question: `Which algorithm is used to find the shortest path in a weighted graph with positive weights?`,
      options: ["Kruskal's Algorithm", "Dijkstra's Algorithm", "Prim's Algorithm", "Depth First Search"],
      correctOption: 1,
      explanation: "Dijkstra's algorithm is specifically designed to find the single-source shortest path in weighted graphs with non-negative edge weights."
    },
    {
      question: `What is the space complexity of an in-place Bubble Sort?`,
      options: ["O(N)", "O(1)", "O(log N)", "O(N^2)"],
      correctOption: 1,
      explanation: "Bubble Sort is an in-place sorting algorithm and only requires a constant amount O(1) of extra memory space for swaps."
    }
  ];
}
