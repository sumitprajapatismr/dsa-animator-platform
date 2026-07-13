import User from '../models/User.js';
import Problem from '../models/Problem.js';
import Submission from '../models/Submission.js';

// @desc    Get system analytics (Users, Submissions, Success rates)
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProblems = await Problem.countDocuments();
    const totalSubmissions = await Submission.countDocuments();
    
    // Success rate computation
    const acceptedCount = await Submission.countDocuments({ status: 'Accepted' });
    const successRate = totalSubmissions > 0 ? Math.round((acceptedCount / totalSubmissions) * 100) : 0;

    // Difficulty breakdown
    const easyCount = await Problem.countDocuments({ difficulty: 'Easy' });
    const mediumCount = await Problem.countDocuments({ difficulty: 'Medium' });
    const hardCount = await Problem.countDocuments({ difficulty: 'Hard' });

    // Recent submissions
    const recentSubmissions = await Submission.find()
      .populate('user', 'name email')
      .populate('problem', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProblems,
        totalSubmissions,
        successRate,
        breakdown: { easy: easyCount, medium: mediumCount, hard: hardCount }
      },
      recentSubmissions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  const { role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ success: true, message: `User role updated to ${role}`, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new problem
// @route   POST /api/admin/problems
// @access  Private/Admin
export const createProblem = async (req, res, next) => {
  try {
    const { title, difficulty, description, constraints, examples, codeTemplates, testCases, tags, timeComplexity, spaceComplexity } = req.body;
    
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const problem = await Problem.create({
      title,
      slug,
      difficulty,
      description,
      constraints,
      examples,
      codeTemplates,
      testCases,
      tags,
      timeComplexity,
      spaceComplexity
    });

    res.status(201).json({ success: true, problem });
  } catch (error) {
    next(error);
  }
};
