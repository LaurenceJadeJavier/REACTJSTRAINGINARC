import React from "react";
import { CustomInput } from "../../../../../components/inputs/CustomInput";
import CustomTextArea from "../../../../../components/inputs/CustomTextArea";

export default function Form(props) {
  const { setFormValues, formValues, isEmpty } = props ?? {};

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <div className="grid grid-cols-1 gap-2">
      <CustomInput
        label="Name"
        type="text"
        name="name"
        isRequired={true}
        value={formValues.name}
        onChange={handleChange}
        isEmpty={isEmpty}
      />
      <CustomTextArea
        label="Description"
        name="description"
        isRequired={true}
        value={formValues.description}
        onChange={handleChange}
        isEmpty={isEmpty}
      />
    </div>
  );
}
