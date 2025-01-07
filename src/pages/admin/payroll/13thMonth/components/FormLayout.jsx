import React from "react";
import { shallow } from "zustand/shallow";
import { CustomSelect } from "../../../../../components/inputs/CustomSelect";
import { alertModalStore } from "../../../../../utils/zustand/AlertModalStore/alertModalStore";
import FormModal from "../../../../../components/modal/FormModal";
import { CustomInput } from "../../../../../components/inputs/CustomInput";
// import FormModal from "../../../../../components/modal/FormModal";
// import { CustomInput } from "../../../../../components/inputs/CustomInput";
// import { alertModalStore } from "../../../../../utils/zustand/AlertModalStore/alertModalStore";
// import { CustomSelect } from "../../../../../components/inputs/CustomSelect";

export const renderLoanForm = () => {
  return (
    <div className="grid grid-cols-2 gap-1">
      <div className="col-span-2">
        <CustomSelect
          onChange={(e) => console.log(e.target.value)}
          value={"value"}
          label="Department"
          options={[
            {
              label: "Select",
              value: "select",
            },
            {
              label: "TEST",
              value: "test",
            },
            {
              label: "TEST 2",
              value: "test2",
            },
          ]}
        />
      </div>

      <div className="col-span-2 text-xs text-neutralGray">DATE RANGE</div>

      <div className="col-span-1">
        <CustomInput type="date" label="From" />
      </div>
      <div className="col-span-1">
        <CustomInput type="date" label="To" />
      </div>
    </div>
  );
};

export default function FormLayout({ openModal, setOpenModal }) {
  const { openSuccessModal, openConfirmModal } = alertModalStore(
    (state) => state,
    shallow,
  );

  const formAction = () => {
    if (openModal === "add") {
      setOpenModal("");
      openSuccessModal({
        title: "Success!",
        message: "Added Successfully!",
        closeNameBtn: "Ok",
      });
    } else {
      openConfirmModal({
        title: "Are you sure?",
        message: "Are you sure you want to update this?",
        confirmNameBtn: "Yes, Update",
        closeNameBtn: "Cancel",
        isOpen: true,
        modalAction: () => {
          setOpenModal("");
          openSuccessModal({
            title: "Success!",
            message: "Your changes has been successfully saved.",
            closeNameBtn: "Ok",
          });
        },
      });
    }
  };

  const modalProps = {
    title: `Generate New 13th Month`,
    body: renderLoanForm(),
    submit: {
      name: openModal === "add" ? "Generate" : "Update",
      btnFunction: () => formAction(),
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
