const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const permit = require('../middlewares/roleMiddleware');
const attachSchoolId = require('../middlewares/attachSchoolId');
const { 
  getAllStudentsForTeacher,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/teacherController');

// All routes in this file are protected and for teachers only
router.use(auth, permit('teacher'), attachSchoolId);

// @route   GET /api/teacher/students
// @desc    Get a list of all students for the teacher's classes
// @access  Teacher
router.get('/students', getAllStudentsForTeacher);

// @route   POST /api/teacher/students
// @desc    Create a new student
// @access  Teacher
router.post('/students', createStudent);

// @route   PUT /api/teacher/students/:id
// @desc    Update a student's details
// @access  Teacher
router.put('/students/:id', updateStudent);

// @route   DELETE /api/teacher/students/:id
// @desc    Delete a student
// @access  Teacher
router.delete('/students/:id', deleteStudent);

module.exports = router;
