const User = require('../models/User');
const bcrypt = require('bcrypt');
const ScheduleSlot = require('../models/ScheduleSlot');
const { sendLoginCredentials } = require('../services/emailService');

// Get all teachers for the admin's school
exports.getAllTeachers = async (req, res) => {
  try {
    const schoolId = req.schoolId;

    const teachers = await User.find({ schoolId, role: 'teacher' })
      .select('name email createdAt')
      .sort({ createdAt: -1 });

    res.json(teachers);
  } catch (err) {
    console.error('Get All Teachers Error:', err);
    res.status(500).json({ message: 'Failed to fetch teachers.' });
  }
};

// Delete a teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.schoolId;

    const teacher = await User.findOneAndDelete({ 
      _id: id, 
      schoolId, 
      role: 'teacher' 
    });

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found or you do not have permission to delete.' });
    }

    // Optional: Add logic here to handle related data, like re-assigning schedule slots.
    // For now, we just delete the user.

    res.json({ message: 'Teacher deleted successfully.' });
  } catch (err) {
    console.error('Delete Teacher Error:', err);
    res.status(500).json({ message: 'Failed to delete teacher.' });
  }
};

// Update a teacher's details
exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const schoolId = req.schoolId;

    if (!name) {
      return res.status(400).json({ message: 'Name is a required field.' });
    }

    const teacher = await User.findOneAndUpdate(
      { _id: id, schoolId, role: 'teacher' },
      { $set: { name } },
      { new: true } // Return the updated document
    ).select('name email createdAt');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found or you do not have permission to edit.' });
    }

    res.json(teacher);
  } catch (err) {
    console.error('Update Teacher Error:', err);
    res.status(500).json({ message: 'Failed to update teacher.' });
  }
};

// Create a new teacher
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const schoolId = req.schoolId;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'teacher',
      schoolId,
    });
    
    await newUser.save();

    // Send login credentials to the new user
    await sendLoginCredentials(email, password);

    // Return the new teacher's data (without password)
    const teacherToReturn = await User.findById(newUser._id).select('name email createdAt');

    res.status(201).json(teacherToReturn);
  } catch (err) {
    console.error('Create Teacher Error:', err);
    res.status(500).json({ message: 'Failed to create teacher.' });
  }
};

// Get a single teacher's details, including their schedule
exports.getTeacherDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.schoolId;

    const teacher = await User.findOne({ _id: id, schoolId, role: 'teacher' }).select('-password');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }

    const schedule = await ScheduleSlot.find({ teacherId: id, schoolId }).sort('weekday periodIndex');

    res.json({ teacher, schedule });
  } catch (err) {
    console.error('Get Teacher Details Error:', err);
    res.status(500).json({ message: 'Failed to fetch teacher details.' });
  }
};
// Get all students for the admin's school
exports.getAllStudents = async (req, res) => {
  try {
    const schoolId = req.schoolId;

    const students = await User.find({ schoolId, role: 'student' })
      .select('name email createdAt classSection rollNumber')
      .sort({ createdAt: -1 });

    res.json(students);
  } catch (err) {
    console.error('Get All Students Error:', err);
    res.status(500).json({ message: 'Failed to fetch students.' });
  }
};

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { name, email, password, classSection, rollNumber } = req.body;
    const schoolId = req.schoolId;

    if (!name || !email || !password || !classSection || !rollNumber) {
      return res.status(400).json({ message: 'Name, email, password, class section, and roll number are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      schoolId,
      classSection,
      rollNumber,
    });
    
    await newUser.save();

    await sendLoginCredentials(email, password);

    const studentToReturn = await User.findById(newUser._id).select('name email createdAt classSection rollNumber');

    res.status(201).json(studentToReturn);
  } catch (err) {
    console.error('Create Student Error:', err);
    res.status(500).json({ message: 'Failed to create student.' });
  }
};

// Update a student's details
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, classSection, rollNumber } = req.body;
    const schoolId = req.schoolId;

    if (!name || !classSection || !rollNumber) {
      return res.status(400).json({ message: 'Name, class section, and roll number are required fields.' });
    }

    const student = await User.findOneAndUpdate(
      { _id: id, schoolId, role: 'student' },
      { $set: { name, classSection, rollNumber } },
      { new: true }
    ).select('name email createdAt classSection rollNumber');

    if (!student) {
      return res.status(404).json({ message: 'Student not found or you do not have permission to edit.' });
    }

    res.json(student);
  } catch (err) {
    console.error('Update Student Error:', err);
    res.status(500).json({ message: 'Failed to update student.' });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const schoolId = req.schoolId;

    const student = await User.findOneAndDelete({ 
      _id: id, 
      schoolId, 
      role: 'student' 
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found or you do not have permission to delete.' });
    }

    res.json({ message: 'Student deleted successfully.' });
  } catch (err) {
    console.error('Delete Student Error:', err);
    res.status(500).json({ message: 'Failed to delete student.' });
  }
};
