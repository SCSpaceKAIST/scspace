import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Dropdown, DropdownButton } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css"; // Ensure you import the CSS for react-datepicker

interface RecurrenceProps {
  onChangeHandler: (type: string, value: any) => void;
}

const Recurrence: React.FC<RecurrenceProps> = ({ onChangeHandler }) => {
  const [isRecurrence, setIsRecurrence] = useState(false);
  const [interval, setInterval] = useState(1);
  const [recurUntil, setRecurUntil] = useState<Date | null>(null);
  const [byday, setByday] = useState<number[]>([2]);

  const month2day = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const handleIsRecur = () => {
    onChangeHandler("TOGGLE", 0);
    setIsRecurrence(!isRecurrence);
  };

  const handleValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(Number(event.target.value)) && event.target.value !== "") {
      const newValue = parseInt(event.target.value);
      setInterval(newValue);
      onChangeHandler("INTERVAL", newValue);
    }
  };

  const decreaseInterval = () => {
    if (interval > 1) {
      const newInterval = interval - 1;
      setInterval(newInterval);
      onChangeHandler("INTERVAL", newInterval);
    }
  };

  const increaseInterval = () => {
    const newInterval = interval + 1;
    setInterval(newInterval);
    onChangeHandler("INTERVAL", newInterval);
  };

  const handleDay = (event: React.MouseEvent<HTMLButtonElement>) => {
    const day = parseInt(event.currentTarget.id);
    const newByday = byday.includes(day)
      ? byday.filter((d) => d !== day)
      : [...byday, day];
    setByday(newByday);
    onChangeHandler("BYDAY", newByday);
  };

  return (
    <div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="checkbox"
          onChange={handleIsRecur}
        />
        <label className="form-check-label">정기예약</label>
      </div>
      {isRecurrence && (
        <div className="container features" id="features">
          <div className="mid-align">
            <div className="top-margin1 selectday">
              <h5>해당 날짜</h5>
              <div>
                <button
                  type="button"
                  id="1"
                  className={byday.includes(1) ? "active_day" : "inactive_day"}
                  onClick={handleDay}
                >
                  MON
                </button>
                <button
                  type="button"
                  id="2"
                  className={byday.includes(2) ? "active_day" : "inactive_day"}
                  onClick={handleDay}
                >
                  TUE
                </button>
                <button
                  type="button"
                  id="3"
                  className={byday.includes(3) ? "active_day" : "inactive_day"}
                  onClick={handleDay}
                >
                  WED
                </button>
                <button
                  type="button"
                  id="4"
                  className={byday.includes(4) ? "active_day" : "inactive_day"}
                  onClick={handleDay}
                >
                  THR
                </button>
                <button
                  type="button"
                  id="5"
                  className={byday.includes(5) ? "active_day" : "inactive_day"}
                  onClick={handleDay}
                >
                  FRI
                </button>
                <button
                  type="button"
                  id="6"
                  className={byday.includes(6) ? "active_day" : "inactive_day"}
                  onClick={handleDay}
                >
                  SAT
                </button>
                <button
                  type="button"
                  id="7"
                  className={byday.includes(7) ? "active_day" : "inactive_day"}
                  onClick={handleDay}
                >
                  SUN
                </button>
              </div>
            </div>
            <h5 className="top-margin1">간격(주)</h5>
            <div className="interval-block">
              <button type="button" onClick={decreaseInterval}>
                -
              </button>
              <input
                type="text"
                value={interval}
                inputMode="decimal"
                min="1"
                step="1"
                onChange={handleValue}
              />
              <button type="button" onClick={increaseInterval}>
                +
              </button>
            </div>
          </div>

          <div className="recur-until-timebox">
            <DatePicker
              onChange={(date: Date | null) => {
                setRecurUntil(date);
                onChangeHandler("UNTIL", date);
              }}
              selected={recurUntil}
              dateFormat="yyyy/MM/dd"
              className="form-control"
              selectsStart
              placeholderText="종료 시각"
              timeIntervals={10}
            />
          </div>
        </div>
      )}
      <hr />
      <br />
    </div>
  );
};

export default Recurrence;
