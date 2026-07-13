import Problem from '../models/Problem.js';
import Submission from '../models/Submission.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { runCode } from '../utils/codeRunner.js';

// Self-seeding function for initial setup
export const seedSampleProblems = async () => {
  const count = await Problem.countDocuments();
  if (count > 0) return;

  const samples = [
    {
      title: 'Two Sum',
      slug: 'two-sum',
      difficulty: 'Easy',
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9',
        'Only one valid answer exists.'
      ],
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
        }
      ],
      codeTemplates: [
        {
          language: 'javascript',
          template: 'function twoSum(nums, target) {\n    // Write your code here\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n}'
        },
        {
          language: 'python',
          template: 'def twoSum(nums, target):\n    # Write your code here\n    hashmap = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in hashmap:\n            return [hashmap[complement], i]\n        hashmap[num] = i\n    return []'
        }
      ],
      testCases: [
        { input: '2,7,11,15\n9', expectedOutput: '[0, 1]', isHidden: false },
        { input: '3,2,4\n6', expectedOutput: '[1, 2]', isHidden: false },
        { input: '3,3\n6', expectedOutput: '[0, 1]', isHidden: true }
      ],
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      tags: ['arrays', 'hash-table', 'two-pointer']
    },
    {
      title: 'Valid Parentheses',
      slug: 'valid-parentheses',
      difficulty: 'Easy',
      description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.',
      constraints: [
        '1 <= s.length <= 10^4',
        's consists of parentheses only.'
      ],
      examples: [
        {
          input: 's = "()"',
          output: 'true',
          explanation: 'Simple matched brackets.'
        }
      ],
      codeTemplates: [
        {
          language: 'javascript',
          template: 'function isValid(s) {\n    // Write your stack implementation here\n    const stack = [];\n    const map = { ")": "(", "}": "{", "]": "[" };\n    for (let char of s) {\n        if (char === "(" || char === "{" || char === "[") {\n            stack.push(char);\n        } else {\n            if (stack.pop() !== map[char]) return false;\n        }\n    }\n    return stack.length === 0;\n}'
        },
        {
          language: 'python',
          template: 'def isValid(s):\n    # Write your code here\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping.values():\n            stack.append(char)\n        elif char in mapping:\n            if not stack or stack.pop() != mapping[char]:\n                return False\n    return len(stack) == 0'
        }
      ],
      testCases: [
        { input: '()', expectedOutput: 'true', isHidden: false },
        { input: '()[]{}', expectedOutput: 'true', isHidden: false },
        { input: '(]', expectedOutput: 'false', isHidden: true }
      ],
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      tags: ['stack', 'string']
    }
  ];

  await Problem.create(samples);
  console.log('Sample problems seeded successfully!');
};

// @desc    Get all problems (with search, pagination, difficulty filters)
// @route   GET /api/problems
// @access  Public
export const getProblems = async (req, res, next) => {
  try {
    await seedSampleProblems(); // Check seeding

    const { difficulty, tag, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (difficulty) query.difficulty = difficulty;
    if (tag) query.tags = tag;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const total = await Problem.countDocuments(query);
    const problems = await Problem.find(query)
      .select('-testCases') // Exclude full test cases for safety
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / Number(limit)),
      problems
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get problem details by slug
// @route   GET /api/problems/:slug
// @access  Public
export const getProblemBySlug = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }
    res.status(200).json({ success: true, problem });
  } catch (error) {
    next(error);
  }
};

// @desc    Run code with custom input
// @route   POST /api/problems/run
// @access  Private
export const runCodePlayground = async (req, res, next) => {
  const { code, language, input } = req.body;
  try {
    const result = await runCode(code, language, input);
    res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit code against test cases
// @route   POST /api/problems/:id/submit
// @access  Private
export const submitCodePlayground = async (req, res, next) => {
  const { code, language } = req.body;
  const problemId = req.params.id;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    let passed = 0;
    const total = problem.testCases.length;
    let finalStatus = 'Accepted';
    let runErrors = '';
    let totalTime = 0;

    for (const testCase of problem.testCases) {
      const res = await runCode(code, language, testCase.input, testCase.expectedOutput);
      
      if (res.status === 'Accepted') {
        passed++;
        totalTime += res.runtime || 0;
      } else {
        finalStatus = res.status;
        runErrors = res.error || `Expected: ${testCase.expectedOutput}, got: ${res.output}`;
        break; // Stop at first failing test case
      }
    }

    const averageRuntime = Math.round(totalTime / (passed || 1));

    // Save Submission
    const submission = await Submission.create({
      user: req.user.id,
      problem: problemId,
      language,
      code,
      status: finalStatus,
      testCasesPassed: passed,
      totalTestCases: total,
      runtime: averageRuntime,
      memory: Math.floor(Math.random() * 200) + 120
    });

    // Award rewards on first Accepted solve
    let xpAwarded = 0;
    let coinsAwarded = 0;
    
    if (finalStatus === 'Accepted') {
      const existingSolved = await Submission.findOne({
        user: req.user.id,
        problem: problemId,
        status: 'Accepted',
        _id: { $ne: submission._id }
      });

      if (!existingSolved) {
        // First solve rewards
        xpAwarded = problem.difficulty === 'Easy' ? 50 : problem.difficulty === 'Medium' ? 100 : 150;
        coinsAwarded = problem.difficulty === 'Easy' ? 10 : problem.difficulty === 'Medium' ? 25 : 50;

        const user = await User.findById(req.user.id);
        user.xp += xpAwarded;
        user.coins += coinsAwarded;

        // Update Level
        const newLevel = Math.floor(Math.sqrt(user.xp / 100)) + 1;
        if (newLevel > user.level) {
          user.level = newLevel;
          await Notification.create({
            user: user._id,
            title: '🎉 Level Up!',
            message: `Congratulations! You have reached Level ${newLevel}! Keep pushing.`,
            type: 'general'
          });
        }

        // Add to Progress Topic tracker
        const topic = problem.tags[0] || 'arrays';
        let progress = await Progress.findOne({ user: req.user.id, topicId: topic });
        if (!progress) {
          progress = await Progress.create({
            user: req.user.id,
            topicId: topic,
            solvedProblems: [problemId]
          });
        } else {
          if (!progress.solvedProblems.includes(problemId)) {
            progress.solvedProblems.push(problemId);
            await progress.save();
          }
        }

        // Unlock achievements check
        const solvedCount = await Submission.countDocuments({ user: req.user.id, status: 'Accepted' });
        // Award badge based on count
        if (solvedCount === 1) {
          user.badges.push({ badgeId: 'first_solve', name: 'First Milestone', icon: 'Award' });
          await Notification.create({
            user: user._id,
            title: '🏆 Achievement Unlocked: First Solve!',
            message: 'You solved your first coding challenge. Badge unlocked!',
            type: 'achievement'
          });
        }
        
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      submission,
      passed,
      total,
      xpGained: xpAwarded,
      coinsGained: coinsAwarded,
      error: runErrors
    });

  } catch (error) {
    next(error);
  }
};
