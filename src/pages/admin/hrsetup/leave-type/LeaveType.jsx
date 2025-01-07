import React, { useEffect, useState } from "react";
import DataTable from "../../../../components/tables/datatable/DataTable";
import * as Io5icons from "react-icons/io5";
import DropdownMenu from "../../../../components/menu/DropdownMenu";
import FormModal from "../../../../components/modal/FormModal";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";
import { createColumnHelper } from "@tanstack/react-table";
import { leaveTypeStore } from "../../../../utils/zustand/AdminStore/HrSetup/leaveTypeStore";
import { DELETE, POST, PUT } from "../../../../services/api";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";

export default function LeaveType() {
  const { accessor } = createColumnHelper();

  //global state
  const { openConfirmModal, openSuccessModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);
  const { leaveType, fetchAllLeaveType } = leaveTypeStore(
    (state) => state,
    shallow,
  );
  const { loadingHoc } = loadingStore((state) => state, shallow);

  const defaultValue = {
    name: "",
  };

  //local state
  const [openForm, setOpenForm] = useState({});
  const [formValues, setFormValues] = useState(defaultValue);
  const [isEmpty, setIsEmpty] = useState(false);
  const [tableData, setTableData] = useState(leaveType);

  useEffect(() => {
    setTableData(leaveType);
  }, [leaveType]);

  //action menu list
  const actionList = [
    {
      _id: 1,
      label: "Update",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoCreateOutline />,
      itemFunction: ({ original }) => {
        setOpenForm({
          action: "Update",
          isOpen: true,
        });
        return setFormValues(original);
      },
    },
    {
      _id: 2,
      label: "Delete",
      textColor: "text-stateRed",
      icon: <Io5icons.IoTrashBinOutline />,
      itemFunction: ({ original }) => {
        openDeleteModal({
          modalAction: () => deleteAPI(original),
        });
      },
    },
  ];

  const deleteAPI = async ({ _id }) => {
    loadingHoc(true);
    const { status } = await DELETE(`/leave-types/${_id}`);
    if (status === 201) {
      openSuccessModal({
        title: "Success!",
        message: "Deleted Successfully!",
        closeNameBtn: "Ok",
      });
      loadingHoc(false);
      return fetchAllLeaveType();
    } else {
      return loadingHoc(false);
    }
  };

  const columns = [
    accessor("name", {
      id: "name",
      header: "Name",
      cell: (info) => info.getValue(),
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
  const clearModal = () => {
    setOpenForm({});
    setIsEmpty(false);
    setFormValues(defaultValue);
    loadingHoc(false);
  };

  //open add modal
  const openFormAction = () => {
    setOpenForm({ action: "Add", isOpen: true });
  };

  const searchData = (value) => {
    const patternData = (item) => pattern.test(item.name);

    const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
    const fltdData = leaveType.filter((item) => patternData(item));
    setTableData(fltdData);
  };

  const tableProps = {
    columns,
    rows: tableData,
    title: "Leave Type",
    subTitle: "List of leave types",
    btnName: "New Leave Type",
    openFormAction,
    searchOption: true,
    searchData,
  };

  const onHandleChange = ({ target }) => {
    const { name, value } = target;
    setFormValues({ ...formValues, [name]: value });
  };

  const addAPI = async () => {
    const { status } = await POST("/leave-types", formValues);
    if (status === 201) {
      openSuccessModal();
      clearModal();
      return fetchAllLeaveType();
    } else {
      return loadingHoc(false);
    }
  };

  const updateAPI = async () => {
    loadingHoc(true);
    const { status } = await PUT(`/leave-types/${formValues?._id}`, formValues);
    if (status === 201) {
      openSuccessModal({
        title: "Success!",
        message: "Your changes has been successfully saved.",
        closeNameBtn: "Ok",
      });
      clearModal();
      return fetchAllLeaveType();
    } else {
      return loadingHoc(false);
    }
  };

  //modal content
  const leaveTypeForm = () => {
    const isAdd = openForm.action === "Add";

    const body = () => {
      return (
        <CustomInput
          label="Name"
          name="name"
          type="text"
          value={formValues.name}
          onChange={onHandleChange}
          isRequired
          isEmpty={isEmpty}
        />
      );
    };

    const validateField = () => {
      if (!formValues?.name) return setIsEmpty(true);
      else return submitFunc();
    };

    const submitFunc = () => {
      if (isAdd) {
        loadingHoc(true);
        return addAPI();
      } else {
        openConfirmModal({
          modalAction: () => updateAPI(),
        });
      }
    };

    const modalProps = {
      title: isAdd ? "Add New Leave Type" : "Update Leave Type",
      body: body(),
      submit: {
        name: isAdd ? "Add" : "Update",
        btnFunction: () => validateField(),
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
    <div className="h-fit w-full rounded-xl bg-white p-5 drop-shadow-xl">
      {leaveTypeForm()}
      <DataTable {...tableProps} />
    </div>
  );
}
