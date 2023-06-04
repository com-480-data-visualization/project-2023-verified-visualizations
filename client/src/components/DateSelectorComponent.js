import React, { useState } from 'react';
import { formatISO, parseISO } from 'date-fns';

const DateSelector = ({ onQueryChange }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleGenerateQuery = () => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const formattedStart = formatISO(start, { representation: 'date' });
      const formattedEnd = formatISO(end, { representation: 'date' });

      const query = {
        timestamp: {
          $gte: formattedStart,
          $lte: formattedEnd,
        },
      };

      onQueryChange(query);
    }
  };

  return (
    <div>
      <label htmlFor="start-date">Start Date:</label>
      <input type="date" id="start-date" value={startDate} onChange={handleStartDateChange} />

      <label htmlFor="end-date">End Date:</label>
      <input type="date" id="end-date" value={endDate} onChange={handleEndDateChange} />

      <button onClick={handleGenerateQuery}>Generate Query</button>
    </div>
  );
};

export default DateSelector;
