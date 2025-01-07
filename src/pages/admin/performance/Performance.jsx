import { useEffect, useState } from "react";
import * as Io5icons from "react-icons/io5";
import * as Lucideicons from "react-icons/lu";
import { shallow } from "zustand/shallow";
import { createColumnHelper } from "@tanstack/react-table";
import { useLoaderData } from "react-router-dom";

// Components
import DataTable from "../../../components/tables/datatable/DataTable";
import FormModal from "../../../components/modal/FormModal";
import { CustomInput } from "../../../components/inputs/CustomInput";
import DropdownMenu from "../../../components/menu/DropdownMenu";
import { CustomSelect } from "../../../components/inputs/CustomSelect";
import ManagePerformance from "./View/ManagePerformance";
import blankProfile from "../../../assets/images/blankProfile.jpg";

// Zustand Component
import { alertModalStore } from "../../../utils/zustand/AlertModalStore/alertModalStore";
import { performanceStore } from "../../../utils/zustand/AdminStore/Performance/performanceStore";
import moment from "moment";
import { departmentStore } from "../../../utils/zustand/AdminStore/HrSetup/departmentStore";
import { designationTypeStore } from "../../../utils/zustand/AdminStore/HrSetup/designationTypeStore";
import { employeeStore } from "../../../utils/zustand/AdminStore/Employee/employeeStore";
import { POST, DELETE, PUT, Toast } from "../../../services/api";

