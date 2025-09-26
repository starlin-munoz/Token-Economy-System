import { useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import ChildProfile from '../components/ClientProfile';
import SelectToken from '../components/SelectToken';
import CurrentGoal from '../components/CurrentGoal';
import RewardStore from '../components/RewardStore';

function TokenEconomy() {

    // State to handle popup when goal is met
    const [popUp, setPopUp] = useState(false);

    // State to manage tokens awarded to the current goal
    const [currentGoalTokens, setCurrentGoalTokens] = useState([]);

    // State to manage the selected token
    const [selectedToken, setSelectedToken] = useState(null);

    // State to manage awarded tokens 
    // We use localStorage to keep token amount even if board reset
    // Token amount should only decrease if used to redeem rewards
    const [awardedTokens, setAwardedTokens] = useState(() => {
        const saved = localStorage.getItem("awardedTokens");
        return saved ? JSON.parse(saved) : [];
    });

    // Save awarded tokens to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("awardedTokens", JSON.stringify(awardedTokens));
    }, [awardedTokens]);

    // State to track max tokens needed to achieve the current goal
    const [maxTokens, setMaxTokens] = useState(1);

    // Allows for navigation between pages
    const navigate = useNavigate();

    // Function to navigate to login page
    const goToLogin = () => {
        navigate('/');
    };

    return (
        <div>
            <div className="header-container">
                <h1 className="title">⭐ABA Token Economy System</h1>
                <button className="logout-btn" onClick={goToLogin}>
                    Logout
                </button>
            </div>
            <p>Reinforcing positive behaviors through visual rewards</p>
            <div className="wrapper">
                <div className="left-align">
                    <section><ChildProfile /></section>
                    <section>
                        <SelectToken
                            selectedToken={selectedToken}
                            setSelectedToken={setSelectedToken}
                        />
                    </section>
                    <section>
                        <CurrentGoal
                            currentGoalTokens={currentGoalTokens}
                            setCurrentGoalTokens={setCurrentGoalTokens}
                            selected={selectedToken}
                            awardedTokens={awardedTokens}
                            maxTokens={maxTokens}
                            setAwardedTokens={setAwardedTokens}
                            setMaxTokens={setMaxTokens}
                            popUp={popUp}
                            setPopUp={setPopUp}
                        />
                    </section>
                </div>
                <section className="right-align">
                    <RewardStore
                        awardedTokens={awardedTokens}
                        setAwardedTokens={setAwardedTokens}
                    />
                </section>
            </div>
        </div>
    );
}

export default TokenEconomy;