import React from "react";

import FormModal from "../../../../components/modal/FormModal";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import {
  ISOTimeToUTC,
  ISOUTCtoTime,
} from "../../../../utils/ISOTimeConverter/ISOTimeConverter";
import moment from "moment";

export default function UpdateTimesheet({
  openModal,
  setOpenModal,
  action,
  formValues,
  setFormValues,
}) {
  const { time_in, time_out, date } = formValues || {};

  const onHandleChange = ({ target }) => {
    const { name, value } = target ?? {};

    //set and convert  eg. 2023-10-02T00:38:46.018Z format
    setFormValues((prev) => ({ ...prev, [name]: ISOTimeToUTC(value) }));
  };

  const renderUpdateTimeSheet = () => {
    return (
      <div className="grid grid-cols-2 gap-2">
        <CustomInput
          value={ISOUTCtoTime(time_in)} //convert value to hh:mm format
          name="time_in"
          onChange={onHandleChange}
          type="time"
          label="Time In"
        />
        <CustomInput
          value={ISOUTCtoTime(time_out)} //convert value to hh:mm format
          name="time_out"
          onChange={onHandleChange}
          type="time"
          label="Time Out"
        />
      </div>
    );
  };

  const modalProps = {
    title: `Update ${moment(date)?.format("MMMM DD, YYYY")}`, //convert eq. October 02, 2023
    body: renderUpdateTimeSheet(),
    submit: {
      name: "Update",
      btnFunction: () => action(), //function of modal after submitted
    },
    cancel: {
      name: "Cancel",
      btnFunction: () => setOpenModal(""),
    },
    isOpen: openModal === "updatetimesheet",
    maxWidth: "max-w-lg", //width of pop modal
  };

  return <FormModal {...modalProps} />;
}
