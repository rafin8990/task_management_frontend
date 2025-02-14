import { useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';

const Register = () => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const onSubmit = (event) => {
    event.preventDefault();
    setButtonLoading(true);
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');

    const registerUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password, role }),
        });
        if (response.ok) {
          navigate(location.state || '/sign-in');
        } else {
          throw new Error('Registration failed');
        }
      } catch (error) {
        toast.error(error.message);
        setButtonLoading(false);
      }
    };

    registerUser();
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us and start managing your tasks efficiently
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Name"
              />
            </div>
            <div className="relative">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div className="relative">
              <label htmlFor="role" className="sr-only">
                Role
              </label>
              <FaUserTag className="absolute top-3 left-3 text-gray-400" />
              <select
                id="role"
                name="role"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="" disabled selected>Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-900 hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              {buttonLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Register'
              )}
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600">
          Have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login here</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;