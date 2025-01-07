import React, { useState } from "react";
import { shallow } from "zustand/shallow";

// Component
import { CustomInput } from "../../../../components/inputs/CustomInput";
import CustomTextArea from "../../../../components/inputs/CustomTextArea";
import FormModal from "../../../../components/modal/FormModal";

// Zustand Component
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import moment from "moment";

export default function OfficialBusiness(props) {
  const { openModal, setOpenModal, fileRequestAction } = props || {};

  // Global State
  const { openConfirmModal } = alertModalStore((state) => state, shallow);

  // Form Values Object
  const formObject = {
    reason: "",
    date: "",
    start_time: "",
    end_time: "",
  };

  // Local State
  const [formValues, setFormValues] = useState(formObject);
  const [isEmpty, setIsEmpty] = useState(false);

  const clearModal = () => {
    setOpenModal("");
    setFormValues(formObject);
    return setIsEmpty(false);
  };

  const requestBusinessTripAction = async () => {
    const { reason, date, start_time, end_time } = formValues || {};
    if (!reason || !date || !start_time || !end_time) return setIsEmpty(true);

    // Time Format ISO
    const formatDate = moment(date).format("YYYY-MM-DD");
    const isoTimeline = (time) => `${date}T${time}:00.000Z`;

    const paramsValues = {
      ...formValues,
      date: formatDate,
      start_time: isoTimeline(start_time),
      end_time: isoTimeline(end_time),
      status: "pending",
      type: "official_bussiness",
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

  const renderOfficialBusiness = () => {
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
        <div className="grid grid-cols-2 gap-2">
          <CustomInput
            isRequired={true}
            name="start_time"
            type="time"
            label="Start Time"
            value={formValues.start_time}
            onChange={handleOnChange}
            isEmpty={isEmpty}
          />
          <CustomInput
            isRequired={true}
            name="end_time"
            type="time"
            label="End Time"
            value={formValues.end_time}
            onChange={handleOnChange}
            isEmpty={isEmpty}
          />
        </div>
        <CustomTextArea
          isRequired={true}
          name="reason"
          label="Purpose"
          value={formValues.reason}
          onChange={handleOnChange}
          isEmpty={isEmpty}
        />
      </div>
    );
  };

  const modalProps = {
    title: "Official Business",
    body: renderOfficialBusiness(),
    submit: {
      name: "Submit",
      btnFunction: () => requestBusinessTripAction(),
    },
    cancel: {
      name: "Cancel",
      btnFunction: () => clearModal(),
    },
    isOpen: openModal === "officialbusiness",
    maxWidth: "max-w-sm",
  };

  return <FormModal {...modalProps} />;
}
