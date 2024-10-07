import '../../index.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RegistrationPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [numQuestions, setNumQuestions] = useState(1);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleRegistration = (event) => {
    event.preventDefault();
    if (validateEmail(email) && validatePassword(password)) {
      // If both validations pass, handle the registration logic
      console.log('Registering:', email, password, frequency, numQuestions);
    } else {
      // Optionally display an error message
      console.error('Validation failed.');
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    // Ensure password is at least 8 characters long and contains a number
    return password.length >= 8 && /\d/.test(password);
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-10 py-6 mt-4 text-left bg-white shadow-lg" style={{ maxWidth: '600px' }}>
        <h3 className="text-2xl font-bold text-center">Create Account</h3>
        <form onSubmit={handleRegistration}>
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
          <div className="mt-4">
            <label className="block" htmlFor="password">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <p className="mt-2 text-xs text-gray-500">
              Password must be at least 8 characters long and contain a number.
            </p>
          </div>
          <div className="mt-4">
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
              Email Frequency:
            </label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700">
              Number of Questions:
            </label>
            <input
              type="number"
              id="numQuestions"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              min="1"
              className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex flex-col items-center justify-between mt-6">
            <button type="submit" className="w-full px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
              Register
            </button>
            <button type="button" onClick={handleLoginRedirect} className="mt-4 text-sm text-blue-600 hover:underline">
              Already have an account? Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
