import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Attendance from './components/Attendance';
import AttendanceHistory from './components/AttendanceHistory';
import ManualAttendance from './components/ManualAttendance';
import Members from './components/Members';
import UserDetail from './components/UserDetail';
import Signup from './components/Signup';
import SystemStatus from './components/SystemStatus';
import DeviceAdmin from './components/DeviceAdmin';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-white">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<><Navigation /><Login /></>} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/attendance" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Navigation />
                    <Attendance />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/members" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Navigation />
                    <Members />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/signup" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Navigation />
                    <Signup />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/attendance/history" 
                element={
                  <ProtectedRoute mentorOrAdminOnly={true}>
                    <Navigation />
                    <AttendanceHistory />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/attendance/manual" 
                element={
                  <ProtectedRoute mentorOrAdminOnly={true}>
                    <Navigation />
                    <ManualAttendance />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/user/:id" 
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <UserDetail />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/system-status" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Navigation />
                    <SystemStatus />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/device-admin" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <Navigation />
                    <DeviceAdmin />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Page */}
              <Route 
                path="*" 
                element={
                  <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="max-w-md w-full mx-auto px-6 text-center">
                      <h1 className="text-lg font-medium text-black tracking-tight mb-4">
                        Page Not Found
                      </h1>
                      <p className="text-xs text-gray-400 tracking-wider uppercase">
                        The page you're looking for doesn't exist
                      </p>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
