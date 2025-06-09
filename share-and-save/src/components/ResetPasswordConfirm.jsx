import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function ResetPasswordConfirm() {
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get('token');
        console.log('Extracted token from URL:', tokenFromUrl);
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setError('Password reset token not found.');
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        if (!token) {
            setError('Password reset token is missing.');
            setLoading(false);
            return;
        }

        console.log('Submitting password reset with:', { token: token, new_password: password, re_new_password: confirmPassword });

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/users/password-reset/confirm/', {
                token: token,
                new_password: password,
                re_new_password: confirmPassword,
            });
            setSuccess('Password reset successful. You can now log in.');
            setLoading(false);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error('Password reset failed:', err.response?.data || err.message);
            setError(err.response?.data?.detail || 'Failed to reset password. Please try again.');
            setLoading(false);
        }
    };

    if (!token && !error) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
                <h3 className="text-2xl font-bold text-center">Reset Password</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <div>
                            <label className="block" htmlFor="password">New Password</label>
                            <input
                                type="password"
                                placeholder="New Password"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block" htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                        {success && <p className="text-green-500 text-xs mt-2">{success}</p>}
                        <div className="flex items-baseline justify-between">
                            <button
                                type="submit"
                                className="px-6 py-2 mt-4 text-white bg-orange-600 rounded-lg hover:bg-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-opacity-50"
                                disabled={loading || !token}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPasswordConfirm; 