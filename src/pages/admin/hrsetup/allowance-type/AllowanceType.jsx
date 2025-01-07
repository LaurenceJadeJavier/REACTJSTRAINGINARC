import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import * as Io5icons from "react-icons/io5";
import { useLoaderData } from "react-router-dom";
import { shallow } from "zustand/shallow";

// Components
import { CustomInput } from "../../../../components/inputs/CustomInput";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import FormModal from "../../../../components/modal/FormModal";
import DropdownMenu from "../../../../components/menu/DropdownMenu";
import DataTable from "../../../../components/tables/datatable/DataTable";
export default function AllowanceType() {
  const rows = useLoaderData();
  const { accessor } = createColumnHelper();

  // Global State
  const { openConfirmModal, openSuccessModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);

  // Local State
  const [tableData, setTableData] = useState(rows);
  const [openForm, setOpenForm] = useState({});
  const [selectedTab, setSelectedTab] = useState("All");

  // Clear Modal
  const clearModal = () => {
    setOpenForm({});
  };

  // Allowance Type Modal Form
  const AllowanceTypeForm = () => {
    const isAdd = openForm.action === "Add";

    const body = () => {
      return (
        <div>
          <CustomInput label="Name" />
          <CustomInput label="Type" />
        </div>
      );
    };

    const submitFunc = () => {
      if (isAdd) {
        openSuccessModal();
        clearModal();
      } else {
        openConfirmModal({
          modalAction: () => {
            openSuccessModal({
              title: "Success!",
              message: "Your changes has been successfully saved.",
              closeNameBtn: "Ok",
            });
            clearModal();
          },
        });
      }
    };

    const modalProps = {
      title: isAdd ? "Add New Allowance Type" : "Update Allowance Type",
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

  // Allowance Type Table
  const AllowanceTable = () => {
    // Filter Tab
    const filterDataByTabAction = (tabName) => {
      if (tabName === "All") return setTableData(rows);
      const filteredData = rows.filter((item) => item.type === tabName);
      return setTableData(filteredData);
    };

    // Tab Selection
    const tabSelection = [
      {
        name: "All",
        isSelected: selectedTab === "All",
        selectTabAction: () => {
          filterDataByTabAction("All");
          return setSelectedTab("All");
        },
      },
      {
        name: "Taxable",
        isSelected: selectedTab === "Taxable",
        selectTabAction: () => {
          filterDataByTabAction("Taxable");
          return setSelectedTab("Taxable");
        },
      },
      {
        name: "Non-Taxable",
        isSelected: selectedTab === "Non-Taxable",
        selectTabAction: () => {
          filterDataByTabAction("Non-Taxable");
          return setSelectedTab("Non-Taxable");
        },
      },
    ];

    // Table Action Option
    const actionList = [
      {
        _id: 1,
        label: "Update",
        textColor: "text-primaryBlue",
        icon: <Io5icons.IoCreateOutline />,
        itemFunction: () =>
          setOpenForm({
            action: "Update",
            isOpen: true,
          }),
      },
      {
        _id: 2,
        label: "Delete",
        textColor: "text-stateRed",
        icon: <Io5icons.IoTrashBinOutline />,
        itemFunction: (row) => {
          openDeleteModal({
            modalAction: () =>
              openSuccessModal({
                title: "Success!",
                message: "Your changes has been successfully saved.",
                closeNameBtn: "Ok",
              }),
          });
        },
      },
    ];

    // Table Column
    const columns = [
      accessor("name", {
        id: "name",
        header: "Name",
        cell: (info) => info.getValue(),
      }),
      accessor("type", {
        id: "type",
        header: "Type",
        cell: (info) => info.getValue(),
      }),
      accessor("_id", {
        id: "_id",
        header: "Action",
        style: "w-20 ",
        cell: (info) => (
          <div className="text-center">
            {" "}
            <DropdownMenu actionList={actionList} />
          </div>
        ),
      }),
    ];

    const openFormAction = () => {
      setOpenForm({ action: "Add", isOpen: true });
    };


    // Table Config
    const tableProps = {
      columns,
      rows: tableData,
      title: "Allowances",
      subTitle: "List of Allowances",
      btnName: "New Allowance",
      openFormAction,
      setOpenForm,
      tableTab: tabSelection,
      // headingFilter
    };

    return tableProps && <DataTable {...tableProps} />;
  };

  return (
    <div className="h-full w-full rounded-xl bg-white p-5 drop-shadow-xl">
      {AllowanceTypeForm()}
      {AllowanceTable()}
    </div>
  );
}

export const allowanceTypeLoader = async () => {
  const rows = [
    {
      name: "Allowance Sample Name",
      type: "Taxable",
      _id: 1,
    },
    {
      name: "Allowance Sample Name",
      type: "Taxable",
      _id: 2,
    },
    {
      name: "Allowance Sample Name",
      type: "Taxable",
      _id: 3,
    },
    {
      name: "Allowance Sample Name",
      type: "Non-Taxable",
      _id: 4,
    },
    {
      name: "Allowance Sample Name",
      type: "Non-Taxable",
      _id: 4,
    },
    {
      name: "Allowance Sample Name",
      type: "Non-Taxable",
      _id: 4,
    },
    {
      name: "Allowance Sample Name",
      type: "Non-Taxable",
      _id: 4,
    },
    {
      name: "Allowance Sample Name",
      type: "Non-Taxable",
      _id: 4,
    },
    {
      name: "Allowance Sample Name",
      type: "Non-Taxable",
      _id: 4,
    },
  ];
  return rows;
};
