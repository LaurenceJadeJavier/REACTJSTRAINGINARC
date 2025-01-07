import React, { useEffect, useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/table-core";
import DataTable from "../../../../components/tables/datatable/DataTable";
import DropdownMenu from "../../../../components/menu/DropdownMenu";
import * as Io5icons from "react-icons/io5";
import ViewOfficialBusiness from "./Modals/ViewOfficialBusiness";
import UpdateStatus from "./Modals/UpdateStatus";

import Status from "../../../../components/status-color/Status";
import { officialBusinessStore } from "../../../../utils/zustand/FileRequest/officialBusiness";
import { shallow } from "zustand/shallow";
import moment from "moment";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";
import { GET, PUT } from "../../../../services/api";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import blankProfile from "../../../../assets/images/blankProfile.jpg";

const defaultValue = {
  name: "",
};

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
      itemFunction: () => setOpenModal("print"),
    },
  ];

  return (
    <div className="text-center">
      {" "}
      <DropdownMenu actionList={actionList} />
    </div>
  );
};

export default function OfficialBusiness() {
  const { accessor } = createColumnHelper();

  //global state
  const { officialBusinesses, fetchAllOfficialBusinesses } =
    officialBusinessStore((state) => state, shallow);
  const { loadingHoc } = loadingStore((state) => state, shallow);
  const { openSuccessModal } = alertModalStore((state) => state, shallow);

  const [selectedTab, setSelectedTab] = useState("All");
  const [openModal, setOpenModal] = useState("");
  const [formValues, setFormValues] = useState({});
  const [tableData, setTableData] = useState([]);
  const [cloneData, setCloneData] = useState([]);

  useEffect(() => {
    filteredData();
  }, [officialBusinesses, selectedTab]);

  // filtered data
  const filteredData = () => {
    if (selectedTab == "All") {
      setCloneData(officialBusinesses);
      return setTableData(officialBusinesses);
    } else {
      const filteredData = officialBusinesses.filter(
        (item) => item.status === selectedTab.toLowerCase(),
      );
      setCloneData(filteredData);
      return setTableData(filteredData);
    }
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
      return fetchAllOfficialBusinesses();
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

  const officialBusinessTable = () => {
    // Table Column
    const columns = [
      accessor("employee", {
        id: "employee",
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
      accessor("start_time", {
        id: "start_time",
        header: "Start time",
        cell: (info) => moment(info.getValue()).format("LT"),
      }),
      accessor("end_time", {
        id: "end_time",
        header: "End time",
        cell: (info) => moment(info.getValue()).format("LT"),
      }),
      accessor("status", {
        id: "status",
        header: "Status",
        cell: (info) => (
          <>
            <Status status={info.getValue()} label={info.getValue()} />
          </>
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
        pattern.test(item.emp_id?.fullName) ||
        pattern.test(moment(item?.createdAt).format("LL")) ||
        pattern.test(moment(item?.start_time).format("LT")) ||
        pattern.test(moment(item?.end_time).format("LT")) ||
        pattern.test(item?.status) ||
        pattern.test(moment(item?.date).format("LL"));

      const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
      const fltdData = cloneData.filter((item) => patternData(item));
      setTableData(fltdData);
    };

    // Table Config
    const tableProps = {
      columns,
      rows: tableData,
      title: "Official Business",
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
        {officialBusinessTable()}
      </div>
      <ViewOfficialBusiness
        openModal={openModal}
        setOpenModal={setOpenModal}
        formValues={formValues}
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
  );
}
