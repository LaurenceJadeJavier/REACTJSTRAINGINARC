import { createColumnHelper } from "@tanstack/react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";
import * as Io5icons from "react-icons/io5";
import DataTable from "../../../components/tables/datatable/DataTable";
import DropdownMenu from "../../../components/menu/DropdownMenu";
import { useNavigate } from "react-router-dom";
import { employeeStore } from "../../../utils/zustand/AdminStore/Employee/employeeStore";
import { loadingStore } from "../../../utils/zustand/LoadingStore/loadingStore";
import { alertModalStore } from "../../../utils/zustand/AlertModalStore/alertModalStore";

export default function Employees() {
  const navigate = useNavigate();

  const { accessor } = createColumnHelper();

  //global state
  const { openConfirmModal, openSuccessModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);
  const {
    employee,
    fetchAllEmployee,
    storeEmployeeForm,
    fetchEmployeeById,
    storeEmployeeView,
  } = employeeStore((state) => state, shallow);
  const { loadingHoc } = loadingStore((state) => state, shallow);

  //local state
  const [selectedTab, setSelectedTab] = useState("All");
  const [tableData, setTableData] = useState(employee);
  const [cloneData, setCloneData] = useState([]);

  useEffect(() => {
    setTableData(employee);
  }, [employee]);

  const actionList = [
    {
      _id: 1,
      label: "View",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoReaderOutline />,
      itemFunction: ({ original }) => {
        loadingHoc(true);
        fetchEmployeeById(original?._id);
        navigate(`/admin/employees/view-employee/${original._id}`);
      },
    },
    {
      _id: 2,
      label: "Manage Employee",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoCreateOutline />,
      itemFunction: ({ original }) => {
        const { documents, leave_credits, basicPays, emp_bank_acc, ...rest } =
          original ?? {};

        navigate(`/admin/employees/manage-employee/${original._id}/step-1/`);
        storeEmployeeView("manage");
        fetchEmployeeById(original?._id);
        return storeEmployeeForm({
          generalInfo: { ...rest, mobileNo: "0" + rest?.mobileNo },
          contribution: { ...rest },
          documents,
          leave_credits:
            leave_credits?.length > 0
              ? leave_credits.map(({ _id, credits }) => ({
                  leaveType_id: _id,
                  credits,
                }))
              : [],
          basicPays,
          emp_bank_acc,
        });
      },
    },
  ];

  const columns = [
    accessor("fullName", {
      id: "fullName",
      header: "Employee",
      cell: ({ row }) => {
        const { fullName, emp_img, emp_no } = row?.original ?? {};

        return (
          <div className="flex items-center">
            <img
              src={emp_img}
              alt="employeeImage"
              className="mx-2 h-10 w-10 rounded-full border border-neutralDark p-1"
            />
            <div className="flex flex-col">
              <span className="text-base capitalize">{fullName}</span>
              <span className="text-xs text-neutralGray">{emp_no}</span>
            </div>
          </div>
        );
      },
    }),
    accessor("departments", {
      id: "departments",
      header: "Department",
      cell: ({ row }) => {
        const { departments } = row.original ?? {};
        return <div>{departments?.name ?? "-"}</div>;
      },
    }),
    accessor("designations", {
      id: "designations",
      header: "Designation",
      cell: ({ row }) => {
        const { designations } = row.original ?? {};
        return <div>{designations?.name ?? "-"}</div>;
      },
    }),
    accessor("status", {
      id: "status",
      header: "Status",
      cell: (info) => <div className="capitalize">{info.getValue()}</div>,
    }),
    accessor("_id", {
      id: "_id",
      header: "Action",
      style: "w-20 ",
      cell: ({ row }) => (
        <div className="text-center">
          <DropdownMenu actionList={actionList} row={row} />
        </div>
      ),
    }),
  ];

  const openFormAction = () => {
    storeEmployeeView("create");
    navigate("/admin/employees/create-employee/step-1", {
      state: { formTitle: "Register New Employee" },
    });
  };

  const filterDataByTabAction = (tabName) => {
    if (tabName === "All") {
      setCloneData(employee);
      return setTableData(employee);
    }
    const filteredData = employee?.filter((item) => item.status === tabName);
    setCloneData(filteredData);
    return setTableData(filteredData);
  };

  const searchData = (value) => {
    const patternData = (item) =>
      pattern.test(item.fullName) ||
      pattern.test(item?.departments?.name) ||
      pattern.test(item?.designations?.name) ||
      pattern.test(item?.status);

    const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
    const fltdData = cloneData.filter((item) => patternData(item));
    setTableData(fltdData);
  };

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
      name: "Active",
      isSelected: selectedTab === "Active",
      selectTabAction: () => {
        filterDataByTabAction("regular");
        return setSelectedTab("Active");
      },
    },
    {
      name: "Non Regular",
      isSelected: selectedTab === "Non Regular",
      selectTabAction: () => {
        filterDataByTabAction("non-regular");
        return setSelectedTab("Non Regular");
      },
    },
    {
      name: "Floating",
      isSelected: selectedTab === "Floating",
      selectTabAction: () => {
        filterDataByTabAction("floating");
        return setSelectedTab("Floating");
      },
    },
    {
      name: "Resigned",
      isSelected: selectedTab === "Resigned",
      selectTabAction: () => {
        filterDataByTabAction("resigned");
        return setSelectedTab("Resigned");
      },
    },
    {
      name: "Terminated",
      isSelected: selectedTab === "Terminated",
      selectTabAction: () => {
        filterDataByTabAction("terminated");
        return setSelectedTab("Terminated");
      },
    },
  ];

  const tableProps = {
    columns,
    rows: tableData,
    title: "Employee",
    subTitle: "List of Employees",
    btnName: "New Employee",
    openFormAction,
    tableTab: tabSelection,
    searchOption: true,
    searchData,
  };
  return (
    <>
      <div className="h-full w-full rounded-xl bg-white p-5 drop-shadow-xl">
        <DataTable {...tableProps} />
      </div>
    </>
  );
}
