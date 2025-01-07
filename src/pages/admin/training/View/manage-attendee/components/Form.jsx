import React, { useState } from "react";
import { shallow } from "zustand/shallow";

// Component
import { CustomSelect } from "../../../../../../components/inputs/CustomSelect";
import { CustomMultiSelect } from "../../../../../../components/inputs/CustomMultiSelect";
import CustomTextArea from "../../../../../../components/inputs/CustomTextArea";

// Zustand Compoennt
import { employeeStore } from "../../../../../../utils/zustand/AdminStore/Employee/employeeStore";

export default function Form(props) {
  const {
    tableData,
    formValues,
    setFormValues,
    isEmpty,
    setEmployeeSelected,
    isAdd,
  } = props ?? {};

  // Global State
  const { employee: employeeData } = employeeStore((state) => state, shallow);

  // Reorganized Data Based Data Available
  const sortSelection = (dataList) => {
    const reorganizedEmployeeDataBased = dataList.map((dataListItem) => {
      const checkIfStored = tableData.findIndex((tableItem) => {
        const employeeData = dataListItem;
        const tableEmployeeData = tableItem.emp_id;
        return employeeData?._id === tableEmployeeData?._id;
      });

      if (checkIfStored === -1)
        return {
          label: dataListItem?.fullName,
          value: dataListItem?._id,
        };
    });

    return reorganizedEmployeeDataBased.filter((item) => !!item);
  };

  // Form Input Change Event
  const handleOnChange = (e) => {
    const { value, name } = e.target || {};
    return setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Form Update Action
  const updateAttendeeForm = () => {
    const statusSelection = [
      {
        label: "Ongoing",
        value: "ongoing",
      },
      {
        label: "Passed",
        value: "passed",
      },
      {
        label: "Failed",
        value: "failed",
      },
    ];

    return !isAdd ? (
      <>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="col-span-2">
            <CustomSelect
              name="status"
              label="Status"
              options={statusSelection}
              value={formValues.status}
              onChange={handleOnChange}
            />
          </div>
          <div className="col-span-2">
            <CustomTextArea
              name="remarks"
              type="text"
              label="Remarks"
              value={formValues.remarks}
              onChange={handleOnChange}
            />
          </div>
        </div>
      </>
    ) : null;
  };

  const addAttendeeForm = () => {
    return isAdd ? (
      <div className="grid gap-2 md:grid-cols-2">
        <div className="col-span-2">
          <CustomMultiSelect
            isRequired={true}
            isEmpty={isEmpty}
            defaultValue={formValues.department}
            onChange={(value) => setEmployeeSelected(value)}
            isMulti={true}
            name="department"
            label="Employee"
            placeholder="Select Multiple"
            options={sortSelection(employeeData)}
            closeMenuOnSelect={false}
          />
        </div>
      </div>
    ) : null;
  };

  return (
    <>
      {addAttendeeForm()}
      {updateAttendeeForm()}
    </>
  );
}
