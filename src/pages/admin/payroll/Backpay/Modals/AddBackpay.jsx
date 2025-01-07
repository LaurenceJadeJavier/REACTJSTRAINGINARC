import React from "react";
import { shallow } from "zustand/shallow";
import FormModal from "../../../../../components/modal/FormModal";
import { CustomSelect } from "../../../../../components/inputs/CustomSelect";
import { CustomInput } from "../../../../../components/inputs/CustomInput";
import { alertModalStore } from "../../../../../utils/zustand/AlertModalStore/alertModalStore";

export const renderBackpayForm = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="mr-1">
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
      <div className="ml-1">
        <CustomSelect
          onChange={(e) => console.log(e.target.value)}
          value={"value"}
          label="Designation"
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
      <div className="col-span-2">
        <CustomSelect
          onChange={(e) => console.log(e.target.value)}
          value={"value"}
          label="Employee"
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
      <span className="col-span-2 my-2 text-xs font-medium text-neutralGray">
        DATE RANGE
      </span>
      <div className="mr-1">
        <CustomInput type="date" label="From" />
      </div>
      <div className="ml-1">
        <CustomInput type="date" label="To" />
      </div>
    </div>
  );
};

export default function AddNewBackpay({ openModal, setOpenModal }) {
  const { openSuccessModal } = alertModalStore((state) => state, shallow);

  const modalProps = {
    title: "Add New Backpay",
    body: renderBackpayForm(),
    submit: {
      name: "Add",
      btnFunction: () => {
        setOpenModal("");
        openSuccessModal({
          title: "Success!",
          message: "Added Successfully!",
          closeNameBtn: "Ok",
        });
      },
    },
    cancel: {
      name: "Cancel",
      btnFunction: () => setOpenModal(""),
    },
    isOpen: openModal === "add",
    maxWidth: "max-w-xl",
  };

  return <FormModal {...modalProps} />;
}
