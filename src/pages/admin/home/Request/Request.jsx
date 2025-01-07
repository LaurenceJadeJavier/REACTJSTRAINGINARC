import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/table-core";
import { shallow } from "zustand/shallow";
import moment from "moment";
import * as Io5icons from "react-icons/io5";

// Components
import DataTable from "../../../../components/tables/datatable/DataTable";
import Status from "../../../../components/status-color/Status";
import FormModal from "../../../../components/modal/FormModal";
import { DELETE } from "../../../../services/api";

// Zustand Component
import { applicationStore } from "../../../../utils/zustand/AdminStore/ApplicationStore/applicationStore";

import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";

export default function Request() {
  // Global State
  const { specificUserApplicationData, storeUserfileApplicationData } =
  applicationStore((state) => state, shallow);
  const { openDeleteModal, openSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
    );

  // Local State
  const [tableData, setTableData] = useState([]);
  const [requestContainer, setRequestContainer] = useState([]);
  const [selectedTab, setSelectedTab] = useState("Leave");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setTableData( specificUserApplicationData[0]?.data || []);
  }, [specificUserApplicationData]);

  // Cancel Request Action (Service)
  const cancelRequestAction = async () => {
    const { _id } = requestContainer || {};

    try {
      const { status } = await DELETE("/applications/" + _id);
      if (status === 201) {
        storeUserfileApplicationData();
        setSelectedTab("Leave");
        setOpenModal(false);
        return openSuccessModal({
          title: "Success!",
          message: "Your request has been cancelled successfully.",
          closeNameBtn: "Ok",
        });
      }
    } catch (err) {
      console.error("err:", err);
    }
  };

  // Request Table
  const requestTable = () => {
    // Tab Selection
    const tabSelection = specificUserApplicationData.map((item, index) => {
      const { title, data } = item || {};
      return {
        key: index,
        name: title,
        isSelected: selectedTab === title,
        selectTabAction: () => {
          setTableData(data);
          return setSelectedTab(title);
        },
      };
    });

    // Table Config
    const tableProps = {
      columns: requestColumn(selectedTab, setOpenModal, setRequestContainer),
      rows: tableData,
      title: "File Request",
      subTitle: "List of file requests",
      btnName: "New Request",
      tableTab: tabSelection,
      btnPrint: true,
    };

    return tableProps && <DataTable {...tableProps} />;
  };

  // Request Details
  const requestDetailsModal = () => {
    const modalProps = {
      title: selectedTab + " Request ",
      body: requestModal(requestContainer, selectedTab),
      submit: {
        name: "Close",
        btnFunction: () => setOpenModal(false),
      },
      cancel: {
        name: (
          <div
            className="text-red-600"
            onClick={() =>
              openDeleteModal({
                title: "Cancel Request",
                message: "Are you sure you want to cancel your request?",
                modalAction: () => cancelRequestAction(),
              })
            }
          >
            Cancel Request
          </div>
        ),
        // btnFunction: () => setOpenModal(false),
      },
      isOpen: openModal,
      maxWidth: "max-w-xl",
    };

    return <FormModal {...modalProps} />;
  };

  return (
    <div className="rounded-2xl bg-white px-4 py-6 shadow-xl">
      {requestTable()}
      {requestDetailsModal()}
    </div>
  );
}

// Request Modal Display Configuration
const requestModal = (requestContainer, selectedTab) => {
  const {
    status,
    createdAt,
    end_time,
    start_time,
    reason,
    leaveType_id,
    isHalfday,
    date,
    failureLog_type,
  } = requestContainer || {};

  const statusProps = {
    title: "Status",
    result: <Status status={status} label={status} />,
  };

  const dateRequestedProps = {
    title: "Date Requested",
    result: moment(createdAt).format("ll") ?? "--",
  };

  const dateProps = {
    title: "Date",
    result: moment(date).format("ll") ?? "--",
  };

  const leaveTypeProps = {
    title: "Type",
    result: leaveType_id?.name ?? "--",
  };

  const halfDayProps = {
    title: "Half Day",
    result: isHalfday ? "Yes" : "No" ?? "--",
  };

  const startTimeProps = {
    title: "Start Time",
    result: start_time ? moment(start_time).format("LT") : "--",
  };

  const endTimeProps = {
    title: "End Time",
    result: end_time ? moment(end_time).format("LT") : "--",
  };

  const purposeProps = {
    title: "Purpose",
    result: reason ?? "--",
  };

  const logShiftProps = {
    title: "Type",
    result: failureLog_type === "time_in" ? "Time In" : "Time Out",
  };

  const logTimeProps = {
    title: "Time",
    result: moment(start_time ?? end_time).format("LT"),
  };

  const requestListDisplay = (detailData) => {
    const labelDisplay = (props) => {
      const { title, result } = props || {};
      return (
        <div className="flex flex-row items-center gap-4 text-sm">
          <div className="flex basis-1/4 flex-row justify-between truncate text-neutralGray">
            <div>{title ?? "--"}</div>
            <div>:</div>
          </div>
          <div className="grow ">{result ?? "--"}</div>
        </div>
      );
    };

    return detailData.map(labelDisplay);
  };

  const detailsDisplayCondition = () => {
    const leaveDetails = [
      statusProps,
      dateRequestedProps,
      dateProps,
      leaveTypeProps,
      halfDayProps,
      purposeProps,
    ];

    const overTimeDetails = [
      statusProps,
      dateRequestedProps,
      dateProps,
      startTimeProps,
      endTimeProps,
      purposeProps,
    ];

    const businessTripDetails = [
      statusProps,
      dateRequestedProps,
      dateProps,
      startTimeProps,
      endTimeProps,
      purposeProps,
    ];

    const failureToLogDetails = [
      statusProps,
      dateRequestedProps,
      dateProps,
      logShiftProps,
      logTimeProps,
      purposeProps,
    ];

    const restDayDetails = [
      statusProps,
      dateRequestedProps,
      dateProps,
      startTimeProps,
      endTimeProps,
      purposeProps,
    ];

    switch (selectedTab) {
      case "Leave":
        return requestListDisplay(leaveDetails);
      case "Overtime":
        return requestListDisplay(overTimeDetails);
      case "Official Business":
        return requestListDisplay(businessTripDetails);
      case "Failure To Log":
        return requestListDisplay(failureToLogDetails);
      case "Rest Day Work":
        return requestListDisplay(restDayDetails);
      default:
        return [];
    }
  };

  return <div className="flex flex-col gap-4">{detailsDisplayCondition()}</div>;
};

