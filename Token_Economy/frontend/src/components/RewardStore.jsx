import React, { useState, useRef, useEffect } from 'react';

function RewardStore({ awardedTokens, setAwardedTokens }) {

    // Current amount of tokens user has
    const currentTokens = awardedTokens.length;

    // State to manage list of rewards
    const [rewards, setRewards] = useState([]);

    // State to toggle reward form visibility
    const [showRewardForm, setShowRewardForm] = useState(false);

    // State to manage new reward input
    const [newReward, setNewReward] = useState('');

    // State to manage reward cost 
    const [newRewardCost, setNewRewardCost] = useState('');

    // State to manage pop-up messages
    const [popUp, setPopUp] = useState({ message: '', visible: false });

    const timeoutRef = useRef(null);
    const idRef = useRef(0);

    useEffect(() => () => clearTimeout(timeoutRef.current), []);

    // Function to handle adding a new reward
    const handleAddReward = () => {
        setShowRewardForm(true);
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const cost = parseInt(newRewardCost, 10);

        if (newReward.trim() === '' || isNaN(cost) || cost < 1) {
            return;
        }

        const reward = {
            id: idRef.current++,
            name: newReward,
            cost: cost
        };

        // Add the reward to the list 
        setRewards(prev => [...prev, reward]);
        // Reset the form and make it invisible
        setNewReward('');
        setNewRewardCost('');
        setShowRewardForm(false);
    };

    // Function to handle cancel
    const handleCancel = () => {
        setNewReward('');
        setShowRewardForm(false);
        setNewRewardCost('');
    };

    // Function to remove rewards
    const handleRemoveReward = (id) => {
        // Remove the reward from the list
        setRewards(prev => prev.filter(r => r.id !== id));
    };

    // Function for pop-ups
    const showPopUp = (message) => {
        setPopUp({ message, visible: true });
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setPopUp({ message: '', visible: false });
        }, 3000);
    }

    // Function to redeem rewards
    const handleRedeemReward = (id) => {
        // Logic to redeem the reward
        const reward = rewards.find(r => r.id === id);
        // Check if user has enough tokens
        if (currentTokens >= reward.cost) {
            const updatedTokens = [...awardedTokens];
            // Remove the used tokens from the user's total
            updatedTokens.splice(0, reward.cost);
            setAwardedTokens(updatedTokens);
            // Deduct tokens and remove reward
            setRewards(prev => prev.filter(r => r.id !== id));
            showPopUp('🎉 Reward redeemed successfully!');
        } else {
            // Show message or handle insufficient tokens
            showPopUp('❌ Not enough tokens to redeem this reward.');
        }
    };

    return (
        <>
            <div className="component-header">
                <div className="reward-store-header">
                    <strong>Reward Store</strong>
                    <span className="token-count">
                        {currentTokens}
                    </span>
                    {popUp.visible && (
                        <div className="custom-popup">
                            {popUp.message}
                        </div>
                    )}
                </div>

                {showRewardForm && (
                    <form onSubmit={handleSubmit} className="reward-form">
                        <input
                            type="text"
                            value={newReward}
                            onChange={(e) => setNewReward(e.target.value)}
                            placeholder="Enter Reward"
                            autoFocus
                        />
                        <input
                            type="number"
                            min="1"
                            value={newRewardCost}
                            onChange={(e) => setNewRewardCost(e.target.value)}
                            placeholder="Token Cost"
                        />
                        <button type="submit">Save Reward</button>
                        <button type="button" onClick={handleCancel}>Cancel</button>
                    </form>
                )}

                <ul className="reward-list">
                    {rewards.map((reward) => (
                        <li key={reward.id} className="reward-item">
                            <span>{reward.name} - {reward.cost} 🪙</span>
                            <div className="reward-actions">
                                <button className="reward-btn redeem" onClick={() => handleRedeemReward(reward.id)}>Redeem</button>
                                <button className="remove reward-btn" onClick={() => handleRemoveReward(reward.id)}>Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>

                {!showRewardForm && (
                    <button className="add-reward" onClick={handleAddReward}>Add Reward</button>
                )}
            </div >
        </>
    );
};
export default RewardStore;