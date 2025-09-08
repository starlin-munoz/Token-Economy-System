import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChildProfile from './ClientProfile';
import SelectToken from './SelectToken';
import CurrentGoal from './CurrentGoal';
import RewardStore from './RewardStore';

function TokenEconomy() {

    // State to handle login
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // State to handle popup when goal is met
    const [popUp, setPopUp] = useState(false);

    // State to manage tokens awarded to the current goal
    const [currentGoalTokens, setCurrentGoalTokens] = useState([]);

    // State to manage high contrast mode
    const [contrast, setContrast] = useState(false);

    // State to manage the voice button color and text
    const [voiceBtn, setVoiceBtn] = useState(false);

    // State to manage the selected token
    const [selectedToken, setSelectedToken] = useState(null);

    // State to manage awarded tokens 
    // We use localStorage to keep token amount even if board reset
    // Token amount should only decrease if used to redeem rewards
    const [awardedTokens, setAwardedTokens] = useState(() => {
        const saved = localStorage.getItem("awardedTokens");
        return saved ? JSON.parse(saved) : 0;
    });

    // Save awarded tokens to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("awardedTokens", JSON.stringify(awardedTokens));
    }, [awardedTokens]);

    // State to track max tokens needed to achieve the current goal
    const [maxTokens, setMaxTokens] = useState(1);

    // Allows for navigation between pages
    const navigate = useNavigate();

    // Function to navigate to login page
    const goToLogin = () => {
        navigate('/');
    };

    // Function to toggle high contrast mode
    const toggleContrast = () => {
        setContrast(prev => {
            const highContrast = !prev;

            // Change the background and text color based on high contrast mode
            const root = document.documentElement;
            root.style.backgroundColor = highContrast ? '#343434' : '#eeeeee';
            root.style.color = highContrast ? '#eeeeee' : '#343434';

            // Change the button colors based on high contrast mode of the components
            const componentHeaders = document.querySelectorAll('.component-header');
            componentHeaders.forEach(header => {
                header.style.backgroundColor = highContrast ? '#555555' : 'white';
                header.style.color = highContrast ? '#eeeeee' : '#343434';
            });

            // Change the background color of the sections
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                section.style.backgroundColor = highContrast ? '#343434' : '#eeeeee';
            });

            // Change the button colors based on high contrast mode
            const buttons = document.querySelectorAll('.main-buttons');
            buttons.forEach(button => {
                button.style.backgroundColor = highContrast ? '#555555' : 'white';
                button.style.color = highContrast ? '#eeeeee' : '#343434';
            });

            return highContrast;
        });
    };

    // Function to toggle the voice button color and text
    const changeVoiceBtn = () => {
        setVoiceBtn(prev => {
            const isOn = !prev;

            // Change the button color based on voice button state
            const buttons = document.querySelectorAll('.onbutton');
            buttons.forEach(button => {
                button.style.backgroundColor = isOn ? 'green' : 'red';
            });

            return isOn;
        });
    };
    return (
        <div>
            <button className="logout-btn" onClick={goToLogin}>
                Logout
            </button>
            <h1 className="title">⭐ABA Token Economy System</h1>
            <p>Reinforcing positive behaviors through visual rewards</p>
            <button className="main-buttons" id="high-contrast" onClick={toggleContrast}>
                <img
                    src={contrast ? './images/DarkMode.png' : './images/DefaultContrast.png'}
                    alt="Contrast" width="16" height="16" />
                High Contrast
            </button>
            <button className="main-buttons" id="voice-prompts" onClick={changeVoiceBtn}>
                <img src="./images/Speaker_Icon.svg" alt="Speaker" width="16" height="16" />
                Voice Prompts
                <div className="onbutton">
                    {voiceBtn ? 'ON' : 'OFF'}
                </div>
            </button>
            <div className="wrapper">
                <div className="left-align">
                    <section><ChildProfile /></section>
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
                            maxTokens={maxTokens}
                            setAwardedTokens={setAwardedTokens}
                            setMaxTokens={setMaxTokens}
                            popUp={popUp}
                            setPopUp={setPopUp}
                        />
                    </section>
                </div>
                <section className="right-align">
                    <RewardStore
                        awardedTokens={awardedTokens}
                        setAwardedTokens={setAwardedTokens}
                    />
                </section>
            </div>
        </div>
    );
}

export default TokenEconomy;