import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');  // 'user' or 'admin'
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Basic form validation
    if (!email || !password) {
      setErrorMessage('Both email and password are required.');
      console.log("Email:", email, "Password:", password); // Log to check the values
      return;
    }
  
    try {
      setLoading(true); // Set loading to true when the request is sent
  
      // Log the data being sent
      console.log({ email, password }); // This will log the data being sent
  
      // API endpoint based on role (user or admin)
      const endpoint = role === 'admin' 
        ? 'http://localhost:4001/api/admin/login' 
        : 'http://localhost:4001/api/user/login';
  
      // Send login request
      const response = await axios.post(endpoint, { email, password });
  
      if (response.data.token) {
        // Save JWT token in localStorage
        localStorage.setItem('token', response.data.token); 
  
        // Redirect based on role
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      } else {
        setErrorMessage('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.log(error);  // Log the full error object for further insights
      setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false); // Reset loading state after the request
    }
  };
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-4 py-2 rounded-md w-full"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-4 py-2 rounded-md w-full"
            required
          />
        </div>

        {/* Role selection for login */}
        <div className="mb-4">
          <label>
            <input
              type="radio"
              name="role"
              value="user"
              checked={role === 'user'}
              onChange={() => setRole('user')}
            />
            User
          </label>
          <label className="ml-4">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === 'admin'}
              onChange={() => setRole('admin')}
            />
            Admin
          </label>
        </div>

        {errorMessage && <p className="text-red-600">{errorMessage}</p>}

        <div className="mt-4">
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
