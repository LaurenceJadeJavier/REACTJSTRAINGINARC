import React, { useEffect, useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/table-core";

import DataTable from "../../../components/tables/datatable/DataTable";
import DropdownMenu from "../../../components/menu/DropdownMenu";

import * as Io5icons from "react-icons/io5";
import ViewFailureToLog from "./Modals/ViewFailureToLog";
import UpdateStatus from "./Modals/UpdateStatus";
import { failureToLogStore } from "../../../utils/zustand/FileRequest/failureToLog";
import { shallow } from "zustand/shallow";
import moment from "moment";
import { GET, PUT } from "../../../services/api";
import { alertModalStore } from "../../../utils/zustand/AlertModalStore/alertModalStore";
import { loadingStore } from "../../../utils/zustand/LoadingStore/loadingStore";
import Status from "../../../components/status-color/Status";
import blankProfile from "../../../assets/images/blankProfile.jpg";

export const DropdownUI = (viewFunc, setOpenModal, setFormValues, row) => {
  const { _id } = row.original;

  // Table Action Option
  const actionList = [
    {
      _id: 1,
      label: "View",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoReaderOutline />,
      itemFunction: () => viewFunc(_id),
    },
    {
      _id: 2,
      label: "Update Status",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoCreateOutline />,
      itemFunction: () => {
        setFormValues({ ...row.original });
        setOpenModal("updatestatus");
      },
    },
    {
      _id: 3,
      label: "Print",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoPrintOutline />,
      itemFunction: (row) => setOpenModal("print"),
    },
  ];

  return (
    <div className="text-center">
      <DropdownMenu actionList={actionList} />
    </div>
  );
};

export default function FailureToLog() {
  const { accessor } = createColumnHelper();

  //global state
  const { openSuccessModal } = alertModalStore((state) => state, shallow);
  const { failureToLogs, fetchAllFailureToLog } = failureToLogStore(
    (state) => state,
    shallow,
  );
  const { loadingHoc } = loadingStore((state) => state, shallow);

  const defaultValue = {
    name: "",
  };

  //local state
  const [selectedTab, setSelectedTab] = useState("All");
  const [openModal, setOpenModal] = useState("");
  const [formValues, setFormValues] = useState({});
  const [tableData, setTableData] = useState([]);
  const [cloneData, setCloneData] = useState([]);

  useEffect(() => {
    filteredData();
  }, [failureToLogs, selectedTab]);

  // filtered data
  const filteredData = () => {
    if (selectedTab == "All") {
      setCloneData(failureToLogs);
      return setTableData(failureToLogs);
    }
    const filtered = failureToLogs.filter(
      (item) => item.status === selectedTab.toLowerCase(),
    );
    setCloneData(filtered);
    return setTableData(filtered);
  };

  const clearModal = () => {
    setOpenModal("");
    setFormValues(defaultValue);
    loadingHoc(false);
  };

  const updateAPI = async () => {
    loadingHoc(true);
    const { status } = await PUT(
      `/applications/status/${formValues?._id}`,
      formValues,
    );
    if (status === 201) {
      openSuccessModal({
        title: "Success!",
        message: "Your changes has been successfully saved.",
        closeNameBtn: "Ok",
      });
      clearModal();
      return fetchAllFailureToLog();
    } else {
      return loadingHoc(false);
    }
  };

  const viewFunc = async (_id) => {
    loadingHoc(true);
    const { data, status } = await GET(`/applications/${_id}`);

    if (status === 200) {
      loadingHoc(false);
      setFormValues(data);
      return setOpenModal("view");
    } else return loadingHoc(false);
  };

  const failureToLogTable = () => {
    // Table Column
    const columns = [
      accessor("emp_id", {
        id: "emp_id",
        header: "Employee",
        cell: ({ row: { original } }) => {
          const { fullName, emp_no, emp_img } = original?.emp_id || {};
          return (
            <div className="flex items-center">
              <img
                src={emp_img || blankProfile}
                className="mx-2 h-10 w-10 rounded-full border border-neutralDark p-1"
              />
              <div className="flex flex-col">
                <span className="text-base">{fullName ?? "--"}</span>
                <span className="text-xs text-neutralGray">
                  {emp_no ?? "--"}
                </span>
              </div>
            </div>
          );
        },
      }),
      accessor("createdAt", {
        id: "createdAt",
        header: "Date",
        cell: (info) => moment(info.getValue()).format("LL"),
      }),
      accessor("failureLog_type", {
        id: "failureLog_type",
        header: "Type",
        cell: (info) =>
          info
            .getValue()
            .replace("_", " ")
            .split("_")
            .map((str) => {
              return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            }),
      }),
      accessor("time", {
        id: "time",
        header: "Time",
        cell: ({ row }) => {
          const { start_time, end_time } = row.original;
          const time = start_time ?? end_time;
          return moment(time).format("LT");
        },
      }),
      accessor("status", {
        id: "status",
        header: "Status",
        cell: (info) => (
          <Status status={info.getValue()} label={info.getValue()} />
        ),
      }),
      accessor("date", {
        id: "date",
        header: "Date Requested",
        cell: (info) => moment(info.getValue()).format("LL"),
      }),
      accessor("_id", {
        id: "_id",
        header: "Action",
        style: "w-20 ",
        cell: ({ row }) =>
          DropdownUI(viewFunc, setOpenModal, setFormValues, row),
      }),
    ];

    // Tab Selection
    const tabSelection = [
      {
        name: "All",
        isSelected: selectedTab === "All",
        selectTabAction: () => setSelectedTab("All"),
      },
      {
        name: "Pending",
        isSelected: selectedTab === "Pending",
        selectTabAction: () => setSelectedTab("Pending"),
      },
      {
        name: "Approved",
        isSelected: selectedTab === "Approved",
        selectTabAction: () => setSelectedTab("Approved"),
      },
      {
        name: "Declined",
        isSelected: selectedTab === "Declined",
        selectTabAction: () => setSelectedTab("Declined"),
      },
      {
        name: "Cancelled",
        isSelected: selectedTab === "Cancelled",
        selectTabAction: () => setSelectedTab("Cancelled"),
      },
    ];

    const searchData = (value) => {
      const patternData = (item) =>
        pattern.test(item?.emp_id?.fullName) ||
        pattern.test(moment(item?.createdAt).format("LL")) ||
        pattern.test(
          item?.failureLog_type
            .replace("_", " ")
            .split("_")
            .map((str) => {
              return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            }),
        ) ||
        pattern.test(moment(item?.start_time).format("LT")) ||
        pattern.test(moment(item?.end_time).format("LT")) ||
        pattern.test(moment(item?.date).format("LL")) ||
        pattern.test(item?.status);

      const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
      const fltdData = cloneData.filter((item) => patternData(item));
      setTableData(fltdData);
    };

    // Table Config
    const tableProps = {
      columns,
      rows: tableData,
      title: "Failure to Log",
      subTitle: "List of file requests",
      tableTab: tabSelection,
      btnPrint: true,
      searchOption: true,
      searchData,
    };

    return tableProps && <DataTable {...tableProps} />;
  };

  return (
    <>
      <div className="rounded-2xl bg-white px-4 py-6 shadow-xl">
        {failureToLogTable()}
      </div>
      {openModal && (
        <>
          <ViewFailureToLog
            openModal={openModal}
            formValues={formValues}
            setOpenModal={setOpenModal}
          />
          <UpdateStatus
            openModal={openModal}
            formValues={formValues}
            setOpenModal={setOpenModal}
            setFormValues={setFormValues}
            submitApi={
              openModal === "updatestatus" ? updateAPI : null /*dito yung add*/
            }
          />
        </>
      )}
    </>
  );
}
