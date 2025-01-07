import React, { useState } from "react";
import * as Io5icons from "react-icons/io5";

// Components
import {
  statusLabel,
  statusSelectionColor,
} from "../../../../../../components/status-color/PayrollStatus";
import EmployeeList from "./components/SearchFilter";
import EmployeeDetails from "./components/Details";
import StatusLayout, {
  StatusLayoutDropdown,
} from "../../components/StatusLayout";
import { CustomSelect } from "../../../../../../components/inputs/CustomSelect";
import { shallow } from "zustand/shallow";
import { alertModalStore } from "../../../../../../utils/zustand/AlertModalStore/alertModalStore";

const employeeInformation = {
  breakdown: [
    {
      year: 2022,
      month: "January",
      netPay: 15850,
      basicPay: 18000,
      totalSalary: 1200,
      taxableIncome: 15350,
      withholdingTax: 500,
      salaries: {
        name: "SALARY",
        amount: 1200,
        items: [
          {
            name: "Absent",
            amount: 1000,
          },
          {
            name: "Late Deductions",
            amount: 100,
          },
          {
            name: "Undertime Deduction",
            amount: 0,
          },
          {
            name: "Overtime Income",
            amount: 0,
          },
          {
            name: "",
            amount: 0,
          },
        ],
      },

      taxableAllowances: {
        name: "TOTAL TAXABLE ALLOWANCE",
        amount: 1000,
        items: [
          {
            name: "Travel Allowance",
            amount: 500,
          },
          {
            name: "Fuel Allowance",
            amount: 500,
          },
          {
            name: "",
            amount: 0,
          },
        ],
      },

      deductions: {
        name: "TOTAL DEDUCTION",
        amount: 1000,
        items: [
          {
            name: "Loan",
            amount: 500,
          },
          {
            name: "Sample Deduction",
            amount: 500,
          },
          {
            name: "",
            amount: 0,
          },
        ],
      },

      contributions: {
        name: "CONTRIBUTIONS",
        amount: 1450,
        items: [
          {
            name: "SSS",
            amount: 750,
          },
          {
            name: "GSIS",
            amount: 100,
          },
          {
            name: "HMDF",
            amount: 300,
          },
          {
            name: "PhilHealth",
            amount: 300,
          },
          {
            name: "",
            amount: 0,
          },
        ],
      },

      nonTaxbles: {
        name: "TOTAL NON TAXABLE ALLOWANCE",
        amount: 1000,
        items: [
          {
            name: "Rice Allowance",
            amount: 500,
          },
          {
            name: "Clothing Allowance",
            amount: 500,
          },
          {
            name: "",
            amount: 0,
          },
        ],
      },
    },
    {
      year: 2022,
      month: "February",
      netPay: 15850,
      basicPay: 18000,
      totalSalary: 1200,
      taxableIncome: 15350,
      withholdingTax: 500,
      salaries: {
        name: "SALARY",
        amount: 1200,
        items: [
          {
            name: "Absent",
            amount: 1000,
          },
          {
            name: "Late Deductions",
            amount: 100,
          },
          {
            name: "Undertime Deduction",
            amount: 0,
          },
          {
            name: "Overtime Income",
            amount: 0,
          },
          {
            name: "",
            amount: 0,
          },
        ],
      },

      taxableAllowances: {
        name: "TOTAL TAXABLE ALLOWANCE",
        amount: 1000,
        items: [
          {
            name: "Travel Allowance",
            amount: 500,
          },
          {
            name: "Fuel Allowance",
            amount: 500,
          },
          {
            name: "",
            amount: 0,
          },
        ],
      },

      deductions: {
        name: "TOTAL DEDUCTION",
        amount: 1000,
        items: [
          {
            name: "Loan",
            amount: 500,
          },
          {
            name: "Sample Deduction",
            amount: 500,
          },
          {
            name: "",
            amount: 0,
          },
        ],
      },

      contributions: {
        name: "CONTRIBUTIONS",
        amount: 1450,
        items: [
          {
            name: "SSS",
            amount: 750,
          },
          {
            name: "GSIS",
            amount: 100,
          },
          {
            name: "HMDF",
            amount: 300,
          },
          {
            name: "PhilHealth",
            amount: 300,
          },
          {
            name: "",
            amount: 0,
          },
        ],
      },

      nonTaxbles: {
        name: "TOTAL NON TAXABLE ALLOWANCE",
        amount: 1000,
        items: [
          {
            name: "Rice Allowance",
            amount: 500,
          },
          {
            name: "Clothing Allowance",
            amount: 500,
          },
          {
            name: "",
            amount: 0,
          },
        ],
      },
    },
  ],
};

