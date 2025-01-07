import React from "react";
import ViewModal from "../../../../components/modal/ViewModal";

import * as Io5icons from "react-icons/io5";
import moment from "moment";
import Status from "../../../../components/status-color/Status";

export const renderViewFailureToLog = (formValues) => {
  const {
    createdAt,
    emp_id,
    dept_id,
    designation_id,
    failureLog_type,
    date,
    start_time,
    end_time,
    reason,
    status,
    remarks,
    updatedAt,
  } = formValues || {};
  const { fullName, emp_no } = emp_id || {};
  const { name: department } = dept_id || {};
  const { name: designation } = designation_id || {};
  const time = start_time ?? end_time;

  const employeeDetailsData = [
    {
      title: "Employee Name",
      value: fullName,
    },
    {
      title: "Employee ID",
      value: emp_no ?? 0,
    },
    {
      title: "Department",
      value: department,
    },
    {
      title: "Designation",
      value: designation,
    },
    {
      title: "Date Requested",
      value: moment(createdAt).format("LL"),
    },
  ];

  const requestDetailsData = [
    {
      title: "Type",
      value: failureLog_type.replace("_"," ").split("_").map(str => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      }),
    },
    {
      title: "Date",
      value: moment(date).format("LL"),
    },
    {
      title: "Time",
      value: moment(time).format("LT"),
    },
    {
      title: "Reason",
      value: reason,
    },
  ];

  const approvalData = [
    {
      title: "Status",
      value: status,
    },
    {
      title: "Remarks",
      value: remarks,
    },
    {
      title: "Date",
      value: moment(updatedAt).format("LL"),
    },
  ];

  const EmployeeDetailsContainer = (
    <>
      <div className="py-4">
        <span className="text-xs font-medium uppercase text-primaryBlue">
          Employee Details
        </span>
      </div>
      {employeeDetailsData.map(({ title, value }) => (
        <div className="grid grid-cols-12 items-start gap-2 py-0.5">
          <div className="col-span-3 flex flex-row items-center justify-between">
            <span className="text-base font-normal text-neutralGray">
              {title}
            </span>
            <span className="text-base font-normal text-neutralGray">:</span>
          </div>
          <div className="col-span-9">
            <span className="text-base font-normal text-neutralDark">
              {value}
            </span>
          </div>
        </div>
      ))}
    </>
  );

  const RequestDetailsContainer = (
    <>
      <div className="py-4">
        <span className="text-xs font-medium uppercase text-primaryBlue">
          Request Details
        </span>
      </div>
      {requestDetailsData.map(({ title, value }) => (
        <div className="grid grid-cols-12 items-start gap-2 py-0.5">
          <div className="col-span-3 flex flex-row items-center justify-between">
            <span className="text-base font-normal text-neutralGray">
              {title}
            </span>
            <span className="text-base font-normal text-neutralGray">:</span>
          </div>
          <div className="col-span-9">
            <span className="text-base font-normal text-neutralDark">
              {value}
            </span>
          </div>
        </div>
      ))}
    </>
  );

  const ApprovalContainer = (
    <>
      <div className="py-4">
        <span className="text-xs font-medium uppercase text-primaryBlue">
          Approval
        </span>
      </div>
      {approvalData.map(({ title, value }) => {
        return (
          <div
            className="grid grid-cols-12 items-start gap-2 py-0.5"
            key={title}
          >
            <div className="col-span-3 flex flex-row items-center justify-between">
              <span className="text-base font-normal text-neutralGray">
                {title}
              </span>
              <span className="text-base font-normal text-neutralGray">:</span>
            </div>
            <div className="col-span-9">
              <Status label={value} status={value} />
            </div>
          </div>
        );
      })}
    </>
  );

  return (
    <div>
      {EmployeeDetailsContainer}
      {RequestDetailsContainer}
      {ApprovalContainer}
    </div>
  );
};

export default function ViewFailureToLog({
  openModal,
  setOpenModal,
  formValues,
}) {
  const modalProps = {
    title: "Failure to Log Request",
    body: renderViewFailureToLog(formValues),
    close: {
      name: "Close",
      btnFunction: () => setOpenModal(""),
    },
    isOpen: openModal === "view",
    maxWidth: "max-w-2xl",
  };

  return <ViewModal {...modalProps} />;
}
