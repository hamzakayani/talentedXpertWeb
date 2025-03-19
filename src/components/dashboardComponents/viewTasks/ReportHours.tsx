import React, { useEffect, useState } from 'react';
import HoursHistory from './HoursHistory';

interface HistoryEntry {
  date: string;
  time: string;
  timestamp: string;
  comment: string;
}

const ReportHours: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [hoursHistory, setHoursHistory] = useState<HistoryEntry[]>([]);
  const [manualHours, setManualHours] = useState<string>('');
  const [manualMinutes, setManualMinutes] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const addToHistory = (totalSeconds: number): void => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    const newEntry: HistoryEntry = {
      date: selectedDate,
      time: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
      timestamp: new Date().toISOString(),
      comment: comment
    };
    
    setHoursHistory([newEntry, ...hoursHistory]);
    setComment('');
    setSeconds(0);
    setManualHours('');
    setManualMinutes('');
  };

  const handleStart = (): void => setIsRunning(true);

  const handleStop = (): void => setIsRunning(false);

  const handleReset = (): void => {
    setIsRunning(false);
    setSeconds(0);
  };

  const handleSubmit = (): void => {
    let totalSeconds = seconds;
    if (manualHours || manualMinutes) {
      const hours = parseInt(manualHours) || 0;
      const minutes = parseInt(manualMinutes) || 0;
      if (hours <= 24 && minutes <= 59) {
        totalSeconds = (hours * 3600) + (minutes * 60);
      }
    }
    if (totalSeconds > 0) {
      addToHistory(totalSeconds);
    }
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <div className="box m-2 p-3 mt-4 bg-black report-hours-section">
      <h4 className="text-white mb-3">Report Hours</h4>
      
      <div className="date-picker-section mb-3">
        <label htmlFor="dateSelect" className="text-white me-2 ">Select Date:</label>
        <input
          type="date"
          id="dateSelect"
          className="form-control d-inline-block w-auto invert"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="track-time-container p-3 bg-dark rounded mb-3">
        <h6 className="mb-3 text-white">Manual Log</h6>
        <div className="d-flex gap-2 align-items-center">
          <input 
            type="number" 
            className="form-control w-25 invert" 
            placeholder="Hours" 
            min="0" 
            max="24" 
            value={manualHours}
            onChange={(e) => setManualHours(e.target.value)}
          />
          <span>:</span>
          <input 
            type="number" 
            className="form-control w-25 invert" 
            placeholder="Minutes" 
            min="0" 
            max="59" 
            value={manualMinutes}
            onChange={(e) => setManualMinutes(e.target.value)}
          />
        </div>
      </div>

      <div className="timer-container p-3 bg-dark rounded mb-3">
        <h6 className="mb-3 text-white">Timer</h6>
        <div className="d-flex align-items-center gap-3">
          <div className="timer-display bg-dark text-white p-2 rounded">
            <span>{formatTime(seconds)}</span>
          </div>
          <button
            className={`btn btn-success rounded-pill timer-btn ${isRunning ? 'disabled' : ''}`}
            onClick={handleStart}
          >
            Start
          </button>
          <button
            className={`btn btn-danger rounded-pill timer-btn ${!isRunning ? 'disabled' : ''}`}
            onClick={handleStop}
          >
            Stop
          </button>
          {/* <button
            className="btn btn-warning rounded-pill timer-btn"
            onClick={handleReset}
          >
            Reset
          </button> */}
        </div>
      </div>

      <div className="comment-section mb-3">
        <textarea
          className="form-control mb-3 invert"
          placeholder="Add a comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button 
          className="btn btn-primary rounded-pill"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      <HoursHistory hoursHistory={hoursHistory} />
    </div>
  );
};

export default ReportHours;