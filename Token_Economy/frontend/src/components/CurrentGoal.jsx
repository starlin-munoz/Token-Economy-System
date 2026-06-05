import { api } from '../api';

function CurrentGoal({ currentGoalTokens, setCurrentGoalTokens, selected, awardedTokens, setAwardedTokens, maxTokens, setMaxTokens, popUp, setPopUp, selectedProfile, profile, sessionId, sessionStarted, onStartSession, onCancelGoal, onStopSession }) {

    // State to track awarded tokens
    const tokens = currentGoalTokens.length;

    // Whether all three conditions are met but session not yet started
    const readyToStart = selectedProfile && selected && maxTokens && !sessionStarted;

    // Function to handle awarding a token
    const handleAwardToken = async () => {
        // If no session is started or goal is met, return
        if (!sessionStarted || !sessionId || !maxTokens || tokens >= maxTokens) {
            return;
        }

        // Award token in the database
        const result = await api.awardToken(sessionId, selected);

        if (result.error) return;

        // Add token to current goal
        setCurrentGoalTokens(prev => {
            const updatedGoalTokens = [...prev, selected];
            // If the goal is met, show the pop-up
            if (updatedGoalTokens.length === maxTokens) {
                setPopUp(true);
            }
            return updatedGoalTokens;
        });

        // Add token to bank
        setAwardedTokens(prev => [...prev, selected]);
    };

    // Reset the visual board only — session stays open
    const resetTokenBoard = () => {
        setCurrentGoalTokens([]);
        setPopUp(false);
    };

    // Function to handle dropdown changes
    const handleDropdown = (e) => {
        const goal = parseInt(e.target.value, 10);
        setMaxTokens(goal);
        setCurrentGoalTokens([]);
        setPopUp(false);
    };

    const selectedProfileName = profile.find(p => p.id === selectedProfile)?.name;

    return (
        <>
            <div className="component-header">
                <strong>Current Goal</strong>
                <select className="token-goal-select" onChange={handleDropdown} value={maxTokens} disabled={sessionStarted}>
                    <option value="" disabled>Token Goal</option>
                    {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </select>
                <br />

                {/* Show tokens currently awarded toward the goal */}
                <p>
                    <strong>Goal Tokens:</strong>{' '}
                    {currentGoalTokens.length === 0 ? (
                        <em>No tokens awarded yet</em>
                    ) : (
                        currentGoalTokens.map((emoji, index) => (
                            <span key={`goal-${index}`} style={{ fontSize: '50px', marginRight: '8px' }}>
                                {emoji}
                            </span>
                        ))
                    )}
                </p>

                {/* Show tokens available in the bank */}
                <p>
                    <strong>Bank Tokens:</strong>{' '}
                    {awardedTokens.length === 0 ? (
                        <em>No tokens in bank</em>
                    ) : (
                        awardedTokens.map((emoji, index) => (
                            <span key={`bank-${index}`} style={{ fontSize: '30px', marginRight: '6px' }}>
                                {emoji}
                            </span>
                        ))
                    )}
                </p>

                {/* Show Start/Cancel when all conditions met but session not started */}
                {readyToStart && (
                    <div className="component-box">
                        <button className="start-session-btn token-btn" onClick={onStartSession}>
                            <strong>Start Session</strong>
                        </button>
                        <button className="cancel-session-btn token-btn" onClick={onCancelGoal}>
                            <strong>Cancel</strong>
                        </button>
                    </div>
                )}

                {/* Show Award, Reset, and Stop when session is active */}
                {sessionStarted && (
                    <div className="component-box">
                        <button className="award-token token-btn" onClick={handleAwardToken} disabled={tokens >= maxTokens}>
                            <strong>Award Token</strong>
                        </button>
                        <button className="reset-token-board token-btn" onClick={resetTokenBoard}>
                            <strong>Reset Token Board</strong>
                        </button>
                        <button className="stop-session-btn token-btn" onClick={onStopSession}>
                            <strong>Stop Session</strong>
                        </button>
                    </div>
                )}
            </div>

            {/* PopUp Model for when token goal is met */}
            {popUp && (
                <div className="popup-backdrop">

                    <span className="star-1">✨</span>
                    <span className="star-2">✨</span>
                    <span className="star-3">✨</span>
                    <span className="star-4">✨</span>
                    <span className="star-5">✨</span>
                    <span className="star-6">✨</span>

                    <div className="popup-container">
                        <h2>🎉 Congratulations! 🎉</h2>
                        <p>
                            {selectedProfile !== null
                                ? `${selectedProfileName} reached the token goal of ${maxTokens}!`
                                : `You reached the token goal of ${maxTokens}!`}
                        </p>
                        <button className="close-btn" onClick={() => setPopUp(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CurrentGoal;