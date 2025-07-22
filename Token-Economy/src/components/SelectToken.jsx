import '../index.css';
function SelectToken({selectedToken, setSelectedToken}) {

    // Function to handle token selection
    const handleTokenSelect = (e) => {
        const selected = e.target.id;

        // Reset background color for all tokens
        const tokens = document.querySelectorAll('.token');
        tokens.forEach(token => {
            token.style.backgroundColor = '';
            token.style.border = '';
        });

        if (selected === selectedToken) {
            // Token is already selected, so deselect it
            setSelectedToken(null);
            return;
        }
        // Highlight the selected token
        e.target.style.backgroundColor = '#d1e7dd';
        e.target.style.border = '3px solid #0f5132';
        setSelectedToken(selected);
    };

    return (
        <>
            <div className="component-header">
                <strong>Select Token</strong>
                <br />
                <button className="token" id="star-token" onClick={handleTokenSelect}>⭐</button>
                <button className="token" id="smile-token" onClick={handleTokenSelect}>😊</button>
                <button className="token" id="heart-token" onClick={handleTokenSelect}>❤️</button>
                <button className="token" id="trophy-token" onClick={handleTokenSelect}>🏆</button>
                <button className="token" id="pizza-token" onClick={handleTokenSelect}>🍕</button>
                <button className="token" id="custom-token" onClick={handleTokenSelect}>🔧</button>
            </div>
        </>
    )
};
export default SelectToken; 