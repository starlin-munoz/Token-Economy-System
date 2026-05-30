import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientProfile from '../components/ClientProfile';
import SelectToken from '../components/SelectToken';
import CurrentGoal from '../components/CurrentGoal';
import RewardStore from '../components/RewardStore';
import { api } from '../api';

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
    // Loaded from the database when a client is selected
    // Token amount only decreases when used to redeem rewards
    const [awardedTokens, setAwardedTokens] = useState([]);

    // State to track max tokens needed to achieve the current goal
    const [maxTokens, setMaxTokens] = useState(1);

    // State to track the current active session ID
    const [currentSessionId, setCurrentSessionId] = useState(null);

    const navigate = useNavigate();

    // Load clients from the database on mount
    useEffect(() => {
        const loadClients = async () => {
            const result = await api.getClients();
            if (result.error) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            setProfile(result);
        };
        loadClients();
    }, []);

    // When a client is selected, load their bank tokens and start a new session
    useEffect(() => {
        if (selectedProfile === null) {
            setAwardedTokens([]);
            setCurrentGoalTokens([]);
            setCurrentSessionId(null);
            setPopUp(false);
            return;
        }

        const loadClientData = async () => {
            // Load bank tokens from the database
            const bankData = await api.getClientBank(selectedProfile);
            if (!bankData.error) {
                // Use balance as the authoritative count
                // If token array doesn't match balance due to encoding, pad with default emoji
                const tokens = bankData.balance > 0
                    ? (bankData.tokens.length === bankData.balance
                        ? bankData.tokens
                        : Array(bankData.balance).fill('⭐'))
                    : [];
                setAwardedTokens(tokens);
            }

            // Create a new session for this client
            const session = await api.createSession(selectedProfile, maxTokens);
            if (!session.error) {
                setCurrentSessionId(session.id);
            }

            // Reset the board for the new client
            setCurrentGoalTokens([]);
            setPopUp(false);
        };

        loadClientData();
    }, [selectedProfile]);

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            <div className="wrapper">
                <div className="top-bar">
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
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
                            sessionId={currentSessionId}
                            onSessionComplete={async (newGoal) => {
                                if (currentSessionId) {
                                    await api.completeSession(currentSessionId);
                                }
                                const session = await api.createSession(selectedProfile, newGoal || maxTokens);
                                if (!session.error) {
                                    setCurrentSessionId(session.id);
                                }
                            }}
                        />
                    </section>
                </div>
                <section className="right-align">
                    <RewardStore
                        awardedTokens={awardedTokens}
                        setAwardedTokens={setAwardedTokens}
                        selectedProfile={selectedProfile}
                    />
                </section>
            </div>
        </div>
    );
}

export default TokenEconomy;