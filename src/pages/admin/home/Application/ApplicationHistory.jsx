import React, { useEffect } from "react";
import { shallow } from "zustand/shallow";
import { applicationStore } from "../../../../utils/zustand/AdminStore/ApplicationStore/applicationStore";
import Status from "../../../../components/status-color/Status";
import moment from "moment";

// Zustand Component

export default function ApplicationHistory(props) {
  const { navigate, data } = props || {};

  // Global State
  const { userApplicationData } = applicationStore((state) => state, shallow);

  // Label Display For Request History
  const LeaveLabelTitle = (props) => {
    const { leaveType } = props || {};

    const labelDisplay = (title, backgroundColor, textColor) => {
      return (
        <div>
          <span
            className={`${backgroundColor} ${textColor} text-md rounded-lg p-1.5 font-semibold `}
          >
            {title ?? "--"}
          </span>
        </div>
      );
    };

    // UI Icon Condition For Request
    switch (leaveType) {
      case "rest_day":
        return labelDisplay("RD", "bg-lightOrange/70", "text-stateOrange");
      case "official_bussiness":
        return labelDisplay("OB", "bg-blue-100", "text-blue-600");
      case "overtime":
        return labelDisplay("OT", "bg-yellow-100", "text-yellow-600");
      case "leave":
        return labelDisplay("LV", "bg-red-50", "text-red-600");
      case "failure_to_log":
        return labelDisplay("FL", "bg-violet-100", "text-violet-600");
      case "void":
        return "--";
    }
  };

  // Request Details
  const requestListDisplay = (item, index) => {
    const { type, start_time, end_time, reason, status, date } = item || {};
    const formatDate = (date) => moment(date).format("ll");

    return (
      <div
        className={`flex flex-row items-center justify-between border-b py-5`}
        key={index}
      >
        <div className="flex flex-row items-center gap-2">
          <LeaveLabelTitle leaveType={type} />
          <div className="flex w-32 flex-col gap-1">
            <span className="text-xs font-semibold">
              {date && type === "leave" && formatDate(date)}
              {start_time && formatDate(start_time)}
              {start_time && end_time && " - "}
              {end_time && formatDate(end_time)}
            </span>
            <p className="truncate text-xs text-neutralGray">
              {reason ?? "--"}
            </p>
          </div>
        </div>
        <Status status={status} label={status} />
      </div>
    );
  };

  return (
    <div className="col-span-2 rounded-2xl bg-white p-4 shadow-md">
      <div className="flex flex-row items-center justify-between">
        <span className="text-base font-semibold text-neutralDark">
          List of Requests
        </span>
        <span
          className="cursor-pointer text-base font-normal text-primaryBlue"
          onClick={() => navigate("/admin/home/request")}
        >
          View All
        </span>
      </div>
      {userApplicationData.map(requestListDisplay)}
    </div>
  );
}
