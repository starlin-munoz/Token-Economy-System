import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import './styles/ClientProfile.css';
import './styles/CurrentGoal.css';
import './styles/RewardStore.css';
import './styles/SelectToken.css';
import TokenEconomy from './pages/TokenEconomy';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TokenEconomy/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;