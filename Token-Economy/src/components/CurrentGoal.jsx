import React, { useState } from 'react';

function CurrentGoal({ selected }) {

    // State to manage awarded tokens
    const [awardedTokens, setAwardedTokens] = useState([]);

    // Function to handle awarding a token
    const handleAwardToken = () => {
        if (selected) {
            setAwardedTokens(prev => [...prev, selected]);
        }
    };

    // Function to reset awarded tokens
    const resetTokenBoard = () => {
        setAwardedTokens([]);
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

    return (
        <>
            <div className="component-header">
                <strong>Current Goal</strong>
                <select className="token-goal-select">
                    <option value="" hidden>Token Goal</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
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
                    <button className="award-token token-btn" onClick={handleAwardToken}>
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
        </>
    )
};
export default CurrentGoal; 