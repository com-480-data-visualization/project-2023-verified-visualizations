import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateSelector = ({ onDateRangeSelect }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDateRangeSelect = () => {
    // Convert the selected dates to MongoDB-compatible format
    const formattedStartDate = startDate.toISOString();
    const formattedEndDate = endDate.toISOString();

    // Generate the MongoDB query based on the date range
    const query = {
      startTime: {
        $gte: formattedStartDate,
        $lt: formattedEndDate
      }
    };

    // Pass the query to the parent component
    onDateRangeSelect(query);
  };

  return (
    <div>
      <h2>Date Selector</h2>
      <div>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          placeholderText="End Date"
          minDate={startDate}
        />
        <button onClick={handleDateRangeSelect}>Generate Query</button>
      </div>
    </div>
  );
};

export default DateSelector;
