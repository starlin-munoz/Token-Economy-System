function CurrentGoal({ currentGoalTokens, setCurrentGoalTokens, selected, awardedTokens, setAwardedTokens, maxTokens, setMaxTokens, popUp, setPopUp, selectedProfile, setSelectedProfile, profile, setProfile }) {

    // State to track awarded tokens 
    const tokens = currentGoalTokens.length;

    // Function to handle awarding a token
    const handleAwardToken = () => {
        // If no token is selected or the current goal is met
        if (!selected || tokens >= maxTokens) {
            return;
        }

        // Add token to current goal
        setCurrentGoalTokens(prev => {
            const updatedGoalTokens = [...prev, selected];
            // If the goal is met, show the pop-up
            if (updatedGoalTokens.length === maxTokens) {
                setPopUp(true);
            }
            return updatedGoalTokens;
        });
        setAwardedTokens(prev => [...prev, selected]);
    }

    // Function to reset awarded tokens
    const resetTokenBoard = () => {
        setCurrentGoalTokens([]);
        setPopUp(false);
    }

    // Function to handle dropdown changes
    const handleDropdown = (e) => {
        const goal = parseInt(e.target.value, 10); // Convert the goal from string to integer
        setMaxTokens(goal); // Update maxTokens state
        setCurrentGoalTokens([]); // Reset tokens when goal changes
        setPopUp(false); // Return popUp state to false
    }

    const selectedProfileName = profile.find(p => p.id === selectedProfile)?.name;

    return (
        <>
            <div className="component-header">
                <strong>Current Goal</strong>
                <select className="token-goal-select" onChange={handleDropdown} value={maxTokens}>
                    <option value="" hidden>Token Goal</option>
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
                <div className="component-box">
                    <button className="award-token token-btn" onClick={handleAwardToken} disabled={tokens >= maxTokens}>
                        <strong>
                            Award Token
                        </strong>
                    </button>
                    <button className="reset-token-board token-btn" onClick={resetTokenBoard}>
                        <strong>
                            Reset Token Board
                        </strong>
                    </button>
                </div>
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
