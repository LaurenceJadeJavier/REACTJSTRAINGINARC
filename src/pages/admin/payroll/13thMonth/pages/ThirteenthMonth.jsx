import { createColumnHelper } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import { shallow } from "zustand/shallow";
import { thirteenthStore } from "../../../../../utils/zustand/Payroll/13thMonth/thirteenthMonth";
import DataTable from "../../../../../components/tables/datatable/DataTable";
import StatusLayout from "../components/StatusLayout";
import * as Lucideicons from "react-icons/lu";
import FormLayout from "../components/FormLayout";
import { useNavigate } from "react-router-dom";

export default function ThirteenthMonth() {
  const navigate = useNavigate();
  const { accessor } = createColumnHelper();

  const { thirteenthMonths } = thirteenthStore((state) => state, shallow);

  //local state
  const [selectedTab, setSelectedTab] = useState("All");
  const [openModal, setOpenModal] = useState("");

  // Tab Selection
  const tabSelection = [
    {
      name: "All",
      isSelected: selectedTab === "All",
      selectTabAction: () => setSelectedTab("All"),
    },
    {
      name: "In Review",
      isSelected: selectedTab === "In Review",
      selectTabAction: () => setSelectedTab("In Review"),
    },
    {
      name: "For Approval",
      isSelected: selectedTab === "For Approval",
      selectTabAction: () => setSelectedTab("For Approval"),
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
      name: "Void",
      isSelected: selectedTab === "Void",
      selectTabAction: () => setSelectedTab("Void"),
    },
  ];

  const tableData = useMemo(() => {
    if (selectedTab == "All") return thirteenthMonths;
    return thirteenthMonths.filter(
      (item) => item.status.toLowerCase() === selectedTab.toLowerCase(),
    );
  }, [selectedTab]); // insert fetch here

  const openFormAction = () => {
    return setOpenModal("add");
  };

  const columns = [
    accessor("dateRange", {
      id: "dateRange",
      header: "Date Range",
      cell: (info) => info.getValue(),
    }),
    accessor("department", {
      id: "department",
      header: "Department",
      cell: (info) => info.getValue(),
    }),
    accessor("status", {
      id: "status",
      header: "Status",
      cell: (info) => (
        <StatusLayout status={info.getValue()} label={info.getValue()} />
      ),
    }),
    accessor("_id", {
      id: "_id",
      header: "Action",
      style: "w-20 ",
      cell: (info) => (
        <div
          className="flex cursor-pointer justify-center text-lg text-primaryBlue"
          onClick={() => {
            navigate(`/admin/payroll/13th-month/${info.getValue()}`);
          }}
        >
          <Lucideicons.LuFolderCog />
        </div>
      ),
    }),
  ];

  // Table Config
  const tableProps = {
    columns,
    rows: tableData,
    title: "13th Month",
    subTitle: "List of generated 13th month pays",
    btnName: "Generate 13th Month",
    tableTab: tabSelection,
    openFormAction,
  };

  return (
    <>
      <div className=" rounded-2xl bg-white px-4 py-6 shadow-xl">
        {tableProps && <DataTable {...tableProps} />}
        {<FormLayout openModal={openModal} setOpenModal={setOpenModal} />}
      </div>
    </>
  );
}
