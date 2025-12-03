import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import './styles/ClientProfile.css';
import './styles/CurrentGoal.css';
import './styles/RewardStore.css';
import './styles/SelectToken.css';
import TokenEconomy from './pages/TokenEconomy';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter basename="/Token-Economy-System">
      <Routes>
        <Route path="/" element={<ProtectedRoute><TokenEconomy /></ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
