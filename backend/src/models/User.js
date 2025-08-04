const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  schoolId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'School',
  required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    default: 'teacher',
  },
  classSection: {
    type: String,
    required: function() { return this.role === 'student'; },
  },
  rollNumber: {
    type: String,
    required: function() { return this.role === 'student'; },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
// This module defines a Mongoose schema for a User model.
// It includes fields for name, email, password, role, and active status.
// The schema is exported as a Mongoose model for use in other parts of the application.
// The 'timestamps' option automatically adds createdAt and updatedAt fields.
// The 'role' field can be either 'admin' or 'teacher', with 'teacher' as the default.
// The 'isActive' field indicates whether the user is currently active, defaulting to true.
// The 'email' field is unique and will be stored in lowercase.
// The 'name' field is trimmed to remove any leading or trailing whitespace.
// The 'password' field is required but not hashed in this schema; hashing should be handled separately before saving the user.
// This schema is used to create and manage user accounts in the application.
// The 'userSchema' defines the structure of user documents in the MongoDB database.
