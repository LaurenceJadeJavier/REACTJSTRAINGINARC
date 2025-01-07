import React from "react";
import { shallow } from "zustand/shallow";
import FormModal from "../../../../../components/modal/FormModal";
import { CustomInput } from "../../../../../components/inputs/CustomInput";
import { alertModalStore } from "../../../../../utils/zustand/AlertModalStore/alertModalStore";
import { CustomSelect } from "../../../../../components/inputs/CustomSelect";
import { employeeStore } from "../../../../../utils/zustand/AdminStore/Employee/employeeStore";

export const renderLoanForm = (formValues, setFormValues) => {
  const { employee } = employeeStore((state) => state, shallow);

  const sortSelection = () => {
    const setSelectionDataAction = (item) => {
      const { fullName, _id } = item || {};
      return { label: fullName, value: _id };
    };

    return (employee ?? []).map(setSelectionDataAction);
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <CustomSelect
          onChange={(e) =>
            setFormValues({ ...formValues, emp_id: e.target.value })
          }
          value={formValues?.emp_id}
          label="Employee"
          options={sortSelection()}
        />
      </div>
      <div className="col-span-2">
        <CustomInput
          type="text"
          label="Reason"
          onChange={(e) =>
            setFormValues({ ...formValues, reason: e.target.value })
          }
          value={formValues?.reason}
        />
      </div>
      <div className="mr-2">
        <CustomInput
          type="number"
          label="Loan Amount"
          onChange={(e) =>
            setFormValues({ ...formValues, amount: e.target.value })
          }
          value={formValues?.amount}
        />
      </div>
      <div className="ml-2">
        <CustomInput
          type="date"
          label="Disbursement Date"
          onChange={(e) =>
            setFormValues({ ...formValues, date: e.target.value })
          }
          value={formValues?.date}
        />
      </div>
      <div className="mr-2">
        <CustomInput
          type="number"
          label="Installment Amount"
          onChange={(e) =>
            setFormValues({ ...formValues, installment_amount: e.target.value })
          }
          value={formValues?.installment_amount}
        />
      </div>
      <div className="ml-2">
        <CustomInput
          type="text"
          label="Installment No."
          onChange={(e) =>
            setFormValues({ ...formValues, installment_no: e.target.value })
          }
          value={formValues?.installment_no}
        />
      </div>
      <div className="col-span-2">
        <CustomSelect
          onChange={(e) =>
            setFormValues({
              ...formValues,
              payroll_period_id: e.target.value,
            })
          }
          value={formValues?.payroll_period_id}
          label="Payroll Period Applied"
          options={[
            {
              label: "For Test Data",
              value: "64f534e432bfdbb73d70fc8e",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default function AddUpdateLoan({
  openModal,
  setOpenModal,
  formValues,
  setFormValues,
  formAction,
}) {
  const { openConfirmModal } = alertModalStore((state) => state, shallow);

  const onSubmit = () => {
    if (openModal === "add") {
      formAction();
    } else {
      openConfirmModal({
        title: "Are you sure?",
        message: "Are you sure you want to update this?",
        confirmNameBtn: "Yes, Update",
        closeNameBtn: "Cancel",
        isOpen: true,
        modalAction: () => formAction(),
      });
    }
  };

  const modalProps = {
    title: `${openModal === "add" ? "Apply New" : "Update"} Loan`,
    body: renderLoanForm(formValues, setFormValues),
    submit: {
      name: openModal === "add" ? "Apply" : "Update",
      btnFunction: () => onSubmit(),
    },
    cancel: {
      name: "Cancel",
      btnFunction: () => setOpenModal(""),
    },
    isOpen: openModal === "add" || openModal === "update",
    maxWidth: "max-w-xl",
  };

  return <FormModal {...modalProps} />;
}
