import React, { useEffect, useState } from "react";
import * as Io5icons from "react-icons/io5";

// Component
import {
  CustomTable,
  ShowHideContent,
} from "../../../../../../services/script_service";
import { GET } from "../../../../../../services/api";

export default function EmployeeDetails(props) {
  const { employeeData, payrollIdData } = props || {};
  const [viewEmployeeData, setViewEmployeeData] = useState([]);

  useEffect(() => {
    if (employeeData?._id) {
      getEmployeeData();
    }
  }, [employeeData]);

  const getEmployeeData = async () => {
    await GET(
      `/payroll-lists/employees/${employeeData?._id}/periods/${payrollIdData?.payroll_period_id?._id}`,
    ).then(({ data, status }) => {
      console.log("employee:", data);
      if (status === 200) {
        setViewEmployeeData(data);
      }
    });
  };

  const { employeeInformation } = employeeData || {};
  const employeeDataLengthExist = Object.keys(employeeData).length;
  const payrollDetailsViewAdjustment =
    employeeDataLengthExist === 0 && "flex justify-center";

  // Payroll Time Sheet Section
  const timeSheetSection = () => {
    const { leaveDates, presentDates, absentDates, overTime, lateDeduct } =
      viewEmployeeData || [];

    // Work Day Details View
    const workDaysDetailsShowOption = () => {
      const workDaycolumn = [
        { title: "Date", value: "date" },
        { title: "Time In", value: "attendance", valueElement: "time_in" },
        { title: "Time Out", value: "attendance", valueElement: "time_out" },
      ];

      const propsContainer = {
        tableRow: presentDates,
        tableColumn: workDaycolumn,
        tableTitle: "TOTAL DAYS OF WORK DAYS",
        tableCount:
          presentDates?.length !== 0 ? presentDates?.length + " " + "DAYS" : 0,
      };

      return <ShowHideContent {...propsContainer} />;
    };

    // Leave Day Details View
    const leaveDaysDetailsShowOption = () => {
      const leaveDayColumn = [
        { title: "Date", value: "date" },
        { title: "Type", value: "leave", valueElement: "type" },
        { title: "Half Day", value: "leave", valueElement: "isHalfday" },
        { title: "Reason", value: "leave", valueElement: "reason" },
      ];

      const propsContainer = {
        tableRow: leaveDates,
        tableColumn: leaveDayColumn,
        tableTitle: "TOTAL LEAVE DAYS",
        tableCount:
          leaveDates?.length !== 0 ? leaveDates?.length + " " + "DAYS" : 0,
      };

      return <ShowHideContent {...propsContainer} />;
    };

    // Absent Day Details View
    const absentDaysDetailsShowOption = () => {
      const absentDayColumn = [{ title: "Date", value: "date" }];

      const propsContainer = {
        tableRow: absentDates,
        tableColumn: absentDayColumn,
        tableTitle: "TOTAL ABSENT DAYS",
        tableCount:
          absentDates?.length !== 0 ? absentDates?.length + " " + "DAYS" : 0,
      };

      return <ShowHideContent {...propsContainer} />;
    };

    // Overtime Details View
    const overtimeDetailsShowOption = () => {
      const propsContainer = {
        tableTitle: "TOTAL OVERTIME",
        tableCount: overTime,
      };

      return <ShowHideContent {...propsContainer} />;
    };

    // Overtime Details View
    const lateDetailsShowOption = () => {
      const propsContainer = {
        tableTitle: "TOTAL LATE",
        tableCount: lateDeduct,
      };

      return <ShowHideContent {...propsContainer} />;
    };

    return (
      <div>
        <div className="text-sm font-semibold">Time Sheet</div>
        <div className="text-xs text-neutralGray">
          Track the hours worked by employee
        </div>
        <div className="flex flex-col gap-3 py-3">
          {workDaysDetailsShowOption()}
          {leaveDaysDetailsShowOption()}
          {absentDaysDetailsShowOption()}
          {overtimeDetailsShowOption()}
          {lateDetailsShowOption()}
        </div>
      </div>
    );
  };

  // Payroll Breakdown Section
  const payrollDetailsSection = () => {
    const { basicPays, taxables, witholdings } = viewEmployeeData || [];

    // Basic Pay Details View
    const basicPaySection = () => {
      return (
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm font-medium text-primaryBlue">Basic Pay</div>
          <div className="text-sm font-medium">{basicPays?.monthly ?? 0}</div>
        </div>
      );
    };

    // Taxable Income Details View
    const taxableIncomeSection = () => {
      return (
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm font-medium text-primaryBlue">
            Taxable Income
          </div>
          <div className="text-sm font-medium">{taxables?.total ?? 0}</div>
        </div>
      );
    };

    // With Holding Tax Details View
    const withHoldingTaxSection = () => {
      return (
        <div className="flex flex-row items-center justify-between">
          <div className="text-sm font-medium text-primaryBlue">
            Withholding Tax
          </div>
          <div className="text-sm font-medium">{witholdings?.total ?? 0}</div>
        </div>
      );
    };

    // Net Pay Details View
    const netPaySection = () => {
      return (
        <div className="flex flex-row items-center justify-between">
          <div className="font-medium">Net Pay</div>
          <div className="font-medium ">{viewEmployeeData?.netPay ?? 0}</div>
        </div>
      );
    };

    // Salary Table Details View
    const salarySection = () => {
      const { salary, totalSalary } = employeeInformation || {};
      const salarycolumn = [
        {
          title: "Salary",
          value: "title",
          style: "customTableTitle",
        },
        {
          title: `(${totalSalary})`,
          value: "amount",
          style: "customTableAmount",
        },
      ];

      return <CustomTable tableColumn={salarycolumn} tableRow={salary} />;
    };

    // Non Tax Allowance Table Details View
    const nonTaxAllowanceSection = () => {
      const { nonTaxAllowance, totalNonTaxAllowance } =
        employeeInformation || {};
      const nonTaxAllowancecolumn = [
        {
          title: "Total Non Taxable Allowance",
          value: "title",
          style: "customTableTitle",
        },
        {
          title: `${totalNonTaxAllowance ?? 0}`,
          value: "amount",
          style: "customTableAmount",
        },
      ];

      return (
        <CustomTable
          tableColumn={nonTaxAllowancecolumn}
          tableRow={nonTaxAllowance}
        />
      );
    };

    // Tax Allowance Table Details View
    const taxAllowanceSection = () => {
      const { taxAllowance, totalTaxAllowance } = employeeInformation || {};
      const TaxAllowancecolumn = [
        {
          title: "Total Taxable Allowance",
          value: "title",
          style: "customTableTitle",
        },
        {
          title: `${totalTaxAllowance ?? 0}`,
          value: "amount",
          style: "customTableAmount",
        },
      ];

      return (
        <CustomTable tableColumn={TaxAllowancecolumn} tableRow={taxAllowance} />
      );
    };

    // Dedcution Table Details View
    const deductionSection = () => {
      const { deduction, totalDeduction } = employeeInformation || {};
      const deductionNolumn = [
        {
          title: "Total Deduction",
          value: "title",
          style: "customTableTitle",
        },
        {
          title: `${totalDeduction ?? 0}`,
          value: "amount",
          style: "customTableAmount",
        },
      ];

      return <CustomTable tableColumn={deductionNolumn} tableRow={deduction} />;
    };

    // Contribution Table Details View
    const contributionSection = () => {
      const { contribution, totalContribution } = employeeInformation || {};
      const contributionColumn = [
        {
          title: "Contribution",
          value: "title",
          style: "customTableTitle",
        },
        {
          title: `(${totalContribution ?? 0})`,
          value: "amount",
          style: "customTableAmount",
        },
      ];

      return (
        <CustomTable tableColumn={contributionColumn} tableRow={contribution} />
      );
    };

    return (
      <>
        <div>
          <div className="text-sm font-semibold">Payroll Details</div>
          <div className="text-xs text-neutralGray">
            Compensation and benefits
          </div>
        </div>
        {basicPaySection()}
        {salarySection()}
        {taxAllowanceSection()}
        {deductionSection()}
        {contributionSection()}
        {taxableIncomeSection()}
        {withHoldingTaxSection()}
        {nonTaxAllowanceSection()}
        {netPaySection()}
      </>
    );
  };

  const withoutEmployeeDetailsSelected = () => {
    return employeeDataLengthExist === 0 ? (
      <div className="flex flex-col items-center justify-center">
        <div>
          <Io5icons.IoPersonSharp className="text-6xl text-neutralLight" />
        </div>
        <div className="text-base text-primaryBlue">No Employee Selected</div>
        <div className="text-xs text-neutralGray">
          Select an employee to access their salary statement.{" "}
        </div>
      </div>
    ) : null;
  };

  const withEmployeeDetailsSelected = () => {
    const employeeCredentialDisplay = (props) => {
      const { employeeId, employee } = props || {};
      return (
        <div className="flex flex-row">
          <img
            src={employeeData?.emp_img}
            alt={employee}
            className="mr-2 h-10 w-10 rounded-full border   border-neutralDark p-1"
          />
          <div className="flex flex-col">
            <span className="text-base font-medium">{employee}</span>
            <span className="text-xs font-light text-neutralGray">
              {employeeId}
            </span>
          </div>
        </div>
      );
    };

    return employeeDataLengthExist ? (
      <div className="flex flex-col gap-4">
        {employeeCredentialDisplay(employeeData)}
        {timeSheetSection()}
        {payrollDetailsSection()}
      </div>
    ) : null;
  };

  return (
    <div
      className={`card grow ${payrollDetailsViewAdjustment}`}
      style={{ height: "inherit" }}
    >
      {withoutEmployeeDetailsSelected()}
      {withEmployeeDetailsSelected()}
    </div>
  );
}
