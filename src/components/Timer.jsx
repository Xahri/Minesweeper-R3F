import { useState, useEffect } from 'react';

export default function Timer ({ onTimerOver, timeInMinutes, isRunning }) {
  const [timeLeft, setTimeLeft] = useState(timeInMinutes * 60);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    if (isRunning){
        const id = setInterval(() => {
          setTimeLeft(timeLeft => timeLeft - 1);
        }, 1000);

        setTimerId(id);

        return () => clearInterval(id);
    }
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimerOver();
      clearInterval(timerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, timerId]);

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const formattedTime = `${minutes}:${seconds}`;

  return (
    <div style={{fontFamily: 'Bebas Neue'}}>
      ⌛ {formattedTime}
    </div>
  );
}
