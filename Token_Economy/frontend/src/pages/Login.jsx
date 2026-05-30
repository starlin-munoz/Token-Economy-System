import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = isRegister
            ? await api.register(email, password)
            : await api.login(email, password);

        setLoading(false);

        if (result.error) {
            setError(result.error);
            return;
        }

        localStorage.setItem('token', result.token);
        navigate('/');
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1 className="title">⭐ ABA Token Economy</h1>
                    <p className="subtitle">
                        {isRegister ? 'Create your therapist account' : 'Welcome'}
                    </p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label>
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </label>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Log In'}
                    </button>
                </form>

                <button
                    className="toggle-auth-btn"
                    onClick={() => { setIsRegister(!isRegister); setError(''); }}
                >
                    {isRegister
                        ? 'Already have an account? Log in'
                        : "Don't have an account? Register"}
                </button>
            </div>
        </div>
    );
}

export default Login;