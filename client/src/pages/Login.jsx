import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    if (storedToken && storedRole) {
      const route =
        storedRole === 'ADMIN'
          ? '/admin/dashboard'
          : storedRole === 'VENDOR'
          ? '/vendor/dashboard'
          : '/customer/dashboard';
      navigate(route);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear previous errors

    // Simple input validation
    if (!email || !password) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4001';
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      const { role, token } = response.data;

      // Save the token and role in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Optional callback for parent component
      onLogin(token);

      // Navigate to the respective dashboard
      switch (role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'VENDOR':
          navigate('/vendor/dashboard');
          break;
        case 'CUSTOMER':
        default:
          navigate('/customer/dashboard');
          break;
      }
    } catch (error) {
      if (!error.response) {
        setError('Network error, please try again later');
      } else {
        setError(error.response?.data?.message || 'Invalid credentials, please try again!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="background-3d"></div>
      <div className="content">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-md transition duration-200 ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
