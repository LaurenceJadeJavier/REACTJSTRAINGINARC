import { createColumnHelper } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

import * as Lucide from "react-icons/lu";

import DataTable from "../../../../components/tables/datatable/DataTable";
import AddNewBackpay from "./Modals/AddBackpay";

export const DropdownUI = (setOpenModal) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <Lucide.LuFolderCog
        className="cursor-pointer text-lg text-primaryBlue"
        onClick={() => navigate("/admin/payroll/backpay/view")}
      />
    </div>
  );
};

export const StatusUI = (original) => {
  let textcolor = "";
  let bgcolor = "";

  if (original?.status === "In Review") {
    textcolor = "text-stateOrange";
    bgcolor = "bg-lightOrange";
  } else if (original?.status === "For Approval") {
    textcolor = "text-[#9747FF]";
    bgcolor = "bg-[#F3EEF9]";
  } else if (original?.status === "Approved") {
    textcolor = "text-stateGreen";
    bgcolor = "bg-lightGreen";
  } else if (original?.status === "Declined") {
    textcolor = "text-stateRed";
    bgcolor = "bg-lightRed";
  } else {
    textcolor = "text-darkGray";
    bgcolor = "bg-lightBlue";
  }

  return (
    <div
      className={`${textcolor} ${bgcolor} w-fit rounded-md px-1.5 py-0.5 text-xs font-medium uppercase`}
    >
      {original?.status}
    </div>
  );
};

export default function Backpay() {
  const rows = useLoaderData();
  const { accessor } = createColumnHelper();

  const [openModal, setOpenModal] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");
  const [tableData, setTableData] = useState(rows);

  useEffect(() => {
    filterDataByTabAction(selectedTab);
  }, []);

  // Filter Tab
  const filterDataByTabAction = (tabName) => {
    if (tabName === "All") return setTableData(rows);
    const filteredData = rows.filter((item) => item.status === tabName);
    return setTableData(filteredData);
  };

  const backpayTable = () => {
    // Table Column
    const columns = [
      accessor("employee", {
        id: "employee",
        header: "Employee",
        cell: (info) => info.getValue(),
      }),
      accessor("department", {
        id: "department",
        header: "Department",
        cell: (info) => info.getValue(),
      }),
      accessor("totalbackpay", {
        id: "totalbackpay",
        header: "Total Backpay",
        cell: (info) => info.getValue(),
      }),
      accessor("status", {
        id: "status",
        header: "Status",
        cell: ({ row: { original } }) => StatusUI(original),
      }),
      accessor("_id", {
        id: "_id",
        header: "Action",
        style: "w-20 ",
        cell: (info) => DropdownUI(setOpenModal),
      }),
    ];

    // Tab Selection
    const tabSelection = [
      {
        name: "All",
        isSelected: selectedTab === "All",
        selectTabAction: () => {
          filterDataByTabAction("All");
          return setSelectedTab("All");
        },
      },
      {
        name: "In Review",
        isSelected: selectedTab === "In Review",
        selectTabAction: () => {
          filterDataByTabAction("In Review");
          return setSelectedTab("In Review");
        },
      },
      {
        name: "For Approval",
        isSelected: selectedTab === "For Approval",
        selectTabAction: () => {
          filterDataByTabAction("For Approval");
          return setSelectedTab("For Approval");
        },
      },
      {
        name: "Approved",
        isSelected: selectedTab === "Approved",
        selectTabAction: () => {
          filterDataByTabAction("Approved");
          return setSelectedTab("Approved");
        },
      },
      {
        name: "Declined",
        isSelected: selectedTab === "Declined",
        selectTabAction: () => {
          filterDataByTabAction("Declined");
          return setSelectedTab("Declined");
        },
      },
      {
        name: "Void",
        isSelected: selectedTab === "Void",
        selectTabAction: () => {
          filterDataByTabAction("Void");
          return setSelectedTab("Void");
        },
      },
    ];

    const openFormAction = () => {
      return setOpenModal("add");
    };

    // Table Config
    const tableProps = {
      columns,
      rows: tableData,
      title: "Backpay",
      subTitle: "List of generated back pays",
      btnName: "New Backpay",
      searchOption: true,
      tableTab: tabSelection,
      openFormAction,
    };

    return tableProps && <DataTable {...tableProps} />;
  };

  return (
    <div>
      <div className="rounded-2xl bg-white px-4 py-6 drop-shadow-xl">
        {backpayTable()}
      </div>
      <AddNewBackpay openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}

export const BackpayLoader = async () => {
  const rows = [
    {
      employee: "TEST",
      department: "TEST",
      totalbackpay: "10.000",
      status: "In Review",
      _id: 0,
    },
    {
      employee: "TEST2",
      department: "TEST2",
      totalbackpay: "10.000",
      status: "For Approval",
      _id: 1,
    },
    {
      employee: "TEST3",
      department: "TEST3",
      totalbackpay: "10.000",
      status: "Approved",
      _id: 2,
    },
    {
      employee: "TEST2",
      department: "TEST2",
      totalbackpay: "10.000",
      status: "Declined",
      _id: 3,
    },
    {
      employee: "TEST3",
      department: "TEST3",
      totalbackpay: "10.000",
      status: "Void",
      _id: 4,
    },
  ];

  return rows;
};
