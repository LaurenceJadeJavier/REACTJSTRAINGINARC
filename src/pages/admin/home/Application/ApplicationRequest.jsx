import React, { useState } from "react";

// Icons
import * as Io5icons from "react-icons/io5";
import RequestLeave from "../Modals/RequestLeave";
import Overtime from "../Modals/Overtime";
import OfficialBusiness from "../Modals/OfficialBusiness";
import FailuretoLog from "../Modals/FailuretoLog";
import Restday from "../Modals/Restday";
import { authStore } from "../../../../utils/zustand/AuthStore/authStore";
import { shallow } from "zustand/shallow";
import { POST } from "../../../../services/api";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { applicationStore } from "../../../../utils/zustand/AdminStore/ApplicationStore/applicationStore";

export default function ApplicationRequest(props) {
  const { navigate } = props || {};
  // Global State
  const { userInformation } = authStore((state) => state, shallow);
  const { storeUserfileApplicationData } = applicationStore(
    (state) => state,
    shallow,
  );
  const { openSuccessModal } = alertModalStore((state) => state, shallow);

  // Local State
  const [openModal, setOpenModal] = useState("");

  // Request Selection Data
  const requestData = [
    {
      title: "Leave",
      details: "Request time off",
      icon: <Io5icons.IoCalendarClearOutline className="h-5 w-5" />,
      action: () => setOpenModal("requestleave"),
    },
    {
      title: "Overtime",
      details: "Request overtime hours",
      icon: <Io5icons.IoTimeOutline className="h-5 w-5" />,
      action: () => setOpenModal("requestovertime"),
    },
    {
      title: "Official business",
      details: "Request official business activities",
      icon: <Io5icons.IoCarOutline className="h-5 w-5" />,
      action: () => setOpenModal("officialbusiness"),
    },
    {
      title: "Failure to Log",
      details: "Request failure to log",
      icon: <Io5icons.IoCloseCircleOutline className="h-5 w-5" />,
      action: () => setOpenModal("failuretolog"),
    },
    {
      title: "Rest Day Work",
      details: "Request rest day work",
      icon: <Io5icons.IoTodayOutline className="h-5 w-5" />,
      action: () => setOpenModal("restdaywork"),
    },
    {
      title: "Payslip",
      details: "View your payslip",
      icon: <Io5icons.IoCashOutline className="h-5 w-5" />,
      action: () => navigate("/admin/home/payslip"),
    },
  ];

  // Request Selectiod Grid
  const requestCardGridDisplay = () => {
    const requestCardList = ({ title, details, icon, action, path }) => (
      <div
        className="col-span-1 flex w-full cursor-pointer flex-col gap-2 rounded-2xl bg-white p-4 shadow-md"
        key={title}
        onClick={action}
      >
        <div className="w-fit rounded-lg bg-lightBlue p-1 text-primaryBlue">
          {icon}
        </div>
        <span className="text-sm font-semibold text-neutralDark">{title}</span>
        <span className="truncate break-all text-xs font-normal text-neutralGray">
          {details}
        </span>
      </div>
    );
    return requestData.map(requestCardList);
  };

  // File Request Action (Service)
  const fileRequestAction = async (parameterValue, formSetter) => {
    const { isEmployee } = userInformation || {};
    const { dept_id, designation_id, _id: employee_id } = isEmployee || {};

    const params = {
      ...parameterValue,
      emp_id: employee_id,
      dept_id: dept_id?._id,
      designation_id: designation_id?._id,
    };

    try {
      const { status } = await POST("/applications", params);
      if (status === 201) {
        setOpenModal("");
        formSetter();
        storeUserfileApplicationData();
        return openSuccessModal({
          title: "Success!",
          message:
            "Your request has been successfully submitted. You can monitor the status of your request by viewing the list of requests.",
          closeNameBtn: "Ok",
        });
      }
    } catch (err) {
      console.error("Error:", err?.response?.data);
    }
  };

  // Modal Components
  const applicationComponent = () => {
    const propsContainer = {
      fileRequestAction,
      openModal,
      setOpenModal,
    };

    return (
      <>
        <RequestLeave {...propsContainer} />
        <Overtime {...propsContainer} />
        <OfficialBusiness {...propsContainer} />
        <FailuretoLog {...propsContainer} />
        <Restday {...propsContainer} />
      </>
    );
  };

  return (
    <>
      {requestCardGridDisplay()}
      {applicationComponent()}
    </>
  );
}
