import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientProfile from '../components/ClientProfile';
import SelectToken from '../components/SelectToken';
import CurrentGoal from '../components/CurrentGoal';
import RewardStore from '../components/RewardStore';
import AppHeader from '../components/AppHeader';
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
    // Empty string shows the placeholder in the dropdown
    const [maxTokens, setMaxTokens] = useState('');

    // State to track the current active session ID
    const [currentSessionId, setCurrentSessionId] = useState(null);

    // State to track whether a session has been explicitly started
    const [sessionStarted, setSessionStarted] = useState(false);

    // Ref to avoid stale closure when completing sessions
    const sessionIdRef = useRef(null);

    const navigate = useNavigate();

    // Keep ref in sync with state
    useEffect(() => {
        sessionIdRef.current = currentSessionId;
    }, [currentSessionId]);

    // Load clients and restore any active session from localStorage on mount
    useEffect(() => {
        const loadClients = async () => {
            const result = await api.getClients();
            if (result.error) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            setProfile(result);

            // Restore active session if one was in progress
            const savedSession = localStorage.getItem('activeSession');
            if (savedSession) {
                const { sessionId, clientId, tokenEmoji, goal } = JSON.parse(savedSession);
                setCurrentSessionId(sessionId);
                setSelectedProfile(clientId);
                setSelectedToken(tokenEmoji);
                setMaxTokens(goal);
                setSessionStarted(true);

                // Reload bank tokens for the restored client
                const bankData = await api.getClientBank(clientId);
                if (!bankData.error) {
                    const tokens = bankData.balance > 0
                        ? (bankData.tokens.length === bankData.balance
                            ? bankData.tokens
                            : Array(bankData.balance).fill('⭐'))
                        : [];
                    setAwardedTokens(tokens);
                }
            }
        };
        loadClients();
    }, []);

    // When a client is deselected, clear everything
    useEffect(() => {
        if (selectedProfile === null) {
            setAwardedTokens([]);
            setCurrentGoalTokens([]);
            setCurrentSessionId(null);
            setSessionStarted(false);
            setPopUp(false);
            setMaxTokens('');
            setSelectedToken(null);
            localStorage.removeItem('activeSession');
        }
    }, [selectedProfile]);

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // Load bank tokens when a client is selected
    const handleProfileSelect = async (clientId) => {
        if (clientId === selectedProfile) {
            setSelectedProfile(null);
            return;
        }

        const bankData = await api.getClientBank(clientId);
        if (!bankData.error) {
            const tokens = bankData.balance > 0
                ? (bankData.tokens.length === bankData.balance
                    ? bankData.tokens
                    : Array(bankData.balance).fill('⭐'))
                : [];
            setAwardedTokens(tokens);
        }

        setSelectedProfile(clientId);
        setCurrentGoalTokens([]);
        setCurrentSessionId(null);
        setSessionStarted(false);
        setPopUp(false);
        setMaxTokens('');
        setSelectedToken(null);
        localStorage.removeItem('activeSession');
    };

    // Start a session explicitly — called when Start Session button is pressed
    const handleStartSession = async () => {
        const session = await api.createSession(selectedProfile, maxTokens);
        if (!session.error) {
            setCurrentSessionId(session.id);
            setSessionStarted(true);
            setCurrentGoalTokens([]);

            // Persist active session to localStorage so it survives page navigation
            localStorage.setItem('activeSession', JSON.stringify({
                sessionId: session.id,
                clientId: selectedProfile,
                tokenEmoji: selectedToken,
                goal: maxTokens,
            }));
        }
    };

    // Cancel goal selection — resets goal without creating a session
    const handleCancelGoal = () => {
        setMaxTokens('');
        setSessionStarted(false);
    };

    // Stop the current session — ends it in the DB and clears all session state
    const handleStopSession = async () => {
        if (sessionIdRef.current) {
            await api.completeSession(sessionIdRef.current);
        }
        setCurrentSessionId(null);
        setSessionStarted(false);
        setCurrentGoalTokens([]);
        setMaxTokens('');
        setPopUp(false);
        localStorage.removeItem('activeSession');
    };

    return (
        <div>
            <div className="wrapper">
                <AppHeader onLogout={handleLogout} />
                <div className="left-align">
                    <section>
                        <ClientProfile
                            selectedProfile={selectedProfile}
                            setSelectedProfile={setSelectedProfile}
                            profile={profile}
                            setProfile={setProfile}
                            onProfileSelect={handleProfileSelect}
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
                            sessionStarted={sessionStarted}
                            onStartSession={handleStartSession}
                            onCancelGoal={handleCancelGoal}
                            onStopSession={handleStopSession}
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