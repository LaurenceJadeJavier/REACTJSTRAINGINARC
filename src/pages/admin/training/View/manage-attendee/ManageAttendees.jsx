import React, { useEffect, useState } from "react";
import BackButton from "../../../../../components/buttons/back-button/BackButton";
import { useLocation } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { shallow } from "zustand/shallow";
import moment from "moment";
import * as Io5icons from "react-icons/io5";

// Component
import DropdownMenu from "../../../../../components/menu/DropdownMenu";
import DataTable from "../../../../../components/tables/datatable/DataTable";
import Form from "./components/Form";
import FormModal from "./components/FormModal";
import { GET, PUT } from "../../../../../services/api";

// Zustand Component
import { alertModalStore } from "../../../../../utils/zustand/AlertModalStore/alertModalStore";

export default function ManageAttendees() {
  const location = useLocation();
  const { accessor } = createColumnHelper();

  // Global State
  const { openConfirmModal, openSuccessModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);

  // Local State
  const [openForm, setOpenForm] = useState({});
  const [tableData, setTableData] = useState([]);
  const [formValues, setFormValues] = useState(location.state);
  const [employeeSelected, setEmployeeSelected] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    getAttendeeDataAction();
  }, []);

  // Get Attendee API (Service)
  const getAttendeeDataAction = async () => {
    const { _id } = formValues || {};

    try {
      const { data, status } = await GET("/trainings/" + _id);
      if (status === 200) {
        setTableData(data?.attendee_lists ?? []);
        return setFormValues(data);
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  // Create Attendee API (Service)
  const createAttendeeAction = async () => {
    const { _id } = formValues || {};
    if (employeeSelected.length === 0) return setIsEmpty(true);

    const employeeList = (employeeSelected ?? []).map(({ value }) => {
      return { emp_id: value };
    });
    const existingEmployeeList = (tableData ?? []).map(({ _id, emp_id }) => {
      return { emp_id: emp_id._id, _id: _id };
    });

    const params = {
      ...formValues,
      attendee_lists: [...employeeList, ...(tableData && existingEmployeeList)],
    };

    try {
      const { status } = await PUT("/trainings/" + _id, params);
      if (status === 201) {
        getAttendeeDataAction();
        setOpenForm({});
        setEmployeeSelected([]);
        setIsEmpty(false);
        return openSuccessModal({
          title: "Success!",
          message: "Your changes has been successfully saved.",
          closeNameBtn: "Ok",
        });
      }
    } catch (err) {
      console.log(`error:`, err);
    }
  };

  // Update Attendee API (Service)
  const updateAttendeeAction = async () => {
    const { attendeeId } = formValues || {};

    try {
      const { status } = await PUT("/attendees/" + attendeeId, formValues);
      if (status === 201) {
        getAttendeeDataAction();
        setOpenForm({});
        return openSuccessModal({
          title: "Success!",
          message: "Your changes has been successfully saved.",
          closeNameBtn: "Ok",
        });
      }
    } catch (err) {
      console.log(`error:`, err);
    }
  };

  // Delete Attendee API (Service)
  const deleteAttendeeAction = async (data) => {
    const { _id } = formValues || {};

    const employeeList = data.map(({ _id: attendeeId, emp_id }) => {
      return { emp_id: emp_id._id, _id: attendeeId };
    });

    const params = {
      ...formValues,
      attendee_lists: employeeList,
    };

    try {
      const { status } = await PUT("/trainings/" + _id, params);
      if (status === 201) {
        getAttendeeDataAction();
        return openSuccessModal({
          title: "Success!",
          message: "Removed Successfully!",
          closeNameBtn: "Ok",
        });
      }
    } catch (err) {
      console.log(`error:`, err);
    }
  };

  // Parent Training Details View
  const trainingDetails = () => {
    const { deptName, total_costs, createdAt, updatedAt, description } =
      location.state || {};

    return (
      <>
        <div className="-mt-6 mb-8 grid gap-1 pt-4 md:grid-cols-7">
          <div className="col-span-1 flex flex-row text-base text-neutralGray md:justify-between">
            <span>Department</span>
            <span>:</span>
          </div>
          <div className="text-base text-neutralDark md:col-span-6 ">
            {deptName ?? "--"}
          </div>
          <div className="col-span-1 flex flex-row text-base text-neutralGray md:justify-between">
            <span>Training Cost</span>
            <span>:</span>
          </div>
          <div className="text-base text-neutralDark md:col-span-6 ">
            P {total_costs ?? 0}
          </div>
          <div className="col-span-1 flex flex-row text-base text-neutralGray md:justify-between">
            <span>Training Period</span>
            <span>:</span>
          </div>
          <div className="text-base text-neutralDark md:col-span-6 ">
            {createdAt ? moment(createdAt).format("LL") : "--"} -
            {updatedAt ? moment(updatedAt).format("LL") : "--"}
          </div>
          <div className="col-span-1 flex flex-row text-base text-neutralGray md:justify-between">
            <span>Description</span>
            <span>:</span>
          </div>
          <div className="text-base text-neutralDark md:col-span-4">
            {description ?? "--"}
          </div>
        </div>
      </>
    );
  };

  // Attendee Form View
  const attendeeForm = () => {
    const isAdd = openForm.action === "Add";
    const clearModal = () => {
      setOpenForm({});
    };

    const body = () => {
      const formProps = {
        formValues,
        isAdd,
        tableData,
        employeeSelected,
        setFormValues,
        setEmployeeSelected,
        isEmpty,
      };

      return <Form {...formProps} />;
    };

    const submitFunc = () => {
      if (isAdd) return createAttendeeAction();

      return openConfirmModal({
        message:
          "Are you sure you'd like to proceed with submitting this remark and comment?",
        modalAction: () => updateAttendeeAction(),
      });
    };

    const modalProps = {
      title: isAdd ? "Add New Attendee" : "Remarks and Comment",
      body: body(),
      submit: {
        name: isAdd ? "Add" : "Submit",
        btnFunction: () => submitFunc(),
      },
      cancel: {
        name: "Cancel",
        btnFunction: () => clearModal(),
      },
      isOpen: openForm.isOpen,
      maxWidth: "max-w-3xl",
    };

    return <FormModal {...modalProps} />;
  };

  // Attendee Table View
  const attendeeTable = () => {
    const openFormAction = () => {
      return setOpenForm({
        action: "Add",
        isOpen: true,
      });
    };

    const actionList = [
      {
        _id: 1,
        label: "Remarks and Comment",
        textColor: "text-primaryBlue",
        icon: <Io5icons.IoCreateOutline />,
        itemFunction: (info) => {
          const { row } = info || {};
          const { status, remarks } = tableData[row.index] || {};

          setFormValues((prev) => ({
            ...prev,
            status,
            remarks,
            attendeeId: row.original._id,
          }));

          return setOpenForm({
            action: "Update",
            isOpen: true,
          });
        },
      },
      {
        _id: 2,
        label: "Delete",
        textColor: "text-stateRed",
        icon: <Io5icons.IoTrashBinOutline />,
        itemFunction: ({ row }) => {
          const { original } = row || {};
          const { employee } = original || {};
          const { attendee_lists } = formValues || {};

          const indexOfSelectedEmployee = tableData
            .map(({ emp_id }) => emp_id?._id)
            .indexOf(original?.emp_id?._id);

          const filterData = attendee_lists.map((item, index) => {
            if (index !== indexOfSelectedEmployee) return item;
          });

          return openDeleteModal({
            message: `Are you sure you want to remove "${employee}" from the list?`,
            modalAction: () =>
              deleteAttendeeAction(filterData.filter((item) => !!item)),
          });
        },
      },
    ];

    const columns = [
      accessor("emp_id.fullName", {
        id: "emp_id.fullName",
        header: "Employee",
        cell: (info) => info.getValue(),
      }),
      accessor("status", {
        id: "status",
        header: "Status",
        accesoryKey: "status",
        cell: (info) => {
          const renderStyle = (type) => {
            let newStyle = "";

            if (info.getValue() === "ongoing") {
              if (type === "text") return "On Going";
              newStyle = "bg-lightBlue text-darkGray";
            }
            if (info.getValue() === "passed") {
              if (type === "text") return "Passed";
              newStyle = "bg-lightGreen text-stateGreen";
            }
            if (info.getValue() === "failed") {
              if (type === "text") return "Failed";
              newStyle = "bg-lightRed text-stateRed";
            }
            return newStyle;
          };

          return (
            <span
              className={`rounded-md p-2 text-left ${renderStyle("color")}`}
            >
              {renderStyle("text")}
            </span>
          );
        },
      }),
      accessor("remarks", {
        id: "remarks",
        header: "Remarks",
        cell: (info) => {
          return <div className="text-left">{info.getValue() ?? "--"}</div>;
        },
      }),
      accessor("_id", {
        id: "_id",
        header: "Action",
        style: "w-20 ",
        cell: (info) => (
          <div className="text-center">
            <DropdownMenu actionList={actionList} row={info} />
          </div>
        ),
      }),
    ];

    const tableProps = {
      columns,
      rows: tableData,
      title: formValues?.title ?? null,
      headDetails: trainingDetails,
      btnName: "New Attendee",
      openFormAction,
      filterSelectionList: ["status"],
    };

    return <DataTable {...tableProps} />;
  };

  return (
    <>
      <BackButton navigateTo="/admin/training" />
      <div className="mt-2 h-full w-full rounded-xl bg-white p-5 drop-shadow-xl">
        {attendeeForm()}
        {attendeeTable()}
      </div>
    </>
  );
}

export const manageAttendeesLoader = () => {
  const rows = [];
  return rows;
};
