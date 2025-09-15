import { useState } from "react";

function Login() {

    const [action, setAction] = useState("Sign Up");

    return (
        <div className="login-container">
            <h1 className="login-title">Welcome to the Token Economy System</h1>
            <div className="header">
                <div className="text">{action}</div>
            </div>
            <div className="inputs">
                {action === "Login" ? <div></div> :
                    <div className="input">
                        <input type="text" placeholder="Email" />
                    </div>}
                <div className="input">
                    <input type="text" placeholder="Username" />
                </div>
                <div className="input">
                    <input type="password" placeholder="Password" />
                </div>
                {action === "Login" ? <div></div> :
                    <div className="input">
                        <input type="password" placeholder="Confirm Password" />
                    </div>}
            </div>
            <div className="submit-container">
                <div className={action === "Login" ? "submit-gray" : "submit"} onClick={() => { setAction("Sign Up") }}>Sign Up</div>
                <div className={action === "Sign Up" ? "submit-gray" : "submit"} onClick={() => { setAction("Login") }}>Login</div>
            </div>
        </div>
    );
}

export default Login;