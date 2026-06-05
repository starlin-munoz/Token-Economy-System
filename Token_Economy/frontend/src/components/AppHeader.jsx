import { useNavigate, useLocation } from 'react-router-dom';

function AppHeader({ onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="header-container">
            <div className="header-top">
                <div>
                    <h1 className="title">⭐ ABA Token Economy System</h1>
                    <p className="subtitle">Reinforcing positive behaviors through visual rewards</p>
                </div>
                <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
            <div className="header-nav">
                <button
                    className={`navbar-btn ${location.pathname === '/' ? 'active' : ''}`}
                    onClick={() => navigate('/')}
                >
                    Token Economy
                </button>
                <button
                    className={`navbar-btn ${location.pathname === '/analytics' ? 'active' : ''}`}
                    onClick={() => navigate('/analytics')}
                >
                    Analytics
                </button>
            </div>
        </div>
    );
}

export default AppHeader;