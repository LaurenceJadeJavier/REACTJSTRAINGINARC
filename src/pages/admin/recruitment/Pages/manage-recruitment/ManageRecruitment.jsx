import { createColumnHelper } from "@tanstack/react-table";
import React, { useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { alertModalStore } from "../../../../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";
import * as Io5icons from "react-icons/io5";
import * as Lucide from "react-icons/lu";
import DropdownMenu from "../../../../../components/menu/DropdownMenu";
import DataTable from "../../../../../components/tables/datatable/DataTable";
import { Menu } from "@headlessui/react";
import BackButton from "../../../../../components/buttons/back-button/BackButton";

export default function ManageRecruitment() {
  const location = useLocation();
  const rows = useLoaderData();
  const { accessor } = createColumnHelper();
  const navigate = useNavigate();

  const { openConfirmModal, openSuccessModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);

  const [tableData, setTableData] = useState(rows);
  const [selectedTab, setSelectedTab] = useState("All");

  const actionList = [
    {
      _id: 1,
      label: "View",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoReaderOutline />,
      itemFunction: ({ original }) =>
        navigate(`/admin/recruitment/view-job-post/${original._id}`),
    },
  ];
  const columns = [
    accessor("name", {
      id: "name",
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    accessor("email", {
      id: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    }),
    accessor("contact", {
      id: "contact",
      header: "Contact",
      cell: (info) => info.getValue(),
    }),
    accessor("status", {
      id: "status",
      header: "Status",
      cell: (info) => info.getValue(),
    }),
    accessor("_id", {
      id: "_id",
      header: "Action",
      style: "w-20 ",
      cell: ({ row }) => {
        const { original } = row;
        return (
          <>
            <div
              className="text-xl text-primaryBlue hover:cursor-pointer"
              onClick={() =>
                navigate(`${location?.pathname}/applicants/${original._id}`)
              }
              // onClick={() => console.log(row, "row")}
            >
              <Lucide.LuFolderCog />
            </div>
          </>
        );
      },
    }),
  ];
  const headDetails = () => {
    return (
      <>
        <div className="mb-8 grid gap-1 md:grid-cols-8">
          <div className="col-span-1 flex flex-row py-1 text-base text-neutralGray md:justify-between">
            <span>Status</span>
            <span>:</span>
          </div>
          <div className="flex md:col-span-7">
            <div className="rounded-lg bg-lightOrange p-1 px-2 text-stateOrange">
              On Going
            </div>
          </div>
          <div className="col-span-1 flex flex-row text-base text-neutralGray md:justify-between">
            <span>Date Posted</span>
            <span>:</span>
          </div>
          <div className="text-base text-neutralDark md:col-span-7 ">
            03 August 2023
          </div>
          <div className="col-span-1 flex flex-row text-base text-neutralGray md:justify-between">
            <span>Deadline</span>
            <span>:</span>
          </div>
          <div className="text-base text-neutralDark md:col-span-7 ">
            December 24, 2023
          </div>
        </div>
      </>
    );
  };

  // Filter Tab
  const filterDataByTabAction = (tabName) => {
    if (tabName === "All") return setTableData(rows);
    const filteredData = rows.filter((item) => item.status === tabName);
    return setTableData(filteredData);
  };

  const tableTab = [
    {
      name: "All",
      isSelected: selectedTab === "All",
      selectTabAction: () => {
        filterDataByTabAction("All");
        return setSelectedTab("All");
      },
    },
    {
      name: "Received",
      isSelected: selectedTab === "Received",
      selectTabAction: () => {
        filterDataByTabAction("Received");
        return setSelectedTab("Received");
      },
    },
    {
      name: "Under Review",
      isSelected: selectedTab === "Under Review",
      selectTabAction: () => {
        filterDataByTabAction("Under Review");
        return setSelectedTab("Under Review");
      },
    },
    {
      name: "Short Listed",
      isSelected: selectedTab === "Short Listed",
      selectTabAction: () => {
        filterDataByTabAction("Short Listed");
        return setSelectedTab("Short Listed");
      },
    },
    {
      name: "On Hold",
      isSelected: selectedTab === "On Hold",
      selectTabAction: () => {
        filterDataByTabAction("On Hold");
        return setSelectedTab("On Hold");
      },
    },
    {
      name: "Not Selected",
      isSelected: selectedTab === "Not Selected",
      selectTabAction: () => {
        filterDataByTabAction("Not Selected");
        return setSelectedTab("Not Selected");
      },
    },
    {
      name: "Offer Extend",
      isSelected: selectedTab === "Offer Extend",
      selectTabAction: () => {
        filterDataByTabAction("Offer Extend");
        return setSelectedTab("Offer Extend");
      },
    },
    {
      name: "Offer Declined",
      isSelected: selectedTab === "Offer Declined",
      selectTabAction: () => {
        filterDataByTabAction("Offer Declined");
        return setSelectedTab("Offer Declined");
      },
    },
  ];

  const tableProps = {
    columns,
    rows: tableData,
    title: "Content Marketing Specialist",
    headDetails,
    tableTab,
  };

  return (
    <>
      <BackButton navigateTo="/admin/recruitment" />
      <div className="mt-2 h-full w-full rounded-xl bg-white p-5 drop-shadow-xl">
        <DataTable {...tableProps} />
      </div>
    </>
  );
}

export const manageRecruitmentLoader = () => {
  const rows = [
    {
      _id: 1,
      name: "John S. Doe Jr.",
      email: "john@gmail.com",
      contact: "Sample Contact",
      status: "Received",
    },
    {
      _id: 2,
      name: "John S. Doe Jr.",
      email: "john@gmail.com",
      contact: "Sample Contact",
      status: "Received",
    },
  ];
  return rows;
};
