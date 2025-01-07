import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { shallow } from "zustand/shallow";
import moment from "moment";

import * as Io5icons from "react-icons/io5";

import AddUpdateLoan from "./Modals/AddUpdate";
import DataTable from "../../../../components/tables/datatable/DataTable";
import DropdownMenu from "../../../../components/menu/DropdownMenu";
import { loanStore } from "../../../../utils/zustand/AdminStore/Loan/loanStore";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { POST, PUT } from "../../../../services/api";

export const DropdownUI = (
  setOpenModal,
  original,
  formValues,
  setFormValues,
) => {
  const navigate = useNavigate();
  const { openDeleteModal, openSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
  );

  // Table Action Option
  const actionList = [
    {
      _id: 1,
      label: "View",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoReaderOutline />,
      itemFunction: () =>
        navigate("/admin/payroll/loan/view", { state: { id: original?._id } }),
    },
    {
      _id: 2,
      label: "Update",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoCreateOutline />,
      itemFunction: () => {
        setFormValues({
          emp_id: original?.emp_id?._id,
          reason: original?.reason,
          amount: original?.amount,
          date: moment(original?.date).format("yyyy-MM-DD"),
          installment_amount: original?.installment_amount,
          installment_no: original?.installment_no,
          payroll_period_id: "64f534e432bfdbb73d70fc8e",
          id: original?._id,
        });
        setOpenModal("update");
      },
    },
    {
      _id: 3,
      label: "Delete",
      textColor: "text-stateRed",
      icon: <Io5icons.IoTrashBinOutline />,
      itemFunction: (row) =>
        openDeleteModal({
          modalAction: () => {
            openSuccessModal({
              title: "Success!",
              message: "Deleted Successfully!",
              closeNameBtn: "Ok",
            });
          },
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

export default function Loan() {
  const { accessor } = createColumnHelper();

  const { loanData, fetchAllLoan } = loanStore((state) => state, shallow);
  const { openSuccessModal } = alertModalStore((state) => state, shallow);

  const [openModal, setOpenModal] = useState("");
  const [formValues, setFormValues] = useState({});

  const createLoanAPI = async () => {
    const params = {
      ...formValues,
      date: moment(formValues.date).format(),
    };

    await POST("/loans", params).then(({ status }) => {
      if (status === 201) {
        setOpenModal("");
        setFormValues({});
        openSuccessModal({
          title: "Success!",
          message: "Applied Successfully!",
          closeNameBtn: "Ok",
        });
        return fetchAllLoan();
      }
    });
  };

  const updateLoanAPI = async () => {
    const params = {
      ...formValues,
      date: moment(formValues.date).format(),
    };

    await PUT(`/loans/${formValues?.id}`, params).then(({ status }) => {
      if (status === 201) {
        setOpenModal("");
        setFormValues({});
        openSuccessModal({
          title: "Success!",
          message: "Your changes has been successfully saved.",
          closeNameBtn: "Ok",
        });
        return fetchAllLoan();
      }
    });
  };

  const loanTable = () => {
    // Table Column
    const columns = [
      accessor("employee", {
        id: "employee",
        header: "Employee",
        style: "w-52",
        cell: ({ row: { original } }) => (
          <div>{original?.emp_id?.fullName}</div>
        ),
      }),
      accessor("department", {
        id: "department",
        header: "Department",
        style: "w-40",
        cell: ({ row: { original } }) => (
          <div>{original?.emp_id?.dept_id?.name}</div>
        ),
      }),
      accessor("installment_amount", {
        id: "installment_amount",
        header: "Total Amount Repaid",
        cell: (info) => info.getValue(),
      }),
      accessor("amount", {
        id: "amount",
        header: "Remaining Amount",
        cell: (info) => info.getValue(),
      }),
      accessor("installment_no", {
        id: "installment_no",
        header: "Remaining Installment No.",
        cell: (info) => info.getValue(),
      }),
      accessor("_id", {
        id: "_id",
        header: "Action",
        style: "w-20 ",
        cell: ({ row: { original } }) =>
          DropdownUI(setOpenModal, original, formValues, setFormValues),
      }),
    ];

    const openFormAction = () => {
      return setOpenModal("add");
    };

    // Table Config
    const tableProps = {
      columns,
      rows: loanData,
      title: "Loan",
      subTitle: "List of applied loans",
      btnName: "Apply New Loan",
      searchOption: true,
      openFormAction,
    };

    return tableProps && <DataTable {...tableProps} />;
  };

  return (
    <div>
      <div className="rounded-2xl bg-white px-4 py-6 drop-shadow-xl">
        {loanTable()}
      </div>
      <AddUpdateLoan
        openModal={openModal}
        setOpenModal={setOpenModal}
        formValues={formValues}
        setFormValues={setFormValues}
        formAction={openModal === "add" ? createLoanAPI : updateLoanAPI}
      />
    </div>
  );
}

export const LoanLoader = async () => {
  const rows = [
    {
      employee: "Pending",
      department: "Pending",
      totalamount: "10.000",
      remainingamount: "10.000",
      remaininginstallno: "1",
      _id: 0,
    },
  ];

  return rows;
};
