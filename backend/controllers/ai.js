import { askGemini, reviewCode, getHint, generateQuiz } from '../utils/aiService.js';

// @desc    Ask general DSA question to AI Tutor
// @route   POST /api/ai/ask
// @access  Private
export const askAITutor = async (req, res, next) => {
  const { prompt, context } = req.body;
  try {
    let fullPrompt = prompt;
    if (context) {
      fullPrompt = `Context information: ${context}\n\nQuestion: ${prompt}`;
    }
    const response = await askGemini(fullPrompt);
    res.status(200).json({ success: true, response });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI Code Review
// @route   POST /api/ai/review
// @access  Private
export const getAICodeReview = async (req, res, next) => {
  const { code, language } = req.body;
  try {
    const review = await reviewCode(code, language);
    res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI Hints for Problem
// @route   POST /api/ai/hint
// @access  Private
export const getAIHint = async (req, res, next) => {
  const { problemTitle, problemDescription, code, language } = req.body;
  try {
    const hint = await getHint(problemTitle, problemDescription, code, language);
    res.status(200).json({ success: true, hint });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate Topic Quiz
// @route   GET /api/ai/quiz/:topic
// @access  Private
export const getAIQuiz = async (req, res, next) => {
  const { topic } = req.params;
  try {
    const quiz = await generateQuiz(topic);
    res.status(200).json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Interview Coach Coordinator
// @route   POST /api/ai/interview
// @access  Private
export const conductInterview = async (req, res, next) => {
  const { currentStep, userResponse, topic } = req.body;
  try {
    if (currentStep === 0) {
      const question = `Welcome to your mock coding interview session! I will act as your AI Interviewer. Today we'll review "${topic || 'Arrays & Searching'}".\n\nCould you start by explaining how Binary Search works, its average-case time complexity, and the main condition required to run it?`;
      return res.status(200).json({
        success: true,
        response: question,
        nextStep: 1
      });
    }

    if (currentStep === 1) {
      const prompt = `Evaluate this answer for binary search description. Tell them what they got right/wrong, and ask them to write a quick pseudo-code or Javascript implementation of binary search.\n\nUser Response: "${userResponse}"`;
      const response = await askGemini(prompt, 'You are a tech company interviewer. Give a direct follow-up.');
      return res.status(200).json({
        success: true,
        response,
        nextStep: 2
      });
    }

    const prompt = `Evaluate this code/pseudo-code implementation of binary search. Check for syntax correctness, bounds checking, middle element calculations, and infinite loop bugs. Grade them out of 100 and summarize their performance.\n\nUser Code: "${userResponse}"`;
    const response = await askGemini(prompt, 'You are compiling a technical candidate review. Respond in clear Markdown.');
    res.status(200).json({
      success: true,
      response,
      nextStep: 3,
      completed: true
    });
  } catch (error) {
    next(error);
  }
};
