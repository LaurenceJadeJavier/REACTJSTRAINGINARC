import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/table-core";
import { useLocation } from "react-router";
import { shallow } from "zustand/shallow";
import moment from "moment";
import { useLoaderData } from "react-router-dom";
import * as Io5icons from "react-icons/io5";

import DataTable from "../../../components/tables/datatable/DataTable";
import DropdownMenu from "../../../components/menu/DropdownMenu";
import { leaveStore } from "../../../utils/zustand/FileRequest/leave";
import ViewFileType from "./Modals/ViewFileType";
import UpdateStatus from "./Modals/UpdateStatus";
import { GET, PUT } from "../../../services/api";
import { alertModalStore } from "../../../utils/zustand/AlertModalStore/alertModalStore";
import { overtimeStore } from "../../../utils/zustand/FileRequest/overtime";
import blankProfile from "../../../assets/images/blankProfile.jpg";

export const DropdownUI = (
  setOpenModal,
  setGetViewID,
  original,
  setFormValues,
  getRequestViewAPI,
) => {
  // Table Action Option
  const actionList = [
    {
      _id: 1,
      label: "View",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoReaderOutline />,
      itemFunction: () => {
        setOpenModal("view");
        getRequestViewAPI(original?._id);
      },
    },
    {
      _id: 2,
      label: "Update Status",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoCreateOutline />,
      itemFunction: (row) => {
        setFormValues(original);
        setGetViewID(original?._id);
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
      {" "}
      <DropdownMenu actionList={actionList} />
    </div>
  );
};

export const StatusUI = (original) => {
  let textcolor = "";
  let bgcolor = "";

  if (original?.status === "cancelled") {
    textcolor = "text-[#7C7C7C]";
    bgcolor = "bg-[#F0F6FC]";
  } else if (original?.status === "approved") {
    textcolor = "text-stateGreen";
    bgcolor = "bg-lightGreen";
  } else if (original?.status === "declined") {
    textcolor = "text-stateRed";
    bgcolor = "bg-lightRed";
  } else {
    textcolor = "text-stateOrange";
    bgcolor = "bg-lightOrange";
  }

  return (
    <div
      className={`${textcolor} ${bgcolor} w-fit rounded-md px-1.5 py-0.5 text-xs font-medium uppercase`}
    >
      {original?.status}
    </div>
  );
};

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function ucFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
// function tile

export default function FileTypes() {
  const value = useLoaderData();
  const { accessor } = createColumnHelper();

  const [selectedTab, setSelectedTab] = useState("All");
  const [getViewID, setGetViewID] = useState("");
  const [tableData, setTableData] = useState([]);
  const [cloneData, setCloneData] = useState([]);
  const [openModal, setOpenModal] = useState("");
  const [formValues, setFormValues] = useState({});
  const [requestViewData, setRequestViewData] = useState([]);

  const { leaveData, fetchAllLeave } = leaveStore((state) => state, shallow);
  const { overtimeData, fetchAllOvertime } = overtimeStore(
    (state) => state,
    shallow,
  );
  const { openSuccessModal } = alertModalStore((state) => state, shallow);

  useEffect(() => {
    fetchFilteredData();
  }, [leaveData, overtimeData, selectedTab, value]);

  const updateStatusAPI = async () => {
    const { status } = await PUT(
      `/applications/status/${getViewID}`,
      formValues,
    );
    if (status === 201) {
      openSuccessModal({
        title: "Success!",
        message: "Your changes has been successfully saved.",
        closeNameBtn: "Ok",
      });
      setOpenModal("");
      fetchAllLeave();
      fetchAllOvertime();
    }
  };

  const getRequestViewAPI = async (id) => {
    await GET(`/applications/${id}`)
      .then(({ data, status }) => {
        if (status === 200) {
          setRequestViewData(data);
        }
      })
      .catch((err) => console.log("Error getting request view"));
  };

  const fetchFilteredData = () => {
    let getStoredData = [];
    if (value === "leave") {
      getStoredData = leaveData;
    } else {
      getStoredData = overtimeData;
    }

    if (selectedTab == "All") {
      setCloneData(getStoredData);
      return setTableData(getStoredData);
    }
    const filteredData = getStoredData.filter(
      (item) => item.status === selectedTab.toLowerCase(),
    );
    setCloneData(filteredData);
    setTableData(filteredData);
  };

  const failureToLogTable = () => {
    // Table Column
    const tbclleave = [
      accessor("type", {
        id: "type",
        header: "Type",
        cell: ({ row }) => {
          const { type } = row.original;
          return (
            <div className="text-sm font-normal capitalize text-neutralDark">
              {type}
            </div>
          );
        },
      }),
      accessor("ishalfday", {
        id: "ishalfday",
        header: "Halfday",
        cell: ({ row: { original } }) => (original?.isHalfday ? "Yes" : "No"),
      }),
    ];
    const tbclovertime = [
      accessor("start_time", {
        id: "start_time",
        header: "Start Time",
        cell: ({ row }) => {
          const { start_time } = row.original;
          return moment(start_time).format("h:mm A");
        },
      }),
      accessor("end_time", {
        id: "end_time",
        header: "End Time",
        cell: ({ row }) => {
          const { end_time } = row.original;
          return moment(end_time).format("h:mm A");
        },
      }),
    ];

    const tbclquery = value === "leave" ? tbclleave : tbclovertime;

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
      accessor("date", {
        id: "date",
        header: "Date",
        cell: ({ row }) => {
          const { date } = row.original;
          return moment(date).format("MMMM DD, YYYY");
        },
      }),

      ...tbclquery,
      accessor("status", {
        id: "status",
        header: "Status",
        cell: ({ row: { original } }) => StatusUI(original),
      }),
      accessor("createdAt", {
        id: "createdAt",
        header: "Date Requested",
        cell: ({ row }) => {
          const { createdAt } = row.original;
          return moment(createdAt).format("MMMM DD, YYYY");
        },
      }),
      accessor("_id", {
        id: "_id",
        header: "Action",
        style: "w-20 ",
        cell: ({ row: { original } }) =>
          DropdownUI(
            setOpenModal,
            setGetViewID,
            original,
            setFormValues,
            getRequestViewAPI,
          ),
      }),
    ];

    // Tab Selection
    const tabSelection = [
      {
        name: "All",
        isSelected: selectedTab === "All",
        selectTabAction: () => {
          return setSelectedTab("All");
        },
      },
      {
        name: "Pending",
        isSelected: selectedTab === "Pending",
        selectTabAction: () => {
          return setSelectedTab("Pending");
        },
      },
      {
        name: "Approved",
        isSelected: selectedTab === "Approved",
        selectTabAction: () => {
          return setSelectedTab("Approved");
        },
      },
      {
        name: "Declined",
        isSelected: selectedTab === "Declined",
        selectTabAction: () => {
          return setSelectedTab("Declined");
        },
      },
      {
        name: "Cancelled",
        isSelected: selectedTab === "Cancelled",
        selectTabAction: () => {
          return setSelectedTab("Cancelled");
        },
      },
    ];

    const searchData = (value) => {
      const patternData = (item) =>
        pattern.test(item?.emp_id?.fullName) ||
        pattern.test(moment(item?.date).format("MMMM DD, YYYY")) ||
        pattern.test(item?.type) ||
        pattern.test(item?.isHalfday ? "Yes" : "No") ||
        pattern.test(moment(item?.start_time).format("h:mm A")) ||
        pattern.test(moment(item?.end_time).format("h:mm A")) ||
        pattern.test(item?.status) ||
        pattern.test(
          moment(moment(item?.createdAt).format("MMMM DD, YYYY")).format(
            "h:mm A",
          ),
        );

      const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
      const fltdData = cloneData.filter((item) => patternData(item));
      setTableData(fltdData);
    };

    // Table Config
    const tableProps = {
      columns,
      rows: tableData,
      title: `${ucFirst(value)} Request`,
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
      <div className="rounded-2xl bg-white px-4 py-6">
        {failureToLogTable()}
      </div>
      <ViewFileType
        openModal={openModal}
        setOpenModal={setOpenModal}
        type={value}
        requestViewData={requestViewData}
      />
      <UpdateStatus
        openModal={openModal}
        setOpenModal={setOpenModal}
        formValues={formValues}
        setFormValues={setFormValues}
        submitApi={updateStatusAPI}
      />
    </>
  );
}
