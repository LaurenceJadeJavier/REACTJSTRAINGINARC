import React, { useState } from "react";
import * as Io5icons from "react-icons/io5";
import { createColumnHelper } from "@tanstack/react-table";
import { shallow } from "zustand/shallow";
import moment from "moment";

// Components
import { filterDataAction } from "../../../../services/script_service";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import DataTable from "../../../../components/tables/datatable/DataTable";
import DropdownMenu from "../../../../components/menu/DropdownMenu";
import FormModal from "../../../../components/modal/FormModal";
import TableFilter from "../../../../components/filter/TableFilter";
import { DELETE, POST, PUT } from "../../../../services/api";
import { performanceStore } from "../../../../utils/zustand/AdminStore/Performance/performanceStore";
import { CustomSelect } from "../../../../components/inputs/CustomSelect";

export default function ManagePerformance(props) {
  const { userContainer, setHistoryView } = props || {};
  const { accessor } = createColumnHelper();

  // Global State
  const { openConfirmModal, openSuccessModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);
  const { userGoalData, fetchUserGoal } = performanceStore(
    (state) => state,
    shallow,
  );

  // Form Object
  const formObject = {
    emp_id: "",
    goal_desc: "",
    remarks: "",
    rating: "",
  };

  // Local State
  const [formValues, setFormValues] = useState(formObject);
  const [openForm, setOpenForm] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // Create New Goal API (Service)
  const createNewGoalAction = async () => {
    const { emp_id } = userContainer || {};
    const employeeId = emp_id?._id;

    const params = {
      ...formValues,
      emp_id: employeeId,
    };

    try {
      const { status } = await POST("/goal-lists", params);
      if (status === 201) {
        fetchUserGoal(employeeId);
        setFormValues(formObject);
        setOpenForm({});
        return openSuccessModal({
          title: "Success!",
          message: "Your changes has been successfully saved.",
          closeNameBtn: "Ok",
        });
      }
    } catch (err) {
      console.log(`err:`, err);
    }
  };

  // Update New Goal API (Service)
  const updateGoalAction = async () => {
    const { emp_id } = userContainer || {};
    const { _id, goal_desc, remarks, rating } = formValues || {};

    const params = {
      emp_id: emp_id?._id,
      goal_desc,
      remarks,
      rating,
    };

    try {
      const { status } = await PUT("/goal-lists/" + _id, params);
      if (status === 201) {
        fetchUserGoal(emp_id?._id);
        setFormValues(formObject);
        setOpenForm({});
        return openSuccessModal({
          title: "Success!",
          message: "Your changes has been successfully saved.",
          closeNameBtn: "Ok",
        });
      }
    } catch (err) {
      console.log(`err:`, err);
    }
  };

  // Delete New Goal API (Service)
  const deleteGoalAction = async (id) => {
    const { emp_id } = userContainer || {};

    try {
      const { status } = await DELETE("/goal-lists/" + id);
      if (status === 201) {
        fetchUserGoal(emp_id?._id);
        return openSuccessModal({
          title: "Success!",
          message: "Your changes has been successfully saved.",
          closeNameBtn: "Ok",
        });
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  // Open Modal Action
  const openFormAction = () => {
    setOpenForm({ action: "Add", isOpen: true });
  };

  // Clear Modal Value Action
  const clearModal = () => {
    setFormValues(formObject);
    setOpenForm({});
  };

  // Navigation Display
  const headerDisplay = () => {
    return (
      <div className="flex flex-row items-center justify-between">
        <div
          className="flex cursor-pointer flex-row items-center gap-1 rounded-lg px-4 py-2 text-primaryBlue hover:bg-gray-100"
          onClick={() => setHistoryView(false)}
        >
          <span>
            <Io5icons.IoArrowBackSharp className="text-md text-primaryBlue" />
          </span>
          Back
        </div>
      </div>
    );
  };

  // User Details Display
  const bodyDisplay = () => {
    const {
      dept_id,
      description,
      start_date,
      end_date,
      emp_id,
      designation_id,
    } = userContainer;

    const { fullName, emp_no, emp_img } = emp_id || {};
    const formattedDate = (data) => moment(data ?? "").format("LL");

    return (
      <div className="mt-4 rounded-xl bg-white p-4 drop-shadow-xl">
        <div className="flex flex-col gap-5 px-1 text-sm">
          <div className="flex flex-row items-center justify-between">
            <div>
              <div className="border-b pb-5 pt-2">
                <div className="text-lg font-semibold">
                  {description ?? "--"}
                </div>
                <div className="text-neutralGray">
                  Evaluation Period :{" "}
                  <span className="text-neutralDark">
                    {formattedDate(start_date)} - {formattedDate(end_date)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-3">
              <div>
                <button
                  onClick={() => setOpenFilter(!openFilter)}
                  className="btn rounded-2xl bg-lightBlue"
                >
                  <Io5icons.IoFilter className="text-xl text-primaryBlue" />{" "}
                </button>
              </div>
              <div>
                <button
                  className="btn btn-info rounded-xl bg-primaryBlue px-5 text-sm  font-normal capitalize text-white"
                  onClick={openFormAction}
                >
                  <span>
                    <Io5icons.IoAddCircleOutline className="text-lg" />
                  </span>
                  New Goal
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-start justify-start gap-4">
            <div>
              <img
                src={emp_img || null}
                alt={"profile"}
                className="h-16 w-16 rounded-full border border-neutralDark p-1"
              />
            </div>
            <div className="flex flex-col">
              <div className="text-base font-medium">{fullName ?? "--"}</div>
              <div className="transform-capitalize text-sm">Active</div>
              <div className="text-sm">{emp_no ?? "--"}</div>
              <div className="text-sm">
                {dept_id?.name ?? null} - {designation_id?.name ?? null}
              </div>
            </div>
          </div>
          <div>{tableDisplay()}</div>
        </div>
      </div>
    );
  };

  // Table Display
  const tableDisplay = () => {
    // Rating Status Display
    const ratingDisplay = (status) => {
      const extraStyle =
        "py-1 px-2 uppercase text-xs w-fit rounded-md font-medium";
      const ratingColor = () => {
        switch (status) {
          case 1:
            return "bg-gray-300 text-gray-700 " + extraStyle;
          case 2:
            return "bg-green-300 text-green-700 " + extraStyle;
          case 3:
            return "bg-red-300 text-red-700 " + extraStyle;
        }
      };

      const ratingLabel = () => {
        switch (status) {
          case 1:
            return "Pending";
          case 2:
            return "Passed";
          case 3:
            return "Failed";
        }
      };

      return <div className={ratingColor()}>{ratingLabel()}</div>;
    };

    const actionList = [
      {
        _id: 1,
        label: "Update",
        textColor: "text-primaryBlue",
        icon: <Io5icons.IoCreateOutline />,
        itemFunction: (row) => {
          setFormValues(row.original);
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
        itemFunction: (row) => {
          const { _id } = row.original || {};
          return openDeleteModal({
            modalAction: () => deleteGoalAction(_id),
          });
        },
      },
    ];

    const columns = [
      accessor("employee", {
        id: "employee",
        header: "Employee",
        accesoryKey: "employee",
        cell: ({ row }) => {
          const { emp_id } = row.original;
          const { fullName, emp_no, emp_img } = emp_id || {};
          return (
            <div className="flex items-center">
              <img
                src={emp_img}
                className="mx-2 h-10 w-10 rounded-full border border-neutralDark p-1"
              />
              <div className="flex flex-col">
                <span className="text-base">{fullName ?? "--"}</span>
                <span className="text-xs text-neutralGray">
                  {emp_no ?? "--"}
                </span>
              </div>
            </div>
          );
        },
      }),
      accessor("rating", {
        id: "rating",
        header: "Rating",
        accesoryKey: "rating",
        cell: (info) => ratingDisplay(info.getValue()),
      }),
      accessor("remarks", {
        id: "remarks",
        header: "Remarks",
        cell: (info) => <div className="w-20 truncate">{info.getValue()}</div>,
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
      rows: userGoalData,
      searchOption: false,
      openForm,
      openFormAction,
    };

    return <DataTable {...tableProps} />;
  };

  // Performance Modal Form
  const performanceTypeForm = () => {
    const isAdd = openForm.action === "Add";

    const handleOnChange = (e) => {
      const { name, value } = e.target || {};

      return setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const body = () => {
      const ratingSelection = [
        {
          _id: 1,
          label: "Pending",
          value: 1,
        },
        {
          _id: 2,
          label: "Passed",
          value: 2,
        },
        {
          _id: 3,
          label: "Failed",
          value: 3,
        },
      ];

      return (
        <div className="grid grid-cols-1 gap-2">
          <CustomInput
            name="goal_desc"
            label="Description"
            type="text"
            isRequired
            isEmpty={isEmpty}
            value={formValues.goal_desc}
            onChange={handleOnChange}
          />
          <CustomSelect
            name="rating"
            label="Rating"
            isRequired
            isEmpty={isEmpty}
            placeholder={"Select Rating"}
            value={formValues.rating}
            onChange={handleOnChange}
            options={ratingSelection}
          />
          <CustomInput
            name="remarks"
            label="Remarks"
            isRequired
            isEmpty={isEmpty}
            value={formValues.remarks}
            onChange={handleOnChange}
          />
        </div>
      );
    };

    const submitFunc = () => {
      if (isAdd) return createNewGoalAction();
      return openConfirmModal({
        modalAction: () => updateGoalAction(),
      });
    };

    const validateFields = () => {
      const { goal_desc, rating, remarks } = formValues || {};
      if (!goal_desc || !rating || !remarks) return setIsEmpty(true);
      else return submitFunc();
    };

    const modalProps = {
      title: isAdd ? "Add New Goal" : "Update Goal",
      body: body(),
      submit: {
        name: isAdd ? "Add" : "Update",
        btnFunction: () => validateFields(),
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

  // Table Filter Form Display (Optional)
  const tableFilterDisplay = () => {
    const columnToFilter = ["remarks"];

    const propsContainer = {
      filterSelection: filterDataAction(columnToFilter, userGoalData),
      openFilter,
      setOpenFilter,
    };

    return columnToFilter && <TableFilter {...propsContainer} />;
  };

  return (
    <div>
      {headerDisplay()}
      {bodyDisplay()}
      {performanceTypeForm()}
      {tableFilterDisplay()}
    </div>
  );
}
