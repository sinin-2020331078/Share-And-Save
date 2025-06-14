import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await signup(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      navigate('/home');
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left side - Welcome Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-amber-500 items-center justify-center p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-0"></div>
        <div className="max-w-md text-center text-white z-10">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-6"
          >
            Welcome to Share & Save
          </motion.h1>
          <motion.p 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl mb-8 opacity-90"
          >
            Join our community to share, save, and make a difference
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <FeatureItem 
              icon={<FaUser className="text-amber-200" />} 
              text="Create your account in minutes" 
            />
            <FeatureItem 
              icon={<FaEnvelope className="text-amber-200" />} 
              text="Get access to exclusive deals" 
            />
            <FeatureItem 
              icon={<FaLock className="text-amber-200" />} 
              text="Secure and private platform" 
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Right side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <FaUser className="text-orange-500 text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md"
            >
              <div className="flex">
                <div className="flex-shrink-0 mt-0.5">
                  <FaExclamationCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                id="firstName"
                name="firstName"
                type="text"
                label="First Name"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />

              <InputField
                id="lastName"
                name="lastName"
                type="text"
                label="Last Name"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <InputField
              id="email"
              name="email"
              type="email"
              label="Email address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              icon={<FaEnvelope />}
              autoComplete="email"
              required
            />

            <InputField
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              icon={<FaLock />}
              autoComplete="new-password"
              required
            />

            <InputField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={<FaLock />}
              autoComplete="new-password"
              required
            />

            <Button loading={loading} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

// Reusable Components
const FeatureItem = ({ icon, text }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="flex items-center space-x-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
  >
    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <span className="text-amber-100 text-lg">{text}</span>
  </motion.div>
);

const InputField = ({ id, name, type, label, placeholder, value, onChange, icon, autoComplete, required }) => (
  <motion.div whileHover={{ scale: 1.01 }}>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </label>
    <div className="mt-1 relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
      )}
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className={`appearance-none block w-full ${icon ? 'pl-10' : 'pl-3'} px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </motion.div>
);

const Button = ({ children, loading, disabled }) => (
  <motion.button
    type="submit"
    disabled={disabled}
    whileHover={!disabled ? { scale: 1.02 } : {}}
    whileTap={!disabled ? { scale: 0.98 } : {}}
    className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 ${
      disabled ? 'opacity-80 cursor-not-allowed' : ''
    }`}
  >
    {loading && (
      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    )}
    {children}
  </motion.button>
);

export default SignUp;