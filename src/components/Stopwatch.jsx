import { useState, useEffect } from 'react';

export default function Stopwatch ({ isRunning }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (isRunning) {
        const id = setInterval(() => {
            setTime(time => time + 1);
        }, 1000);

        return () => clearInterval(id);
    }
  }, [isRunning]);

  const minutes = Math.floor(time / 60).toString().padStart(2, '0');
  const seconds = (time % 60).toString().padStart(2, '0');
  const formattedTime = `${minutes}:${seconds}`;

  return (
    <div style={{fontFamily: 'Bebas Neue'}}>
      ⏱️ {formattedTime}
    </div>
  );
}
