import React, { useEffect, useState } from "react";
import DataTable from "../../../../components/tables/datatable/DataTable";
import * as Io5icons from "react-icons/io5";
import DropdownMenu from "../../../../components/menu/DropdownMenu";
import FormModal from "../../../../components/modal/FormModal";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";
import { createColumnHelper } from "@tanstack/react-table";
import { CustomMultiSelect } from "../../../../components/inputs/CustomMultiSelect";
import { DELETE, POST, PUT } from "../../../../services/api";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";
import { documentTypeStore } from "../../../../utils/zustand/AdminStore/HrSetup/documentTypeStore";
import { fileFormat } from "../../../../utils/FileFormat/FileFormat";

export default function DocumentType() {
  const { accessor } = createColumnHelper();
  // Global State
  const { openConfirmModal, openSuccessModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);
  const { loadingHoc } = loadingStore((state) => state, shallow);
  const { documentType, fetchAllDocumentType } = documentTypeStore(
    (state) => state,
    shallow,
  );
  const defaultValue = {
    name: "",
    types: [],
    maxSize: 0,
  };

  // Local State
  const [openForm, setOpenForm] = useState({});
  const [formValues, setFormValues] = useState(defaultValue);
  const [isEmpty, setIsEmpty] = useState(false);
  const [tableData, setTableData] = useState(documentType);

  useEffect(() => {
    setTableData(documentType);
  }, [documentType]);

  // Clear Modal Value Action
  const clearStates = () => {
    setOpenForm({});
    setFormValues(defaultValue);
    setIsEmpty(false);
    loadingHoc(false);
  };

  const onHandleChange = ({ target }) => {
    const { name, value, type, valueAsNumber } = target;
    if (type === "number") {
      setFormValues({
        ...formValues,
        [name]: valueAsNumber >= 0 ? valueAsNumber : "",
      });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  // Document Modal Form
  const documentTypeForm = () => {
    const isAdd = openForm.action === "Add";

    const body = () => {
      return (
        <div className="grid grid-cols-1 gap-2">
          <CustomInput
            label="Name"
            name="name"
            type="text"
            value={formValues.name}
            onChange={onHandleChange}
            isRequired
            isEmpty={isEmpty}
          />
          <CustomMultiSelect
            label="File Type"
            placeholder="Please Select File type"
            options={fileFormat}
            isMulti={true}
            name="types"
            value={formValues.types}
            onChange={(e) => setFormValues({ ...formValues, types: e })}
            closeMenuOnSelect={false}
            isRequired
            isEmpty={isEmpty}
          />
          <CustomInput
            label="Max size KB"
            type="number"
            name="maxSize"
            value={formValues.maxSize}
            onChange={onHandleChange}
            isRequired
            isEmpty={isEmpty}
          />
        </div>
      );
    };

    const submitFunc = () => {
      if (isAdd) {
        loadingHoc(true);
        return addAPI();
      } else {
        return openConfirmModal({
          modalAction: () => updateAPI(),
        });
      }
    };

    const addAPI = async () => {
      const params = {
        ...formValues,
        types:
          formValues?.types?.length > 0
            ? formValues.types.map(({ value }) => value)
            : [],
      };

      const { status } = await POST("/document-types", params);
      if (status === 201) {
        openSuccessModal();
        clearStates();
        return fetchAllDocumentType();
      } else {
        loadingHoc(false);
      }
    };

    const updateAPI = async () => {
      loadingHoc(true);
      const params = {
        ...formValues,
        types:
          formValues?.types?.length > 0
            ? formValues.types.map(({ value }) => value)
            : [],
      };
      const { status } = await PUT(
        `/document-types/${formValues?._id}`,
        params,
      );
      if (status === 201) {
        openSuccessModal({
          title: "Success!",
          message: "Your changes has been successfully saved.",
          closeNameBtn: "Ok",
        });
        clearStates();
        return fetchAllDocumentType();
      } else {
        loadingHoc(false);
      }
    };

    //form validation
    const validateFields = () => {
      const { name, types, maxSize } = formValues ?? {};
      if (!name || maxSize < 0 || types?.length <= 0) return setIsEmpty(true);
      else return submitFunc();
    };

    const modalProps = {
      title: isAdd ? "Add New Document Type" : "Update Document Type",
      body: body(),
      submit: {
        name: isAdd ? "Add" : "Update",
        btnFunction: () => validateFields(),
      },
      cancel: {
        name: "Cancel",
        btnFunction: () => clearStates(),
      },
      isOpen: openForm.isOpen,
      maxWidth: "max-w-lg",
    };

    return <FormModal {...modalProps} />;
  };

  // Document Table
  const documentTable = () => {
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

          //retructure for file type format
          const types = original.types?.map((item) => ({
            label: item,
            value: item,
          }));
          return setFormValues({ ...original, types });
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
      const { status } = await DELETE(`/document-types/${_id}`);
      if (status === 201) {
        loadingHoc(false);
        openSuccessModal({
          message: "Deleted Successfully!",
          closeNameBtn: "Ok",
        });
        return fetchAllDocumentType();
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
      accessor("types", {
        id: "types",
        header: "FILE TYPES",
        cell: (info) => info.getValue()?.map((data) => data + ", "),
      }),
      accessor("maxSize", {
        id: "maxSize",
        header: "MAX SIZE KB",
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

    const openFormAction = () => {
      setOpenForm({ action: "Add", isOpen: true });
    };

    const searchData = (value) => {
      const patternData = (item) =>
        pattern.test(item.name) ||
        pattern.test(item?.types) ||
        pattern.test(item?.maxSize);

      const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
      const fltdData = documentType.filter((item) => patternData(item));
      setTableData(fltdData);
    };

    const tableProps = {
      columns,
      rows: tableData,
      title: "Document Type",
      subTitle: "List of document types",
      btnName: "New Document Type",
      setOpenForm,
      openFormAction,
      searchOption: true,
      searchData,
    };

    return <DataTable {...tableProps} />;
  };

  return (
    <div className="h-fit w-full rounded-xl bg-white p-5 drop-shadow-xl">
      {documentTypeForm()}
      {documentTable()}
    </div>
  );
}
