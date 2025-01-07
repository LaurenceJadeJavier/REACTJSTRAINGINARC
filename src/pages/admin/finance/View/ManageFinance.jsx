import React, { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { shallow } from "zustand/shallow";
import moment from "moment";
import * as Io5icons from "react-icons/io5";

// Component
import DataTable from "../../../../components/tables/datatable/DataTable";
import DropdownMenu from "../../../../components/menu/DropdownMenu";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import FormModal from "../../../../components/modal/FormModal";
import { CustomSelect } from "../../../../components/inputs/CustomSelect";
import { DELETE, POST, PUT } from "../../../../services/api";

// Zustand Component
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { financeStore } from "../../../../utils/zustand/AdminStore/Finance/financeStore";

export default function ManageFinance(props) {
  const { accessor } = createColumnHelper();
  const { accountContainer, setManageView } = props || {};

  // Global State
  const { financeManageData, fetchManageFinance } = financeStore(
    (state) => state,
    shallow,
  );
  const { openConfirmModal, openDeleteModal, openSuccessModal } =
    alertModalStore((state) => state, shallow);

  // Form Object
  const formObject = {
    desc: "",
    amount: "",
    type: "",
    date: moment(Date.now()).format(),
  };

  // Local State
  const [formValues, setFormValues] = useState(formObject);
  const [openForm, setOpenForm] = useState({});
  const [isEmpty, setIsEmpty] = useState(false);

  const formValidateValuesAction = () => {
    const { desc, amount, type } = formValues || {};
    return !desc || !amount || !type;
  };

  // Create New Transaction (Service) API
  const createTransactionAction = async () => {
    const { _id } = accountContainer || {};
    const formValidate = formValidateValuesAction();
    if (formValidate) return setIsEmpty(true);

    const params = {
      ...formValues,
      bank_acc_id: _id,
    };

    try {
      const { status } = await POST("/transact-lists", params);
      return status === 201 && successServiceAction();
    } catch (err) {
      console.log(`err:`, err);
    }
  };

  // Update Transaction (Service) API
  const updateTransactionAction = async () => {
    const { _id: transactId } = formValues || {};
    const { _id: bankId } = accountContainer || {};
    const formValidate = formValidateValuesAction();
    if (formValidate) return setIsEmpty(true);

    const params = {
      ...formValues,
      bank_acc_id: bankId,
    };

    try {
      const { status } = await PUT("/transact-lists/" + transactId, params);
      return status === 201 && successServiceAction();
    } catch (err) {
      console.log(`err:`, err);
    }
  };

  // Delete Transaction (Service) API
  const deleteTransactionAction = async (id) => {
    try {
      const { status } = await DELETE("/transact-lists/" + id);
      return status === 201 && successServiceAction();
    } catch (err) {
      console.log(`err:`, err);
    }
  };

  const successServiceAction = () => {
    const { _id } = accountContainer || {};

    fetchManageFinance(_id);
    setOpenForm({ isOpen: false });
    setFormValues(formObject);
    setIsEmpty(false);
    return openSuccessModal({
      title: "Success!",
      message: "Your changes has been successfully saved.!",
      closeNameBtn: "Ok",
    });
  };

  // Navigation Display
  const navigationDisplay = () => {
    return (
      <div className="flex flex-row items-center justify-between">
        <div
          className="flex cursor-pointer flex-row items-center gap-1 rounded-lg px-4 py-2 text-primaryBlue hover:bg-gray-100"
          onClick={() => setManageView(false)}
        >
          <span>
            <Io5icons.IoArrowBackSharp className="text-md text-primaryBlue" />
          </span>
          Back
        </div>
      </div>
    );
  };

  // Finance Profile Details
  const financeProfileDisplay = () => {
    const { acc_no, name, branch, initial_bal } = accountContainer || {};
    const totalAmount = new Intl.NumberFormat().format(initial_bal);

    return (
      <div className="flex flex-row items-center justify-between rounded-2xl bg-white px-4 py-6 shadow-md">
        <div className="flex flex-col gap-1">
          <div className="font-semibold text-neutralDark">{name ?? "--"}</div>
          <div className="text-sm text-neutralDark">{acc_no ?? "--"}</div>
          <div className="text-sm text-neutralDark">{branch ?? "--"}</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-primaryBlue px-16 py-3">
          <div className="font-semibold text-primaryBlue">
            P {totalAmount ?? 0}
          </div>
          <div className="text-sm">Balance</div>
        </div>
      </div>
    );
  };

  // Finance Transaction Table
  const financeTransactionTable = () => {
    const dropDownMenu = (info) => {
      // Table Action Option
      const actionList = [
        {
          _id: 1,
          label: "Update",
          textColor: "text-primaryBlue",
          icon: <Io5icons.IoCreateOutline />,
          itemFunction: ({ row }) => {
            setFormValues(row.original);
            setOpenForm({
              action: "Update",
              isOpen: true,
            });
          },
        },
        {
          _id: 2,
          label: "Delete",
          textColor: "text-stateRed",
          icon: <Io5icons.IoTrashBinOutline />,
          itemFunction: ({ row }) => {
            const data = row.original;
            console.log(`data:`, data);
            openDeleteModal({
              modalAction: () => deleteTransactionAction(data._id),
            });
          },
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
      accessor("createdAt", {
        id: "createdAt",
        header: "Date And Time",
        cell: (info) => {
          const data = info.getValue();
          const formatTime = (date, type) => moment(date).format(type);
          return data
            ? formatTime(data, "LL") + " | " + formatTime(data, "LT")
            : "--";
        },
      }),
      accessor("transaction_id", {
        id: "transaction_id",
        header: "Transaction ID",
        cell: (info) => info.getValue() ?? "--",
      }),
      accessor("desc", {
        id: "desc",
        header: "Description",
        cell: (info) => info.getValue() ?? "--",
      }),
      accessor("type", {
        id: "type",
        header: "Type",
        cell: (info) => info.getValue(),
      }),
      accessor("_id", {
        id: "_id",
        header: "Action",
        cell: (info) => dropDownMenu(info),
      }),
    ];

    // Table Config
    const tableProps = {
      columns,
      rows: financeManageData[0]?.transactLists ?? [],
      title: "",
      subTitle: "",
      btnName: "New Transaction",
      filterSelectionList: ["type"],
      openFormAction: () =>
        setOpenForm({
          action: "Add",
          isOpen: true,
        }),
      openForm,
    };

    return (
      <div className="rounded-2xl bg-white px-4 py-6">
        <DataTable {...tableProps} />
      </div>
    );
  };

  // Finance Form
  const financeForm = () => {
    const isAdd = openForm.action === "Add";

    const handleOnChange = (e) => {
      const { value, name } = e.target || {};
      return setFormValues((data) => ({ ...data, [name]: value }));
    };

    // Clear Modal
    const clearModal = () => {
      setFormValues(formObject);
      setIsEmpty(false);
      return setOpenForm({});
    };

    const body = () => {
      const withdrawType = [
        { label: "Deposit", value: "deposit", _id: 1 },
        { label: "Withdraw", value: "withdraw", _id: 2 },
        { label: "Transfer", value: "transfer", _id: 3 },
      ];

      return (
        <div className="grid grid-cols-1 gap-2">
          <CustomInput
            name="desc"
            label="Description"
            type="text"
            isRequired={true}
            value={formValues.desc}
            isEmpty={isEmpty}
            onChange={handleOnChange}
          />
          <CustomSelect
            name="type"
            label="Type"
            type="text"
            isRequired={true}
            value={!isAdd || !!formValues.type ? formValues.type : null}
            isEmpty={isEmpty}
            onChange={handleOnChange}
            options={withdrawType}
          />
          <CustomInput
            name="amount"
            label="Amount"
            type="number"
            isRequired={true}
            value={formValues.amount}
            isEmpty={isEmpty}
            onChange={handleOnChange}
          />
        </div>
      );
    };

    const modalProps = {
      title: isAdd ? "Add New Transaction" : "Update Transaction",
      body: body(),
      submit: {
        name: isAdd ? "Add" : "Update",
        btnFunction: () => {
          if (isAdd) return createTransactionAction();
          return openConfirmModal({
            title: "Are you sure?",
            message: "Are you sure you want to update this?",
            confirmNameBtn: "Yes, Update",
            modalAction: () => updateTransactionAction(),
          });
        },
      },
      cancel: {
        name: "Cancel",
        btnFunction: () => clearModal(),
      },
      isOpen: openForm.isOpen,
      maxWidth: "max-w-lg",
    };

    return <FormModal {...modalProps} />;
  };

  return (
    <div className="flex flex-col gap-4">
      {navigationDisplay()}
      {financeProfileDisplay()}
      {financeTransactionTable()}
      {financeForm()}
    </div>
  );
}

const rows = [
  {
    _id: 1,
    dateAndTime: "April 09, 2023 | 08:00 AM",
    transactionId: "123-ABCDEF",
    description: "Sample Description",
    type: "Deposit",
  },
  {
    _id: 2,
    dateAndTime: "April 09, 2023 | 08:00 AM",
    transactionId: "123-ABCDEF",
    description: "Sample Description",
    type: "Withdraw",
  },
  {
    _id: 3,
    dateAndTime: "April 09, 2023 | 08:00 AM",
    transactionId: "123-ABCDEF",
    description: "Sample Description",
    type: "Transfer",
  },
  {
    _id: 4,
    dateAndTime: "April 09, 2023 | 08:00 AM",
    transactionId: "123-ABCDEF",
    description: "Sample Description",
    type: "Withdraw",
  },
  {
    _id: 5,
    dateAndTime: "April 09, 2023 | 08:00 AM",
    transactionId: "123-ABCDEF",
    description: "Sample Description",
    type: "Transfer",
  },
  {
    _id: 6,
    dateAndTime: "April 09, 2023 | 08:00 AM",
    transactionId: "123-ABCDEF",
    description: "Sample Description",
    type: "Deposit",
  },
  {
    _id: 7,
    dateAndTime: "April 09, 2023 | 08:00 AM",
    transactionId: "123-ABCDEF",
    description: "Sample Description",
    type: "Withdraw",
  },
];