const employeeDataSample = [
  {
    employeeId: "0001",
    employee: "Cardo Milen",
    img: "https://e1.pxfuel.com/desktop-wallpaper/28/668/desktop-wallpaper-profile-for-girls-profile-pics-cute-girl-beautiful-indian-woman.jpg",
    employeeInformation,
  },
  {
    employeeId: "0008",
    employee: "Melisa Perez",
    img: "https://cdn4.sharechat.com/beautifulgirlprofilepicture_2fd82a95_1601311911497_cmprsd_40.jpg?tenant=sc&referrer=pwa-sharechat-service&f=beautifulgirlprofilepicture_2fd82a95_1601311911497_cmprsd_40.jpg",
    employeeInformation,
  },
  {
    employeeId: "0054",
    employee: "Melissa Miles",
    img: "https://i.pinimg.com/1200x/ba/37/bf/ba37bf9bc911f418ae7b6e32d7ddd641.jpg",
    employeeInformation,
  },
  {
    employeeId: "0062",
    employee: "Jennifer Banuod",
    img: "https://i0.wp.com/smsforwishes.com/wp-content/uploads/2022/05/105274370_103709461393684_681293867908537804_n.jpeg?resize=700%2C700&ssl=1",
  },
  {
    employeeId: "0063",
    employee: "Cecil Lorrie",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTGvEY12LCxbX-xySVH-AqdcL68uSdBAHqEtjM8BOlzXrM1Vd86A3CoguCjGeUKgmE7ss&usqp=CAU",
  },
  {
    employeeId: "0085",
    employee: "Rosabel Beauregard",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRegSgwrkL0Do-sak49xOn8rakCd8XfzN7j4K6LnivhBQYBB2lJk-WwmvgB8pnhEyhXOpE&usqp=CAU",
    employeeInformation,
  },
  {
    employeeId: "0098",
    employee: "Nyah Lorinda",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHmNGIT27oP6Fhuj3hVheDa7FYwFxwnp_PM1GxynxlsaIiYIJzI0mLKfvpwh6eNyaHkxA&usqp=CAU",
    employeeInformation,
  },
  {
    employeeId: "0098",
    employee: "Starla Britney",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkgTQZTQtq9cVSUJSmVu9cBeDKySIQwAXtrWbkwbtLVlgxW4tbMijjaR9OwAWRUBFv_p4&usqp=CAU",
    employeeInformation,
  },
  {
    employeeId: "0045",
    employee: "Ashlee Aspen",
    img: "https://i.pinimg.com/originals/c8/02/59/c80259383a2629318806f8be33be409d.jpg",
    employeeInformation,
  },
  {
    employeeId: "0065",
    employee: "Ashlee Aspen",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw_FbIhBtCeKORndZx_KJF8tDTYggwEXE2Ezw5mjietL5HXq3UhZC193mo-ahedeD6264&usqp=CAU",
  },
  {
    employeeId: "0032",
    employee: "Ashlee Aspen",
    img: "https://i.pinimg.com/736x/e7/ab/95/e7ab952755a3473b8a0358824186555d.jpg",
    employeeInformation,
  },
];

const selectedDept = {
  _id: 1,
  dateRange: "Dec 2022 - Nov 2023",
  department: "Department",
  status: "IN REVIEW",
  employeeInformation,
  employee: employeeDataSample,
};

export default function ManageThirtheenthMonth(props) {
  const { setHistoryView } = props || {};
  const { openConfirmModal, openSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
  );

  // Local State
  const [employeeData, setEmployeeData] = useState({});

  const managePayrollHeader = () => {
    const { payrollPeriod, status } = selectedDept || {};

    const statusHandler = () => {
      openConfirmModal({
        message: "Are you sure you want to update the status of this payroll?",
        modalAction: () => {
          openSuccessModal({
            title: "Success!",
            message: "Your changes has been successfully saved.",
            closeNameBtn: "Ok",
          });
        },
      });
    };

    // Navigation Display
    const headerNavigation = () => {
      return (
        <div className="flex flex-row items-center justify-between">
          <div
            className="flex cursor-pointer flex-row items-center gap-1 rounded-lg px-4 py-2 text-primaryBlue hover:bg-gray-100"
            onClick={() => setHistoryView(false)}
          >
            <span>
              <Io5icons.IoArrowBackSharp className="text-md text-primaryBlue" />
            </span>
            Back
          </div>
        </div>
      );
    };

    // Header Title Details
    const headerTitle = () => {
      return (
        <div className="card flex flex-row items-center justify-between">
          <div className="">
            <div className="text-base font-semibold">
              {payrollPeriod ?? null}
            </div>
            <div className="text-lg font-medium">Dec 2022 - Nov 2023</div>
            <div className="text-neutralGray">Manage 13th Month</div>
          </div>
          <div>
            <StatusLayoutDropdown status={status}>
              <div className="relative inline-flex">
                <select
                  className="form-select rounded-xl bg-transparent py-2 pl-4 uppercase"
                  onChange={statusHandler}
                  value={status}
                >
                  <option value="in review">in review</option>
                  <option value="for approval">for approval</option>
                  <option value="approved">approved</option>
                  <option value="declined">declined</option>
                  <option value="void">void</option>
                </select>
              </div>
            </StatusLayoutDropdown>
          </div>
        </div>
      );
    };

    return (
      <div className="flex basis-1/2 flex-col gap-4">
        {headerNavigation()}
        {headerTitle()}
      </div>
    );
  };

  const managePayrollBody = () => {
    // Employee List Search Selection Section (Left)
    const employeeSearchList = () => {
      const propsContainer = {
        employeeData,
        setEmployeeData,
        selectedDept,
      };

      return propsContainer && <EmployeeList {...propsContainer} />;
    };

    // Employee Details Section (Right)
    const employeeDetailsList = () => {
      const propsContainer = {
        employeeData,
      };
      return propsContainer && <EmployeeDetails {...propsContainer} />;
    };

    return (
      <div className="flex grow flex-row gap-3">
        {employeeSearchList()}
        {employeeDetailsList()}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col gap-3">
      {managePayrollHeader()}
      {managePayrollBody()}
    </div>
  );
}
