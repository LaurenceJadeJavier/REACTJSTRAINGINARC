import React from "react";
import ViewModal from "../../../../components/modal/ViewModal";
import moment from "moment";

export const renderViewFileType = (urltype, requestViewData) => {
  const {
    emp_id,
    dept_id,
    designation_id,
    createdAt,
    type,
    isHalfday,
    date,
    reason,
    status,
    remarks,
    date_approved,
    start_time,
    end_time,
  } = requestViewData || [];

  const employeeDetailsData = [
    {
      title: "Employee Name",
      value: emp_id?.fullName,
    },
    {
      title: "Employee ID",
      value: emp_id?._id,
    },
    {
      title: "Department",
      value: dept_id?.name,
    },
    {
      title: "Designation",
      value: designation_id?.name,
    },
    {
      title: "Date Requested",
      value: moment(createdAt).format("MMMM DD, YYYY"),
    },
  ];

  const reqLeaveData = [
    {
      title: "Type",
      value: type,
    },
    {
      title: "Half Day",
      value: isHalfday ? "Yes" : "No",
    },
    {
      title: "Date",
      value: moment(date).format("MMMM DD, YYYY"),
    },
    {
      title: "Reason",
      value: reason,
    },
  ];

  const reqOvertimeData = [
    {
      title: "Date",
      value: moment(createdAt).format("MMMM DD, YYYY"),
    },
    {
      title: "Start Time",
      value: moment(start_time).format("h:mm A"),
    },
    {
      title: "End Time",
      value: moment(end_time).format("h:mm A"),
    },
    {
      title: "Purpose",
      value: reason,
    },
  ];

  const requestDetailsData =
    urltype === "leave" ? reqLeaveData : reqOvertimeData;

  const approvalData = [
    {
      title: "Status",
      value: status,
    },
    {
      title: "Remarks",
      value: remarks ?? "-",
    },
    {
      title: "Date",
      value: date_approved
        ? moment(date_approved).format("MMMM DD, YYYY")
        : "-",
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
        <div className="grid grid-cols-12 items-center gap-2 py-0.5">
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
            <span className="text-base font-normal capitalize text-neutralGray">
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
        let bgcolor = "";
        let textcolor = "";
        let textsize = "";

        if (title === "Status") {
          textsize = "text-sm";
          if (value === "cancelled") {
            textcolor = "text-[#7C7C7C]";
            bgcolor = "bg-[#F0F6FC]";
          } else if (value === "approved") {
            textcolor = "text-stateGreen";
            bgcolor = "bg-lightGreen";
          } else if (value === "declined") {
            textcolor = "text-stateRed";
            bgcolor = "bg-lightRed";
          } else {
            textcolor = "text-stateOrange";
            bgcolor = "bg-lightOrange";
          }
        } else {
          textsize = "text-base";
        }

        return (
          <div className="grid grid-cols-12 items-start gap-2 py-0.5">
            <div className="col-span-3 flex flex-row items-center justify-between">
              <span className="text-base font-normal text-neutralGray">
                {title}
              </span>
              <span className="text-base font-normal text-neutralGray">:</span>
            </div>
            <div className="col-span-9">
              <span
                className={`${
                  title === "Status" ? "uppercase" : "capitalize"
                } ${bgcolor} ${textcolor} ${textsize} rounded-md px-2 py-0.5 font-normal`}
              >
                {value}
              </span>
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

export default function ViewFileType({
  setOpenModal,
  openModal,
  type,
  requestViewData,
}) {
  const urltype = type;

  const title = urltype === "leave" ? "Request Leave" : "Request Overtime";
  const modalProps = {
    title,
    body: renderViewFileType(urltype, requestViewData),
    close: {
      name: "Close",
      btnFunction: () => setOpenModal(""),
    },
    isOpen: openModal === "view",
    maxWidth: "max-w-2xl",
  };

  return <ViewModal {...modalProps} />;
}
