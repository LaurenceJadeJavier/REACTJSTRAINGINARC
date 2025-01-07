import { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import * as Lucideicons from "react-icons/lu";
import { shallow } from "zustand/shallow";
import moment from "moment";

// Components
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { departmentStore } from "../../../../utils/zustand/AdminStore/HrSetup/departmentStore";
import DataTable from "../../../../components/tables/datatable/DataTable";
import PayrollStatus from "../../../../components/status-color/PayrollStatus";
import ManagePayroll from "./View/ManagePayroll";
import FormModal from "../../../../components/modal/FormModal";
import { CustomSelect } from "../../../../components/inputs/CustomSelect";
import { payrollPeriodStore } from "../../../../utils/zustand/AdminStore/HrSetup/payrollPeriod";
import { GET, POST } from "../../../../services/api";
import { payrollListStore } from "../../../../utils/zustand/AdminStore/Payroll/Payroll-list";

export default function Payroll() {
  const { accessor } = createColumnHelper();

  // Global State
  const { openConfirmModal, openSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
  );
  const { department } = departmentStore((state) => state, shallow);
  const { payrollPeriods } = payrollPeriodStore((state) => state, shallow);
  const { payrollListData, fetchAllPayrollList } = payrollListStore(
    (state) => state,
    shallow,
  );
  console.log("payrollListData:", payrollListData);

  // Local State
  const [tableData, setTableData] = useState(payrollListData);
  const [openForm, setOpenForm] = useState({});
  const [selectedTab, setSelectedTab] = useState("All");
  const [manageView, setManageView] = useState(false);
  const [payrollContainer, setPayrollContainer] = useState({});
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    payrollAPI();
  }, []);

  const payrollAPI = async () => {
    await GET("/payroll-lists").then(({ data, status }) => {
      console.log("data:", data);
      setTableData(data)
      // console.log("status:", status);
    });
  };

  // Create Payroll
  const createPayrollAPI = async () => {
    await POST("/payroll-lists", formValues).then(({ status }) => {
      if (status === 201) {
        fetchAllPayrollList();
        clearModal();
        return openSuccessModal();
      }
    });
  };

  // Clear Modal Value Action
  const clearModal = () => {
    setOpenForm({});
    setFormValues({});
  };

  // Payroll Type Table
  const payrollTable = () => {
    // Filter Tab
    const filterDataByTabAction = (tabName) => {
      if (tabName === "All") return setTableData(payrollListData);
      const filteredData = payrollListData.filter(
        (item) => item.status === tabName,
      );
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
        name: "In Review",
        isSelected: selectedTab === "In Review",
        selectTabAction: () => {
          filterDataByTabAction("review");
          return setSelectedTab("In Review");
        },
      },
      {
        name: "For Approval",
        isSelected: selectedTab === "For Approval",
        selectTabAction: () => {
          filterDataByTabAction("approval");
          return setSelectedTab("For Approval");
        },
      },
      {
        name: "Approved",
        isSelected: selectedTab === "Approved",
        selectTabAction: () => {
          filterDataByTabAction("approved");
          return setSelectedTab("Approved");
        },
      },
      {
        name: "Declined",
        isSelected: selectedTab === "Declined",
        selectTabAction: () => {
          filterDataByTabAction("declined");
          return setSelectedTab("Declined");
        },
      },
      {
        name: "Void",
        isSelected: selectedTab === "Void",
        selectTabAction: () => {
          filterDataByTabAction("void");
          return setSelectedTab("Void");
        },
      },
    ];

    // Table Column
    const columns = [
      accessor("payrollPeriod", {
        id: "payrollPeriod",
        header: "Payroll Period",
        cell: ({ row: { original } }) => (
          <div>
            {moment(original?.payroll_period_id?.start_day).format("MMM DD")} -{" "}
            {moment(original?.payroll_period_id?.end_day).format("MMM DD YYYY")}
          </div>
        ),
      }),
      accessor("department", {
        id: "department",
        header: "Department",
        cell: ({ row: { original } }) => original?.dept_id?.name,
      }),
      accessor("status", {
        id: "status",
        header: "Status",
        accessoryKey: "status",
        cell: (info) => <PayrollStatus status={info.getValue()} />,
      }),
      accessor("_id", {
        id: "_id",
        header: "Action",
        style: "w-20 ",
        cell: (info) => (
          <div
            className="flex cursor-pointer justify-center text-lg text-primaryBlue"
            onClick={() => {
              setPayrollContainer(info.row.original);
              return setManageView(!manageView);
            }}
          >
            <Lucideicons.LuFolderCog />
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
      btnName: "New Payroll",
      title: "Payroll",
      subTitle: "List of generated payrolls",
      tableTab: tabSelection,
      openFormAction,
      setOpenForm,
    };

    return !manageView ? (
      <div className="h-fit w-full rounded-xl bg-white p-5 drop-shadow-xl">
        {payrollTypeForm()}
        <DataTable {...tableProps} />
      </div>
    ) : null;
  };

  // Perfomance Manage Details View
  const payrollManage = () => {
    return (
      manageView && (
        <ManagePayroll
          payrollContainer={payrollContainer}
          setHistoryView={setManageView}
        />
      )
    );
  };

  // Payroll Modal Form
  const payrollTypeForm = () => {
    const isAdd = openForm.action === "Add";

    const sortDeptSelection = () => {
      const setSelectionDataAction = (item) => {
        const { name, _id } = item || {};
        return { label: name, value: _id };
      };

      return (department ?? []).map(setSelectionDataAction);
    };

    const sortPayrollSelection = () => {
      const setSelectionDataAction = (item) => {
        const { name, _id } = item || {};
        return { label: name, value: _id };
      };

      return (payrollPeriods ?? []).map(setSelectionDataAction);
    };

    const body = () => {
      return (
        <div className="grid grid-cols-1 gap-3">
          <CustomSelect
            label="Department"
            value={formValues?.dept_id}
            onChange={(e) =>
              setFormValues({ ...formValues, dept_id: e.target.value })
            }
            options={sortDeptSelection()}
          />
          <CustomSelect
            label="Payroll Period Apply"
            value={formValues?.payroll_period_id}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                payroll_period_id: e.target.value,
              })
            }
            options={sortPayrollSelection()}
          />
        </div>
      );
    };

    const submitFunc = () => {
      if (isAdd) {
        createPayrollAPI();
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
      title: isAdd ? "Add New Payroll" : "Update Payroll",
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

  return (
    <>
      {payrollTable()}
      {payrollManage()}
    </>
  );
}
