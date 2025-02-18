// CountdownTimer.jsx (Part 1 of 2)
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const CountdownTimer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialMinutes = parseInt(searchParams.get('minutes')) || 25;

  const [totalTime, setTotalTime] = useState(initialMinutes * 60);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableMinutes, setEditableMinutes] = useState(String(initialMinutes));
  const audioRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (audioRef.current) {
        audioRef.current.play();
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, navigate]);

  const toggleTimer = () => {
    if (!isRunning && isEditing) {
      const minutes = parseInt(editableMinutes);
      if (!isNaN(minutes) && minutes > 0) {
        setTotalTime(minutes * 60);
        setTimeLeft(minutes * 60);
        setIsEditing(false);
      }
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
    setIsEditing(false);
  };

  const handleMinutesClick = () => {
    if (!isRunning) {
      setIsEditing(true);
    }
  };

  const handleMinutesChange = (e) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 0 && parseInt(value) <= 99)) {
      setEditableMinutes(value);
    }
  };

  const handleMinutesBlur = () => {
    const minutes = parseInt(editableMinutes);
    if (!isNaN(minutes) && minutes > 0) {
      setTotalTime(minutes * 60);
      setTimeLeft(minutes * 60);
    } else {
      setEditableMinutes(String(Math.floor(timeLeft / 60)).padStart(2, '0'));
    }
    setIsEditing(false);
  };


  // CountdownTimer.jsx (Part 2 of 2)

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const progress = (totalTime - timeLeft) / totalTime;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="relative inline-block">
        <audio ref={audioRef}>
          <source src="https://cdn.freesound.org/previews/536/536108_11423254-lq.mp3" type="audio/mpeg" />
        </audio>

        <svg className="w-80 h-80 transform -rotate-90" viewBox="0 0 256 256">
          <circle
            cx="128"
            cy="128"
            r="120"
            className="stroke-gray-200"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            className="stroke-blue-500"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease'
            }}
          />
        </svg>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
          <div className="flex justify-center items-center text-6xl font-mono mb-4 space-x-1">
            {isEditing ? (
              <input
                type="number"
                value={editableMinutes}
                onChange={handleMinutesChange}
                onBlur={handleMinutesBlur}
                className="w-24 bg-transparent text-center text-6xl font-mono focus:outline-none"
                autoFocus
              />
            ) : (
              <span 
                onClick={handleMinutesClick}
                className={!isRunning ? "cursor-pointer" : ""}
              >
                {String(minutes).padStart(2, '0')}
              </span>
            )}
            <span>:</span>
            <span>{String(seconds).padStart(2, '0')}</span>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={toggleTimer}
              className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;