import './App.css'
import ChildProfile from './components/ChildProfile'
import SelectToken from './components/SelectToken'
import CurrentGoal from './components/CurrentGoal'
import RewardStore from './components/RewardStore'

function App() {

  return (
    <div>
      <h1 className="title">⭐ABA Token Economy System</h1>
      <p>Reinforcing positive behaviors through visual rewards</p>
      <button className="main-buttons" id="high-contrast">
        <img src="./images/DefaultContrast.png" alt="Contrast" width="16" height="16" />
        High Contrast
      </button>
      <button className="main-buttons" id="voice-prompts">
        <img src="./images/Speaker_Icon.svg" alt="Speaker" width="16" height="16" />
        Voice Prompts
        <button className="onbutton">OFF</button>
      </button>
      
      <div className="wrapper">
        <div className="left-align">
          <section><ChildProfile /></section>
          <section><SelectToken /></section>
          <section><CurrentGoal /></section>
        </div>
        <section className="right-align"><RewardStore /></section>
      </div>
    </div>
  )
}

export default App
