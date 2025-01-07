import React from "react";
import { shallow } from "zustand/shallow";

import CustomTextArea from "../../../../../components/inputs/CustomTextArea";
import FormModal from "../../../../../components/modal/FormModal";

import { alertModalStore } from "../../../../../utils/zustand/AlertModalStore/alertModalStore";
import { CustomSelect } from "../../../../../components/inputs/CustomSelect";

export const renderUpdateStatus = (formValues, setFormValues) => {
  const { status, remarks } = formValues || {};
  return (
    <div className="grid grid-cols-1 gap-3">
      <CustomSelect
        onChange={(e) =>
          setFormValues((prev) => ({ ...prev, status: e.target.value }))
        }
        value={status}
        label="Status"
        options={[
          {
            label: "Select Status",
            value: "select",
          },
          {
            label: "Pending",
            value: "pending",
          },
          {
            label: "Approved",
            value: "approved",
          },
          {
            label: "Declined",
            value: "declined",
          },
        ]}
      />
      <CustomTextArea
        label="Remarks"
        value={remarks}
        onChange={(e) =>
          setFormValues((prev) => ({ ...prev, remarks: e.target.value }))
        }
      />
    </div>
  );
};

export default function UpdateStatus({
  openModal,
  setOpenModal,
  formValues,
  setFormValues,
  submitApi,
}) {
  const { openConfirmModal } = alertModalStore((state) => state, shallow);

  const modalProps = {
    title: "Update Status",
    body: renderUpdateStatus(formValues, setFormValues),
    submit: {
      name: "Update",
      btnFunction: () => {
        openConfirmModal({
          title: "Are you sure?",
          message: "Are you sure you want to update this?",
          closeNameBtn: "Cancel",
          confirmNameBtn: "Yes, Update",
          modalAction: () => submitApi(),
        });
      },
    },
    cancel: {
      name: "Cancel",
      btnFunction: () => setOpenModal(""),
    },
    isOpen: openModal === "updatestatus",
    maxWidth: "max-w-md",
  };

  return <FormModal {...modalProps} />;
}
