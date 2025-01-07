import React, { useEffect, useState } from "react";
import * as Io5icons from "react-icons/io5";
import { shallow } from "zustand/shallow";
import { createColumnHelper } from "@tanstack/react-table";
import * as Lucideicons from "react-icons/lu";
import moment from "moment";

// Components
import { DELETE, POST, PUT, errorAlert } from "../../../services/api";
import { CustomInput } from "../../../components/inputs/CustomInput";
import DataTable from "../../../components/tables/datatable/DataTable";
import DropdownMenu from "../../../components/menu/DropdownMenu";
import FormModal from "../../../components/modal/FormModal";
import ManageAsset from "./View/ManageAsset";

// Zustand Component
import { alertModalStore } from "../../../utils/zustand/AlertModalStore/alertModalStore";
import { authStore } from "../../../utils/zustand/AuthStore/authStore";
import { assetStore } from "../../../utils/zustand/AdminStore/Asset/assetStore";

export default function Asset() {
  const { accessor } = createColumnHelper();

  // Global State
  const { userInformation } = authStore((state) => state, shallow);
  const { openConfirmModal, openSuccessModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);
  const { assetData, fetchAllAsset, fetchManageAsset } = assetStore(
    (state) => state,
    shallow,
  );

  // Form Object
  const formObject = {
    name: "",
    desc: "",
    emp_id: "",
    status: "unassigned",
    date: moment(Date.now()).format(),
  };

  // Local State
  const [formValues, setFormValues] = useState(formObject);
  const [manageView, setManageView] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [openForm, setOpenForm] = useState({});
  const [assetContainer, setAssetContainer] = useState({});
  const [tableData, setTableData] = useState(assetData);

  useEffect(() => {
    setTableData(assetData);
  }, [assetData]);

  // Validate Form Values Action
  const validateFormValues = () => {
    const { name, desc } = formValues || {};
    return !name || !desc;
  };

  // Create New Asset Service (API)
  const createAssetAction = async () => {
    const { isEmployee } = userInformation || {};
    const validateForm = validateFormValues();
    if (validateForm) return setIsEmpty(true);
    if (!isEmployee) return errorAlert("Make sure to login as employee");

    try {
      const { status } = await POST("/assets", {
        ...formValues,
        emp_id: isEmployee._id,
      });
      if (status === 201) return successServiceAction();
    } catch (err) {
      console.error(`err:`, err);
    }
  };

  // Update Asset Service (API)
  const updateAssetAction = async () => {
    const { _id } = formValues || {};
    const validateForm = validateFormValues();
    if (validateForm) return setIsEmpty(true);

    try {
      const { status } = await PUT("/assets/" + _id, formValues);
      if (status === 201) return successServiceAction();
    } catch (err) {
      console.error(`err:`, err);
    }
  };

  // Update Asset Service (API)
  const deleteAssetAction = async (id) => {
    try {
      const { status } = await DELETE("/assets/" + id);
      if (status === 201) return successServiceAction();
    } catch (err) {
      console.error(`err:`, err);
    }
  };

  // Success Service Value Action
  const successServiceAction = () => {
    fetchAllAsset();
    setOpenForm({});
    setFormValues(formObject);
    setIsEmpty(false);
    return openSuccessModal({
      title: "Success!",
      message: "Your changes has been successfully saved.",
      closeNameBtn: "Ok",
    });
  };

  // Asset Modal Form
  const assetTypeForm = () => {
    const isAdd = openForm.action === "Add";

    const handleOnChange = (e) => {
      const { value, name } = e.target || {};
      return setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const body = () => {
      return (
        <div className="grid grid-cols-1 gap-3">
          <CustomInput
            name="name"
            label="Name"
            value={formValues?.name}
            isRequired={true}
            isEmpty={isEmpty}
            onChange={handleOnChange}
          />
          <CustomInput
            name="desc"
            label="Description"
            value={formValues?.desc}
            isRequired={true}
            isEmpty={isEmpty}
            onChange={handleOnChange}
          />
        </div>
      );
    };

    const submitFunc = () => {
      if (isAdd) return createAssetAction();
      return openConfirmModal({
        modalAction: () => updateAssetAction(),
      });
    };

    const clearModal = () => {
      setOpenForm({});
      return setFormValues(formObject);
    };

    const modalProps = {
      title: isAdd ? "Add New Equipment" : "Update Equipment",
      body: body(),
      submit: {
        name: isAdd ? "Add" : "Update",
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

  // Asset Table
  const assetTable = () => {
    const actionList = [
      {
        _id: 1,
        label: "Manage Asset",
        textColor: "text-primaryBlue",
        icon: (
          // <span className="loading loading-spinner loading-xs"></span>,
          <Lucideicons.LuFileCog />
        ),
        itemFunction: async (info) => {
          const data = info.row.original;
          await fetchManageAsset(data?._id)
            .then((res) => {
              console.log("res", res);
              setAssetContainer(data);
              return setManageView(!manageView);
            })
            .catch((err) => {
              console.log("err", err);
            });
        },
      },
      {
        _id: 2,
        label: "Update",
        textColor: "text-primaryBlue",
        icon: <Io5icons.IoCreateOutline />,
        itemFunction: (info) => {
          const data = info.row.original;
          const formParams = {
            ...data,
            emp_id: data?.emp_id?._id,
          };

          setFormValues(formParams);
          return setOpenForm({
            action: "Update",
            isOpen: true,
          });
        },
      },
      {
        _id: 3,
        label: "Delete",
        textColor: "text-stateRed",
        icon: <Io5icons.IoTrashBinOutline />,
        itemFunction: (info) => {
          const data = info.row.original;
          return openDeleteModal({
            modalAction: () => deleteAssetAction(data?._id),
          });
        },
      },
    ];

    const columns = [
      accessor("createdAt", {
        id: "createdAt",
        header: "Date Created",
        cell: (info) => moment(info.getValue()).format("LL"),
      }),
      accessor("name", {
        id: "name",
        header: "Name",
        cell: (info) => info.getValue() ?? "--",
      }),
      accessor("desc", {
        id: "desc",
        header: "Description",
        cell: (info) => info.getValue() ?? "--",
      }),
      accessor("status", {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: (row) => {
          const status = row.getValue();
          const ifAssigned = status === "assigned";
          const assignedMark = "bg-gray-200 text-gray-600";
          const unAssignedMark = "bg-red-200 text-red-600";

          return (
            <div className={`rounded-full py-1 text-xs font-medium`}>
              <span
                className={`${
                  ifAssigned ? assignedMark : unAssignedMark
                } rounded-full px-2 py-1 uppercase`}
              >
                {ifAssigned ? "assigned" : "unassigned"}
              </span>
            </div>
          );
        },
      }),
      accessor("emp_id", {
        id: "emd_id",
        header: "Assigned To",
        cell: (info) => {
          const { assetHistories } = info.row.original || {};
          const { firstName, lastName } = assetHistories?.employees || {};
          return (
            <div>
              {firstName ?? "--"} {lastName ?? null}{" "}
            </div>
          );
        },
      }),
      accessor("_id", {
        id: "_id",
        header: "Action",
        style: "w-20 ",
        cell: (row) => (
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
        pattern.test(moment(item?.createdAt).format("LL")) ||
        pattern.test(item?.name) ||
        pattern.test(item?.desc) ||
        pattern.test(item?.status);

      const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
      const fltdData = assetData.filter((item) => patternData(item));
      setTableData(fltdData);
    };

    const tableProps = {
      columns,
      rows: tableData,
      title: "Assets",
      subTitle: "Management of assets",
      btnName: "New Equipment",
      searchOption: true,
      searchData,
      setOpenForm,
      openFormAction,
    };

    return !manageView ? <DataTable {...tableProps} /> : null;
  };

  // Asset Manage Details View
  const assetManage = () => {
    const propsContainer = {
      assetContainer: assetContainer,
      setHistoryView: setManageView,
    };

    return manageView ? <ManageAsset {...propsContainer} /> : null;
  };

  return (
    <div className="h-fit w-full rounded-xl bg-white p-5 drop-shadow-xl">
      {assetTypeForm()}
      {assetTable()}
      {assetManage()}
    </div>
  );
}
