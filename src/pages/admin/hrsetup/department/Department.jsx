import React, { useEffect, useState } from "react";
import DataTable from "../../../../components/tables/datatable/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import * as Io5icons from "react-icons/io5";
import DropdownMenu from "../../../../components/menu/DropdownMenu";
import FormModal from "../../../../components/modal/FormModal";
import Form from "./components/Form";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";
import ViewModal from "../../../../components/modal/ViewModal";
import View from "./components/View";
import { departmentStore } from "../../../../utils/zustand/AdminStore/HrSetup/departmentStore";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";
import { DELETE, GET, POST, PUT } from "../../../../services/api";

export default function Department() {
  const { accessor } = createColumnHelper();
  const { loadingHoc } = loadingStore((state) => state, shallow);
  const { openSuccessModal, openConfirmModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);
  const { department, fetchAllDepartment } = departmentStore(
    (state) => state,
    shallow,
  );
  const [formValues, setFormValues] = useState({});
  const [isEmpty, setIsEmpty] = useState(false);
  const [openForm, setOpenForm] = useState({});
  const [openViewModal, setOpenViewModal] = useState({});
  const [tableData, setTableData] = useState(department);

  useEffect(() => {
    setTableData(department);
  }, [department]);

  const actionList = [
    {
      _id: 1,
      label: "View",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoReaderOutline />,
      itemFunction: ({ original }) => viewFunc(original),
    },
    {
      _id: 2,
      label: "Update",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoCreateOutline />,
      itemFunction: ({ original }) => {
        setOpenForm({
          action: "Update",
          isOpen: true,
        });
        setFormValues(original);
      },
    },
    {
      _id: 3,
      label: "Delete",
      textColor: "text-stateRed",
      icon: <Io5icons.IoTrashBinOutline />,
      itemFunction: ({ original }) => {
        openDeleteModal({
          modalAction: () => deleteFunc(original),
        });
      },
    },
  ];

  const viewFunc = async ({ _id }) => {
    loadingHoc(true);
    const { data, status } = await GET(`/departments/${_id}`);

    if (status === 200) {
      loadingHoc(false);
      return setOpenViewModal({
        data: data,
        isOpen: true,
      });
    } else return loadingHoc(false);
  };

  const deleteFunc = async ({ _id }) => {
    loadingHoc(true);
    const { status } = await DELETE(`/departments/${_id}`);
    if (status === 201) {
      openSuccessModal({
        message: "Deleted Successfully!",
        closeNameBtn: "Ok",
      });
      fetchAllDepartment();
      return loadingHoc(false);
    } else return loadingHoc(false);
  };

  const columns = [
    accessor("name", {
      id: "name",
      header: "Department",
      cell: (info) => info.getValue(),
    }),
    accessor("noOfEmployees", {
      id: "noOfEmployees",
      header: "No. Of Employees",
      style: "text-center",
      cell: (info) => <div className="text-center">{info.getValue()}</div>,
    }),
    accessor("_id", {
      id: "_id",
      header: "Action",
      style: "w-20",
      cell: ({ row }) => (
        <div className="text-center">
          <DropdownMenu actionList={actionList} row={row} />
        </div>
      ),
    }),
  ];

  const openFormAction = () => {
    setOpenForm({
      action: "Add",
      isOpen: true,
    });
  };

  const searchData = (value) => {
    const patternData = (item) =>
      pattern.test(item.noOfEmployees) || pattern.test(item?.name);

    const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
    const fltdData = department.filter((item) => patternData(item));
    setTableData(fltdData);
  };

  const tableProps = {
    openFormAction,
    title: "Department",
    subTitle: "Manage department settings",
    btnName: "New Department",
    rows: tableData,
    columns,
    searchOption: true,
    searchData,
  };

  const clearModal = () => {
    setOpenForm({});
    setFormValues({});
    setIsEmpty(false);
    loadingHoc(false);
  };

  const departmentForm = () => {
    const isAdd = openForm.action === "Add";
    const addAPI = async () => {
      const { status } = await POST("/departments", formValues);

      if (status === 201) {
        clearModal();
        openSuccessModal();
        return fetchAllDepartment();
      } else {
        loadingHoc(false);
      }
    };

    const updateAPI = async () => {
      loadingHoc(true);
      const { status } = await PUT(
        `/departments/${formValues?._id}`,
        formValues,
      );
      if (status === 201) {
        openSuccessModal({
          title: "Success!",
          message: "Your changes has been successfully saved.",
          closeNameBtn: "Ok",
        });
        clearModal();
        return fetchAllDepartment();
      } else {
        loadingHoc(false);
      }
    };

    const submitFunc = () => {
      if (isAdd) {
        loadingHoc(true);
        addAPI();
      } else {
        openConfirmModal({
          modalAction: () => updateAPI(),
        });
      }
    };

    const validateField = () => {
      if (!formValues.name || !formValues.description) return setIsEmpty(true);
      else return submitFunc();
    };

    const propsContainer = {
      setFormValues,
      formValues,
      isEmpty,
    };

    const formProps = {
      title: isAdd ? "Add New Department" : "Update Department",
      body: <Form {...propsContainer} />,
      isOpen: openForm.isOpen,
      submit: {
        name: isAdd ? "Add" : "Update",
        btnFunction: () => validateField(),
      },
      cancel: {
        name: "Cancel",
        btnFunction: () => clearModal(),
      },
      maxWidth: "max-w-xl",
    };
    return <FormModal {...formProps} />;
  };

  const viewDepartment = () => {
    const { isOpen, data } = openViewModal ?? {};
    const viewProps = {
      title: <span className="capitalize">{data?.name}</span>,
      isOpen: isOpen,
      body: <View {...data} />,
      close: {
        name: "Close",
        btnFunction: () => setOpenViewModal({}),
      },
      maxWidth: "max-w-2xl",
    };

    return <ViewModal {...viewProps} />;
  };

  return (
    <div className="h-fit w-full rounded-xl bg-white p-5 drop-shadow-xl">
      {departmentForm()}
      {viewDepartment()}
      <DataTable {...tableProps} />
    </div>
  );
}
