import React from "react";
import { CustomMultiSelect } from "../../../../../../components/inputs/CustomMultiSelect";
import { CustomSelect } from "../../../../../../components/inputs/CustomSelect";
import CustomTextArea from "../../../../../../components/inputs/CustomTextArea";

export default function Form(props) {
  const { formValues, setFormValues, isAdd } = props ?? {};

  return (
    <>
      <div className="">
        <CustomSelect
          value={"value"}
          label="Remarks"
          options={[
            {
              value: "Interviewing",
              label: "Interviewing",
            },
            {
              value: "On Hold",
              label: "On Hold",
            },
            {
              value: "Short Listed",
              label: "Short Listed",
            },
            {
              value: "On Hold",
              label: "On Hold",
            },
            {
              value: "On Hold",
              label: "On Hold",
            },
          ]}
        />
      </div>
      <div>
        <CustomTextArea label="Remarks" />
      </div>
    </>
  );
}
