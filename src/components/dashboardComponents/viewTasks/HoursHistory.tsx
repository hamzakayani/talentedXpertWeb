import React from 'react';

interface HistoryEntry {
  date: string;
  time: string;
  timestamp: string;
  comment: string;
}

interface HoursHistoryProps {
  hoursHistory: HistoryEntry[];
}

const HoursHistory: React.FC<HoursHistoryProps> = ({ hoursHistory }) => {
  const calculateTotalHours = (): string => {
    const totalSeconds = hoursHistory.reduce((acc, entry) => {
      const [hours, minutes, seconds] = entry.time.split(':').map(Number);
      return acc + (hours * 3600) + (minutes * 60) + seconds;
    }, 0);
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Function to format date with day name
  const formatDateWithDay = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long', // Adds full day name (e.g., "Monday")
      year: 'numeric',
      month: 'long',    // Full month name (e.g., "March")
      day: 'numeric'    // Day number (e.g., "17")
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="hours-history mt-4">
      <h6 className="text-white">Recent Reported Hours</h6>
      <div className="total-hours mb-3">
        <span className="text-white">Total Hours: {calculateTotalHours()}</span>
      </div>
      <div className="history-list text-white">
        {hoursHistory.length === 0 ? (
          <p>No hours reported yet</p>
        ) : (
          <ul className="list-unstyled">
            {hoursHistory.map((entry: HistoryEntry, index: number) => (
              <li 
                key={index}
                className="history-entry p-2 mb-2 bg-dark rounded"
              >
                <div>{formatDateWithDay(entry.date)} - {entry.time}</div>
                <div className="comment text-white mt-1">
                  {entry.comment || 'No comment'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HoursHistory;