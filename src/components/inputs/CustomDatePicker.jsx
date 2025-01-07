import moment from "moment";
import React, { forwardRef } from "react";
import DatePicker, { CalendarContainer } from "react-datepicker";
import * as Io5icons from "react-icons/io5";

const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
  <button
    className="flex flex-row items-center justify-between gap-4 rounded-xl bg-lightBlue px-4 py-2"
    onClick={onClick}
    ref={ref}
  >
    <span className="text-base font-normal text-primaryBlue">{value}</span>
    <Io5icons.IoCaretDown className="text-primaryBlue" />
  </button>
));

const CustomHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}) => {
  return (
    <div className="flex flex-row items-center justify-evenly">
      <Io5icons.IoChevronBack
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      />
      <span>{moment(date).format("MMMM yyyy")}</span>
      <Io5icons.IoChevronForward
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      />
    </div>
  );
};

const MyContainer = ({ className, children }) => {
  return (
    <div style={{ background: "transparent", color: "#fff" }}>
      <CalendarContainer className={className}>
        <div style={{ position: "relative", fontSize: 16, fontWeight: 400 }}>
          {children}
        </div>
      </CalendarContainer>
    </div>
  );
};

export const CustomDatePicker = ({ state, setState }) => {
  return (
    <DatePicker
      selected={state}
      onChange={(date) => setState(date)}
      dateFormat="MMMM yyyy"
      showMonthYearPicker
      customInput={<ExampleCustomInput />}
      calendarContainer={MyContainer}
      renderCustomHeader={CustomHeader}
    />
  );
};
