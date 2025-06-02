import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const TIME_OPTIONS = [10, 20, 30];
const MOTIVATIONAL_PHRASES = [
  "Отличная работа!",
  "Ты молодец!",
  "Продолжай в том же духе!",
  "Супер!",
  "Невероятно!",
  "Горжусь тобой!"
];

function App() {
  const [name, setName] = useState(() => {
    const savedName = localStorage.getItem('timerMotivatorName');
    return savedName || '';
  });
  const [selectedTime, setSelectedTime] = useState(TIME_OPTIONS[0]);
  const [timeLeft, setTimeLeft] = useState(selectedTime);
  const [timerActive, setTimerActive] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const [currentMotivation, setCurrentMotivation] = useState('');
  const [completionCount, setCompletionCount] = useState(() => {
    const savedCount = localStorage.getItem('timerMotivatorCompletions');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('.assets/notification.mp3'); 
  }, []);
  useEffect(() => {
    localStorage.setItem('timerMotivatorName', name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem('timerMotivatorCompletions', completionCount.toString());
  }, [completionCount]);

  useEffect(() => {
    if (!timerActive) {
      return;
    }

    if (timeLeft === 0) {
      setTimerActive(false);
      setTimerFinished(true);
      const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length);
      setCurrentMotivation(MOTIVATIONAL_PHRASES[randomIndex]);
      setCompletionCount(prevCount => prevCount + 1);
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.warn("Audio play failed:", error);
        });
      }
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
    setTimeLeft(selectedTime); 
    setTimerFinished(false);
    setCurrentMotivation('');
    setTimerActive(true);
  };

  const handleResetOrTryAgain = () => {
    //setName('');
    setSelectedTime(TIME_OPTIONS[0]);
    setTimeLeft(TIME_OPTIONS[0]);
    setTimerActive(false);
    setTimerFinished(false);
    setCurrentMotivation('');
   
    
  };

  const handleTimeChange = (event) => {
    const newTime = parseInt(event.target.value, 10);
    setSelectedTime(newTime);
    if (!timerActive) {
      setTimeLeft(newTime);
    }
  };

  const progressPercentage = (selectedTime > 0 && timerActive) ? ((selectedTime - timeLeft) / selectedTime) * 100 : 0;
  const displayProgress = timerFinished ? 100 : progressPercentage;

  return (
    <div className="App">
      <h1>Таймер-Мотиватор</h1>
      <p className="completions">Завершено раз: {completionCount}</p>
      {!timerActive && !timerFinished && (
        <div className="input-group">
          <input
            type="text"
            placeholder="Введите ваше имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select value={selectedTime} onChange={handleTimeChange} disabled={timerActive}>
            {TIME_OPTIONS.map(time => (
              <option key={time} value={time}>{time} сек</option>
            ))}
          </select>
          <button onClick={handleStartTimer} disabled={timerActive || !name.trim()}>
            Старт таймера
          </button>
        </div>
      )}

      {(timerActive || timerFinished) && (
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${displayProgress}%` }}>
            {timerActive && Math.round(displayProgress) + "%"}
          </div>
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

      
      {!timerActive && !timerFinished && (name || selectedTime !== TIME_OPTIONS[0]) && ( // Показываем если есть что сбрасывать
         <button onClick={handleResetOrTryAgain} className="reset-button general-reset">
            Сбросить настройки
         </button>
      )}
    </div>
  );
}

export default App;