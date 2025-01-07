import React, { useState } from "react";
import { shallow } from "zustand/shallow";

// Component
import { CustomSelect } from "../../../../components/inputs/CustomSelect";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import CustomTextArea from "../../../../components/inputs/CustomTextArea";
import FormModal from "../../../../components/modal/FormModal";

// Zustand Component
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { leaveTypeStore } from "../../../../utils/zustand/AdminStore/HrSetup/leaveTypeStore";
export default function RequestLeave(props) {
  const { openModal, setOpenModal, fileRequestAction } = props || {};

  // Global State
  const { openConfirmModal } = alertModalStore((state) => state, shallow);
  const { leaveType } = leaveTypeStore((state) => state, shallow);

  // Form Values Object
  const formObject = {
    // leaveType_id: "",
    date: "",
    // isHalfday: "",
    reason: "",
  };

  // Local State
  const [formValues, setFormValues] = useState(formObject);
  const [isEmpty, setIsEmpty] = useState(false);

  const clearModal = () => {
    setOpenModal("");
    setFormValues(formObject);
    return setIsEmpty(false);
  };

  const requestLeaveAction = async () => {
    const { leaveType_id, date, isHalfday, reason } = formValues || {};
    setIsEmpty(false);

    if (!leaveType_id || !date || !isHalfday || !reason)
      return setIsEmpty(true);

    const paramsValues = {
      ...formValues,
      type: "leave",
    };

    return openConfirmModal({
      title: "Are you sure?",
      message: "Are you sure you want to file this?",
      closeNameBtn: "Cancel",
      confirmNameBtn: "Yes, File",
      modalAction: () => fileRequestAction(paramsValues, clearModal),
    });
  };

  // Half Day Selection
  const isHalfDaySelection = [
    {
      label: "Yes",
      value: "true",
    },
    {
      label: "No",
      value: "false",
    },
  ];

  // Reassigned Type Selection Data Logic
  const reassignSelectionData = (selectionData) => {
    const setSelectionData = (item, index) => ({
      key: index,
      value: item._id,
      label: item.name,
    });

    return selectionData.map(setSelectionData);
  };

  // Input On Change Action
  const handleOnChange = (e) => {
    const { name, value } = e.target || {};
    return setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Form Display
  const renderRequestLeave = () => {
    return (
      <div className="grid grid-cols-1 gap-3">
        <CustomInput
          isRequired={true}
          value={formValues.date}
          name="date"
          type="date"
          label="Date"
          isEmpty={isEmpty}
          onChange={handleOnChange}
        />
        <CustomSelect
          placeholder={"Select Type"}
          isRequired={true}
          value={formValues.leaveType_id}
          name="leaveType_id"
          label="Type"
          isEmpty={isEmpty}
          onChange={handleOnChange}
          options={reassignSelectionData(leaveType)}
        />
        <CustomSelect
          placeholder={"Select"}
          isRequired={true}
          value={formValues.isHalfday}
          name="isHalfday"
          label="Half Day"
          isEmpty={isEmpty}
          onChange={handleOnChange}
          options={isHalfDaySelection}
        />
        <CustomTextArea
          isRequired={true}
          value={formValues.reason}
          name="reason"
          label="Reason"
          isEmpty={isEmpty}
          onChange={handleOnChange}
        />
      </div>
    );
  };

  // Modal Config
  const modalProps = {
    title: "Request Leave",
    body: renderRequestLeave(),
    submit: {
      name: "Submit",
      btnFunction: () => requestLeaveAction(),
    },
    cancel: {
      name: "Cancel",
      btnFunction: () => clearModal(),
    },
    isOpen: openModal === "requestleave",
    maxWidth: "max-w-sm",
  };

  return <FormModal {...modalProps} />;
}