// Request Column Configuration
const requestColumn = (selectedTab, setOpenModal, setRequestContainer) => {
  const { accessor } = createColumnHelper();

  const dateColumn = accessor("date", {
    id: "date",
    header: "Date",
    accesoryKey: "date",
    cell: (info) => (
      <div className="flex items-center">
        {moment(info.getValue()).format("ll")}
      </div>
    ),
  });

  const startTimeColumn = accessor("start_time", {
    id: "start_time",
    header: "Start time",
    accesoryKey: "start_time",
    cell: (info) =>
      info.getValue() ? moment(info.getValue()).format("LT") : "--",
  });

  const startEndColumn = accessor("end_time", {
    id: "end_time",
    header: "End time",
    accesoryKey: "end_time",
    cell: (info) =>
      info.getValue() ? moment(info.getValue()).format("LT") : "--",
  });

  const statusColumn = accessor("status", {
    id: "status",
    header: "Status",
    accesoryKey: "status",
    cell: (info) => (
      <>
        <Status status={info.getValue()} label={info.getValue()} />
      </>
    ),
  });

  const dateRequestedColumn = accessor("createdAt", {
    id: "createdAt",
    header: "Date Requested",
    accesoryKey: "createdAt",
    cell: (info) => (
      <div className="flex items-center">
        {moment(info.getValue()).format("ll")}
      </div>
    ),
  });

  const reasonColumn = accessor("reason", {
    id: "reason",
    header: "Purpose",
    accesoryKey: "reason",
    cell: (info) => <div className="w-16 truncate"> {info.getValue()}</div>,
  });

  const halfDayColumn = accessor("isHalfday", {
    id: "isHalfday",
    header: "Half Day",
    accesoryKey: "isHalfday",
    cell: (info) => (info.getValue() ? "Yes" : "No"),
  });

  const leaveTypeColumn = accessor("leaveType_id", {
    id: "leaveType_id",
    header: "Type",
    accesoryKey: "leaveType_id",
    cell: (info) => <div> {info.getValue()?.name ?? "--"}</div>,
  });

  const failureToLogShiftColumn = accessor("failureLog_type", {
    id: "failureLog_type",
    header: "Type",
    accesoryKey: "failureLog_type",
    cell: (info) => (info.getValue() === "time_in" ? "Time In" : "Time Out"),
  });

  const failureToLogTimeColumn = accessor("start_time", {
    id: "updatedAt",
    header: "Time",
    accesoryKey: "updatedAt",
    cell: (info) => {
      const { start_time, end_time } = info.row.original || {};
      return <div>{moment(start_time ?? end_time).format("LT")}</div>;
    },
  });

  const actionColumn = accessor("_id", {
    id: "_id",
    header: "Action",
    style: "w-20 ",
    cell: (info) => (
      <div
        className="flex cursor-pointer justify-center"
        onClick={() => {
          setOpenModal(true);
          setRequestContainer(info.row.original);
        }}
      >
        <Io5icons.IoReaderOutline className="text-xl text-primaryBlue" />
      </div>
    ),
  });

  // Leave Table
  const leaveTableColumn = [
    dateColumn,
    leaveTypeColumn,
    halfDayColumn,
    reasonColumn,
    statusColumn,
    dateRequestedColumn,
    actionColumn,
  ];

  // Over Time Table
  const overtimeTableColumn = [
    dateColumn,
    startTimeColumn,
    startEndColumn,
    reasonColumn,
    statusColumn,
    dateRequestedColumn,
    actionColumn,
  ];

  // Official Business Table
  const officialBusinessTableColumn = [
    dateColumn,
    startTimeColumn,
    startEndColumn,
    reasonColumn,
    statusColumn,
    dateRequestedColumn,
    actionColumn,
  ];

  // Failure To Log Table
  const failureToLogTableColumn = [
    dateColumn,
    failureToLogShiftColumn,
    failureToLogTimeColumn,
    reasonColumn,
    dateRequestedColumn,
    actionColumn,
  ];

  // Rest Day Work
  const restDayWorkTableColumn = [
    dateColumn,
    startTimeColumn,
    startEndColumn,
    reasonColumn,
    statusColumn,
    dateRequestedColumn,
    actionColumn,
  ];

  switch (selectedTab) {
    case "Leave":
      return leaveTableColumn;
    case "Overtime":
      return overtimeTableColumn;
    case "Official Business":
      return officialBusinessTableColumn;
    case "Failure To Log":
      return failureToLogTableColumn;
    case "Rest Day Work":
      return restDayWorkTableColumn;
    default:
      return [];
  }
};
