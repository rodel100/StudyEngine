import '../../index.css';
import React, { useEffect, useState } from 'react';

const RegistrationPage = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [usernameError, setUsernameError] = useState('');  // State for username validation error
  const [passwordError, setPasswordError] = useState('');  // State for password validation error
  const [emailError, setEmailError] = useState('');  // State for email validation error
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [firstnameError, setFirstNameError] = useState('');
  const [lastnameError, setLastNameError] = useState('');

  const handleRegistration = async (event) => {
    event.preventDefault(); // Prevent form submission if validation fails
    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password);

    if (isUsernameValid && isPasswordValid) {
      try {
        // If both validations pass, handle the registration logic
        const response = await fetch(`http://localhost:8000/auth/register`, {
          mode: 'cors',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: username, password: password, email: email, firstName: firstname, lastName: lastname }),
        });
    
        // Check if the response is ok (status code 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log('Success:', data);
        window.alert('User registered successfully');
        window.location.href = '/';
      } catch (error) {
        // Handle fetch errors and display meaningful messages
        console.error('Error:', error.message);
        window.alert(`Registration failed: ${error.message || error}`);
      }
    }
  };

  const validateUsername = (username) => {
    if (username.length < 7) {
      setUsernameError('Username must be > 6 characters.');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const validatePassword = (password) => {
    if (password.length < 7) {
      return false;
    }
    setPasswordError('');
    return true;  
  };
  const validateEmail = (email) => {
    if (email.length < 7) {
      return false;
    }
    setEmailError('');
    return true;  
  }
  const validateFirstName = (firstname) => {
    if (firstname.length < 2) {
      return false;
    }
    setFirstNameError('');
    return true;  
  }
  const validateLastName = (lastname) => {
    if (lastname.length < 2) {
      return false;
    }
    setLastNameError('');
    return true;  
  }
  useEffect(() => {
    username.length > 0 && validateUsername(username);
    password.length > 0 && validatePassword(password);
    email.length > 0 && validateEmail(email);
    firstname.length > 0 && validateFirstName(firstname);
    lastname.length > 0 && validateLastName(lastname);
  }
  , [username, password , email, firstname, lastname]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-10 py-6 mt-4 text-left bg-white shadow-lg" style={{ maxWidth: '600px' }}>
        <h3 className="text-2xl font-bold text-center">Create Account</h3>
        <form onSubmit={handleRegistration}>
          {/* Make a first name and last name */}
          <div className="mt-4">
            <label className="block">First Name</label>
            <input
              type="text"
              placeholder="Enter your First Name"
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {firstnameError && <p className="text-red-600 text-sm mt-1">{firstnameError}</p>}
          </div>
          <div className="mt-4">
            <label className="block">Last Name</label>
            <input
              type="text"
              placeholder="Enter your Last Name"
              id="lastname"
              value={lastname}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {lastnameError && <p className="text-red-600 text-sm mt-1">{lastnameError}</p>}
          </div>
          <div className="mt-4">
            <label className="block">Username</label>
            <input
              type="text"
              placeholder="Enter your Username"
              id="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {/* Display username error */}
            {usernameError && <p className="text-red-600 text-sm mt-1">{usernameError}</p>}
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
            {/* Display password error */}
            {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              id="email"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
          </div>
          <div className="flex flex-col items-center justify-between mt-6">
            <button type="submit" className="w-full px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
              Register
            </button>
            <a href="/login" className="mt-4 text-sm text-blue-600 hover:underline">Already have an account? Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
