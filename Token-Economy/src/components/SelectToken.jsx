import '../index.css';
import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

function SelectToken({ selectedToken, setSelectedToken }) {

    // State to show emoji picker
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    // State to manage custom token input
    const [customToken, setCustomToken] = useState('🔧');

    const tokens = ['⭐', '😊', '❤️', '🏆', '🍕'];

    // Function to handle token selection
    const handleTokenSelect = (emoji) => {
        setSelectedToken(prev => prev === emoji ? null : emoji);
    };

    // Function to handle emoji selection from picker
    const handleCustomTokenChange = (emojiObj) => {
        setCustomToken(emojiObj.emoji);
        setSelectedToken(emojiObj.emoji);
        setShowEmojiPicker(false);
    };

    // Function to handle custom token click
    const handleCustomTokenClick = () => {
        setShowEmojiPicker(true);
    };

    return (
        <>
            <div className="component-header">
                <strong>Select Token</strong>
                <br />
                {tokens.map((emoji, index) => (
                    <button
                        key={emoji}
                        className={`token token-${index} ${selectedToken === emoji ? 'selected' : ''}`}
                        onClick={() => handleTokenSelect(emoji)}
                    >
                        {emoji}
                    </button>
                ))}

                <button
                    className={`token custom-token ${selectedToken === customToken ? 'selected' : ''}`}
                    onClick={handleCustomTokenClick}
                >
                    {customToken}
                </button>

                {showEmojiPicker && (
                    <div className="emoji-picker-popup">
                        <EmojiPicker onEmojiClick={handleCustomTokenChange} />
                        <button className="close-picker" onClick={() => setShowEmojiPicker(false)}>
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
export default SelectToken; 