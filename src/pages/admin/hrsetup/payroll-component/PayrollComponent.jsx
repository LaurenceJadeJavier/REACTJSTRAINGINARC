import { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import * as Io5icons from "react-icons/io5";
import { shallow } from "zustand/shallow";

// Components
import { CustomInput } from "../../../../components/inputs/CustomInput";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import FormModal from "../../../../components/modal/FormModal";
import DropdownMenu from "../../../../components/menu/DropdownMenu";
import DataTable from "../../../../components/tables/datatable/DataTable";
import { payrollComponentStore } from "../../../../utils/zustand/AdminStore/HrSetup/payrollComponent";
import { DELETE, POST, PUT } from "../../../../services/api";
import { CustomSelect } from "../../../../components/inputs/CustomSelect";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";

export const DropdownUI = (
  original,
  deletePayrollCompAPI,
  setOpenForm,
  setFormValues,
) => {
  const { openDeleteModal } = alertModalStore((state) => state, shallow);
  const { description, type } = original;
  // Table Action Option
  const actionList = [
    {
      _id: 1,
      label: "Update",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoCreateOutline />,
      itemFunction: () => {
        setOpenForm({
          action: "Update",
          isOpen: true,
        });
        setFormValues({
          description: description,
          type: type,
          id: original?._id,
        });
      },
    },
    {
      _id: 2,
      label: "Delete",
      textColor: "text-stateRed",
      icon: <Io5icons.IoTrashBinOutline />,
      itemFunction: (row) => {
        openDeleteModal({
          modalAction: () => deletePayrollCompAPI(original?._id),
        });
      },
    },
  ];

  return (
    <div className="text-center">
      {" "}
      <DropdownMenu actionList={actionList} />
    </div>
  );
};

export default function PayrollComponent() {
  const { accessor } = createColumnHelper();

  // Global State
  const { openConfirmModal, openSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
  );
  const { loadingHoc } = loadingStore((state) => state, shallow);
  const { fetchAllPayrollComponent, payrollCompData } = payrollComponentStore(
    (state) => state,
    shallow,
  );

  // Local State
  const [tableData, setTableData] = useState([]);
  const [cloneData, setCloneData] = useState([]);
  const [openForm, setOpenForm] = useState({});
  const [formValues, setFormValues] = useState({});
  const [isEmpty, setIsEmpty] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");

  useEffect(() => {
    fetchFilteredData();
  }, [payrollCompData, selectedTab]);

  const fetchFilteredData = () => {
    if (selectedTab == "All") {
      setCloneData(payrollCompData);
      return setTableData(payrollCompData);
    }
    const filteredData = payrollCompData.filter(
      (item) => item.type === selectedTab.toLowerCase(),
    );
    setCloneData(filteredData);
    setTableData(filteredData);
  };

  const createPayrollCompAPI = async () => {
    loadingHoc(true);
    await POST("/payroll-comps", formValues).then(({ status }) => {
      if (status === 201) {
        openSuccessModal();
        clearModal();
        fetchAllPayrollComponent();
        loadingHoc(false);
      } else return loadingHoc(false);
    });
  };

  const updatePayrollCompAPI = async () => {
    loadingHoc(true);
    await PUT(`/payroll-comps/${formValues?.id}`, formValues).then(
      ({ status }) => {
        if (status === 201) {
          openSuccessModal({
            title: "Success!",
            message: "Your changes has been successfully saved.",
            closeNameBtn: "Ok",
          });
          clearModal();
          fetchAllPayrollComponent();
          loadingHoc(false);
        } else return loadingHoc(false);
      },
    );
  };

  const deletePayrollCompAPI = async (id) => {
    loadingHoc(true);
    await DELETE(`/payroll-comps/${id}`).then(({ status }) => {
      if (status === 201) {
        openSuccessModal({
          title: "Success!",
          message: "Deleted Successfully!",
          closeNameBtn: "Ok",
        });
        fetchAllPayrollComponent();
        loadingHoc(false);
      } else return loadingHoc(false);
    });
  };

  // Clear Modal
  const clearModal = () => {
    setOpenForm({});
    setFormValues({});
    setIsEmpty(false);
  };

  // Payroll Type Modal Form
  const payrollComponentTypeForm = () => {
    const isAdd = openForm.action === "Add";

    const body = () => {
      return (
        <div className="grid grid-cols-1 gap-3">
          <CustomInput
            label="Description"
            value={formValues?.description}
            isRequired
            onChange={(e) =>
              setFormValues({ ...formValues, description: e.target.value })
            }
            isEmpty={isEmpty}
          />
          <CustomSelect
            label="Type"
            options={[
              {
                label: "Taxable Allowance",
                value: "taxable",
              },
              {
                label: "Non Taxable Income",
                value: "non-taxable",
              },
              {
                label: "Deduction",
                value: "deduction",
              },
            ]}
            isEmpty={isEmpty}
            isRequired
            value={formValues?.type}
            onChange={(e) =>
              setFormValues({ ...formValues, type: e.target.value })
            }
          />
        </div>
      );
    };

    const submitFunc = () => {
      if (isAdd) {
        createPayrollCompAPI();
      } else {
        openConfirmModal({
          modalAction: () => updatePayrollCompAPI(),
        });
      }
    };

    const validateFields = () => {
      const { type, description } = formValues || {};
      if (!type || !description) return setIsEmpty(true);
      else return submitFunc();
    };

    const modalProps = {
      title: isAdd ? `Add New Payroll Component` : `Update Payroll Component`,
      body: body(),
      submit: {
        name: isAdd ? "Add" : "Update",
        btnFunction: () => validateFields(),
      },
      cancel: {
        name: "Cancel",
        btnFunction: () => {
          setFormValues({});
          clearModal();
        },
      },
      isOpen: openForm.isOpen,
      maxWidth: "max-w-lg",
    };

    return <FormModal {...modalProps} />;
  };

  // Payroll Type Table
  const payrollComponentTable = () => {
    // Tab Selection
    const tabSelection = [
      {
        name: "All",
        isSelected: selectedTab === "All",
        selectTabAction: () => {
          return setSelectedTab("All");
        },
      },
      {
        name: "Taxable Allowance",
        isSelected: selectedTab === "taxable",
        selectTabAction: () => {
          return setSelectedTab("taxable");
        },
      },
      {
        name: "Non Taxable Income",
        isSelected: selectedTab === "non-taxable",
        selectTabAction: () => {
          return setSelectedTab("non-taxable");
        },
      },
      {
        name: "Deduction",
        isSelected: selectedTab === "deduction",
        selectTabAction: () => {
          return setSelectedTab("deduction");
        },
      },
    ];

    // Table Column
    const columns = [
      accessor("description", {
        id: "description",
        header: "Description",
        cell: (info) => info.getValue(),
      }),
      accessor("type", {
        id: "type",
        header: "Type",
        cell: ({ row: { original } }) => (
          <div className="capitalize">{original?.type}</div>
        ),
      }),
      accessor("_id", {
        id: "_id",
        header: "Action",
        style: "w-20 ",
        cell: ({ row: { original } }) =>
          DropdownUI(
            original,
            deletePayrollCompAPI,
            setOpenForm,
            setFormValues,
          ),
      }),
    ];

    const openFormAction = () => {
      setOpenForm({ action: "Add", isOpen: true });
    };

    const searchData = (value) => {
      const patternData = (item) =>
        pattern.test(item.description) || pattern.test(item?.type);

      const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
      const fltdData = cloneData.filter((item) => patternData(item));
      setTableData(fltdData);
    };

    // Table Config
    const tableProps = {
      columns,
      rows: tableData,
      title: "Payroll Components",
      subTitle: "List of payroll components",
      btnName: "New Payroll Component",
      openFormAction,
      setOpenForm,
      tableTab: tabSelection,
      searchOption: true,
      searchData,
    };

    return tableProps && <DataTable {...tableProps} />;
  };

  return (
    <div className="h-fit w-full rounded-xl bg-white p-5 drop-shadow-xl">
      {payrollComponentTypeForm()}
      {payrollComponentTable()}
    </div>
  );
}
