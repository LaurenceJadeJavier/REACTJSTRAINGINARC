import { createColumnHelper } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import DropdownMenu from "../../../../components/menu/DropdownMenu";

import * as Io5icons from "react-icons/io5";
import DataTable from "../../../../components/tables/datatable/DataTable";
import AddPayrollPeriod from "./Modals/AddPayrollPeriod";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";
import { payrollPeriodStore } from "../../../../utils/zustand/AdminStore/HrSetup/payrollPeriod";
import moment from "moment";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";
import { DELETE } from "../../../../services/api";

export const DropdownUI = (setOpenModal, setFormValues, row) => {
  const { openDeleteModal, openSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
  );
  const { fetchAllPayrollPeriod } = payrollPeriodStore(
    (state) => state,
    shallow,
  );
  const { loadingHoc } = loadingStore((state) => state, shallow);

  const deleteAPI = async () => {
    const { original } = row || {};
    const { _id } = original || {};
    try {
      loadingHoc(true);
      const { status } = await DELETE(`/payroll-periods/${_id}`);
      if (status === 201) {
        loadingHoc(false);
        openSuccessModal({
          message: "Deleted Successfully!",
          closeNameBtn: "Ok",
        });
        return fetchAllPayrollPeriod();
      } else {
        return loadingHoc(false);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  // Table Action Option
  const actionList = [
    {
      _id: 1,
      label: "Update",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoCreateOutline />,
      itemFunction: () => {
        setFormValues({ ...row.original });
        setOpenModal("update");
      },
    },
    {
      _id: 2,
      label: "Delete",
      textColor: "text-stateRed",
      icon: <Io5icons.IoTrashBinOutline />,
      itemFunction: (row) =>
        openDeleteModal({
          modalAction: () => deleteAPI(),
        }),
    },
  ];

  return (
    <div className="text-center">
      {" "}
      <DropdownMenu actionList={actionList} />
    </div>
  );
};

export default function PayrollPeriod() {
  const { accessor } = createColumnHelper();
  const { payrollPeriods } = payrollPeriodStore((state) => state, shallow);

  const [openModal, setOpenModal] = useState("");
  const [formValues, setFormValues] = useState({});
  const [tableData, setTableData] = useState(payrollPeriods);

  useEffect(() => {
    setTableData(payrollPeriods);
  }, [payrollPeriods]);

  const clearModal = () => {
    setOpenModal("");
    setFormValues({});
  };

  const formValuesHandler = (e) => {
    return setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const payrollPeriodTable = () => {
    // Table Column
    const columns = [
      accessor("name", {
        id: "name",
        header: "Name",
        style: "w-[50%]",
        cell: (info) => info.getValue(),
      }),
      accessor("daterange", {
        id: "daterange",
        header: "Date Range",
        style: "w-[50%]",
        cell: ({ row }) => {
          const { start_day, end_day } = row.original;
          return `${moment(start_day).format("ll")} - ${moment(end_day).format(
            "ll",
          )}`;
        },
      }),
      accessor("_id", {
        id: "_id",
        header: "Action",
        style: "w-20",
        cell: ({ row }) => DropdownUI(setOpenModal, setFormValues, row),
      }),
    ];

    const openFormAction = () => {
      return setOpenModal("add");
    };

    const searchData = (value) => {
      const patternData = (item) =>
        pattern.test(item.name) ||
        pattern.test(moment(item?.start_day).format("ll")) ||
        pattern.test(moment(item?.end_day).format("ll"));

      const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
      const fltdData = payrollPeriods.filter((item) => patternData(item));
      setTableData(fltdData);
    };

    // Table Config
    const tableProps = {
      columns,
      rows: tableData,
      title: "Payroll Period",
      subTitle: "List of payroll period",
      btnName: "New Payroll Period",
      searchOption: true,
      openFormAction,
      searchData,
    };

    return tableProps && <DataTable {...tableProps} />;
  };

  return (
    <div className="rounded-2xl bg-white px-4 py-6">
      {payrollPeriodTable()}
      <AddPayrollPeriod
        openModal={openModal}
        setOpenModal={setOpenModal}
        formValuesHandler={formValuesHandler}
        formValues={formValues}
        clearModal={clearModal}
      />
    </div>
  );
}

export const PayrollPeriodLoader = async () => {
  const rows = [
    {
      name: "Test name",
      daterange: "Test date",
      _id: 0,
    },
    {
      name: "Test name",
      daterange: "Test date",
      _id: 1,
    },
    {
      name: "Test name",
      daterange: "Test date",
      _id: 2,
    },
  ];

  return rows;
};
