import React, { useEffect, useState } from "react";
import DataTable from "../../../components/tables/datatable/DataTable";
import { createColumnHelper } from "@tanstack/table-core";
import { useNavigate } from "react-router-dom";
import { shallow } from "zustand/shallow";

import * as Io5icons from "react-icons/io5";

import { employeeStore } from "../../../utils/zustand/AdminStore/Employee/employeeStore";

export const DropdownUI = (original) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center">
      <Io5icons.IoReaderOutline
        className="cursor-pointer text-lg text-primaryBlue"
        onClick={() =>
          navigate("/admin/time-sheet/viewemployee", { state: original })
        }
      />
    </div>
  );
};

export const EmployeeTableUI = (original) => {
  const { emp_img, firstName, middleName, lastName, mobileNo } = original || {};
  return (
    <div className="flex flex-row gap-2">
      <div className="rounded-full border border-neutralDark p-0.5">
        <img alt="employeeimg" className="h-8 w-8 rounded-full" src={emp_img} />
      </div>
      <div className="flex flex-col">
        <span className="text-base font-normal text-neutralDark">
          {firstName}
          {middleName ? " " : null}
          {middleName} {lastName}
        </span>
        <span className="text-xs font-normal text-neutralGray">
          0{mobileNo}
        </span>
      </div>
    </div>
  );
};

export default function TimeSheet() {
  const { accessor } = createColumnHelper();

  const { employee } = employeeStore((state) => state, shallow);

  const [tableData, setTableData] = useState(employee);

  useEffect(() => {
    setTableData(employee);
  }, [employee]);

  const timesheetTable = () => {
    // Table Column
    const columns = [
      accessor("employee", {
        id: "employee",
        header: "Employee",
        cell: ({ row: { original } }) => EmployeeTableUI(original),
      }),
      accessor("department", {
        id: "department",
        header: "Department",
        cell: ({ row: { original } }) => original?.departments?.name,
      }),
      accessor("designation", {
        id: "designation",
        header: "Designation",
        cell: ({ row: { original } }) => original?.designations?.name,
      }),
      accessor("_id", {
        id: "_id",
        header: "View",
        style: "w-20 ",
        cell: ({ row: { original } }) => DropdownUI(original),
      }),
    ];

    const searchData = (value) => {
      const patternData = (item) =>
        pattern.test(item.fullName) ||
        pattern.test(item?.departments?.name) ||
        pattern.test(item?.designations?.name);

      const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
      const fltdData = employee.filter((item) => patternData(item));
      setTableData(fltdData);
    };

    // Table Config
    const tableProps = {
      columns,
      rows: tableData,
      title: "Timesheet",
      subTitle: "Track the emplyee's attendance",
      searchOption: true,
      searchData
    };

    return tableProps && <DataTable {...tableProps} />;
  };

  return (
    <>
      <div className="rounded-2xl bg-white px-4 py-6">{timesheetTable()}</div>
    </>
  );
}
