import React, { useState } from "react";
import { shallow } from "zustand/shallow";
import FormModal from "../../../../../components/modal/FormModal";
import { alertModalStore } from "../../../../../utils/zustand/AlertModalStore/alertModalStore";
import { CustomInput } from "../../../../../components/inputs/CustomInput";
import { POST, PUT } from "../../../../../services/api";
import { loadingStore } from "../../../../../utils/zustand/LoadingStore/loadingStore";
import { payrollPeriodStore } from "../../../../../utils/zustand/AdminStore/HrSetup/payrollPeriod";
import moment from "moment";

export default function AddPayrollPeriod({
  openModal,
  setOpenModal,
  formValuesHandler,
  formValues,
  clearModal,
}) {
  const { openSuccessModal, openConfirmModal } = alertModalStore(
    (state) => state,
    shallow,
  );
  const { loadingHoc } = loadingStore((state) => state, shallow);
  const { fetchAllPayrollPeriod } = payrollPeriodStore(
    (state) => state,
    shallow,
  );
  const [isEmpty, setIsEmpty] = useState(false);

  const { _id } = formValues || {};

  const renderOfficialBusiness = () => {
    return (
      <div className="grid grid-cols-1 gap-3">
        <CustomInput
          type="text"
          label="Name"
          name="name"
          isRequired
          value={formValues.name}
          onChange={formValuesHandler}
          isEmpty={isEmpty}
        />
        <div className="grid grid-cols-2 gap-3">
          <CustomInput
            name="start_day"
            type="date"
            label="Start Day"
            isRequired
            value={
              formValues.start_day
                ? moment(formValues.start_day).format("YYYY-MM-DD")
                : formValues.start_day
            }
            onChange={formValuesHandler}
            isEmpty={isEmpty}
          />
          <CustomInput
            name="end_day"
            type="date"
            label="End Day"
            isRequired
            value={
              formValues.end_day
                ? moment(formValues.end_day).format("YYYY-MM-DD")
                : formValues.end_day
            }
            onChange={formValuesHandler}
            isEmpty={isEmpty}
          />
        </div>
      </div>
    );
  };

  const addApi = async () => {
    loadingHoc(true);
    const { status } = await POST("/payroll-periods", formValues);
    if (status === 201) {
      setIsEmpty(false);
      loadingHoc(false);
      openSuccessModal({
        title: "Success!",
        message: "Added Successfully!",
        closeNameBtn: "Ok",
      });
      clearModal();
      return fetchAllPayrollPeriod();
    } else {
      return loadingHoc(false);
    }
  };

  const updateAPI = async () => {
    loadingHoc(true);
    const { status } = await PUT(`/payroll-periods/${_id}`, formValues);
    if (status === 201) {
      clearModal();
      loadingHoc(false);
      setIsEmpty(false);
      openSuccessModal({
        title: "Success!",
        message: "Your changes has been successfully saved.",
        closeNameBtn: "Ok",
      });
      return fetchAllPayrollPeriod();
    } else return loadingHoc(false);
  };

  const formAction = async () => {
    if (openModal === "add") {
      addApi();
    } else {
      openConfirmModal({
        title: "Are you sure?",
        message: "Are you sure you want to update this?",
        closeNameBtn: "Cancel",
        confirmNameBtn: "Yes, Update",
        modalAction: () => updateAPI(),
      });
    }
  };

  const validateFields = () => {
    const { name, start_day, end_day } = formValues || {};
    if (!name || !start_day || !end_day) {
      setIsEmpty(true);
    } else return formAction();
  };

  const modalProps = {
    title: `${openModal === "add" ? "Add" : "Update"} Payroll Period`,
    body: renderOfficialBusiness(),
    submit: {
      name: openModal === "add" ? "Add" : "Update",
      btnFunction: () => validateFields(),
    },
    cancel: {
      name: "Cancel",
      btnFunction: () => {
        setIsEmpty(false);
        clearModal();
      },
    },
    isOpen: openModal === "add" || openModal === "update",
    maxWidth: "max-w-lg",
  };

  return <FormModal {...modalProps} />;
}
