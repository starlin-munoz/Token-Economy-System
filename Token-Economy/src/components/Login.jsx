function Login() {
    return(
        <div className="login-container">
            <h1 className="login-title">Welcome to the Token Economy System</h1>
            <p className="login-instructions">Please log in to continue.</p>
            <button className="login-button" onClick={() => window.location.href = '/app'}>
                Log In
            </button>
        </div>
    );
}

export default Login;