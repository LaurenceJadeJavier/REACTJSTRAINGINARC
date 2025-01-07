import React, { useEffect, useState } from "react";
import CancelButton from "../../../../components/buttons/cancel-button/CancelButton";
import HorizontalLine from "../../../../components/seperator-line/HorizontalLine";
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Stepper from "../../../../components/stepper/Stepper";
import GeneralInformation from "./GeneralInformation";
import Documents from "./Documents";
import PayrollDetails from "./PayrollDetails";
import PayslipDetails from "./PayslipDetails";
import { shallow } from "zustand/shallow";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { employeeStore } from "../../../../utils/zustand/AdminStore/Employee/employeeStore";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";
import { PUT } from "../../../../services/api";
import Payslip from "./Payslip/Payslip";

export default function Form() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { view } = state || {};
  console.log(`view:`, view);

  const { openConfirmModal, openSuccessModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);
  const {
    employeeView,
    employeeForm,
    employeeInfo,
    storeEmployeeForm,
    fetchAllEmployee,
    clearEmployeeForm,
  } = employeeStore((state) => state, shallow);
  const { loadingHoc } = loadingStore((state) => state, shallow);
  const [formProps, setFormProps] = useState(employeeForm);

  useEffect(() => {
    if (employeeInfo) {
      storeEmployeeForm({
        ...employeeForm,
        empPayrollLists: employeeInfo.empPayrollLists ?? [],
      });
    }
  }, [employeeInfo]);

  const stepperProps = {
    steps: [
      {
        stepNumber: 1,
        heading: "General Information",
        subHeading: "Employee Profile",
        navigateTo: "step-1",
      },
      {
        stepNumber: 2,
        heading: "Documents",
        subHeading: "Upload employee’s files",
        navigateTo: "step-2",
      },
      {
        stepNumber: 3,
        heading: "Payroll Details",
        subHeading: "Compensation and benefits",
        navigateTo: "step-3",
      },
      {
        stepNumber: 4,
        heading: "Payslip Details",
        subHeading: "Setup employee’s payslip",
        navigateTo: "step-4",
      },
    ],
  };

  const saveCurrentChanges = () => {
    openConfirmModal({
      modalAction: () => updateAPI(),
    });
  };

  const updateAPI = async () => {
    // loadingHoc(true);

    //restruct contribution params prevent replacing general info
    const contriParams = {
      tin_no: formProps?.contribution?.tin_no,
      pagibig_no: formProps?.contribution?.pagibig_no,
      sss_no: formProps?.contribution?.sss_no,
      philhealth_no: formProps?.contribution?.philhealth_no,
    };

    const params = {
      ...formProps.generalInfo,
      ...contriParams,
      documents: formProps.documents,
      leave_credits: formProps.leave_credits,
      basicPays: formProps?.basicPays,
      bankName: formProps?.emp_bank_acc?.name,
      bankAcc: formProps?.emp_bank_acc?.account,
      empPayrollLists: formProps.empPayrollLists,
    };

    const { status } = await PUT(`/employees/${id}`, params);

    if (status === 201) {
      navigate("/admin/employees");
      loadingHoc(false);
      openSuccessModal({
        title: "Success!",
        message: "Your changes has been successfully saved.",
        closeNameBtn: "Ok",
      });
      clearEmployeeForm();
      return fetchAllEmployee();
    } else {
      return loadingHoc(false);
    }
  };

  const childrenRoutes = [
    {
      name: "step-1",
      path: "/step-1",
      element: <GeneralInformation setFormProps={setFormProps} />,
    },
    {
      name: "step-2",
      path: "/step-2",
      element: <Documents setFormProps={setFormProps} />,
    },
    {
      name: "step-3",
      path: "/step-3",
      element: <PayrollDetails setFormProps={setFormProps} />,
    },
    {
      name: "step-4",
      path: "/step-4",
      element:
        employeeView === "manage" ? (
          <Payslip formProps={formProps} setFormProps={setFormProps} />
        ) : (
          <PayslipDetails formProps={formProps} setFormProps={setFormProps} />
        ),
    },
  ];

  return (
    <div className="">
      <CancelButton
        // navigateTo="/admin/employees"
        func={() => {
          navigate("/admin/employees");
          return clearEmployeeForm();
        }}
      />

      <div className="max-h-[88.5vh] w-full rounded-xl bg-white p-5 drop-shadow-xl">
        <div className="md:flex md:justify-between">
          <div className="text-xl font-semibold text-neutralDark">
            {id ? "Manage Employee" : "Register New Employee"}
          </div>
          {id && (
            <div
              className="flex items-center rounded-lg bg-primaryBlue px-6  py-2 text-highlight hover:cursor-pointer"
              onClick={saveCurrentChanges}
            >
              Save Changes
            </div>
          )}
        </div>
        <HorizontalLine />
        <div className="grid grid-cols-1 divide-x md:grid-cols-5 md:gap-2">
          <div class="col-span-1 mb-2 max-h-[88vh] min-h-[88vh] md:mb-0">
            <Stepper {...stepperProps} />
          </div>
          <div class="scrollbar-hidden col-span-4 max-h-[74vh]  min-h-[74vh] overflow-auto  px-6">
            <Routes>
              {childrenRoutes.map((child) => (
                <Route
                  key={child.name}
                  path={child.path}
                  element={child.element}
                />
              ))}
              <Route path="/*" element={<div>page not found</div>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
