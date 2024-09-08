import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { setHours, setMinutes } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import WorkCheckbox from "./CheckBoxList";

interface TimeProps {
  limitdate: {
    mindays: number;
    maxdays: number;
    maxUseHour: number;
  };
  rehersal?: boolean;
  rehersalLastday?: boolean;
  work?: boolean;
  onChangeHandler: (field: string, date: Date | null, isWork?: boolean) => void;
}

const Time: React.FC<TimeProps> = (props) => {
  const { t } = useTranslation();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [rehersalStartDate, setRehersalStartDate] = useState<Date | null>(null);
  const [rehersalEndDate, setRehersalEndDate] = useState<Date | null>(null);
  const [lastRehersalStartDate, setLastRehersalStartDate] =
    useState<Date | null>(null);
  const [lastRehersalEndDate, setLastRehersalEndDate] = useState<Date | null>(
    null
  );
  const [workStartDate, setWorkStartDate] = useState<Date | null>(null);
  const [workEndDate, setWorkEndDate] = useState<Date | null>(null);
  const [isWork, setIsWork] = useState(false);

  const calcDate = (date: Date, days: number) => {
    const startDate = new Date(date);
    return new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + days
    );
  };

  const filterTime = (time: Date) => {
    if (!startDate) return false;
    const startTime = new Date(startDate);
    const selectedTime = new Date(time);
    const limitTime =
      props.limitdate.maxUseHour === -1
        ? new Date(
            startTime.getFullYear(),
            startTime.getMonth(),
            startTime.getDate(),
            24,
            0
          )
        : new Date(
            startTime.getFullYear(),
            startTime.getMonth(),
            startTime.getDate(),
            startTime.getHours() + props.limitdate.maxUseHour,
            startTime.getMinutes()
          );

    return (
      startTime.getTime() < selectedTime.getTime() &&
      limitTime.getTime() >= selectedTime.getTime()
    );
  };

  const filterTimeRehersal = (time: Date) => {
    if (!rehersalStartDate) return false;
    const startTime = new Date(rehersalStartDate);
    const selectedTime = new Date(time);
    const limitTime =
      props.limitdate.maxUseHour === -1
        ? new Date(
            startTime.getFullYear(),
            startTime.getMonth(),
            startTime.getDate(),
            24,
            0
          )
        : new Date(
            startTime.getFullYear(),
            startTime.getMonth(),
            startTime.getDate(),
            startTime.getHours() + props.limitdate.maxUseHour,
            startTime.getMinutes()
          );

    return (
      startTime.getTime() < selectedTime.getTime() &&
      limitTime.getTime() >= selectedTime.getTime()
    );
  };

  const filterTimeLastRehersal = (time: Date) => {
    if (!lastRehersalStartDate) return false;
    const startTime = new Date(lastRehersalStartDate);
    const selectedTime = new Date(time);
    const limitTime =
      props.limitdate.maxUseHour === -1
        ? new Date(
            startTime.getFullYear(),
            startTime.getMonth(),
            startTime.getDate(),
            24,
            0
          )
        : new Date(
            startTime.getFullYear(),
            startTime.getMonth(),
            startTime.getDate(),
            startTime.getHours() + props.limitdate.maxUseHour,
            startTime.getMinutes()
          );

    return (
      startTime.getTime() < selectedTime.getTime() &&
      limitTime.getTime() >= selectedTime.getTime()
    );
  };

  const filterTimeWork = (time: Date) => {
    if (!workStartDate) return false;
    const startTime = new Date(workStartDate);
    const selectedTime = new Date(time);
    const limitTime =
      props.limitdate.maxUseHour === -1
        ? new Date(
            startTime.getFullYear(),
            startTime.getMonth(),
            startTime.getDate(),
            24,
            0
          )
        : new Date(
            startTime.getFullYear(),
            startTime.getMonth(),
            startTime.getDate(),
            startTime.getHours() + props.limitdate.maxUseHour,
            startTime.getMinutes()
          );

    return (
      startTime.getTime() < selectedTime.getTime() &&
      limitTime.getTime() >= selectedTime.getTime()
    );
  };

  const handleValueChange_checkbox = () => {
    setIsWork(!isWork);
  };

  return (
    <div>
      <div className="row">
        <h5>{t("예약 시간")}</h5>
        <div className="col-md-6 form-group">
          {t("시작")}
          <DatePicker
            onChange={(date) => {
              setStartDate(date);
              props.onChangeHandler("timeFrom", date);
              setEndDate(date);
            }}
            selected={startDate}
            minDate={calcDate(new Date(), props.limitdate.mindays)}
            maxDate={calcDate(new Date(), props.limitdate.maxdays)}
            dateFormat="yyyy/MM/dd h:mm aa"
            className="form-control"
            selectsStart
            placeholderText={t("예약 시작 시간 ~")}
            timeIntervals={10}
            showTimeSelect
            required
          />
        </div>

        {startDate ? (
          <div className="col-md-6 form-group mt-3 mt-md-0">
            {t("끝")}
            <DatePicker
              onChange={(date) => {
                setEndDate(date);
                props.onChangeHandler("timeTo", date);
              }}
              selected={endDate}
              dateFormat="yyyy/MM/dd h:mm aa"
              className="form-control"
              selectsEnd
              filterTime={filterTime}
              timeIntervals={10}
              showTimeSelect
              required
            />
          </div>
        ) : (
          <div className="col-md-6 form-group mt-3 mt-md-0">
            {t("끝")}
            <DatePicker className="form-control" disabled required />
          </div>
        )}
      </div>

      {props.rehersal ? (
        <div className="row">
          <h5>{t("당일 리허설")}</h5>
          <div className="col-md-6 form-group">
            {t("시작")}
            <DatePicker
              onChange={(date) => {
                setRehersalStartDate(date);
                props.onChangeHandler("rehersalFrom", date, true);
                setRehersalEndDate(date);
              }}
              selected={rehersalStartDate}
              minDate={calcDate(new Date(), props.limitdate.mindays)}
              maxDate={calcDate(new Date(), props.limitdate.maxdays)}
              dateFormat="yyyy/MM/dd h:mm aa"
              className="form-control"
              selectsStart
              placeholderText={t("없을 시 생략")}
              timeIntervals={10}
              showTimeSelect
            />
          </div>

          {rehersalStartDate ? (
            <div className="col-md-6 form-group mt-3 mt-md-0">
              {t("끝")}
              <DatePicker
                onChange={(date) => {
                  setRehersalEndDate(date);
                  props.onChangeHandler("rehersalTo", date, true);
                }}
                selected={rehersalEndDate}
                dateFormat="yyyy/MM/dd h:mm aa"
                className="form-control"
                selectsEnd
                filterTime={filterTimeRehersal}
                timeIntervals={10}
                showTimeSelect
              />
            </div>
          ) : (
            <div className="col-md-6 form-group mt-3 mt-md-0">
              {t("끝")}
              <DatePicker className="form-control" disabled />
            </div>
          )}
        </div>
      ) : null}

      {props.rehersalLastday ? (
        <div className="row">
          <h5>{t("전날 리허설")}</h5>
          <div className="col-md-6 form-group">
            {t("시작")}
            <DatePicker
              onChange={(date) => {
                setLastRehersalStartDate(date);
                props.onChangeHandler("rehersalLastdayFrom", date, true);
                setLastRehersalEndDate(date);
              }}
              selected={lastRehersalStartDate}
              minDate={calcDate(new Date(), props.limitdate.mindays - 1)}
              maxDate={calcDate(new Date(), props.limitdate.maxdays)}
              dateFormat="yyyy/MM/dd h:mm aa"
              className="form-control"
              selectsStart
              placeholderText={"리허설이 없다면 생략"}
              timeIntervals={10}
              showTimeSelect
            />
          </div>

          {lastRehersalStartDate ? (
            <div className="col-md-6 form-group mt-3 mt-md-0">
              {t("끝")}
              <DatePicker
                onChange={(date) => {
                  setLastRehersalEndDate(date);
                  props.onChangeHandler("rehersalLastdayTo", date, true);
                }}
                selected={lastRehersalEndDate}
                dateFormat="yyyy/MM/dd h:mm aa"
                className="form-control"
                selectsEnd
                filterTime={filterTimeLastRehersal}
                timeIntervals={10}
                showTimeSelect
              />
            </div>
          ) : (
            <div className="col-md-6 form-group mt-3 mt-md-0">
              {t("끝")}
              <DatePicker className="form-control" disabled />
            </div>
          )}
        </div>
      ) : null}

      {props.work ? (
        <div>
          <WorkCheckbox
            checkboxlist={{
              "전문관리인력이 없는 경우 클릭":
                "Click if you don't have trained manager",
            }}
            head="근로 배정"
            name="work"
            onChangeHandler={handleValueChange_checkbox}
          />
          <br />
          <p className="percent90">
            전문관리인력은 단체별로 존재하는 울림/미래홀의 장비 사용 가능 인력을
            의미하며, 전문관리인력이 없을 시 근로 배정이 이뤄집니다.
          </p>
        </div>
      ) : null}

      {isWork ? (
        <div className="row">
          <h5>{t("근로 사용 시간")}</h5>
          <div className="col-md-6 form-group">
            {t("시작")}
            <DatePicker
              onChange={(date) => {
                setWorkStartDate(date);
                props.onChangeHandler("workFrom", date, true);
                setWorkEndDate(date);
              }}
              selected={workStartDate}
              minDate={calcDate(new Date(), props.limitdate.mindays - 1)}
              maxDate={calcDate(new Date(), props.limitdate.maxdays)}
              dateFormat="yyyy/MM/dd h:mm aa"
              className="form-control"
              selectsStart
              placeholderText={""}
              timeIntervals={10}
              showTimeSelect
            />
          </div>

          {workStartDate ? (
            <div className="col-md-6 form-group mt-3 mt-md-0">
              {t("끝")}
              <DatePicker
                onChange={(date) => {
                  setWorkEndDate(date);
                  props.onChangeHandler("workTo", date, true);
                }}
                selected={workEndDate}
                dateFormat="yyyy/MM/dd h:mm aa"
                className="form-control"
                selectsEnd
                filterTime={filterTimeWork}
                timeIntervals={10}
                showTimeSelect
              />
            </div>
          ) : (
            <div className="col-md-6 form-group mt-3 mt-md-0">
              {t("끝")}
              <DatePicker className="form-control" disabled />
            </div>
          )}
        </div>
      ) : null}
      <hr />
      <br />
    </div>
  );
};

export default Time;
