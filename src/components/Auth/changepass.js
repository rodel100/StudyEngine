import '../../index.css'
import React, { useState } from 'react';

const ChangePasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token] = useState(''); // Assume token is passed via query params

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password })
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Your password has been successfully reset.');
      } else {
        setMessage('Failed to reset password. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-10 py-6 mt-4 text-left bg-white shadow-lg" style={{ maxWidth: '400px' }}>
        <h3 className="text-2xl font-bold text-center">Change Password</h3>
        <form onSubmit={handleChangePassword}>
          <div className="mt-4">
            <label htmlFor="password" className="block">New Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="confirmPassword" className="block">Confirm New Password</label>
            <input 
              type="password" 
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div className="mt-6">
            <button type="submit" className="w-full px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
              Change Password
            </button>
          </div>
          {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
