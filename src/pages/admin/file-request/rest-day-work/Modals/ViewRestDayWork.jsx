import React from "react";
import ViewModal from "../../../../../components/modal/ViewModal";
import Status from "../../../../../components/status-color/Status";
import moment from "moment";

export const renderViewRestDay = (applicationContainer) => {
  const { emp_id, dept_id, designation_id, createdAt } =
    applicationContainer || {};
  console.log(`applicationContainer:`, applicationContainer);

  const EmployeeDetailsContainer = () => {
    const { fullName, emp_No } = emp_id || {};
    const { name: departmentName } = dept_id || {};
    const { name: designationName } = designation_id || {};

    const employeeDetailsData = [
      {
        title: "Employee Name",
        value: fullName ?? "--",
      },
      {
        title: "Employee ID",
        value: emp_No ?? "--",
      },
      {
        title: "Department",
        value: departmentName ?? "--",
      },
      {
        title: "Designation",
        value: designationName,
      },
      {
        title: "Date Requested",
        value: createdAt ? moment(createdAt).format("ll") : "--",
      },
    ];

    const employeeDetailsList = ({ title, value }) => (
      <div className="grid grid-cols-12 items-start gap-2 py-0.5" key={title}>
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
    );

    return (
      <>
        <div className="py-4">
          <span className="text-xs font-medium uppercase text-primaryBlue">
            Employee Details
          </span>
        </div>
        {employeeDetailsData.map(employeeDetailsList)}
      </>
    );
  };

  const RequestDetailsContainer = () => {
    const { start_time, end_time, date, reason } = applicationContainer || {};
    const requestDetailsData = [
      {
        title: "Date",
        value: date ? moment(date).format("ll") : "--",
      },
      {
        title: "Start Time",
        value: start_time ? moment(start_time).format("LT") : "--",
      },
      {
        title: "End Time",
        value: end_time ? moment(end_time).format("LT") : "--",
      },
      {
        title: "Purpose",
        value: reason ?? "--",
      },
    ];

    const requestDetailsList = ({ title, value }) => (
      <div className="grid grid-cols-12 items-start gap-2 py-0.5" key={title}>
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
    );

    return (
      <>
        <div className="py-4">
          <span className="text-xs font-medium uppercase text-primaryBlue">
            Request Details
          </span>
        </div>
        {requestDetailsData.map(requestDetailsList)}
      </>
    );
  };

  const ApprovalContainer = () => {
    const { status, remarks, updatedAt } = applicationContainer || {};
    console.log(`remarks:`, remarks)
    const approvalData = [
      {
        title: "Status",
        value: status,
      },
      {
        title: "Remarks",
        value: remarks ?? "--",
      },
      {
        title: "Date",
        value: updatedAt ? moment(updatedAt).format("ll") : "--",
      },
    ];

    const approvalList = ({ title, value }) => {
      return (
        <div className="grid grid-cols-12 items-start gap-2 py-0.5" key={title}>
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
    };

    return (
      <>
        <div className="py-4">
          <span className="text-xs font-medium uppercase text-primaryBlue">
            Approval
          </span>
        </div>
        {approvalData.map(approvalList)}
      </>
    );
  };

  return (
    <div>
      {EmployeeDetailsContainer()}
      {RequestDetailsContainer()}
      {ApprovalContainer()}
    </div>
  );
};

export default function ViewRestDayWork(props) {
  const { openModal, setOpenModal, applicationContainer } = props || {};
  console.log(`ViewRestDayWork applicationContainer:`, applicationContainer);

  const modalProps = {
    title: "Rest Day Work Request",
    body: renderViewRestDay(applicationContainer),
    close: {
      name: "Close",
      btnFunction: () => setOpenModal(""),
    },
    isOpen: openModal === "view",
    maxWidth: "max-w-2xl",
  };

  return <ViewModal {...modalProps} />;
}
