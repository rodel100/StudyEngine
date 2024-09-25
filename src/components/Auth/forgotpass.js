import '../../index.css'
import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleResetRequest = async (event) => {
    event.preventDefault();
    // Call to backend API to initiate password reset process
    try {
      const response = await fetch('/api/request-password-reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.success) {
        setMessage('A password reset link has been sent to your email address.');
      } else {
        setMessage('Failed to send password reset email. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-10 py-6 mt-4 text-left bg-white shadow-lg" style={{ maxWidth: '400px' }}>
        <h3 className="text-2xl font-bold text-center">Forgot Password</h3>
        <p className="mt-2 text-center">Enter your email address and we will send you a link to reset your password.</p>
        <form onSubmit={handleResetRequest}>
          <div className="mt-4">
            <label className="block" htmlFor="email">Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div className="mt-6">
            <button type="submit" className="w-full px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
              Send Reset Link
            </button>
          </div>
          {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
