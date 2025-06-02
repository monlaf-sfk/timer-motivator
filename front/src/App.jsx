import React, { useState, useEffect } from 'react';
import './App.css';

const INITIAL_TIME = 10;
const MOTIVATIONAL_PHRASES = [
  "Отличная работа!",
  "Ты молодец!",
  "Продолжай в том же духе!",
  "Супер!",
  "Невероятно!",
  "Горжусь тобой!"
];

function App() {
  const [name, setName] = useState('');
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [timerActive, setTimerActive] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const [currentMotivation, setCurrentMotivation] = useState('');

  useEffect(() => {
    if (!timerActive) {
      return;
    }

    if (timeLeft === 0) {
      setTimerActive(false);
      setTimerFinished(true);
      const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length);
      setCurrentMotivation(MOTIVATIONAL_PHRASES[randomIndex]);
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timerActive, timeLeft]);

  const handleStartTimer = () => {
    if (name.trim() === '') {
      alert('Пожалуйста, введите имя!');
      return;
    }
    setTimeLeft(INITIAL_TIME);
    setTimerFinished(false);
    setCurrentMotivation('');
    setTimerActive(true);
  };

  const handleResetOrTryAgain = () => { 
    setName('');
    setTimeLeft(INITIAL_TIME);
    setTimerActive(false);
    setTimerFinished(false);
    setCurrentMotivation('');
  };

  return (
    <div className="App">
      <h1>Таймер-Мотиватор</h1>

      {!timerActive && !timerFinished && (
        <div className="input-group">
          <input
            type="text"
            placeholder="Введите ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={timerActive} 
          />
          <button onClick={handleStartTimer} disabled={timerActive || !name.trim()}> 
            Старт таймера
          </button>
        </div>
      )}

      {timerActive && (
        <div className="timer-display">
          <p>{name}, осталось {timeLeft} сек</p>
        </div>
      )}

      {timerFinished && (
        <div className="results">
          <p>{currentMotivation} Ты справился, {name} 💪</p>
          <button onClick={handleResetOrTryAgain}>Попробовать ещё раз</button>
        </div>
      )}

      {name && !timerActive && !timerFinished && (
         <button onClick={handleResetOrTryAgain} className="reset-button general-reset">
            Сбросить имя
         </button>
      )}
    </div>
  );
}

export default App;