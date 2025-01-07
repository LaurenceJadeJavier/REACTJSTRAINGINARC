import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import * as Io5icons from "react-icons/io5";
import * as Lucide from "react-icons/lu";
import moment from "moment";
import { shallow } from "zustand/shallow";

// Component
import DataTable from "../../../components/tables/datatable/DataTable";
import DropdownMenu from "../../../components/menu/DropdownMenu";
import Form from "./components/Form";
import FormModal from "./components/FormModal";
import { DELETE, GET, POST, PUT, Toast } from "../../../services/api";

// Zustand Component
import { alertModalStore } from "../../../utils/zustand/AlertModalStore/alertModalStore";
import { trainingStore } from "../../../utils/zustand/AdminStore/Trainings/trainingsStore";

export default function Trainings() {
  const navigate = useNavigate();
  const { accessor } = createColumnHelper();

  // Global State
  const { openConfirmModal, openSuccessModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);
  const { trainingData, fetchAllTrainingAction } = trainingStore(
    (state) => state,
    shallow,
  );

  // Form Object
  const formObject = {
    title: "",
    trainer: "",
    dept_id: "",
    start_date: "",
    end_date: "",
    total_costs: "",
  };

  // Local State
  const [formValues, setFormValues] = useState(formObject);
  const [openForm, setOpenForm] = useState({});
  const [isEmpty, setIsEmpty] = useState(false);
  const [tableData, setTableData] = useState(trainingData);

  useEffect(() => {
    setTableData(trainingData);
  }, [trainingData]);

  // Validate If Form Has Value
  const formValidation = () => {
    const { title, trainer, dept_id, start_date, end_date, total_costs } =
      formValues || {};

    const checkIfValueIsValid =
      !title ||
      !trainer ||
      !dept_id ||
      !start_date ||
      !end_date ||
      !total_costs ||
      moment(start_date).format() > moment(end_date).format();

    return checkIfValueIsValid;
  };

  // Get Specific Attendee Data API (Service)
  const getAttendeeDataAction = async (id) => {
    try {
      const { data, status } = await GET("/trainings/" + id);
      return status === 200 && data;
    } catch (err) {
      console.log(`err:`, err);
    }
  };

  // Create Training API (Service)
  const createTrainingAction = async () => {
    const formValidationBoolean = formValidation();
    if (formValidationBoolean) return setIsEmpty(true);

    const params = {
      ...formValues,
      attendee_lists: [],
    };

    try {
      const { status } = await POST("/trainings", params);
      if (status === 201) {
        fetchAllTrainingAction();
        setIsEmpty(false);
        setOpenForm({});
        setFormValues(formObject);
        return openSuccessModal();
      }
    } catch (err) {
      console.log(`error:`, err);
    }
  };

  // Update Training API (Service)
  const updateTrainingAction = async () => {
    const { _id } = formValues || {};
    const formValidationBoolean = formValidation();
    const { attendee_lists } = await getAttendeeDataAction(_id);
    if (formValidationBoolean) return setIsEmpty(true);

    // Existing Attendee Record
    const existingEmployeeList = (attendee_lists ?? []).map(
      ({ _id, emp_id }) => {
        return { emp_id: emp_id._id, _id: _id };
      },
    );

    const params = {
      ...formValues,
      attendee_lists: existingEmployeeList,
    };

    try {
      const { status } = await PUT("/trainings/" + _id, params);
      if (status === 201) {
        fetchAllTrainingAction();
        setIsEmpty(false);
        setOpenForm({});
        setFormValues(formObject);
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

  // Delete Training API (Service)
  const deleteTrainingAction = async (id) => {
    try {
      const { status } = await DELETE("/trainings/" + id);
      if (status === 201) {
        fetchAllTrainingAction();
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

  // Training Table View
  const traningTable = () => {
    const openFormAction = () => {
      return setOpenForm({
        action: "Add",
        isOpen: true,
      });
    };

    const actionList = [
      {
        _id: 1,
        label: "Update",
        textColor: "text-primaryBlue",
        icon: <Io5icons.IoCreateOutline />,
        itemFunction: async (row) => {
          const { dept_id, start_date, end_date } = row.original || {};

          const formParams = {
            ...row.original,
            dept_id: dept_id?._id,
            start_date: moment(start_date).format("YYYY-MM-DD"),
            end_date: moment(end_date).format("YYYY-MM-DD"),
          };

          setFormValues(formParams);
          return setOpenForm({
            action: "Update",
            isOpen: true,
          });
        },
      },
      {
        _id: 2,
        label: "Manage",
        textColor: "text-primaryBlue",
        icon: <Lucide.LuFolderCog />,
        itemFunction: ({ original }) => {
          const { dept_id, start_date, end_date } = original || {};
          const formParams = {
            ...original,
            deptName: dept_id?.name,
            dept_id: dept_id?._id,
            start_date: moment(start_date).format("YYYY-MM-DD"),
            end_date: moment(end_date).format("YYYY-MM-DD"),
          };

          return navigate("manage-attendees/" + original._id, {
            state: formParams,
          });
        },
      },
      {
        _id: 3,
        label: "Delete",
        textColor: "text-stateRed",
        icon: <Io5icons.IoTrashBinOutline />,
        itemFunction: (row) => {
          const { _id } = row.original || {};
          return openDeleteModal({
            modalAction: () => deleteTrainingAction(_id),
          });
        },
      },
    ];

    const columns = [
      accessor("title", {
        id: "title",
        header: "Title",
        cell: (info) => info.getValue(),
      }),
      accessor("dept_id.name", {
        id: "dept_id.name",
        header: "Department",
        cell: (info) => info.getValue(),
      }),
      accessor("trainer", {
        id: "trainer",
        header: "Trainer",
        cell: (info) => info.getValue(),
      }),
      accessor("total_costs", {
        id: "total_costs",
        header: "Training Cost",
        cell: (info) => info.getValue(),
      }),
      accessor("start_date", {
        id: "start_date",
        header: "Start Date",
        cell: (info) => moment(info.getValue() ?? "").format("LL"),
      }),
      accessor("end_date", {
        id: "end_date",
        header: "End Date",
        cell: (info) => moment(info.getValue() ?? "").format("LL"),
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

    const tableProps = {
      columns,
      rows: tableData,
      title: "Training",
      subTitle: "List of trainings",
      btnName: "New Training",
      openFormAction,
      searchOption: true,
      searchData,
    };

    return tableProps && <DataTable {...tableProps} />;
  };

  //search function
  const searchData = (value) => {
    const patternData = ({
      title,
      dept_id,
      trainer,
      total_costs,
      start_date,
      end_date,
    }) =>
      pattern.test(title) ||
      pattern.test(trainer) ||
      pattern.test(dept_id?.name) ||
      pattern.test(total_costs) ||
      //format to filter by date eg. 2023-09-15T00:00:00.000Z -> September 15, 2023
      pattern.test(moment(start_date)?.format("MMMM DD, YYYY")) ||
      pattern.test(moment(end_date)?.format("MMMM DD, YYYY"));
    const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
    const fltdData = trainingData.filter((item) => patternData(item));
    setTableData(fltdData);
  };

  // Training Form View
  const trainingForm = () => {
    const isAdd = openForm.action === "Add";
    const clearModal = () => {
      setFormValues(formObject);
      setIsEmpty(false);
      return setOpenForm({});
    };

    const body = () => {
      const formProps = {
        formValues,
        setFormValues,
        isEmpty,
        openForm,
      };

      return <Form {...formProps} />;
    };

    const submitFunc = () => {
      const { start_date, end_date } = formValues || {};
      if (
        start_date &&
        end_date &&
        moment(start_date).format() > moment(end_date).format()
      ) {
        Toast.fire({
          icon: "info",
          title: "Invalid Start and End time",
          timer: 2000,
        });
      }

      if (isAdd) return createTrainingAction();
      return openConfirmModal({
        message: "Are you sure you want to update this?",
        modalAction: () => updateTrainingAction(),
      });
    };

    const modalProps = {
      title: isAdd ? "Add New Training" : "Update Training",
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
      maxWidth: "max-w-3xl",
    };
    return <FormModal {...modalProps} />;
  };

  return (
    <>
      <div className="h-fit w-full rounded-xl bg-white p-5 drop-shadow-xl">
        {trainingForm()}
        {traningTable()}
      </div>
    </>
  );
}

export const trainingsLoader = async () => {
  const rows = [];
  return rows;
};
