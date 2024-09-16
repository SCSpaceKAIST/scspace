import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";

interface TimeSelectorProps {
  dateFrom: Date;
  dateTo: Date;
  setDateFrom: (date: Date) => void;
  setDateTo: (date: Date) => void;
  maxTime: number; // 최대 예약 시간 (분 단위)
  minDate: Date; // 예약 가능 시작 날짜
  maxDate: Date; // 예약 가능 종료 날짜
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
  maxTime,
  minDate,
  maxDate,
}) => {
  const { t } = useTranslation();

  // 시간 조정 함수 (분 단위로 추가 또는 감소)
  const adjustMinutesToDateTo = (minutes: number) => {
    const newDate = new Date(dateTo.getTime() + minutes * 60000);
    handleDateToChange(newDate);
  };

  // 총 예약 시간 계산 함수
  const getTotalReservationTime = () => {
    const diffInMs = dateTo.getTime() - dateFrom.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}시간 ${minutes}분`;
  };

  // 시간 형식화 함수
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return { hours, minutes: mins };
  };

  // dateTo 변경 함수
  const handleDateToChange = (date: Date | null) => {
    if (date) {
      // dateTo가 dateFrom보다 이전으로 설정되지 않도록 검증
      if (date.getTime() < dateFrom.getTime()) {
        alert(t("종료 시간은 시작 시간보다 이전일 수 없습니다."));
        return;
      }

      // 다음 날 00:00:00 계산
      const nextDayMidnight = new Date(dateFrom);
      nextDayMidnight.setDate(nextDayMidnight.getDate() + 1); // 다음 날로 변경
      nextDayMidnight.setHours(0, 0, 0, 0); // 00:00:00으로 설정

      // 종료 시간이 다음 날 00:00:00을 넘지 않도록 검증
      if (date.getTime() > nextDayMidnight.getTime()) {
        alert(t("종료 시간은 자정을 넘을 수 없습니다."));
        return;
      }

      // 최대 예약 시간을 초과하지 않도록 검증
      if (date.getTime() - dateFrom.getTime() <= maxTime * 60000) {
        setDateTo(date);
      } else {
        const { hours, minutes } = formatTime(maxTime);
        alert(`최대 예약 시간은 ${hours}시간 ${minutes}분입니다.`);
      }
    }
  };

  return (
    <div>
      <div className="row">
        <h5>{t("예약 시간")}</h5>
        <div className="col-md-3 form-group">
          {t("시작 시간")}
          <br />
          <DatePicker
            selected={dateFrom}
            onChange={(date) => {
              if (date) {
                setDateFrom(date);
                // 시작 시간을 변경하면 종료 시간을 시작 시간으로 설정
                setDateTo(date);
              }
            }}
            minDate={minDate}
            maxDate={maxDate}
            dateFormat="yyyy/MM/dd h:mm aa"
            className="form-control"
            selectsStart
            placeholderText={t("예약 시작 시간 ~")}
            timeIntervals={10}
            showTimeSelect
            required
          />
        </div>

        <div className="col-md-3 form-group mt-3 mt-md-0">
          {t("종료 시간")}
          <br />
          <DatePicker
            selected={dateTo}
            onChange={handleDateToChange}
            minDate={dateFrom}
            maxDate={maxDate}
            dateFormat="yyyy/MM/dd h:mm aa"
            className="form-control"
            selectsEnd
            timeIntervals={10}
            showTimeSelect
            required
          />
          {/* 시간 조정 버튼 */}
          <div className="mt-2">
            <button
              type="button"
              className="btn btn-outline-primary btn-sm me-2"
              onClick={() => adjustMinutesToDateTo(30)}
            >
              +30분
            </button>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => adjustMinutesToDateTo(-30)}
            >
              -30분
            </button>
          </div>
        </div>
      </div>
      {/* 총 예약 시간 표시 */}
      <div className="mt-3">
        <strong>{t("총 예약 시간")}: </strong>
        {getTotalReservationTime()}
      </div>
      <hr />
    </div>
  );
};

export default TimeSelector;
