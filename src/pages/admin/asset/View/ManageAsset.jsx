import React, { useState } from "react";
import * as Io5icons from "react-icons/io5";
import { createColumnHelper } from "@tanstack/react-table";
import { shallow } from "zustand/shallow";

// Components
import { filterDataAction } from "../../../../services/script_service";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import { CustomSelect } from "../../../../components/inputs/CustomSelect";
import DataTable from "../../../../components/tables/datatable/DataTable";
import FormModal from "../../../../components/modal/FormModal";
import TableFilter from "../../../../components/filter/TableFilter";
import moment from "moment";
import { assetStore } from "../../../../utils/zustand/AdminStore/Asset/assetStore";
import { POST, PUT } from "../../../../services/api";
import { employeeStore } from "../../../../utils/zustand/AdminStore/Employee/employeeStore";
import { authStore } from "../../../../utils/zustand/AuthStore/authStore";
import blankProfile from "./../../../../assets/images/blankProfile.jpg";

export default function ManageAsset(props) {
  const { assetContainer, setHistoryView } = props || {};
  const { accessor } = createColumnHelper();

  // Global State
  const { userInformation } = authStore((state) => state, shallow);
  const { employee: employeeData } = employeeStore((state) => state, shallow);
  const { assetManageData, fetchManageAsset, fetchAllAsset } = assetStore(
    (state) => state,
    shallow,
  );
  const { openConfirmModal, openSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
  );

  // Form Object
  const formObject = {
    returned_at: "",
    asset_id: "",
    emp_id: "",
    issued_at: "",
  };

  // Local State
  const [formValues, setFormValues] = useState(formObject);
  const [openForm, setOpenForm] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // Assign Asset/Equipment Service (API)
  const assignedToAction = async () => {
    const { _id } = assetContainer || {};
    const { isEmployee } = userInformation || {};
    const { emp_id, issued_at } = formValues || {};
    if (!emp_id || !issued_at) return setIsEmpty(true);

    const params = {
      ...formValues,
      asset_id: _id,
      issued_by: isEmployee?.fullName ?? "admin",
    };

    try {
      const { status } = await POST("/assets/histories", params);
      return status === 201 && successServiceAction(_id);
    } catch (err) {
      console.error(err);
    }
  };

  // Mark Return Asset/Equipment Service (API)
  const markReturnToAction = async () => {
    const { _id } = assetContainer || {};
    const { returned_at } = formValues || {};
    if (!returned_at) return setIsEmpty(true);

    const params = {
      ...formValues,
      asset_id: _id,
    };

    try {
      const { status } = await PUT("/assets/histories/return", params);
      return status === 201 && successServiceAction(_id);
    } catch (err) {
      console.error(err);
    }
  };

  // Success Service Action
  const successServiceAction = (id) => {
    fetchAllAsset();
    fetchManageAsset(id);
    setOpenForm({});
    setIsEmpty(false);
    setFormValues(formObject);
    return openSuccessModal();
  };

  // Open Modal Action
  const openFormAction = () => {
    setOpenForm({ action: "Add", isOpen: true });
  };

  // Clear Modal Value Action
  const clearModal = () => {
    setOpenForm({});
    setIsEmpty(false);
    return setFormValues(formObject);
  };

  // Navigation Display
  const headerDisplay = () => {
    return (
      <div className="flex flex-row items-center justify-between">
        <div
          className="flex cursor-pointer flex-row items-center gap-1 rounded-lg px-4 py-2 text-primaryBlue hover:bg-gray-100"
          onClick={() => setHistoryView(false)}
        >
          <span>
            <Io5icons.IoArrowBackSharp className="text-md text-primaryBlue" />
          </span>
          Back
        </div>
      </div>
    );
  };

  // Manage Assets Details Display
  const bodyDisplay = () => {
    const { desc, date, name } = assetContainer || {};
    const { status } = assetManageData[0] || {};

    const isAssigned = status === "assigned";
    const buttonTitle = isAssigned ? "Mark As Return" : "Assigned To";

    return (
      <div className="mt-4 rounded-xl bg-white p-4 drop-shadow-xl">
        <div className="flex flex-col gap-5 px-1 text-sm">
          <div className="flex flex-row items-center justify-between border-b pb-5 pt-2">
            <div>
              <div>
                <div className="text-lg font-semibold">{name ?? "--"}</div>
                <div className="text-neutralGray">
                  Date Created :{" "}
                  <span className="text-neutralDark">
                    {moment(date).format("LL") ?? "--"}
                  </span>
                </div>
                <div className="text-neutralGray">
                  Description :{" "}
                  <span className="text-neutralDark">{desc ?? "--"}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-3">
              <div>
                <button
                  onClick={() => setOpenFilter(!openFilter)}
                  className="btn rounded-2xl bg-lightBlue"
                >
                  <Io5icons.IoFilter className="text-xl text-primaryBlue" />{" "}
                </button>
              </div>
              <div>
                <button
                  className="btn btn-info rounded-xl bg-primaryBlue px-5 text-sm  font-normal capitalize text-white"
                  onClick={openFormAction}
                >
                  <span>
                    <Io5icons.IoCheckmarkCircleOutline className="text-lg" />
                  </span>
                  {buttonTitle}
                </button>
              </div>
            </div>
          </div>
          <div>{tableDisplay()}</div>
        </div>
      </div>
    );
  };

  // Manage Assets Table Display
  const tableDisplay = () => {
    const columns = [
      accessor("emp_id", {
        id: "emp_id",
        header: "Employee",
        accessorKey: "employee",
        cell: (info) => {
          const { assetHistories } = info.original || {};
          const { img, firstName, lastName, emp_no } =
            assetHistories?.employees || {};

          return (
            <div className="flex items-center">
              <img
                src={img ?? blankProfile}
                alt={"employee"}
                className="mx-2 h-10 w-10 rounded-full border border-neutralDark p-1"
              />
              <div className="flex flex-col">
                <span className="text-base">
                  {firstName ?? null}
                  {lastName ?? null}
                </span>
                <span className="text-xs text-neutralGray">{emp_no}</span>
              </div>
            </div>
          );
        },
      }),
      accessor("issued_at", {
        id: "issued_at",
        header: "Date Issued",
        cell: (info) => moment(info.getValue()).format("LL"),
      }),
      accessor("issued_by", {
        id: "issued_by",
        header: "Issued By",
        cell: (info) => info.getValue(),
      }),
      accessor("returned_at", {
        id: "returned_at",
        header: "Return Date",
        cell: (info) =>
          info.getValue() ? moment(info.getValue()).format("LL") : "--",
      }),
      accessor("status", {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: (row) => {
          const status = row.getValue();
          const ifAssigned = status === "assigned";
          const assignedMark = "bg-red-200 text-red-600";
          const unAssignedMark = "bg-green-200 text-green-600";

          return (
            <div className={`rounded-full py-1 text-xs font-medium`}>
              <span
                className={`${
                  ifAssigned ? assignedMark : unAssignedMark
                } rounded-full px-2 py-1 capitalize`}
              >
                {row.getValue()}
              </span>
            </div>
          );
        },
      }),
    ];

    const tableProps = {
      columns,
      rows: assetManageData[0]?.assetHistories ?? [],
      searchOption: false,
      openForm,
      openFormAction,
    };

    return <DataTable {...tableProps} />;
  };

  // Manage Asset Modal Form
  const manageAssetTypeForm = () => {
    const { status } = assetManageData[0] || {};
    const isAssigned = status === "assigned";

    // Form Input action
    const handleOnChange = (e) => {
      const { value, name } = e.target || {};
      return setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    // To Assign Form
    const assignedForm = () => {
      // Sort Selection Action
      const sortSelection = (dataList) => {
        const setSelectionDataAction = (item) => {
          const { fullName, _id } = item || {};
          return { label: fullName, value: _id };
        };

        return (dataList ?? []).map(setSelectionDataAction);
      };

      return (
        <div className="flex flex-col">
          <CustomSelect
            name="emp_id"
            label="Employee"
            isRequired={true}
            isEmpty={isEmpty}
            value={formValues.emp_id || null}
            onChange={handleOnChange}
            options={sortSelection(employeeData)}
          />
          <CustomInput
            name="issued_at"
            type="date"
            label="Date"
            value={formValues.issued_at}
            isRequired={true}
            isEmpty={isEmpty}
            onChange={handleOnChange}
          />
        </div>
      );
    };

    // Mark Return Form
    const returnForm = () => {
      return (
        <div className="flex flex-col">
          <CustomInput
            name="returned_at"
            type="date"
            label="Date"
            value={formValues.returned_at}
            isRequired={true}
            isEmpty={isEmpty}
            onChange={handleOnChange}
          />
        </div>
      );
    };

    const submitFunc = () => {
      const { status } = assetManageData[0] || {};
      const isAssigned = status === "assigned";

      if (!isAssigned) return assignedToAction();
      return openConfirmModal({
        modalAction: () => markReturnToAction(),
      });
    };

    const modalProps = {
      title: isAssigned ? "Mark As Return" : "Assigned To",
      body: isAssigned ? returnForm() : assignedForm(),
      submit: {
        name: "Confirm",
        btnFunction: () => submitFunc(),
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

  // Table Filter Form Display (Optional)
  const tableFilterDisplay = () => {
    const columnToFilter = ["status", "employee"];
    const propsContainer = {
      filterSelection: filterDataAction(columnToFilter, assetHistoryList),
      openFilter,
      setOpenFilter,
    };

    return columnToFilter && <TableFilter {...propsContainer} />;
  };

  return (
    <div>
      {headerDisplay()}
      {bodyDisplay()}
      {manageAssetTypeForm()}
      {tableFilterDisplay()}
    </div>
  );
}

const assetHistoryList = [
  {
    _id: 1,
    employeeId: "123-123-12",
    employee: "Cardo Milen",
    img: "https://cdn4.sharechat.com/beautifulgirlprofilepicture_28b9873b_1598803439147_cmprsd_40.jpg?tenant=sc&referrer=pwa-sharechat-service&f=beautifulgirlprofilepicture_28b9873b_1598803439147_cmprsd_40.jpg",
    dateIssued: "April 09, 2023",
    issuedBy: "Admin",
    returnDate: "April 09, 2024",
    status: "Assigned",
  },
  {
    _id: 2,
    employeeId: "123-123-12",
    employee: "Randy Mathala",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd8WsULO-7-_MRSARY4tenOtZCYCa-BiQRoEVpE-sjmJivFgAqfYndXT-ZifmU8eMYm-4&usqp=CAU",
    dateIssued: "April 01, 2023",
    issuedBy: "Manager",
    returnDate: "April 09, 2024",
    status: "Returned",
  },
  {
    _id: 3,
    employeeId: "123-123-12",
    employee: "Cardo Milen",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd8WsULO-7-_MRSARY4tenOtZCYCa-BiQRoEVpE-sjmJivFgAqfYndXT-ZifmU8eMYm-4&usqp=CAU",
    dateIssued: "April 09, 2023",
    issuedBy: "Admin",
    returnDate: "April 09, 2024",
    status: "Returned",
  },
  {
    _id: 1,
    employeeId: "123-123-12",
    employee: "Cardo Milen",
    img: "https://cdn4.sharechat.com/beautifulgirlprofilepicture_28b9873b_1598803439147_cmprsd_40.jpg?tenant=sc&referrer=pwa-sharechat-service&f=beautifulgirlprofilepicture_28b9873b_1598803439147_cmprsd_40.jpg",
    dateIssued: "April 09, 2023",
    issuedBy: "Admin",
    returnDate: "April 09, 2024",
    status: "Assigned",
  },
];
