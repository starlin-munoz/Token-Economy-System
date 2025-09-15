import { Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import './styles/ClientProfile.css';
import './styles/CurrentGoal.css';
import './styles/RewardStore.css';
import './styles/SelectToken.css';
import './styles/Login.css';
import TokenEconomy from './components/TokenEconomy';
import Login from './components/Login';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app" element={<TokenEconomy />} />
      </Routes>
    </>
  );
}

  export default App;
