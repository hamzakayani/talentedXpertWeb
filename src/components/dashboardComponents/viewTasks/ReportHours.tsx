import React, { useEffect, useState } from 'react';
import HoursHistory from './HoursHistory';
import { reportHoursSchema } from '@/schemas/reportHoursSchema/reportHoursSchema';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { dataForServer } from '@/models/reportHoursModel/reportHoursModel';
import FileUpload from '@/components/common/upload/FileUpload';
import { Icon } from '@iconify/react/dist/iconify.js';
import { AmountType } from '@/services/enums/enums';

interface HistoryEntry {
  date: string;
  time: string;
  timestamp: string;
  comment: string;
}

const ReportHours = ({ task, hoursSubmit, setHoursSubmit, proposalAmount }: any) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [hoursHistory, setHoursHistory] = useState<HistoryEntry[]>([]);
  const [manualHours, setManualHours] = useState<string>('');
  const [manualMinutes, setManualMinutes] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  type FormSchemaType = z.infer<typeof reportHoursSchema>;

  const { register, handleSubmit, setValue, watch, clearErrors, formState: { errors } } = useForm<FormSchemaType>({
    defaultValues: {
      startTime: '',
      endTime: '',
      duration: 0,
      comment: '',
      TEProfileId: Number(user?.profile[0].id),
      taskId: Number(task?.id),
      amount: 0
    },
    resolver: zodResolver(reportHoursSchema),
    mode: 'all'
  });

 const  calculateAmount = (minutes:number) => {
  const hours = minutes / 60;
  const totalAmount = hours* proposalAmount;
  return Number(totalAmount.toFixed(2));

 }

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
    setStartTime(null);
  };

  const handleStart = (): void => {
    setIsRunning(true);
    setStartTime(new Date().toISOString());
    setValue('startTime', new Date().toISOString());
  };

  const handleStop = (): void => {
    setIsRunning(false);
    setEndTime(new Date().toISOString())
    setValue('endTime', new Date().toISOString());
  };

  const handleReset = (): void => {
    setIsRunning(false);
    setSeconds(0);
    setStartTime(null);
    setEndTime(null);
    setValue('startTime', '');
    setValue('endTime', '');
  };

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    let totalSeconds = seconds;
    let durationInMinutes = 0;

    // Calculate duration from timer
    if (startTime && isRunning) {
      const endTime = new Date().toISOString();
      setValue('endTime', endTime);
      totalSeconds = seconds;
      durationInMinutes = Math.floor(totalSeconds / 60);
    }
    else if (startTime && !isRunning) {
      totalSeconds = seconds;
      durationInMinutes = Math.floor(totalSeconds / 60);
    }

    // Calculate duration from manual entry
    else if (manualHours || manualMinutes) {
      setStartTime(null)
      const hours = parseInt(manualHours) || 0;
      const minutes = parseInt(manualMinutes) || 0;
      if (hours <= 24 && minutes <= 59) {
        totalSeconds = (hours * 3600) + (minutes * 60);
        durationInMinutes = (hours * 60) + minutes;
      }
    }
    console.log('duration min', durationInMinutes)

    const updatedData = {
      ...data,
      startTime: (manualHours || manualMinutes) ? null : startTime ? startTime : new Date().toISOString(),
      endTime: (manualHours || manualMinutes) ? null : endTime ? endTime : new Date().toISOString(),
      duration: durationInMinutes,
      amount: calculateAmount(durationInMinutes),
      comment: comment,
    };


    const formData = dataForServer(updatedData);

    try {
      const res = await apiCall(requests.hourlyLog, formData, 'post', true, dispatch, user, router);
      if (res?.error) {
        const message = res?.error?.message;
        if (Array.isArray(message)) {
          message?.map((msg: string) => toast.error(msg || 'Something went wrong, please try again'));
        } else {
          toast.error(message || 'Something went wrong, please try again');
        }
      } else {
        toast.success(res?.data?.message);
        hoursSubmit ? setHoursSubmit(false) : setHoursSubmit(true);
        if (totalSeconds > 0) {
          addToHistory(totalSeconds);
        }
      }
    } catch (err) {
      console.warn(err);
    }

    setIsRunning(false);
    setSeconds(0);
  };

  const handleFileSelect = async (files: File[], fileObjs: any[],) => {


  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="box m-2 p-3 mt-4 bg-black report-hours-section">
        <h4 className="text-white mb-3">Report Hours</h4>

        <div className="date-picker-section mb-3">
          <label htmlFor="dateSelect" className="text-white me-2">Select Date:</label>
          <input
            type="date"
            id="dateSelect"
            className="form-control d-inline-block w-auto invert me-3"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button type='button' className="btn bg-dark text-light fs-12 me-4" >
            <span className="text-white"><Icon className='attach-icon' icon="fluent:attach-16-regular" /> Attach File</span>
          </button>
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
              type="button"
              className={`btn btn-success rounded-pill timer-btn ${isRunning ? 'disabled' : ''}`}
              onClick={handleStart}
            >
              Start
            </button>
            <button
              type="button"
              className={`btn btn-danger rounded-pill timer-btn ${!isRunning ? 'disabled' : ''}`}
              onClick={handleStop}
            >
              Stop
            </button>
          </div>
        </div>

        <div className="comment-section mb-3">
          <textarea
            className="form-control mb-3 invert"
            placeholder="Add a comment"
            value={comment}
            {...register('comment')}
            onChange={(e) => {
              setComment(e.target.value);
              setValue('comment', e.target.value);
            }}
          />
          
          <button
            type="submit"
            className="btn btn-primary rounded-pill"
          >
            Submit
          </button>
        </div>

        {task?.weeklyMilestones && <HoursHistory HoursHistory={task?.weeklyMilestones} />}
      </div>
    </form>
  );
};

export default ReportHours;