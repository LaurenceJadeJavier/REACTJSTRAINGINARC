import React, { useState } from "react";
import { shallow } from "zustand/shallow";

// Component
import { CustomInput } from "../../../../components/inputs/CustomInput";
import { CustomSelect } from "../../../../components/inputs/CustomSelect";
import CustomTextArea from "../../../../components/inputs/CustomTextArea";
import FormModal from "../../../../components/modal/FormModal";

// Zustand Component
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { authStore } from "../../../../utils/zustand/AuthStore/authStore";
import moment from "moment";

export default function FailuretoLog(props) {
  const { openModal, setOpenModal, fileRequestAction } = props || {};

  // Global State
  const { openConfirmModal } = alertModalStore((state) => state, shallow);

  // Form Values Object
  const formObject = {
    date: "",
    time: "",
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

  const requestFailureToLogAction = async () => {
    const { date, time, failureLog_type, reason } = formValues || {};
    setIsEmpty(false);

    if (!time || !date || !failureLog_type || !reason) return setIsEmpty(true);

    const formatDate = moment(date).format("YYYY-MM-DD");
    const isoTimeline = `${date}T${time}:00.000Z`;
    const isTimeInAssigned = failureLog_type === "time_in";

    const paramsValues = {
      ...formValues,
      status: "pending",
      type: "failure_to_log",
      date: formatDate,
      start_time: isTimeInAssigned ? isoTimeline : "",
      end_time: !isTimeInAssigned ? isoTimeline : "",
    };

    return openConfirmModal({
      title: "Are you sure?",
      message: "Are you sure you want to file this?",
      closeNameBtn: "Cancel",
      confirmNameBtn: "Yes, File",
      modalAction: () => fileRequestAction(paramsValues, clearModal),
    });
  };

  // Input On Change Action
  const handleOnChange = (e) => {
    const { name, value } = e.target || {};
    return setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const renderFailuretoLog = () => {
    // Time Shift Selection
    const timeShiftSelection = [
      {
        label: "Time In",
        value: "time_in",
      },
      {
        label: "Time Out",
        value: "time_out",
      },
    ];

    return (
      <div className="grid grid-cols-1 gap-3">
        <CustomInput
          isRequired={true}
          name="date"
          type="date"
          label="Date"
          value={formValues.date}
          onChange={handleOnChange}
          isEmpty={isEmpty}
        />
        <CustomInput
          isRequired={true}
          name="time"
          type="time"
          label="Start Time"
          value={formValues.time}
          onChange={handleOnChange}
          isEmpty={isEmpty}
        />
        <CustomSelect
          isRequired={true}
          placeholder={"Select Type"}
          name="failureLog_type"
          label="Type"
          value={formValues.failureLog_type}
          onChange={handleOnChange}
          options={timeShiftSelection}
          isEmpty={isEmpty}
        />
        <CustomTextArea
          isRequired={true}
          name="reason"
          label="Reason"
          value={formValues.reason}
          onChange={handleOnChange}
          isEmpty={isEmpty}
        />
      </div>
    );
  };

  const modalProps = {
    title: "Failure to Log",
    body: renderFailuretoLog(),
    submit: {
      name: "Submit",
      btnFunction: () => requestFailureToLogAction(),
    },
    cancel: {
      name: "Cancel",
      btnFunction: () => clearModal(),
    },
    isOpen: openModal === "failuretolog",
    maxWidth: "max-w-sm",
  };

  return <FormModal {...modalProps} />;
}
