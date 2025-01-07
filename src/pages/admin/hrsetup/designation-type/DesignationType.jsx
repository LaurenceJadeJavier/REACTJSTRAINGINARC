import React, { useEffect, useState } from "react";
import DataTable from "../../../../components/tables/datatable/DataTable";
import * as Io5icons from "react-icons/io5";
import DropdownMenu from "../../../../components/menu/DropdownMenu";
import FormModal from "../../../../components/modal/FormModal";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";
import { createColumnHelper } from "@tanstack/react-table";
import { designationTypeStore } from "../../../../utils/zustand/AdminStore/HrSetup/designationTypeStore";
import { DELETE, POST, PUT } from "../../../../services/api";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";

export default function DesignationType() {
  const { designationType, fetchAllDesignationType } = designationTypeStore(
    (state) => state,
    shallow,
  );
  const { openConfirmModal, openSuccessModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);
  const { loadingHoc } = loadingStore((state) => state, shallow);
  const { accessor } = createColumnHelper();
  const [openForm, setOpenForm] = useState({});
  const [formValues, setFormValues] = useState({});
  const [isEmpty, setIsEmpty] = useState(false);
  const [tableData, setTableData] = useState(designationType);

  useEffect(() => {
    setTableData(designationType);
  }, [designationType]);

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
        setFormValues(original);
      },
    },
    {
      _id: 2,
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

  const deleteFunc = async ({ _id }) => {
    loadingHoc(true);
    const { status } = await DELETE(`/designations/${_id}`);
    if (status === 201) {
      openSuccessModal({
        title: "Success!",
        message: "Deleted Successfully!",
        closeNameBtn: "Ok",
      });

      fetchAllDesignationType();
      return loadingHoc(false);
    } else return loadingHoc(false);
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
    setFormValues({});
    setIsEmpty(false);
    loadingHoc(false);
  };

  const openFormAction = () => {
    setOpenForm({ action: "Add", isOpen: true });
  };

  const searchData = (value) => {
    const patternData = (item) => pattern.test(item.name);

    const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
    const fltdData = designationType.filter((item) => patternData(item));
    setTableData(fltdData);
  };

  const tableProps = {
    columns,
    rows: tableData,
    title: "Designation Type",
    subTitle: "List of designation types",
    btnName: "New Designation Type",
    setOpenForm,
    openFormAction,
    searchOption: true,
    searchData,
  };

  const designationTypeForm = () => {
    const isAdd = openForm.action === "Add";

    const body = () => {
      return (
        <CustomInput
          label="Name"
          value={formValues.name}
          name="name"
          isRequired={true}
          isEmpty={isEmpty}
          onChange={({ target }) =>
            setFormValues({ ...formValues, name: target.value })
          }
        />
      );
    };

    const addAPI = async () => {
      const { status } = await POST("/designations", formValues);
      if (status === 201) {
        clearModal();
        openSuccessModal();
        return fetchAllDesignationType();
      } else {
        loadingHoc(false);
      }
    };

    const updateAPI = async () => {
      loadingHoc(true);
      const { status } = await PUT(
        `/designations/${formValues?._id}`,
        formValues,
      );
      if (status === 201) {
        openSuccessModal({
          title: "Success!",
          message: "Your changes has been successfully saved.",
          closeNameBtn: "Ok",
        });
        clearModal();
        return fetchAllDesignationType();
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
      if (!formValues.name || formValues.name === "") return setIsEmpty(true);
      else return submitFunc();
    };

    const modalProps = {
      title: isAdd ? "Add New Designation Type" : "Update Designation Type",
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
      {designationTypeForm()}
      <DataTable {...tableProps} />
    </div>
  );
}
