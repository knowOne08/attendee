const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  }, // store only date without time for grouping
  sessions: [{
    entryTime: { 
      type: Date,
      required: true
    },
    exitTime: { 
      type: Date 
    },
    autoExitSet: {
      type: Boolean,
      default: false
    }
  }],
  // Legacy fields for backward compatibility
  entryTime: { 
    type: Date 
  },
  exitTime: { 
    type: Date 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  timestamp: { 
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
AttendanceSchema.index({ user: 1, date: -1 });
AttendanceSchema.index({ date: -1 });
// Legacy indexes for backward compatibility
AttendanceSchema.index({ userId: 1, timestamp: -1 });
AttendanceSchema.index({ timestamp: -1 });

// Helper method to get date without time for grouping
AttendanceSchema.statics.getDateOnly = function(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

// Method to auto-set exit times at 9 PM for incomplete sessions
AttendanceSchema.statics.autoSetExitTimes = async function() {
  const now = new Date();
  const today = this.getDateOnly(now);
  const ninePM = new Date(today);
  ninePM.setHours(21, 0, 0, 0); // 9 PM

  // Only run if it's past 9 PM
  if (now < ninePM) {
    return { message: 'Not yet 9 PM, no auto-exit needed' };
  }

  try {
    // Find all attendance records for today with incomplete sessions
    const attendanceRecords = await this.find({
      date: today,
      'sessions.exitTime': null
    });

    let updatedCount = 0;

    for (let record of attendanceRecords) {
      let updated = false;
      
      for (let session of record.sessions) {
        if (!session.exitTime) {
          // Set exit time to the entry time (as requested)
          session.exitTime = session.entryTime;
          session.autoExitSet = true;
          updated = true;
        }
      }
      
      if (updated) {
        await record.save();
        updatedCount++;
      }
    }

    return { 
      message: `Auto-exit completed for ${updatedCount} attendance records`,
      updatedCount 
    };
  } catch (error) {
    throw new Error(`Auto-exit failed: ${error.message}`);
  }
};

// Pre-save middleware to handle data migration and validation
AttendanceSchema.pre('save', function(next) {
  // Handle migration from old schema
  if (this.userId && !this.user) {
    this.user = this.userId;
  }
  
  // Migrate old single entry/exit to sessions array
  if ((this.entryTime || this.timestamp) && (!this.sessions || this.sessions.length === 0)) {
    const entryTime = this.entryTime || this.timestamp;
    const session = {
      entryTime: entryTime,
      exitTime: this.exitTime || null,
      autoExitSet: false
    };
    this.sessions = [session];
    this.date = AttendanceSchema.statics.getDateOnly(entryTime);
  }
  
  // Ensure sessions have proper entry times and update legacy fields for compatibility
  if (this.sessions && this.sessions.length > 0) {
    // Update legacy fields with first session for backward compatibility
    this.entryTime = this.sessions[0].entryTime;
    this.exitTime = this.sessions[this.sessions.length - 1].exitTime;
    this.timestamp = this.sessions[0].entryTime;
    
    // Set date based on first session entry time
    if (!this.date) {
      this.date = AttendanceSchema.statics.getDateOnly(this.sessions[0].entryTime);
    }
  }
  
  next();
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
