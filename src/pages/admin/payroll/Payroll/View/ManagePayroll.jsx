import React, { useEffect, useState } from "react";
import * as Io5icons from "react-icons/io5";

// Components
import {
  statusLabel,
  statusSelectionColor,
} from "../../../../../components/status-color/PayrollStatus";
import EmployeeList from "./Components/PayrollSearchFilter";
import EmployeeDetails from "./Components/PayrollDetails";
import { GET } from "../../../../../services/api";
import moment from "moment";

export default function ManagePayroll(props) {
  const { payrollContainer, setHistoryView } = props || {};

  // Local State
  const [employeeData, setEmployeeData] = useState({});
  const [payrollIdData, setPayrollIdData] = useState([]);

  useEffect(() => {
    if (payrollContainer?._id) {
      getPayrollIdAPI();
    }
  }, [payrollContainer]);

  const getPayrollIdAPI = async () => {
    await GET(`/payroll-lists/${payrollContainer?._id}`).then(
      ({ data, status }) => {
        if (status === 200) {
          console.log("data:", data);
          setPayrollIdData(data);
        }
      },
    );
  };

  const managePayrollHeader = () => {
    const { payroll_period_id, status } = payrollIdData || [];

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
              {moment(payroll_period_id?.start_day).format("MMM DD")} -{" "}
              {moment(payroll_period_id?.end_day).format("MMM DD YYYY")}
            </div>
            <div className="text-neutralGray">Manage Payroll</div>
          </div>
          <div>
            <div className={statusSelectionColor(status)}>
              <div>{statusLabel(status)}</div>
              <div>
                <Io5icons.IoCaretDownOutline />
              </div>
            </div>
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
        payrollIdData,
      };
      return propsContainer && <EmployeeList {...propsContainer} />;
    };

    // Employee Details Section (Right)
    const employeeDetailsList = () => {
      const propsContainer = {
        employeeData,
        payrollIdData,
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
