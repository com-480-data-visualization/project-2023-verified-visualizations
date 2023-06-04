import React from 'react';

const TimeSlider = ({ day, startTime, endTime, onTimeRangeChange }) => {
  const handleStartTimeChange = (event) => {
    const newStartTime = event.target.value;
    onTimeRangeChange(day, newStartTime, endTime);
  };

  const handleEndTimeChange = (event) => {
    const newEndTime = event.target.value;
    onTimeRangeChange(day, startTime, newEndTime);
  };

  return (
    <div>
      <h3>{day}</h3>
      <div>
        <label htmlFor={`start-time-${day}`}>Start Time:</label>
        <input
          type="time"
          id={`start-time-${day}`}
          value={startTime}
          onChange={handleStartTimeChange}
        />
      </div>
      <div>
        <label htmlFor={`end-time-${day}`}>End Time:</label>
        <input
          type="time"
          id={`end-time-${day}`}
          value={endTime}
          onChange={handleEndTimeChange}
        />
      </div>
    </div>
  );
};

export default TimeSlider;
