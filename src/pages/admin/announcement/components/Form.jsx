import React, { useState } from "react";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import CustomTextArea from "../../../../components/inputs/CustomTextArea";
import { CustomMultiSelect } from "../../../../components/inputs/CustomMultiSelect";
import { departmentStore } from "../../../../utils/zustand/AdminStore/HrSetup/departmentStore";
import { shallow } from "zustand/shallow";

export default function Form(props) {
  const { formValues, setFormValues, isEmpty } = props ?? {};
  const { department } = departmentStore((state) => state, shallow);

  const radioBtnList = [
    { id: "all", label: "All" },
    {
      id: "departments",
      label: "Select Department",
    },
    { id: "roles", label: "Select Role" },
    { id: "employees", label: "Select Employee" },
  ];

  const departmentList = department.map(({ name, _id }) => ({
    label: name,
    value: _id,
  }));

  const onHandleChange = (e) => {
    const { name, value } = e.target ?? {};
    return setFormValues({ ...formValues, [name]: value });
  };

  const additionalfield = () => {
    return (
      <div className="col-span-2 grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <CustomInput
            type="text"
            label="Title"
            name="title"
            isRequired
            isEmpty={isEmpty}
            value={formValues.title}
            onChange={onHandleChange}
          />
        </div>
        <div>
          <CustomInput
            type="date"
            label="Date"
            name="day"
            isRequired
            isEmpty={isEmpty}
            value={formValues.day}
            onChange={onHandleChange}
          />
        </div>
        <div>
          <CustomInput
            type="time"
            label="Time"
            name="time"
            isRequired
            isEmpty={isEmpty}
            value={formValues.time}
            onChange={onHandleChange}
          />
        </div>
        <div className="col-span-2">
          <CustomTextArea
            label="Details"
            name="details"
            isRequired
            isEmpty={isEmpty}
            value={formValues.details}
            onChange={onHandleChange}
          />
        </div>
      </div>
    );
  };

  const selectedLayout = () => {
    switch (formValues?.to) {
      case "departments":
        return (
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <CustomMultiSelect
                // defaultValue={formValues.dept_list}
                isMulti={true}
                name="department"
                label="Department"
                isRequired
                isEmpty={isEmpty}
                placeholder="Select Multiple"
                options={departmentList ?? []}
                value={formValues.dept_list}
                onChange={(e) => setFormValues({ ...formValues, dept_list: e })}
                closeMenuOnSelect={false}
              />
            </div>
            {additionalfield()}
          </div>
        );
      case "roles":
        return <div>Select Role</div>;
      case "employees":
        return <div>Select Employee</div>;
      default:
        return additionalfield();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-4">
        {radioBtnList?.map(({ id, label }, index) => (
          <div className="form-control " key={id}>
            <label className="label cursor-pointer gap-1 ">
              <input
                type="radio"
                name="to"
                // key={label}
                className="radio radio-sm checked:bg-stateGreen "
                // onChange={(e) =>
                //   setFormValues({ ...formValues, to: e.target.checked })
                // }
                onClick={() => setFormValues({ ...formValues, to: id })}
                // value={formValues.to === id}
                // value={formValues.to}
                checked={formValues.to === id}
              />
              <span className="label-text">{label}</span>
            </label>
          </div>
        ))}
      </div>
      <div className="flex flex-col">{selectedLayout()}</div>
    </div>
  );
}
