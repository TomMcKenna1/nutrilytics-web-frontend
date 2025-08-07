import React, { useState, useEffect } from "react";
import styles from "./DateTimePicker.module.css";

interface DateTimePickerProps {
  onChange: (date: Date) => void;
  initialDateTime?: Date;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  onChange,
  initialDateTime,
}) => {
  const toLocalISOString = (date: Date) => {
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzoffset)
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  };

  const [dateTime, setDateTime] = useState(
    toLocalISOString(initialDateTime || new Date())
  );
  const maxDateTime = toLocalISOString(new Date());

  useEffect(() => {
    if (initialDateTime) {
      setDateTime(toLocalISOString(initialDateTime));
    }
  }, [initialDateTime]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDateTime = event.target.value;
    setDateTime(newDateTime);
    onChange(new Date(newDateTime));
  };

  return (
    <div className={styles.dateTimePickerContainer}>
      <input
        type="datetime-local"
        value={dateTime}
        max={maxDateTime}
        onChange={handleChange}
        className={styles.dateTimePickerInput}
        aria-label="Meal date and time"
      />
    </div>
  );
};

export default DateTimePicker;
