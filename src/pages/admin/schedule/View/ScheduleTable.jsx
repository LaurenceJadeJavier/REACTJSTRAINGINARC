import { useEffect, useState } from "react";
import * as Io5icons from "react-icons/io5";
import { shallow } from "zustand/shallow";
import { createColumnHelper } from "@tanstack/react-table";

// Components
import DataTable from "../../../../components/tables/datatable/DataTable";
import FormModal from "../../../../components/modal/FormModal";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { useNavigate } from "react-router";

export default function ScheduleTable(props) {
  const { rows, setView } = props || {};
  const { accessor } = createColumnHelper();
  const navigate = useNavigate();
  // Global State
  const { openConfirmModal, openSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
  );

  // Local State
  const [openForm, setOpenForm] = useState({});
  const [historyView, setHistoryView] = useState(false);
  const [tableData, setTableData] = useState(rows);

  useEffect(() => {
    setTableData(rows);
  }, [rows]);

  const scheduleTableView = () => {
    // Clear Modal Value Action
    const clearModal = () => {
      setOpenForm({});
    };

    // Schedule Modal Form
    const scheduleTypeForm = () => {
      const isAdd = openForm.action === "Add";

      const body = () => {
        return (
          <>
            <CustomInput label="Name" />
            <CustomInput type="date" label="Work Starts" />
            <CustomInput type="date" label="Work Ends" />
          </>
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
        title: isAdd ? "Add New Schedule" : "Update Schedule",
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

    // Schedule Table
    const scheduleTable = () => {
      const columns = [
        accessor("employee", {
          id: "employee",
          header: "Employee",
          cell: ({ row }) => {
            const { emp_img, firstName, lastName, emp_no } = row.original;

            return (
              <div className="flex items-center">
                <img
                  src={emp_img}
                  alt={emp_img}
                  className="mx-2 h-10 w-10 rounded-full border border-neutralDark p-1"
                />
                <div className="flex flex-col">
                  <span className="text-base">
                    {firstName + " " + lastName}
                  </span>
                  <span className="text-xs text-neutralGray">{emp_no}</span>
                </div>
              </div>
            );
          },
        }),
        accessor("departments", {
          id: "departments",
          header: "Department",
          cell: ({ row }) => {
            const { departments } = row.original ?? {};
            return <div>{departments?.name ?? "-"}</div>;
          },
        }),
        accessor("designations", {
          id: "designations",
          header: "Designation",
          cell: ({ row }) => {
            const { designations } = row.original ?? {};
            return <div>{designations?.name ?? "-"}</div>;
          },
        }),
        accessor("_id", {
          id: "_id",
          header: "View",
          style: "w-16 ",
          cell: (info) => (
            <div
              onClick={() => {
                navigate(`/admin/schedule/view/${info.getValue()}`);
              }}
              className="flex cursor-pointer items-center justify-center"
            >
              <Io5icons.IoCalendarOutline className="text-xl text-primaryBlue" />
            </div>
          ),
        }),
      ];

      const openFormAction = () => {
        return navigate("/admin/schedule/form");
      };

      const searchData = (value) => {
        const patternData = (item) =>
          pattern.test(item.fullName) ||
          pattern.test(item?.departments?.name) ||
          pattern.test(item?.designations?.name);

        const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
        const fltdData = rows.filter((item) => patternData(item));
        setTableData(fltdData);
      };

      const tableProps = {
        columns,
        rows: tableData,
        title: "Schedule",
        subTitle: "List of schedule",
        btnName: "New Schedule",
        openFormAction,
        setOpenForm,
        searchOption: true,
        searchData,
      };

      return (
        !historyView && (
          <div className="h-full w-full rounded-xl bg-white p-5 drop-shadow-xl">
            <DataTable {...tableProps} />
          </div>
        )
      );
    };

    return (
      <div>
        {scheduleTypeForm()}
        {scheduleTable()}
      </div>
    );
  };

  return <>{scheduleTableView()}</>;
}
