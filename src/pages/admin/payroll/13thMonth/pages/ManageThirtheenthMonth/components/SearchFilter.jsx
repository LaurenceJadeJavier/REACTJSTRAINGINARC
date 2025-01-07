import React, { useState } from "react";
import * as Io5icons from "react-icons/io5";
import { RadioGroup } from "@headlessui/react";
import { shallow } from "zustand/shallow";

// Component
import DebouncedInput from "../../../../../../../components/debounce/DebouncedInput";
import { alertModalStore } from "../../../../../../../utils/zustand/AlertModalStore/alertModalStore";
import FormModal from "../../../../../../../components/modal/FormModal";
import { CustomSelect } from "../../../../../../../components/inputs/CustomSelect";

export default function EmployeeList(props) {
  const { employeeData, setEmployeeData, selectedDept } = props || {};
  const { department, employee } = selectedDept || {};

  // Global State
  const { openConfirmModal, openSuccessModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);

  // Local State
  const [openForm, setOpenForm] = useState({});
  const [employeeList, setEmployeeList] = useState(employee ?? []);

  // Employee List Modal Form
  const employeeListTypeForm = () => {
    const isAdd = openForm.action === "Add";

    // Clear Modal Value Action
    const clearModal = () => {
      setOpenForm({});
    };

    const body = () => {
      return (
        <>
          <CustomSelect
            placeholder="Please Select Empoyee"
            label="Employee"
            options={[
              {
                label: "Melany Charos",
                value: "Melany Charos",
              },
              {
                label: "Hunty Distro",
                value: "Hunty Distro",
              },
            ]}
          />
        </>
      );
    };

    const submitFunc = () => {
      if (isAdd) {
        openSuccessModal();
        clearModal();
      } else {
        openConfirmModal({
          modalAction: () => {
            openSuccessModal({
              title: "Success!",
              message: "Your changes has been successfully saved.",
              closeNameBtn: "Ok",
            });
            clearModal();
          },
        });
      }
    };

    const modalProps = {
      title: isAdd ? "Add Employee" : "Update Employee",
      body: body(),
      submit: {
        name: isAdd ? "Add" : "Update",
        btnFunction: () => submitFunc(),
      },
      cancel: {
        name: "Cancel",
        btnFunction: () => clearModal(),
      },
      isOpen: openForm.isOpen,
      maxWidth: "max-w-lg",
    };

    return <FormModal {...modalProps} />;
  };

  // Employee Payroll Title View
  const employeeTitleCard = () => {
    return (
      <div className="text-sm font-medium text-primaryBlue">
        {department ?? null} ({employee?.length ?? 0})
      </div>
    );
  };

  // Employee Payroll Search View
  const employeeSearchSelection = () => {
    const onSearchEmployeeChange = (e) => {
      const value = e?.target?.value;
      if (!value) return setEmployeeList(employee);

      const filteredEmployeeData = employeeList.filter(
        (item) =>
          item.employee.toLowerCase().includes(value.toLowerCase()) ||
          item.employeeId.toLowerCase().includes(value.toLowerCase()),
      );

      return setEmployeeList(filteredEmployeeData);
    };

    return (
      <div className="flex flex-row gap-2">
        <div className="flex flex-row items-center justify-between rounded-lg border border-primaryBlue p-2">
          <div>
            <DebouncedInput
              type="text"
              placeholder="Search"
              className="w-full px-2"
              onChange={onSearchEmployeeChange}
            />
          </div>
          <div>
            <Io5icons.IoSearchOutline className="text-blue-300" />
          </div>
        </div>
        <div>
          <button
            className="btn rounded-2xl bg-primaryBlue"
            onClick={() => setOpenForm({ isOpen: true, action: "Add" })}
          >
            <Io5icons.IoAdd className="text-xl text-white" />{" "}
          </button>
        </div>
      </div>
    );
  };

  // Employee Payroll Selection View
  const employeeSelectionCard = () => {
    const employeeCardList = (item, index) => {
      const { employeeId, employee, img } = item || {};
      return (
        <RadioGroup.Option value={item} key={index}>
          {({ checked }) => {
            const isSelected = checked ? "bg-blue-50 border-blue-200" : "";
            return (
              <div>
                <div
                  className={`my-1.5 flex cursor-pointer flex-row items-center justify-between rounded-lg border border-gray-100 px-2 py-3 ${isSelected}`}
                >
                  <div>
                    <div className="flex items-center">
                      <img
                        src={img}
                        alt={employee}
                        className="mx-2 h-10 w-10 rounded-full border   border-neutralDark p-1"
                      />
                      <div className="flex flex-col">
                        <span className="text-base font-normal">
                          {employee}
                        </span>
                        <span className="text-xs font-light text-neutralGray">
                          {employeeId}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      openDeleteModal({
                        title: "Confirm Remove",
                        message: `Are you sure you want to remove "${employee}" from the list`,
                        modalAction: () =>
                          openSuccessModal({
                            title: "Success!",
                            message: "Deleted Successfully!",
                            closeNameBtn: "Ok",
                          }),
                      });
                    }}
                  >
                    <Io5icons.IoCloseOutline className="text-md rounded-full text-neutralGray hover:bg-red-400 hover:text-white" />
                  </div>
                </div>
              </div>
            );
          }}
        </RadioGroup.Option>
      );
    };

    return (
      <div>
        <RadioGroup value={employeeData} onChange={setEmployeeData}>
          {employeeList.map(employeeCardList)}
        </RadioGroup>
      </div>
    );
  };

  return (
    <div className="card h-[100vh] basis-1/2">
      <div className="flex flex-col gap-2 overflow-auto">
        {employeeTitleCard()}
        {employeeSearchSelection()}
        {employeeSelectionCard()}
        {employeeListTypeForm()}
      </div>
    </div>
  );
}
