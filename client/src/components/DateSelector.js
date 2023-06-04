import React, { useState } from 'react';

const DateSelector = ({ onDateSelection }) => {
  const [selectedDates, setSelectedDates] = useState([]);

  const handleDateChange = (event) => {
    const date = event.target.value;

    if (!selectedDates.includes(date)) {
      setSelectedDates((prevSelectedDates) => [...prevSelectedDates, date]);
    }
  };

  const handleDateRemove = (date) => {
    setSelectedDates((prevSelectedDates) =>
      prevSelectedDates.filter((d) => d !== date)
    );
  };

  const handleSelectionDone = () => {
    onDateSelection(selectedDates);
  };

  return (
    <div>
      <label>Select Dates:</label>
      <div>
        <input type="date" onChange={handleDateChange} />
        <button onClick={handleSelectionDone}>Done</button>
      </div>
      <ul>
        {selectedDates.map((date) => (
          <li key={date}>
            {date}
            <button onClick={() => handleDateRemove(date)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DateSelector;
