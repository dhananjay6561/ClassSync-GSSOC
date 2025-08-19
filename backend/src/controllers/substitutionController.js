const Substitution = require('../models/Substitution');
const ScheduleSlot = require('../models/ScheduleSlot');
const User = require('../models/User');
const { generateSubstitutionsForLeave } = require('../services/substitutionEngine');

// Teacher: Get their substitutions
exports.getMySubstitutions = async (req, res) => {
  try {
    

    const subs = await Substitution.find({ substituteTeacherId: req.user._id })
      .populate('originalTeacherId', 'name email')
      .populate('substituteTeacherId', 'name email')
      .populate({
        path: 'scheduleSlotId',
        select: 'weekday periodIndex subject classSection',
      })
      .sort({ assignedAt: -1 });

    res.json(subs);
  } catch (err) {
    console.error('getMySubstitutions error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin: Get all substitutions in their school
exports.getAllSubstitutions = async (req, res) => {
  try {
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 30;

    const total = await Substitution.countDocuments({ schoolId: req.schoolId });

    const subs = await Substitution.find({ schoolId: req.schoolId })
      .populate('originalTeacherId', 'name email')
      .populate('substituteTeacherId', 'name email')
      .populate('scheduleSlotId')
      .sort({ assignedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      substitutions: subs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('getAllSubstitutions error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin: Get substitution history with optional date range and pagination
exports.getSubstitutionHistory = async (req, res) => {
  try {
    const schoolId = req.schoolId;
    const { from, to, page = 1, limit = 10 } = req.query;

    // Build date filter
    const dateFilter = {};
    if (from) dateFilter.createdAt = { $gte: new Date(from) };
    if (to) dateFilter.createdAt = { ...dateFilter.createdAt, $lte: new Date(to) };

    // Total records count (for pagination)
    const total = await Substitution.countDocuments({
       ...dateFilter,
       schoolId: schoolId
    });

    // Fetch paginated substitutions
    const substitutions = await Substitution.find({
      ...dateFilter,
      schoolId
    })
      .populate('originalTeacherId', 'name email')
      .populate('substituteTeacherId', 'name email')
      .populate('scheduleSlotId')
      .sort({ assignedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Filter by school
    const filtered = substitutions.filter(sub => 
      sub.scheduleSlotId?.schoolId?.toString() === schoolId.toString()
    );

    // Map for frontend
    const result = filtered.map(sub => ({
      date: (sub.date || sub.assignedAt || sub.createdAt)?.toISOString().split('T')[0] || 'N/A',
      period: sub.scheduleSlotId?.periodIndex + 1,
      weekday: sub.scheduleSlotId?.weekday,
      subject: sub.scheduleSlotId?.subject,
      classSection: sub.scheduleSlotId?.classSection,
      reason: sub.reason,
      originalTeacher: {
        name: sub.originalTeacherId?.name || 'N/A',
        email: sub.originalTeacherId?.email || 'N/A'
      },
      substituteTeacher: {
        name: sub.substituteTeacherId?.name || 'N/A',
        email: sub.substituteTeacherId?.email || 'N/A'
      }
    }));

    res.json({
      count: result.length, // records in this page
      total,                // total records in DB
      page: Number(page),
      limit: Number(limit),
      history: result
    });

  } catch (err) {
    console.error('Substitution History Error:', err);
    res.status(500).json({ message: 'Failed to fetch substitution history' });
  }
};


// Admin: Generate substitutions for a leave request
exports.generateSubstitutions = async (req, res) => {
  try {
    const { leaveRequestId, teacherId, fromDate, toDate, schoolId } = req.body;

    // Validate required fields
    if (!teacherId || !fromDate || !toDate || !schoolId) {
      return res.status(400).json({ 
        message: 'Missing required fields: teacherId, fromDate, toDate, schoolId' 
      });
    }

    console.log('Generating substitutions for leave request:')

    // Create a mock leave request object for the service
    const leaveRequest = {
      _id: leaveRequestId,
      teacherId,
      fromDate,
      toDate,
      schoolId
    };

    console.log('Leave Request:');

    // Generate substitutions using your existing service
    const substitutions = await generateSubstitutionsForLeave(leaveRequest);

    // Check for conflicts (classes that couldn't be covered)
    const totalSlotsNeeded = await ScheduleSlot.countDocuments({ 
      teacherId, 
      schoolId 
    });
    
    const conflicts = [];
    if (substitutions.length < totalSlotsNeeded) {
      // You might want to implement logic to identify specific conflicts
      conflicts.push({
        message: `${totalSlotsNeeded - substitutions.length} classes need manual assignment`
      });
    }

    console.log('Substitutions generated:', substitutions.length);

    res.json({
      success: true,
      substitutions: substitutions.map(sub => ({
        id: sub.sub._id,
        originalTeacher: sub.substitute.name,
        subject: sub.slot.subject,
        classSection: sub.slot.classSection,
        date: sub.date,
        period: sub.slot.periodIndex + 1
      })),
      conflicts,
      message: `Successfully arranged coverage for ${substitutions.length} classes`
    });

  } catch (error) {
    console.error('Generate substitutions error:', error);
    
    res.status(500).json({ 
      message: 'Failed to generate substitutions',
      error: error.message 
    });
  }
};

// Admin: Override a substitution (change the cover teacher)
exports.overrideSubstitution = async (req, res) => {
  try {
    const { substitutionId, newSubstituteId, reason } = req.body;
    const schoolId = req.schoolId;

    if (!substitutionId || !newSubstituteId) {
      return res.status(400).json({ message: 'Missing substitutionId or newSubstituteId' });
    }

    const substitution = await Substitution.findOne({ _id: substitutionId, schoolId });
    if (!substitution) {
      return res.status(404).json({ message: 'Substitution not found' });
    }

    substitution.substituteTeacherId = newSubstituteId;
    substitution.reason = reason || substitution.reason;
    await substitution.save();

    res.json({ message: 'Substitution updated successfully.' });
  } catch (err) {
    console.error('Override substitution error:', err);
    res.status(500).json({ message: 'Failed to override substitution' });
  }
};



//This code defines two functions for managing teacher substitutions in a school system.
// The `getMySubstitutions` function retrieves all substitutions for the currently logged-in teacher.
// It populates the original teacher's details and the schedule slot information, sorting the results by the assignment date.
// The `getAllSubstitutions` function retrieves all substitutions in the school, populating both the original and substitute teacher details,
// as well as the schedule slot information. It also sorts the results by the assignment date.
// The functions handle errors and respond with appropriate status codes and messages.
// The `getMySubstitutions` function retrieves a teacher's substitutions, populating original teacher and schedule slot details.
// The `getAllSubstitutions` function retrieves all substitutions in a school, populating both original and substitute teacher details.
// The functions use Mongoose to query the `Substitution` model and populate related fields.