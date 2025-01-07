import React from "react";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import CustomTextArea from "../../../../components/inputs/CustomTextArea";
import { CustomSelect } from "../../../../components/inputs/CustomSelect";
import { shallow } from "zustand/shallow";
import { departmentStore } from "../../../../utils/zustand/AdminStore/HrSetup/departmentStore";

export default function Form(props) {
  const { formValues, setFormValues, isEmpty, openForm } = props || {};
  const isUpdate = openForm.action === "Update";

  // Global State
  const { department: departmentData } = departmentStore(
    (state) => state,
    shallow,
  );

  // Sort Selection Action
  const sortSelection = (dataList) => {
    const setSelectionDataAction = (item) => {
      const { name, _id } = item || {};
      return { label: name, value: _id };
    };

    return (dataList ?? []).map(setSelectionDataAction);
  };

  // Set Input Data
  const handleOnChange = (e) => {
    const { name, value } = e.target || {};
    return setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="col-span-2">
          <CustomInput
            name="title"
            type="text"
            label="Title"
            value={formValues.title}
            isEmpty={isEmpty}
            isRequired={true}
            onChange={handleOnChange}
          />
        </div>
        <div className="col-span-2">
          <CustomTextArea
            name="description"
            type="text"
            label="Description"
            value={formValues.description}
            isEmpty={isEmpty}
            isRequired={true}
            onChange={handleOnChange}
          />
        </div>
        <div className="col-span-2">
          <CustomInput
            name="trainer"
            type="text"
            label="Trainer"
            value={formValues.trainer}
            isEmpty={isEmpty}
            isRequired={true}
            onChange={handleOnChange}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <CustomSelect
            name="dept_id"
            label="Department"
            defaultValue={isUpdate ? formValues.dept_id : null}
            isEmpty={isEmpty}
            isRequired={true}
            onChange={handleOnChange}
            options={sortSelection(departmentData)}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <CustomInput
            name="total_costs"
            type="number"
            label="Training Cost"
            value={formValues.total_costs}
            isEmpty={isEmpty}
            isRequired={true}
            onChange={handleOnChange}
          />
        </div>
        <div className="col-span-2">
          <div className="text-base font-medium">Training Period</div>
          <div className="text-xs text-neutralGray">
            Specify the duration for the training period
          </div>
        </div>
        <div className="col-span-2 md:col-span-1">
          <CustomInput
            name="start_date"
            type="date"
            label="Start Date"
            value={formValues.start_date}
            isEmpty={isEmpty}
            isRequired={true}
            onChange={handleOnChange}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <CustomInput
            name="end_date"
            type="date"
            label="End Date"
            value={formValues.end_date}
            isEmpty={isEmpty}
            isRequired={true}
            onChange={handleOnChange}
          />
        </div>
      </div>
    </>
  );
}
