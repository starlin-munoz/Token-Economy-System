import React, { useState } from 'react';
import './App.css'
import './index.css'
import ChildProfile from './components/ChildProfile'
import SelectToken from './components/SelectToken'
import CurrentGoal from './components/CurrentGoal'
import RewardStore from './components/RewardStore'

function App() {

  // State to manage high contrast mode
  const [contrast, setContrast] = useState(false);

  // State to manage the voice button color and text
  const [voiceBtn, setVoiceBtn] = useState(false);

  // State to manage the selected token
  const [selectedToken, setSelectedToken] = useState(null);

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
        <button className="onbutton" onClick={changeVoiceBtn}>
          {voiceBtn ? 'ON' : 'OFF'}
        </button>
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
            <CurrentGoal selected={selectedToken} />
          </section>
        </div>
        <section className="right-align">
          <RewardStore />
        </section>
      </div>
    </div>
  )
};

export default App;
