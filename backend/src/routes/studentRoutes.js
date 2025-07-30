const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const permit = require('../middlewares/roleMiddleware');
const { 
  getMyProfile, 
  updateMyProfile, 
  getMySchedule, 
  getDashboardData 
} = require('../controllers/studentController');

// All routes in this file are protected and for students only
router.use(auth, permit('student'));

// @route   GET /api/student/me
// @desc    Get logged-in student's profile
// @access  Student
router.get('/me', getMyProfile);

// @route   PUT /api/student/me
// @desc    Update logged-in student's profile
// @access  Student
router.put('/me', updateMyProfile);

// @route   GET /api/student/my-schedule
// @desc    Get student's weekly schedule
// @access  Student
router.get('/my-schedule', getMySchedule);

// @route   GET /api/student/dashboard
// @desc    Get student's dashboard data
// @access  Student
router.get('/dashboard', getDashboardData);

module.exports = router;
