import { useState } from "react";
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";
import '../styles/Form.css';
import authApi from '../authApi';

function Form({ route, method }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    // Function to handle form submission
    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await authApi.post(route, { username, password });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate('/');
            } else {
                navigate('/login');
            }

        } catch (error) {
            console.log(error);
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
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="input">
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className="submit-container">
                    <button type="submit" className="submit">{name}</button>
                </div>
            </div>
        </form>
    );
}

export default Form;