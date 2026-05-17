import { useState, useEffect } from 'react';
import ClientProfile from '../components/ClientProfile';
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

    // State to manage selected profile
    const [selectedProfile, setSelectedProfile] = useState(null);

    // State to manage saved profile info
    const [profile, setProfile] = useState([]);

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

    return (
        <div>
            <div className="wrapper">
                <div className="header-container">
                    <h1 className="title">⭐ABA Token Economy System</h1>
                    <p className="subtitle">Reinforcing positive behaviors through visual rewards</p>
                </div>
                <div className="left-align">
                    <section>
                        <ClientProfile
                            selectedProfile={selectedProfile}
                            setSelectedProfile={setSelectedProfile}
                            profile={profile}
                            setProfile={setProfile}
                        />
                    </section>
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
                            setAwardedTokens={setAwardedTokens}
                            maxTokens={maxTokens}
                            setMaxTokens={setMaxTokens}
                            popUp={popUp}
                            setPopUp={setPopUp}
                            selectedProfile={selectedProfile}
                            profile={profile}
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