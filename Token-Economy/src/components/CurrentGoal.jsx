import React, { useState, useRef } from 'react';

function CurrentGoal({ selected }) {

    // State to manage awarded tokens
    const [awardedTokens, setAwardedTokens] = useState([]);

    // State to track awarded tokens 
    const tokens = awardedTokens.length;

    // State to track maximum number of tokens from the dropdown
    const [maxTokens, setMaxTokens] = useState(1);

    // State to handle popup when goal is met 
    const [popUp, setPopUp] = useState(false);

    // Function to handle awarding a token
    const handleAwardToken = () => {
        // If a token is selected and token amount is less than the goal
        if (selected && tokens < maxTokens) {
            setAwardedTokens(prev => {
                const updatedTokens = [...prev, selected];
                // If amount of tokens equals that of the goal, 
                // allow the congratulation popup to appear
                if (updatedTokens.length === maxTokens) {
                    setPopUp(true);
                }
                return updatedTokens;
            });
        }
    };

    // Function to reset awarded tokens
    const resetTokenBoard = () => {
        setAwardedTokens([]);
        setPopUp(false); 
    }

    // Function to get the emoji based on the token ID
    const getEmojiFromId = (id) => {
        switch (id) {
            case 'star-token':
                return '⭐';
            case 'smile-token':
                return '😊';
            case 'heart-token':
                return '❤️';
            case 'trophy-token':
                return '🏆';
            case 'pizza-token':
                return '🍕';
            case 'custom-token':
                return '🔧';
            default:
                return '';
        }
    };

    // Function to handle dropdown changes 
    const handleDropdown = (e) => {
        const goal = parseInt(e.target.value); // Convert the goal from string to integer
        setMaxTokens(goal); // Update maxTokens state
        setAwardedTokens([]); // Reset tokens when goal changes
        setPopUp(false); // Return popUp state to false
    };

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
                <p>
                    {awardedTokens.map((token, index) => (
                        <span key={index} style={{ fontSize: '50px', marginRight: '8px' }}>
                            {getEmojiFromId(token)}
                        </span>
                    ))}
                </p>
                <div className="component-box">
                    <button className="award-token token-btn" onClick={handleAwardToken} disabled={tokens >= maxTokens}>
                        <strong>
                            <img src="./images/medal-emoji.png" alt="Award" width="16" height="16" />
                            Award Token
                        </strong>
                    </button>
                    <button className="reset-token-board token-btn" onClick={resetTokenBoard}>
                        <strong>
                            <img src="./images/ResetTokens.png" alt="Reset" width="16" height="16" />
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
                        <p>You reached your token goal of {maxTokens}!</p>
                        <button className="close-btn" onClick={() => setPopUp(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    )
};
export default CurrentGoal; 