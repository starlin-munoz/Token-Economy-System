import { useState, useRef, useEffect } from 'react';
import { api } from '../api';

function RewardStore({ awardedTokens, setAwardedTokens, selectedProfile }) {

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

    useEffect(() => () => clearTimeout(timeoutRef.current), []);

    // Load rewards from the database when a client is selected
    useEffect(() => {
        if (!selectedProfile) {
            setRewards([]);
            return;
        }

        const loadRewards = async () => {
            const result = await api.getRewards(selectedProfile);
            if (!result.error) {
                setRewards(result);
            }
        };

        loadRewards();
    }, [selectedProfile]);

    // Function to handle adding a new reward
    const handleAddReward = () => {
        setShowRewardForm(true);
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const cost = parseInt(newRewardCost, 10);

        if (newReward.trim() === '' || isNaN(cost) || cost < 1) {
            return;
        }

        const reward = await api.createReward(selectedProfile, newReward, cost);

        if (reward.error) return;

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
    const handleRemoveReward = async (id) => {
        await api.deleteReward(id);

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
    };

    // Function to redeem rewards
    const handleRedeemReward = async (id) => {
        const reward = rewards.find(r => r.id === id);

        // Check if user has enough tokens
        if (currentTokens < reward.cost) {
            showPopUp('❌ Not enough tokens to redeem this reward.');
            return;
        }

        const result = await api.redeemReward(id);

        if (result.error) {
            showPopUp('❌ Not enough tokens to redeem this reward.');
            return;
        }

        // Deduct tokens from the bank
        setAwardedTokens(prev => prev.slice(0, prev.length - reward.cost));

        // Remove reward from the list
        setRewards(prev => prev.filter(r => r.id !== id));

        showPopUp('🎉 Reward redeemed successfully!');
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
            </div>
        </>
    );
};

export default RewardStore;