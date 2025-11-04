import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../styles/Form.css';
import authApi from '../authApi';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Form({ route, method }) {

    // State for form fields
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // State for loading, success, and error messages
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // State for frontend validation errors
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const navigate = useNavigate();
    const name = method === "login" ? "Login" : "Register";

    // Validate username in real-time
    useEffect(() => {
        if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
            setUsernameError("Username can only contain letters, numbers, and underscores");
        } else {
            setUsernameError("");
        }
    }, [username]);

    // Validate password in real-time
    useEffect(() => {
        if (password && password.length < 8) {
            setPasswordError("Password must be at least 8 characters");
        } else {
            setPasswordError("");
        }
    }, [password]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // Prevent submission if frontend validation fails
        if (usernameError || passwordError) {
            setLoading(false);
            return;
        }

        try {
            const res = await authApi.post(route, { username, password });

            // Handle login
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate('/', { state: { userName: username } });
            }
            // Handle registration success
            else {
                setSuccess("Account created successfully! You can now log in.");
            }
        } catch (err) {
            if (method === "register" && err.response) {
                setError(err.response.data?.username || "Registration failed");
            } else {
                setError("Login failed");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="login-container">
                <h1 className="login-title">Welcome to the Token Economy System</h1>
                <div className="header">
                    <div className="text">{name}</div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {usernameError && <p className="error-msg">{usernameError}</p>}
                    </div>
                    <div className="input">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && <p className="error-msg">{passwordError}</p>}
                    </div>
                </div>
                <div className="submit-container">
                    <button type="submit" className="submit" disabled={usernameError || passwordError || loading}>
                        {name}
                    </button>

                    {/* Move error and success messages below the submit button */}
                    {error && <p className="error-msg" style={{ marginTop: '0.5rem' }}>{error}</p>}
                    {success && <p className="success-msg" style={{ marginTop: '0.5rem' }}>{success}</p>}
                </div>

                {/* Show register link only on login form */}
                {method === "login" && (
                    <p className="switch-form">
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                )}

                {/* Show login link only on register form */}
                {method === "register" && (
                    <p className="switch-form">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                )}

                {loading && <p>Loading...</p>}
            </div>
        </form>
    );
}

export default Form;