import React, { useState } from 'react';

// Calendar Component
const Calendar = ({ onDateSelection }) => {
  const [selectedDates, setSelectedDates] = useState([]);

  const handleDateSelection = (event) => {
    const date = event.target.value;
    setSelectedDates((prevSelectedDates) => [...prevSelectedDates, date]);
  };

  const handleRemoveDate = (date) => {
    setSelectedDates((prevSelectedDates) =>
      prevSelectedDates.filter((d) => d !== date)
    );
  };

  const handleGenerateQuery = () => {
    const query = {
      $or: selectedDates.map((date) => ({
        $and: [
          { starttime: { $gte: new Date(date + 'T00:00:00Z') } },
          { endtime: { $lte: new Date(date + 'T23:59:59Z') } },
        ],
      })),
    };

    console.log('Generated Query:', query);
    // Perform MongoDB operations with the generated query
  };

  return (
    <div>
      <h3>Calendar</h3>
      <div>
        <input type="date" onChange={handleDateSelection} />
      </div>
      <ul>
        {selectedDates.map((date) => (
          <li key={date}>
            {date}
            <button onClick={() => handleRemoveDate(date)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handleGenerateQuery}>Generate Query</button>
    </div>
  );
};

// Time Slider Component
const TimeSlider = ({ day, onTimeRangeChange }) => {
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');

  const handleTimeRangeChange = () => {
    onTimeRangeChange(day, startTime, endTime);
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
          onChange={(e) => setStartTime(e.target.value)}
          onBlur={handleTimeRangeChange}
        />
      </div>
      <div>
        <label htmlFor={`end-time-${day}`}>End Time:</label>
        <input
          type="time"
          id={`end-time-${day}`}
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          onBlur={handleTimeRangeChange}
        />
      </div>
    </div>
  );
};

// Parent Query Generator Component
const QueryBuilder = () => {
  const [timeRanges, setTimeRanges] = useState({});

  const handleTimeRangeChange = (day, startTime, endTime) => {
    setTimeRanges((prevTimeRanges) => ({
      ...prevTimeRanges,
      [day]: { startTime, endTime },
    }));
  };

  return (
    <div>
      <h1>Query Generator</h1>
      <Calendar />
      <div>
        <h2>Time Sliders</h2>
        <TimeSlider day="Monday" onTimeRangeChange={handleTimeRangeChange} />
        <TimeSlider day="Tuesday" onTimeRangeChange={handleTimeRangeChange} />
        <TimeSlider day="Wednesday" onTimeRangeChange={handleTimeRangeChange} />
        <TimeSlider day="Thursday" onTimeRangeChange={handleTimeRangeChange} />
        <TimeSlider day="Friday" onTimeRangeChange={handleTimeRangeChange} />
        <TimeSlider day="Saturday" onTimeRangeChange={handleTimeRangeChange} />
        <TimeSlider day="Sunday" onTimeRangeChange={handleTimeRangeChange} />
      </div>
    </div>
  );
};

export default QueryBuilder;
