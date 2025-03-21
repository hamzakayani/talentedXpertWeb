import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { RootState, useAppDispatch } from '@/store/Store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface HourlyLog {
  id: number;
  date: string;
  startTime: string | null;
  endTime: string | null;
  duration: number;
  isApproved: boolean;
  comment: string;
}

interface WeeklyMilestone {
  id: number;
  week: number;
  startDate: string;
  endDate: string;
  status: string;
  taskId: number;
  hourlylogs: HourlyLog[];
}

interface HoursHistoryProps {
  HoursHistory: WeeklyMilestone[];
  
}

const HoursHistory: React.FC<HoursHistoryProps> = ({ HoursHistory }) => {

 const [hoursHistory, setHoursHistory]= useState(HoursHistory)
  const user = useSelector((state: RootState) => state.user)
    const dispatch = useAppDispatch();
    const router = useRouter();

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
  };

  const formatTime = (time: string | null): string => {
    if (!time) return '';
    const date = new Date(time);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  const calculateTotalHours = (): string => {
    const totalSeconds = hoursHistory
      .flatMap(milestone => milestone.hourlylogs)
      .reduce((acc, log) => acc + log.duration, 0);
    return formatDuration(totalSeconds);
  };

  const formatDateWithDay = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handleApprove = async(logId: number) =>  {
     const data =  {
        "isApproved": true
     }
     try {
          const res = await apiCall(requests.hourlyLog +'/'+ Number(logId) , data, 'put', true, dispatch, user, router);
          if (res?.error) {
            const message = res?.error?.message;
            if (Array.isArray(message)) {
              message?.map((msg: string) => toast.error(msg || 'Something went wrong, please try again'));
            } else {
              toast.error(message || 'Something went wrong, please try again');
            }
          } else {
            toast.success(res?.data?.message);
            setHoursHistory(prev => prev.map(milestone => ({
              ...milestone,
              hourlylogs: milestone.hourlylogs.map(log => 
                log.id === logId 
                  ? { ...log, isApproved: true } 
                  : log
              )
            })));
            
            
          }
        } catch (err) {
          console.warn(err);
        }
    
  };

  const groupedByWeek = hoursHistory.reduce((acc, milestone) => {
    acc[milestone.week] = milestone.hourlylogs;
    return acc;
  }, {} as Record<number, HourlyLog[]>);

  return (
    <div className="hours-history mt-4 position-relative">
      <div className="total-hours mb-3 position-absolute top-0 end-0">
        <span className="text-white fw-bold">Total Hours: {calculateTotalHours()}</span>
      </div>
      <h6 className="text-white">Recent Reported Hours</h6>
      <div className="history-list text-white pt-4">
        {Object.keys(groupedByWeek).length === 0 ? (
          <p>No hours reported yet</p>
        ) : (
          Object.entries(groupedByWeek).map(([week, logs]) => (
            <div key={week} className="week-group mb-4">
              <h5 className="text-white">Week {week}</h5>
              <ul className="list-unstyled">
                {logs.map((log, index) => (
                  <li
                    key={index}
                    className="history-entry p-2 mb-2 bg-dark rounded"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      {/* <div>
                        {formatDateWithDay(log.date)} - 
                        {` ${formatTime(log.startTime)} to  ${formatTime(log.endTime)}`} -   
                        {formatDuration(log.duration)}
                      </div> */}
                      <div className="d-flex align-items-center gap-3">
                        <span className="fw-bold">{formatDateWithDay(log.date)}</span>
                        <span>
                          {formatTime(log.startTime)}
                          <span className="mx-2">-</span>
                          {formatTime(log.endTime)}
                        </span>
                        <span className="text-info fw-bold">{formatDuration(log.duration)}</span>
                      </div>
                      
                      {user?.profile[0]?.type === 'TR' && (
                        <button
                          className={`btn btn-sm ${log.isApproved ? 'btn-success' : 'btn-primary'}`}
                          onClick={() => handleApprove(log.id)}
                          disabled={log.isApproved}
                        >
                          {log.isApproved ? 'Approved ✓' : 'Approve'}
                        </button>
                      )}
                    </div>
                    <div className="comment text-white mt-1">
                      {log.comment || 'No comment'}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HoursHistory;