export default function Performance() {
  const { accessor } = createColumnHelper();

  // Global State
  const { openConfirmModal, openSuccessModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);
  const { performanceData, fetchAllPerformance, fetchUserGoal } =
    performanceStore();

  const { department: departmentData } = departmentStore(
    (state) => state,
    shallow,
  );
  const { designationType: designationData } = designationTypeStore(
    (state) => state,
    shallow,
  );
  const { employee: employeeData } = employeeStore((state) => state, shallow);
  const [tableData, setTableData] = useState(performanceData);

  useEffect(() => {
    setTableData(performanceData);
  }, [performanceData]);

  // Form Object
  // const formObject = {
  //   emp_id: "",
  //   dept_id: "",
  //   designation_id: "",
  //   description: "",
  //   start_date: "",
  //   end_date: "",
  //   remarks: "",
  // };
  // Local State
  const [formValues, setFormValues] = useState({});
  const [openForm, setOpenForm] = useState({});
  const [userContainer, setUserContainer] = useState({});
  const [manageView, setManageView] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  // Create New Performance API (Service)
  const createNewPerformanceAction = async () => {
    const modalMessage = {
      title: "Success!",
      message: "Added Successfully!",
      closeNameBtn: "Ok",
    };

    const successModal = () => {
      setOpenForm({});
      setFormValues({});
      setIsEmpty(false);
      openSuccessModal(modalMessage);
      return fetchAllPerformance();
    };

    try {
      const { status } = await POST("/performances", formValues);

      return status === 201 && successModal();
    } catch (err) {
      console.log(`err:`, err);
    }
  };

  // Update Performance API (Service)
  const updatePerformanceAction = async () => {
    const { _id } = formValues || {};

    const modalMessage = {
      title: "Success!",
      message: "Your changes has been successfully saved.",
      closeNameBtn: "Ok",
    };

    const successModal = () => {
      setOpenForm({});
      setFormValues({});
      setIsEmpty(false);
      openSuccessModal(modalMessage);
      return fetchAllPerformance();
    };

    try {
      const { status } = await PUT("/performances/" + _id, formValues);
      return status === 201 && successModal();
    } catch (err) {
      console.log(`err:`, err);
    }
  };

  // Archive Performance API (Service)
  const archivePerformanceAction = async (id) => {
    try {
      const { status } = await DELETE("/performances/" + id);
      if (status === 201) {
        fetchAllPerformance();
        return openSuccessModal({
          title: "Success!",
          message: "Deleted Successfully!",
          closeNameBtn: "Ok",
        });
      }
    } catch (err) {
      console.log(`err:`, err);
    }
  };

  // Performance Table View
  const performanceTableView = () => {
    // Clear Modal Value Action
    const clearModal = () => {
      setOpenForm({});
      setIsEmpty(false);
      return setFormValues({});
    };

    // Open Modal Action
    const openFormAction = () => {
      setOpenForm({ action: "Add", isOpen: true });
    };

    // Performance Modal Form
    const performanceTypeForm = () => {
      const isAdd = openForm.action === "Add";
      const sortSelection = (dataList) => {
        const setSelectionDataAction = (item) => {
          const { name, _id, firstName, middleName, lastName } = item || {};
          const ifStringExist = (data) => (data ?? null) + " ";
          const personName =
            ifStringExist(firstName) +
            ifStringExist(middleName) +
            ifStringExist(lastName);
          return { label: name ?? personName, value: _id };
        };

        return (dataList ?? []).map(setSelectionDataAction);
      };

      const handleOnChange = (e) => {
        const { name, value } = e.target;

        return setFormValues((prev) => ({ ...prev, [name]: value }));
      };

      const performanceFormBody = () => {
        return (
          <div className="flex flex-col gap-2">
            <div className="flex w-full flex-row gap-2">
              <div className="w-full">
                <CustomSelect
                  name={"dept_id"}
                  placeholder={"Select Department"}
                  label={"Department"}
                  isRequired
                  isEmpty={isEmpty}
                  value={formValues?.dept_id}
                  onChange={handleOnChange}
                  options={sortSelection(departmentData)}
                />
              </div>
              <div className="w-full">
                <CustomSelect
                  name={"designation_id"}
                  placeholder={"Select Designation"}
                  label={"Designation"}
                  isRequired
                  isEmpty={isEmpty}
                  value={formValues?.designation_id}
                  onChange={handleOnChange}
                  options={sortSelection(designationData)}
                />
              </div>
            </div>
            <div>
              <CustomSelect
                name={"emp_id"}
                placeholder={"Select "}
                label={"Employee"}
                isRequired
                isEmpty={isEmpty}
                value={formValues?.emp_id}
                onChange={handleOnChange}
                options={sortSelection(employeeData)}
              />
            </div>
            <div>
              <CustomInput
                name={"description"}
                isRequired
                isEmpty={isEmpty}
                value={formValues.description}
                onChange={handleOnChange}
                label="Description"
              />
            </div>
            <div className="flex flex-col py-3">
              <div className="text-md font-semibold text-neutralDark">
                Evaluation Period
              </div>
              <div className="text-xs text-neutralGray">
                Determine the timeframe during which an employee's job
                performance is assessed and reviewed.
              </div>
            </div>
            <div className="flex w-full flex-row gap-2">
              <div className="w-full">
                <CustomInput
                  name={"start_date"}
                  type="date"
                  label="Start Date"
                  isRequired
                  isEmpty={isEmpty}
                  value={formValues?.start_date}
                  onChange={handleOnChange}
                />
              </div>
              <div className="w-full">
                <CustomInput
                  name={"end_date"}
                  type="date"
                  label="End Date"
                  isRequired
                  isEmpty={isEmpty}
                  value={formValues?.end_date}
                  onChange={handleOnChange}
                />
              </div>
            </div>
          </div>
        );
      };

      const submitFunc = () => {
        if (isAdd) return createNewPerformanceAction();
        else
          return openConfirmModal({
            modalAction: () => updatePerformanceAction(),
          });
      };

      const validateFields = () => {
        const {
          dept_id,
          description,
          designation_id,
          emp_id,
          end_date,
          start_date,
        } = formValues || {};

        if (
          !dept_id ||
          !description ||
          !designation_id ||
          !emp_id ||
          !end_date ||
          !start_date
        )
          return setIsEmpty(true);
        else {
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
          } else {
            return submitFunc();
          }
        }
      };

      const modalProps = {
        title: isAdd ? "Add Employee" : "Update Employee",
        body: performanceFormBody(),
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

    // Performance Table
    const performanceTable = () => {
      const actionList = [
        {
          _id: 1,
          label: "Update",
          textColor: "text-primaryBlue",
          icon: <Io5icons.IoCreateOutline />,
          itemFunction: (row) => {
            const { emp_id, designation_id, dept_id, end_date, start_date } =
              row.original;

            const formValuesContainer = {
              ...row.original,
              designation_id: designation_id?._id,
              emp_id: emp_id?._id,
              dept_id: dept_id?._id,
              start_date: moment(start_date).format("YYYY-MM-DD"),
              end_date: moment(end_date).format("YYYY-MM-DD"),
            };

            setFormValues(formValuesContainer);
            return setOpenForm({
              action: "Update",
              isOpen: true,
            });
          },
        },
        {
          _id: 2,
          label: "Manage Goals",
          textColor: "text-primaryBlue",
          icon: <Lucideicons.LuFileCog />,
          itemFunction: (row) => {
            const { emp_id } = row.original || {};
            setUserContainer(row.original);
            fetchUserGoal(emp_id?._id ?? null);
            return setManageView(!manageView);
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
              modalAction: () => archivePerformanceAction(_id),
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
                  src={emp_img || blankProfile}
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
        accessor("description", {
          id: "description",
          header: "Description",
          accesoryKey: "description",
          cell: (info) => (
            <div className="w-20 truncate">{info.getValue()}</div>
          ),
        }),
        accessor("dept_id.name", {
          id: "dept_id.name",
          header: "Department",
          accesoryKey: "Department",
          cell: (info) => info.getValue(),
        }),
        accessor("evaluation", {
          id: "evaluation",
          header: "EVALUATION PERIOD",
          accesoryKey: "evaluation",
          cell: ({ row }) => {
            const { start_date, end_date } = row.original || {};
            const startDate = moment(start_date).format("ll");
            const endDate = moment(end_date).format("ll");

            return (
              <div>
                {startDate ?? null} - {endDate ?? null}
              </div>
            );
          },
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
        title: "Performance",
        subTitle: "Track goals for your employees",
        btnName: "Add Employee",
        openFormAction,
        searchOption: true, //show search icon
        searchData,
      };

      return !manageView ? (
        <div className="h-full w-full rounded-xl bg-white p-5 drop-shadow-xl">
          <DataTable {...tableProps} />
        </div>
      ) : null;
    };

    //search function
    const searchData = (value) => {
      const patternData = ({
        emp_id,
        description,
        dept_id,
        end_date,
        start_date,
      }) =>
        pattern.test(emp_id?.fullName) ||
        pattern.test(description) ||
        pattern.test(dept_id?.name) ||
        //format to filter by date eg. 2023-09-15T00:00:00.000Z -> Sep 15, 2023
        pattern.test(moment(start_date)?.format("ll")) ||
        pattern.test(moment(end_date)?.format("ll"));
      const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
      const fltdData = performanceData.filter((item) => patternData(item));
      setTableData(fltdData);
    };

    // Perfomance Manage Details View
    const performanceManage = () => {
      return (
        manageView && (
          <ManagePerformance
            userContainer={userContainer}
            setHistoryView={setManageView}
          />
        )
      );
    };

    return (
      <div>
        {performanceTypeForm()}
        {performanceTable()}
        {performanceManage()}
      </div>
    );
  };

  return <>{performanceTableView()}</>;
}
