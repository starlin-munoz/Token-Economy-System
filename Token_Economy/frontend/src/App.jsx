import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';
import './styles/ClientProfile.css';
import './styles/CurrentGoal.css';
import './styles/RewardStore.css';
import './styles/SelectToken.css';
import TokenEconomy from './pages/TokenEconomy';
import Login from './pages/Login';

function PrivateRoute({ children }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <TokenEconomy />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;