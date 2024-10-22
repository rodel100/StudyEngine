import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Dashboard from './components/dashboard';
import Login from './components/Auth/login';
import Register from './components/Auth/register';
import ForgetPassword from './components/Auth/forgotpass';
import ChangePassword from './components/Auth/changepass';
import Questions from './components/questions';
import StudyGroupQuestions from './components/StudyGroupComponents/StudyGroupQuestions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="*" element={<Login />} />
        <Route path="/studygroup-questions" element={<StudyGroupQuestions />} />
      </Routes>
    </Router>
  );
}

export default App;
