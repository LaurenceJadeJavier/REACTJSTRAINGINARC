import React, { useEffect, useState, Fragment } from "react";
import { createColumnHelper } from "@tanstack/table-core";
import * as Io5icons from "react-icons/io5";
import ViewRestDayWork from "./Modals/ViewRestDayWork";
import UpdateStatus from "./Modals/UpdateStatus";
import { shallow } from "zustand/shallow";
import moment from "moment";

// Components
import DataTable from "../../../../components/tables/datatable/DataTable";
import DropdownMenu from "../../../../components/menu/DropdownMenu";
import Status from "../../../../components/status-color/Status";
import blankProfile from "../../../../assets/images/blankProfile.jpg";

// Zustand Component
import { applicationStore } from "../../../../utils/zustand/AdminStore/ApplicationStore/applicationStore";

export default function RestDayWork() {
  const { accessor } = createColumnHelper();

  // Global State
  const { filteredApplicationData } = applicationStore(
    (state) => state,
    shallow,
  );

  // Local State
  const [applicationContainer, setApplicationContainer] = useState([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [openModal, setOpenModal] = useState("");
  const [tableData, setTableData] = useState([]);
  const [cloneData, setCloneData] = useState([]);

  useEffect(() => {
    filteredData();
  }, [filteredApplicationData, selectedTab]);

  // filtered data
  const filteredData = () => {
    if (selectedTab == "All") {
      setCloneData(filteredApplicationData);
      return setTableData(filteredApplicationData);
    } else {
      const filteredData = filteredApplicationData.filter(
        (item) => item.status === selectedTab.toLowerCase(),
      );
      setCloneData(filteredData);
      return setTableData(filteredData);
    }
  };

  // Rest Day Table
  const restDayWorkTable = () => {
    // Select Table Action
    const tableDropDownOption = (setOpenModal, info) => {
      // Table Action Option
      const actionList = [
        {
          _id: 1,
          label: "View",
          textColor: "text-primaryBlue",
          icon: <Io5icons.IoReaderOutline />,
          itemFunction: (row) => {
            setApplicationContainer(row.original);
            return setOpenModal("view");
          },
        },
        {
          _id: 2,
          label: "Update Status",
          textColor: "text-primaryBlue",
          icon: <Io5icons.IoCreateOutline />,
          itemFunction: (row) => {
            setApplicationContainer(row.original);
            return setOpenModal("updatestatus");
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
          <DropdownMenu actionList={actionList} row={info} />
        </div>
      );
    };

    // Table Column
    const columns = [
      accessor("employee", {
        id: "employee",
        header: "Employee",
        cell: ({ row }) => {
          const { emp_id } = row.original;
          const { fullName, emp_no, emp_img } = emp_id || {};
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
      accessor("date", {
        id: "date",
        header: "Date",
        accesoryKey: "date",
        cell: (info) => (
          <div className="flex items-center">
            {moment(info.getValue()).format("ll")}
          </div>
        ),
      }),
      accessor("start_time", {
        id: "start_time",
        header: "Start time",
        accesoryKey: "start_time",
        cell: (info) =>
          info.getValue() ? moment(info.getValue()).format("LT") : "--",
      }),
      accessor("end_time", {
        id: "end_time",
        header: "End time",
        accesoryKey: "end_time",
        cell: (info) =>
          info.getValue() ? moment(info.getValue()).format("LT") : "--",
      }),
      accessor("status", {
        id: "status",
        header: "Status",
        accesoryKey: "status",
        cell: (info) => (
          <>
            <Status status={info.getValue()} label={info.getValue()} />
          </>
        ),
      }),
      accessor("createdAt", {
        id: "createdAt",
        header: "Date Requested",
        accesoryKey: "createdAt",
        cell: (info) => (
          <div className="flex items-center">
            {moment(info.getValue()).format("ll")}
          </div>
        ),
      }),
      accessor("_id", {
        id: "_id",
        header: "Action",
        style: "w-20 ",
        cell: (info) => tableDropDownOption(setOpenModal, info.row),
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
        pattern.test(item.emp_id?.fullName) ||
        pattern.test(moment(item?.date).format("ll")) ||
        pattern.test(moment(item?.start_time).format("LT")) ||
        pattern.test(moment(item?.end_time).format("LT")) ||
        pattern.test(item?.status) ||
        pattern.test(moment(item?.createdAt).format("ll"));

      const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
      const fltdData = cloneData.filter((item) => patternData(item));
      setTableData(fltdData);
    };

    // Table Config
    const tableProps = {
      columns,
      rows: tableData,
      title: "Rest Day Work",
      subTitle: "List of file requests",
      tableTab: tabSelection,
      btnPrint: true,
      searchOption: true,
      searchData,
    };

    return tableProps && <DataTable {...tableProps} />;
  };

  // Rest Day Modal Form
  const restDayModal = () => {
    const modalAction = {
      openModal,
      setOpenModal,
    };

    const viewRestDayModal = () => {
      const propsContainer = {
        ...modalAction,
        applicationContainer,
      };
      return <ViewRestDayWork {...propsContainer} />;
    };

    const updateRestDayModal = () => {
      const propsContainer = {
        ...modalAction,
        applicationContainer,
        setSelectedTab,
      };

      return <UpdateStatus {...propsContainer} />;
    };

    return (
      <Fragment>
        {viewRestDayModal()}
        {updateRestDayModal()}
      </Fragment>
    );
  };

  return (
    <div className="rounded-2xl bg-white px-4 py-6 shadow-xl">
      {restDayWorkTable()}
      {restDayModal()}
    </div>
  );
}
