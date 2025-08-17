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
  entryTime: { 
    type: Date 
  },
  exitTime: { 
    type: Date 
  },
  // Legacy field for backward compatibility
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

// Pre-save middleware to handle data migration and validation
AttendanceSchema.pre('save', function(next) {
  // Handle migration from old schema
  if (this.userId && !this.user) {
    this.user = this.userId;
  }
  if (this.timestamp && !this.entryTime && !this.exitTime) {
    this.entryTime = this.timestamp;
    this.date = AttendanceSchema.statics.getDateOnly(this.timestamp);
  }
  
  // Set date based on entryTime or exitTime
  if (!this.date) {
    if (this.entryTime) {
      this.date = AttendanceSchema.statics.getDateOnly(this.entryTime);
    } else if (this.exitTime) {
      this.date = AttendanceSchema.statics.getDateOnly(this.exitTime);
    }
  }
  
  next();
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
