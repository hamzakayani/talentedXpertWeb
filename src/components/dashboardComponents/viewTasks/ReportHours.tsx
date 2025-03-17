import React, { useEffect, useState } from 'react';

interface HistoryEntry {
  date: string;
  time: string;
  timestamp: string;
}

const ReportHours: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [hoursHistory, setHoursHistory] = useState<HistoryEntry[]>([]);
  const [manualHours, setManualHours] = useState<string>('');
  const [manualMinutes, setManualMinutes] = useState<string>('');

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
      timestamp: new Date().toISOString()
    };
    
    setHoursHistory([newEntry, ...hoursHistory]);
  };

  const handleStart = (): void => setIsRunning(true);

  const handleStop = (): void => {
    setIsRunning(false);
    if (seconds > 0) {
      addToHistory(seconds);
      setSeconds(0); // Reset timer after logging
    }
  };

  const handleReset = (): void => {
    setIsRunning(false);
    setSeconds(0);
  };

  const handleSubmitHours = (): void => {
    const hours = parseInt(manualHours) || 0;
    const minutes = parseInt(manualMinutes) || 0;
    
    if ((hours > 0 || minutes > 0) && hours <= 24 && minutes <= 59) {
      const totalSeconds = (hours * 3600) + (minutes * 60);
      addToHistory(totalSeconds);
      setManualHours('');
      setManualMinutes('');
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedDate(e.target.value);
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setManualHours(e.target.value);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setManualMinutes(e.target.value);
  };

  return (
    <div className="box m-2 p-3 mt-4 bg-black report-hours-section">
      <h4 className="text-white mb-3">Report Hours</h4>
      <div className="track-time-container p-3 bg-gray rounded">
        <h6 className="text-white mb-3">Track Time</h6>

        <div className="time-tracking-controls d-flex flex-column gap-3">
          <div className="date-picker-section">
            <label htmlFor="dateSelect" className="text-white me-2">Select Date:</label>
            <input
              type="date"
              id="dateSelect"
              className="form-control d-inline-block w-auto"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="manual-entry-section">
            <h6 className="text-white mt-3">Manual Entry</h6>
            <div className="d-flex gap-2 align-items-center">
              <input 
                type="number" 
                className="form-control w-25" 
                placeholder="Hours" 
                min="0" 
                max="24" 
                value={manualHours}
                onChange={handleHoursChange}
              />
              <span className="text-white">:</span>
              <input 
                type="number" 
                className="form-control w-25" 
                placeholder="Minutes" 
                min="0" 
                max="59" 
                value={manualMinutes}
                onChange={handleMinutesChange}
              />
              <button 
                className="btn btn-outline-info rounded-pill ms-2"
                onClick={handleSubmitHours}
              >
                Submit Hours
              </button>
            </div>
          </div>

          <div className="timer-section d-flex align-items-center gap-3">
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
            <button
              className="btn btn-warning rounded-pill timer-btn"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="hours-history mt-4">
          <h6 className="text-white">Recent Reported Hours</h6>
          <div className="history-list text-white">
            {hoursHistory.length === 0 ? (
              <p>No hours reported yet</p>
            ) : (
              <ul className="list-unstyled">
                {hoursHistory.map((entry: HistoryEntry, index: number) => (
                  <li key={index}>
                    {entry.date} - {entry.time}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHours;