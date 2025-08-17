const express = require('express');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { authMiddleware, adminOrMentorMiddleware, optionalAuthMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /attendance - Record attendance with entry/exit logic
router.post('/', async (req, res) => {
  try {
    const { rfidTag, timestamp } = req.body;
    
    console.log('RFID Tag: ', rfidTag);
    // Find user by RFID tag
    const user = await User.findOne({ rfidTag });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is active
    if (user.status === 'inactive') {
      return res.status(403).json({ 
        error: 'User account is inactive. Attendance not recorded.',
        user: {
          id: user._id,
          name: user.name,
          status: user.status
        }
      });
    }
    
    // Parse timestamp or use current time
    const currentTime = timestamp ? new Date(timestamp) : new Date();
    const dateOnly = Attendance.getDateOnly(currentTime);
    
    // Check if attendance record exists for today
    let attendance = await Attendance.findOne({
      user: user._id,
      date: dateOnly
    });
    
    if (!attendance) {
      // No record exists - create new entry
      attendance = new Attendance({
        user: user._id,
        date: dateOnly,
        entryTime: currentTime,
        // Legacy fields for backward compatibility
        userId: user._id,
        timestamp: currentTime
      });
      
      await attendance.save();
      
      return res.status(201).json({ 
        message: 'Entry time recorded successfully',
        type: 'entry',
        attendance: {
          id: attendance._id,
          userId: user._id,
          userName: user.name,
          userRole: user.role,
          date: dateOnly,
          entryTime: currentTime,
          exitTime: null
        }
      });
    } 
    else if (attendance.entryTime && !attendance.exitTime) {
      // Entry exists but no exit - record exit
      attendance.exitTime = currentTime;
      await attendance.save();
      
      return res.status(200).json({ 
        message: 'Exit time recorded successfully',
        type: 'exit',
        attendance: {
          id: attendance._id,
          userId: user._id,
          userName: user.name,
          userRole: user.role,
          date: dateOnly,
          entryTime: attendance.entryTime,
          exitTime: currentTime
        }
      });
    }
    else {
      // Both entry and exit already recorded
      return res.status(400).json({ 
        message: 'Already logged entry and exit today',
        type: 'complete',
        attendance: {
          id: attendance._id,
          userId: user._id,
          userName: user.name,
          userRole: user.role,
          date: dateOnly,
          entryTime: attendance.entryTime,
          exitTime: attendance.exitTime
        }
      });
    }
    
  } catch (error) {
    console.error('Attendance recording error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /attendance/manual - Manual attendance recording with type selection
router.post('/manual', authMiddleware, adminOrMentorMiddleware, async (req, res) => {
  try {
    const { userId, timestamp, type } = req.body;
    
    // Validate inputs
    if (!userId || !timestamp || !type) {
      return res.status(400).json({ error: 'userId, timestamp, and type are required' });
    }

    if (!['entry', 'exit'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either "entry" or "exit"' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is active
    if (user.status === 'inactive') {
      return res.status(403).json({ 
        error: 'User account is inactive. Attendance not recorded.',
        user: {
          id: user._id,
          name: user.name,
          status: user.status
        }
      });
    }
    
    const recordTime = new Date(timestamp);
    const dateOnly = Attendance.getDateOnly(recordTime);
    
    // Find or create attendance record for this date
    let attendance = await Attendance.findOne({
      user: userId,
      date: dateOnly
    });
    
    if (!attendance) {
      if (type === 'exit') {
        return res.status(400).json({ 
          error: 'Cannot record exit time without entry time',
          type: 'validation_error'
        });
      }
      
      // Create new attendance record with entry time
      attendance = new Attendance({
        user: userId,
        date: dateOnly,
        entryTime: recordTime,
        // Legacy fields for backward compatibility
        userId: userId,
        timestamp: recordTime
      });
    } else {
      // Update existing record
      if (type === 'entry') {
        if (attendance.entryTime) {
          return res.status(400).json({ 
            error: 'Entry time already recorded for this date',
            type: 'already_exists',
            attendance: {
              id: attendance._id,
              entryTime: attendance.entryTime,
              exitTime: attendance.exitTime
            }
          });
        }
        attendance.entryTime = recordTime;
        // Update legacy timestamp
        attendance.timestamp = recordTime;
      } else if (type === 'exit') {
        if (!attendance.entryTime) {
          return res.status(400).json({ 
            error: 'Cannot record exit time without entry time',
            type: 'validation_error'
          });
        }
        if (attendance.exitTime) {
          return res.status(400).json({ 
            error: 'Exit time already recorded for this date',
            type: 'already_exists',
            attendance: {
              id: attendance._id,
              entryTime: attendance.entryTime,
              exitTime: attendance.exitTime
            }
          });
        }
        attendance.exitTime = recordTime;
      }
    }
    
    await attendance.save();
    
    // Prepare response
    const response = {
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} time recorded successfully`,
      type: type,
      attendance: {
        id: attendance._id,
        userId: user._id,
        userName: user.name,
        userRole: user.role,
        date: dateOnly,
        entryTime: attendance.entryTime,
        exitTime: attendance.exitTime
      }
    };
    
    res.status(type === 'entry' && !attendance.exitTime ? 201 : 200).json(response);
    
  } catch (error) {
    console.error('Manual attendance recording error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /attendance/today - Get today's attendance logs with entry/exit times
router.get('/today', optionalAuthMiddleware, async (req, res) => {
  try {
    // Get start and end of today
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    // Find attendance records for today using new schema
    let attendanceRecords = await Attendance.find({
      date: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    }).populate('user', 'name rfidTag role status').sort({ entryTime: -1 });
    
    // If no records found with new schema, try legacy schema for backward compatibility
    if (attendanceRecords.length === 0) {
      const legacyRecords = await Attendance.find({
        timestamp: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      }).populate('userId', 'name rfidTag role status').sort({ timestamp: -1 });
      
      // Convert legacy records to new format
      attendanceRecords = legacyRecords.map(record => ({
        _id: record._id,
        user: record.userId,
        date: startOfDay,
        entryTime: record.timestamp,
        exitTime: null,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt
      }));
    }
    
    // Filter out records for inactive users if not admin/mentor
    let filteredRecords = attendanceRecords;
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'mentor')) {
      filteredRecords = attendanceRecords.filter(record => 
        record.user && record.user.status === 'active'
      );
    }
    
    // Format response to include both entry and exit times
    const formattedRecords = filteredRecords.map(record => ({
      id: record._id,
      name: record.user.name,
      rfidTag: record.user.rfidTag,
      role: record.user.role,
      status: record.user.status,
      entryTime: record.entryTime,
      exitTime: record.exitTime,
      // Legacy timestamp for backward compatibility
      timestamp: record.entryTime
    }));
    
    res.json(formattedRecords);
    
  } catch (error) {
    console.error('Get today attendance error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /attendance/history - Get attendance history with filters (updated for entry/exit)
router.get('/history', authMiddleware, adminOrMentorMiddleware, async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      userId, 
      page = 1, 
      limit = 50,
      status = 'active'
    } = req.query;
    
    // Build date filter for both new and legacy schema
    const dateFilter = {};
    if (startDate || endDate) {
      const timeFilter = {};
      if (startDate) {
        timeFilter.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        timeFilter.$lte = end;
      }
      
      dateFilter.$or = [
        { date: timeFilter },
        { timestamp: timeFilter }
      ];
    }
    
    // Build main filter
    const filter = {};
    if (Object.keys(dateFilter).length > 0) {
      filter.$and = [dateFilter];
    }
    if (userId) {
      filter.$or = [
        { user: userId },
        { userId: userId } // Legacy support
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build aggregation pipeline for new schema
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'legacyUserInfo'
        }
      },
      {
        $addFields: {
          user: {
            $cond: {
              if: { $gt: [{ $size: '$userInfo' }, 0] },
              then: { $arrayElemAt: ['$userInfo', 0] },
              else: { $arrayElemAt: ['$legacyUserInfo', 0] }
            }
          }
        }
      },
      {
        $match: {
          'user.status': status
        }
      },
      {
        $project: {
          date: { $ifNull: ['$date', { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }] },
          entryTime: { $ifNull: ['$entryTime', '$timestamp'] },
          exitTime: 1,
          userId: '$user._id',
          userName: '$user.name',
          userEmail: '$user.email',
          userRole: '$user.role',
          userRfidTag: '$user.rfidTag',
          userStatus: '$user.status',
          // Legacy timestamp for backward compatibility
          timestamp: { $ifNull: ['$entryTime', '$timestamp'] }
        }
      },
      { $sort: { date: -1, entryTime: -1, timestamp: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) }
    ];
    
    const attendanceRecords = await Attendance.aggregate(pipeline);
    
    // Get total count for pagination
    const countPipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'legacyUserInfo'
        }
      },
      {
        $addFields: {
          user: {
            $cond: {
              if: { $gt: [{ $size: '$userInfo' }, 0] },
              then: { $arrayElemAt: ['$userInfo', 0] },
              else: { $arrayElemAt: ['$legacyUserInfo', 0] }
            }
          }
        }
      },
      {
        $match: {
          'user.status': status
        }
      },
      { $count: 'total' }
    ];
    
    const countResult = await Attendance.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;
    
    res.json({
      attendance: attendanceRecords,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        limit: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Get attendance history error:', error);
    res.status(500).json({ error: 'Server error while fetching attendance history' });
  }
});

// GET /attendance/user/:userId - Get attendance for specific user (updated for entry/exit)
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate, page = 1, limit = 20 } = req.query;
    
    // Check if user can access this data
    if (req.user.role !== 'admin' && req.user.role !== 'mentor' && req.user.id !== userId) {
      return res.status(403).json({ error: 'Access denied. You can only view your own attendance.' });
    }
    
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Build date filter for both new and legacy schema
    const dateFilter = { 
      $or: [
        { user: userId },
        { userId: userId } // Legacy support
      ]
    };
    
    if (startDate || endDate) {
      const timeFilter = {};
      if (startDate) {
        timeFilter.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        timeFilter.$lte = end;
      }
      
      dateFilter.$and = [
        {
          $or: [
            { date: timeFilter },
            { timestamp: timeFilter }
          ]
        }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get attendance records
    const attendanceRecords = await Attendance.find(dateFilter)
      .sort({ date: -1, entryTime: -1, timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count
    const total = await Attendance.countDocuments(dateFilter);
    
    // Format records for consistent response
    const formattedRecords = attendanceRecords.map(record => ({
      id: record._id,
      date: record.date || Attendance.getDateOnly(record.timestamp),
      entryTime: record.entryTime || record.timestamp,
      exitTime: record.exitTime,
      // Legacy timestamp for backward compatibility
      timestamp: record.entryTime || record.timestamp
    }));
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      attendance: formattedRecords,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        limit: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Get user attendance error:', error);
    res.status(500).json({ error: 'Server error while fetching user attendance' });
  }
});

// GET /attendance/stats - Get attendance statistics
router.get('/stats', authMiddleware, adminOrMentorMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.timestamp = {};
      if (startDate) {
        dateFilter.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.timestamp.$lte = end;
      }
    }
    
    // Get total attendance records
    const totalAttendance = await Attendance.countDocuments(dateFilter);
    
    // Get unique users who attended
    const uniqueAttendees = await Attendance.distinct('userId', dateFilter);
    const uniqueAttendeesCount = uniqueAttendees.length;
    
    // Get attendance by day
    const attendanceByDay = await Attendance.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day'
            }
          },
          attendanceCount: '$count',
          uniqueUsersCount: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { date: -1 } },
      { $limit: 30 } // Last 30 days
    ]);
    
    res.json({
      totalAttendance,
      uniqueAttendeesCount,
      attendanceByDay
    });
    
  } catch (error) {
    console.error('Get attendance stats error:', error);
    res.status(500).json({ error: 'Server error while fetching attendance statistics' });
  }
});

// DELETE /attendance/:id - Delete attendance record (admin only)
router.delete('/:id', authMiddleware, adminOrMentorMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const attendance = await Attendance.findById(id).populate('userId', 'name email');
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    await Attendance.findByIdAndDelete(id);
    
    res.json({
      message: 'Attendance record deleted successfully',
      deletedRecord: {
        id: attendance._id,
        userName: attendance.userId.name,
        timestamp: attendance.timestamp
      }
    });
    
  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(500).json({ error: 'Server error while deleting attendance record' });
  }
});

// GET /attendance/my - Get current user's attendance records
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 20 } = req.query;
    const userId = req.user.id;
    
    // Build date filter
    const dateFilter = { 
      $or: [
        { user: userId },
        { userId: userId } // Legacy support
      ]
    };
    
    if (startDate || endDate) {
      const timeFilter = {};
      if (startDate) {
        timeFilter.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        timeFilter.$lte = end;
      }
      
      // Apply to both new and legacy schema
      dateFilter.$and = [
        {
          $or: [
            { date: timeFilter },
            { timestamp: timeFilter }
          ]
        }
      ];
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get attendance records
    const attendanceRecords = await Attendance.find(dateFilter)
      .sort({ date: -1, entryTime: -1, timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count
    const total = await Attendance.countDocuments(dateFilter);
    
    // Format records for consistent response
    const formattedRecords = attendanceRecords.map(record => ({
      id: record._id,
      date: record.date || Attendance.getDateOnly(record.timestamp),
      entryTime: record.entryTime || record.timestamp,
      exitTime: record.exitTime,
      // Legacy timestamp for backward compatibility
      timestamp: record.entryTime || record.timestamp
    }));
    
    res.json({
      attendance: formattedRecords,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        limit: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Get my attendance error:', error);
    res.status(500).json({ error: 'Server error while fetching your attendance' });
  }
});

module.exports = router;
