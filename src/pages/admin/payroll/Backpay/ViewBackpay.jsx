import React, { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { shallow } from "zustand/shallow";

import * as Io5icons from "react-icons/io5";

import BackButton from "../../../../components/buttons/back-button/BackButton";
import testprofileimage from "../../../../assets/testimages/employeeprofiletest.png";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";

export default function ViewBackpay() {
  const { openSuccessModal, openConfirmModal } = alertModalStore(
    (state) => state,
    shallow,
  );

  const [selectedStatus, SetSelectedStatus] = useState("");

  const formAction = () => {
    return openConfirmModal({
      title: "Are you sure?",
      message: "Are you sure you want to update the status of this payroll?",
      confirmNameBtn: "Yes, Update",
      closeNameBtn: "Cancel",
      isOpen: true,
      modalAction: () => {
        openSuccessModal({
          title: "Success!",
          message: "Your changes has been successfully saved.",
          closeNameBtn: "Ok",
        });
      },
    });
  };

  const renderContainer = () => {
    let textstatuscolor = "";
    let bgstatuscolor = "";

    // status color
    if (selectedStatus === "Void") {
      textstatuscolor = "text-darkGray";
      bgstatuscolor = "bg-lightBlue";
    } else if (selectedStatus === "For Approval") {
      textstatuscolor = "text-[#9747FF]";
      bgstatuscolor = "bg-[#F3EEF9]";
    } else if (selectedStatus === "Approve") {
      textstatuscolor = "text-stateGreen";
      bgstatuscolor = "bg-lightGreen";
    } else if (selectedStatus === "Declined") {
      textstatuscolor = "text-stateRed";
      bgstatuscolor = "bg-lightRed";
    } else {
      textstatuscolor = "text-stateOrange";
      bgstatuscolor = "bg-lightOrange";
    }

    const renderHeader = (
      <div className="flex flex-col gap-2">
        <span className="text-lg font-medium text-neutralDark">
          Juan S. Dela Cruz Jr.’s Backpay
        </span>
        <div className="flex flex-row items-center gap-2">
          <span className="text-sm font-normal text-neutralGray">
            Backpay Period
          </span>
          <span className="text-sm font-normal text-neutralGray">:</span>
          <span className="text-sm font-normal text-neutralDark">
            Aug 2023 - Sep 2024
          </span>
        </div>
      </div>
    );

    const statusButtonUI = () => {
      const typeofStatus = [
        {
          title: "In Review",
          value: "inreview",
        },
        {
          title: "For Approval",
          value: "forapproval",
        },
        {
          title: "Approve",
          value: "approve",
        },
        {
          title: "Declined",
          value: "declined",
        },
        {
          title: "Void",
          value: "void",
        },
      ];

      return (
        <div className="">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button
                className={`${textstatuscolor} ${bgstatuscolor} inline-flex w-full justify-center rounded-xl px-4 py-2 text-sm font-normal hover:bg-opacity-40`}
              >
                {selectedStatus || "In Review"}
                <Io5icons.IoCaretDownOutline
                  className={`${textstatuscolor} -mr-1 ml-2 h-5 w-5`}
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  {typeofStatus.map(({ title, value }) => (
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => SetSelectedStatus(title)}
                          className={`${
                            active
                              ? "bg-primaryBlue text-white"
                              : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          {title}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      );
    };

    const renderProfile = (
      <div className="mt-8 flex flex-row gap-4">
        <div className="rounded-full border border-neutralDark p-[3px]">
          <img className="h-16 w-16" src={testprofileimage} alt="employeeimg" />
        </div>
        <div className="flex flex-col justify-evenly">
          <span className="text-base font-normal text-neutralDark">
            Juan S. Dela Cruz Jr.
          </span>
          <span className="text-base font-normal text-neutralBlack">
            123-456-78
          </span>
          <span className="text-base font-normal text-neutralBlack">
            Department - Designation
          </span>
        </div>
      </div>
    );

    const renderBodyContainer = () => {
      const tables = [
        {
          title: "salary",
          sampleData: [
            {
              name: "absent",
              amount: "2000",
            },
            {
              name: "Late Deductions",
              amount: "100",
            },
            {
              name: "Undertime Deduction",
              amount: "200",
            },
            {
              name: "Overtime Income",
              amount: "0",
            },
          ],
        },
        {
          title: "total taxable allowance",
          sampleData: [
            {
              name: "Travel Allowance",
              amount: "500",
            },
            {
              name: "Fuel Allowance",
              amount: "100",
            },
          ],
        },
        {
          title: "total deduction",
          sampleData: [
            {
              name: "Loan",
              amount: "500",
            },
            {
              name: "Sample Deduction",
              amount: "100",
            },
          ],
        },
        {
          title: "contributions",
          sampleData: [
            {
              name: "SSS",
              amount: "500",
            },
            {
              name: "GSIS",
              amount: "100",
            },
            {
              name: "HMDF",
              amount: "100",
            },
            {
              name: "PhilHealth",
              amount: "100",
            },
          ],
        },
      ];

      return tables.map(({ title, sampleData }) => (
        <div className="mb-8">
          <div className="mb-4 bg-highlight px-4 py-1">
            <span className="text-sm font-medium uppercase text-neutralDark">
              {title}
            </span>
          </div>
          <div className="grid grid-cols-12 items-center px-6">
            <div className="col-span-5 text-start text-xs font-medium uppercase text-neutralGray">
              name
            </div>
            <div className="col-span-3 text-start text-xs font-medium uppercase text-neutralGray">
              amount
            </div>
            <div className="col-span-4 text-end text-xs font-medium uppercase text-neutralGray">
              remove
            </div>
          </div>
          {sampleData.map(({ name, amount }) => (
            <div className="mt-4 grid grid-cols-12 items-center px-6">
              <span className="col-span-5 text-base font-normal capitalize text-neutralDark">
                {name}
              </span>
              <div className="group relative col-span-3 mt-1 flex w-fit flex-col border-b">
                <input
                  type="number"
                  className="peer w-full bg-transparent px-2 outline-none"
                  value={amount}
                  autoComplete="off"
                />
              </div>
              <div className="col-span-4 flex justify-end pr-4">
                <Io5icons.IoCloseCircleOutline className="cursor-pointer text-stateRed" />
              </div>
            </div>
          ))}
          <div className="mt-4 flex flex-row items-center gap-1 px-6">
            <Io5icons.IoAddOutline className="cursor-pointer text-primaryBlue" />
            <span className="cursor-pointer text-primaryBlue">Add</span>
          </div>
        </div>
      ));
    };

    const renderTotalNonTaxableAllowance = () => {
      const sampleData = [
        {
          name: "rice allowance",
          amount: "500",
        },
        {
          name: "clothing allowance",
          amount: "500",
        },
      ];

      return (
        <div className="mb-8">
          <div className="mb-4 bg-highlight px-4 py-1">
            <span className="text-sm font-medium uppercase text-neutralDark">
              TOTAL NON TAXABLE ALLOWANCE
            </span>
          </div>
          <div className="grid grid-cols-12 items-center px-6">
            <div className="col-span-5 text-start text-xs font-medium uppercase text-neutralGray">
              name
            </div>
            <div className="col-span-3 text-start text-xs font-medium uppercase text-neutralGray">
              amount
            </div>
            <div className="col-span-4 text-end text-xs font-medium uppercase text-neutralGray">
              remove
            </div>
          </div>
          {sampleData.map(({ name, amount }) => (
            <div className="mt-4 grid grid-cols-12 items-center px-6">
              <span className="col-span-5 text-base font-normal capitalize text-neutralDark">
                {name}
              </span>
              <div className="group relative col-span-3 mt-1 flex w-fit flex-col border-b">
                <input
                  type="number"
                  className="peer w-full bg-transparent px-2 outline-none"
                  value={amount}
                  autoComplete="off"
                />
              </div>
              <div className="col-span-4 flex justify-end pr-4">
                <Io5icons.IoCloseCircleOutline className="cursor-pointer text-stateRed" />
              </div>
            </div>
          ))}
          <div className="mt-4 flex flex-row items-center gap-1 px-6">
            <Io5icons.IoAddOutline className="cursor-pointer text-primaryBlue" />
            <span className="cursor-pointer text-primaryBlue">Add</span>
          </div>
        </div>
      );
    };

    return (
      <div className="mt-6 rounded-2xl bg-white px-4 py-6 shadow-md">
        <div className="mb-8 flex flex-row justify-between">
          {renderHeader}
          {statusButtonUI()}
        </div>
        <div className="w-full border border-borderRlight/50" />
        <div className="my-8">{renderProfile}</div>
        <div className="mb-4 flex flex-row items-center justify-between">
          <span className="text-sm font-medium uppercase text-primaryBlue">
            basic pay
          </span>
          <span className="text-sm font-medium text-neutralDark">
            18,000.00
          </span>
        </div>
        {renderBodyContainer()}
        <div className="mb-2 flex flex-row items-center justify-between">
          <span className="text-sm font-medium uppercase text-primaryBlue">
            TAXABLE INCOME
          </span>
          <span className="text-sm font-medium text-neutralDark">
            15,300.00
          </span>
        </div>
        <div className="mb-8 flex flex-row items-center justify-between">
          <span className="text-sm font-medium uppercase text-primaryBlue">
            WITHHOLDING TAX
          </span>
          <span className="text-sm font-medium text-neutralDark">(500.00)</span>
        </div>
        {renderTotalNonTaxableAllowance()}
        <div className="mb-8 flex flex-row items-center justify-between">
          <span className="text-base font-medium uppercase text-neutralDark">
            NET PAY
          </span>
          <span className="text-base font-medium text-neutralDark">
            (500.00)
          </span>
        </div>
        <div className="flex justify-end">
          <button
            onClick={formAction}
            className="rounded-xl bg-primaryBlue px-4 py-2 text-sm font-normal capitalize text-white hover:bg-primaryBlue/90"
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="pl-2">
        <BackButton />
      </div>
      {renderContainer()}
    </div>
  );
}
