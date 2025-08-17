import React from 'react';

const AttendanceTable = ({ attendanceData, loading, error, showUserInfo = true }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '--';
    console.log(timestamp);
    console.log(new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata'

    }));
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const isComplete = (record) => {
    return record.entryTime && record.exitTime;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-1 h-1 bg-black animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center">
        <p className="text-xs text-gray-400 tracking-wider uppercase">Error</p>
      </div>
    );
  }

  if (!attendanceData || attendanceData.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-xs text-gray-400 tracking-wider uppercase">No entries</p>
      </div>
    );
  }

  return (
    <div className="space-y-px">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b border-gray-200 text-xs text-gray-400 tracking-wider uppercase">
        {showUserInfo && <div className="flex-1">Name</div>}
        <div className="w-20 text-center">Entry</div>
        <div className="w-20 text-center">Exit</div>
        <div className="w-8"></div> {/* For complete indicator */}
      </div>

      {/* Attendance Records */}
      {attendanceData.map((record, index) => {
        const complete = isComplete(record);
        const userName = record.name || record.userId?.name || 'Unknown';
        const userRole = record.role || record.userId?.role;
        
        return (
          <div 
            key={record._id || record.id || index} 
            className={`flex items-center justify-between py-6 border-b border-gray-100 last:border-b-0 group hover:bg-gray-50/50 transition-colors duration-200 ${
              complete ? 'bg-green-50/30' : ''
            }`}
          >
            {showUserInfo && (
              <div className="flex-1 flex items-center space-x-4">
                <div className="w-2 h-2 bg-black rounded-full opacity-60"></div>
                <div>
                  <p className="text-sm font-medium text-black tracking-tight">
                    {userName}
                  </p>
                  {userRole && (
                    <p className="text-xs text-gray-400 tracking-wider uppercase mt-1">
                      {userRole}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div className="w-20 text-center">
              <p className="text-xs text-gray-900 tracking-wider font-mono">
                {formatTime(record.entryTime || record.timestamp)}
              </p>
            </div>
            
            <div className="w-20 text-center">
              <p className={`text-xs tracking-wider font-mono ${
                record.exitTime ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {record.exitTime ? formatTime(record.exitTime) : 'Not yet logged'}
              </p>
            </div>
            
            <div className="w-8 flex justify-center">
              {complete && (
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttendanceTable;
