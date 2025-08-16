const mongoose = require('mongoose');

const scheduleSlotSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
  },
  weekday: {
    type: Number, // 0 = Sunday, 6 = Saturday
    required: true,
    min: 0,
    max: 6,
  },
  periodIndex: {
    type: Number, // 0 = Period 1, 1 = Period 2, etc.
    required: true,
    min: 0,
  },
  subject: {
    type: String,
    required: true,
  },
  classSection: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

// Ensure unique constraint on teacherId, weekday, and periodIndex
scheduleSlotSchema.index({ teacherId: 1, weekday: 1, periodIndex: 1 }, { unique: true });

module.exports = mongoose.model('ScheduleSlot', scheduleSlotSchema);

// This module defines the ScheduleSlot model for MongoDB using Mongoose.
// It includes fields for teacher ID, school ID, weekday, period index, subject, and
// class section. It also sets up a unique index to prevent duplicate schedule slots
// for the same teacher on the same weekday and period index.
// The model is exported for use in other parts of the application.
