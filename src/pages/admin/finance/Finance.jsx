import { createColumnHelper } from "@tanstack/react-table";
import React, { useEffect, useState } from "react";
import * as Lucideicons from "react-icons/lu";
import * as Io5icons from "react-icons/io5";
import { shallow } from "zustand/shallow";

// Component
import DataTable from "../../../components/tables/datatable/DataTable";
import DropdownMenu from "../../../components/menu/DropdownMenu";
import ManageFinance from "./View/ManageFinance";
import FormModal from "../../../components/modal/FormModal";
import { CustomInput } from "../../../components/inputs/CustomInput";
import { POST, PUT } from "../../../services/api";

// Zustand Component
import { alertModalStore } from "../../../utils/zustand/AlertModalStore/alertModalStore";
import { financeStore } from "../../../utils/zustand/AdminStore/Finance/financeStore";

export default function Finance() {
  const { accessor } = createColumnHelper();

  //Global State
  const { financeData, fetchManageFinance, fetchAllFinance } = financeStore(
    (state) => state,
    shallow,
  );
  const { openConfirmModal, openSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
  );

  // Form Object
  const formObject = {
    name: "",
    initial_bal: "",
    acc_no: "",
    branch: "",
  };

  // Local State
  const [formValues, setFormValues] = useState(formObject);
  const [accountContainer, setAccountContainer] = useState({});
  const [modalType, setModalType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [manageView, setManageView] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [tableData, setTableData] = useState(financeData);

  useEffect(() => {
    setTableData(financeData);
  }, [financeData]);

  // Form Validation
  const formValidateValuesAction = () => {
    const { name, initial_bal, acc_no, branch } = formValues || {};
    return !name || !initial_bal || !acc_no || !branch;
  };

  // Create New Account (Service) API
  const createNewAccountAction = async () => {
    const formValidate = formValidateValuesAction();
    if (formValidate) return setIsEmpty(true);

    try {
      const { status } = await POST("/bank-accs/", formValues);
      return status === 201 && successServiceAction();
    } catch (err) {
      console.log(`err:`, err);
    }
  };

  // Update Account (Service) API
  const updateNewAccountAction = async () => {
    const { _id } = formValues || {};
    const formValidate = formValidateValuesAction();
    if (formValidate === true) return setIsEmpty(true);

    try {
      const { status } = await PUT("/bank-accs/" + _id, formValues);
      return status === 201 && successServiceAction();
    } catch (err) {
      console.log(`err:`, err);
    }
  };

  // Clear Modal Value Action
  const successServiceAction = () => {
    setOpenModal(false);
    fetchAllFinance();
    setModalType("");
    setFormValues(formObject);
    setIsEmpty(false);
    return openSuccessModal({
      title: "Success!",
      message: "Your changes has been successfully saved.",
      closeNameBtn: "Ok",
    });
  };

  // Finance Table View
  const financeTable = () => {
    const dropDownMenu = (row) => {
      // Table Action Option
      const actionList = [
        {
          _id: 1,
          label: "Manage Transaction",
          textColor: "text-primaryBlue",
          icon: <Lucideicons.LuFolderCog />,
          itemFunction: (info) => {
            const data = info.row.original;
            fetchManageFinance(data?._id);
            setAccountContainer(data);
            return setManageView(true);
          },
        },
        {
          _id: 2,
          label: "Update",
          textColor: "text-primaryBlue",
          icon: <Io5icons.IoCreateOutline />,
          itemFunction: (info) => {
            setFormValues(info.row.original);
            setModalType("update");
            return setOpenModal(true);
          },
        },
      ];

      return (
        <div className="text-center">
          <DropdownMenu actionList={actionList} row={row} />
        </div>
      );
    };

    // Table Column
    const columns = [
      accessor("name", {
        id: "name",
        header: "Account Name",
        cell: (info) => info.getValue(),
      }),
      accessor("acc_no", {
        id: "acc_no",
        header: "Account No.",
        cell: (info) => info.getValue(),
      }),
      accessor("initial_bal", {
        id: "initial_bal",
        header: "Balance",
        cell: (info) => info.getValue(),
      }),
      accessor("branch", {
        id: "branch",
        header: "Bank Branch",
        cell: (info) => info.getValue(),
      }),
      accessor("_id", {
        id: "_id",
        header: "Action",
        cell: (info) => dropDownMenu(info),
      }),
    ];

    const openFormAction = () => {
      return setOpenModal("add");
    };

    const searchData = (value) => {
      const patternData = (item) =>
        pattern.test(item.name) ||
        pattern.test(item?.acc_no) ||
        pattern.test(item?.initial_bal) ||
        pattern.test(item?.branch);

      const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
      const fltdData = financeData.filter((item) => patternData(item));
      setTableData(fltdData);
    };

    // Table Config
    const tableProps = {
      columns,
      rows: tableData,
      title: "Finance",
      subTitle: "List of accounts",
      btnName: "New Account",
      searchOption: true,
      openFormAction,
      searchData,
    };

    return (
      !manageView && (
        <div className="rounded-2xl bg-white px-4 py-6">
          <DataTable {...tableProps} />
        </div>
      )
    );
  };

  // Finance Modal Form
  const financeForm = () => {
    const financeFormDisplay = () => {
      const handleOnChange = (e) => {
        const { value, name } = e.target || {};
        return setFormValues((data) => ({ ...data, [name]: value }));
      };

      return (
        <div className="grid grid-cols-1 gap-3">
          <CustomInput
            name="name"
            type="text"
            label="Account Name"
            value={formValues.name}
            isEmpty={isEmpty}
            isRequired={true}
            onChange={handleOnChange}
          />
          <CustomInput
            name="acc_no"
            type="text"
            label="Account No"
            value={formValues.acc_no}
            isEmpty={isEmpty}
            isRequired={true}
            onChange={handleOnChange}
          />
          <CustomInput
            name="initial_bal"
            type="number"
            label="Initial Balance"
            value={formValues.initial_bal}
            isEmpty={isEmpty}
            isRequired={true}
            onChange={handleOnChange}
          />
          <CustomInput
            name="branch"
            type="text"
            label="Bank Branch"
            value={formValues.branch}
            isEmpty={isEmpty}
            isRequired={true}
            onChange={handleOnChange}
          />
        </div>
      );
    };

    const modalProps = {
      title: `${modalType !== "update" ? "Add New" : "Update"} Account`,
      body: financeFormDisplay(),
      submit: {
        name: modalType !== "update" ? "Add" : "Update",
        btnFunction: () => {
          if (modalType !== "update") return createNewAccountAction();

          return openConfirmModal({
            title: "Are you sure?",
            message: "Are you sure you want to update this?",
            confirmNameBtn: "Yes, Update",
            modalAction: () => updateNewAccountAction(),
          });
        },
      },
      cancel: {
        name: "Cancel",
        btnFunction: () => {
          setModalType("");
          setIsEmpty(false);
          setFormValues(formObject);
          return setOpenModal(false);
        },
      },
      isOpen: !!openModal,
      maxWidth: "max-w-md",
    };

    return <FormModal {...modalProps} />;
  };

  // Manage Finance View
  const manageFinance = () => {
    const propsContainer = {
      accountContainer,
      setManageView,
    };

    return manageView && <ManageFinance {...propsContainer} />;
  };

  return (
    <>
      {financeTable()}
      {manageFinance()}
      {financeForm()}
    </>
  );
}

const rows = [
  {
    _id: 1,
    accountName: "Account Name Sample",
    accountNo: "00998877666",
    balance: "100,000.00",
    bankBranch: "Union Bank - Sampaloc Manila",
  },
  {
    _id: 2,
    accountName: "Account Name Sample",
    accountNo: "00998877666",
    balance: "100,000.00",
    bankBranch: "BDO - Muntinlupa",
  },
  {
    _id: 3,
    accountName: "Account Name Sample",
    accountNo: "00998877666",
    balance: "100,000.00",
    bankBranch: "Citti Bank - Caloocan City",
  },
  {
    _id: 4,
    accountName: "Account Name Sample",
    accountNo: "00998877666",
    balance: "100,000.00",
    bankBranch: "Citti Bank - Manila",
  },
  {
    _id: 5,
    accountName: "Account Name Sample",
    accountNo: "00998877666",
    balance: "100,000.00",
    bankBranch: "BDO - Sta Rosa",
  },
  {
    _id: 6,
    accountName: "Account Name Sample",
    accountNo: "00998877666",
    balance: "100,000.00",
    bankBranch: "Union Bank - Cavite",
  },
  {
    _id: 7,
    accountName: "Account Name Sample",
    accountNo: "00998877666",
    balance: "100,000.00",
    bankBranch: "Union Bank - Paco Manila",
  },
];
