import React from "react";
import * as Io5icons from "react-icons/io5";

// Component
import {
  CustomTable,
  ShowHideContent,
} from "../../../../../../../services/script_service";
import Accordion from "../../../../../../../components/accordion/Accordion";
import { alertModalStore } from "../../../../../../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";

export default function EmployeeDetails(props) {
  const { employeeData } = props || {};
  const { employeeInformation } = employeeData || {};
  const { breakdown } = employeeInformation || {};
  const employeeDataLengthExist = Object.keys(employeeData).length;
  const payrollDetailsViewAdjustment =
    employeeDataLengthExist === 0 && "flex justify-center";

  const { openConfirmModal, openSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
  );

  const submitFunc = () => {
    openConfirmModal({
      modalAction: () => {
        openSuccessModal({
          title: "Success!",
          message: "Your changes has been successfully saved.",
          closeNameBtn: "Ok",
        });
      },
    });
  };

  const amountFormatter = (amount) =>
    amount.toLocaleString("en-US", { minimumFractionDigits: 2 });

  // Payroll Time Sheet Section
  const timeSheetSection = () => {
    return (
      <div>
        <div className="text-sm font-semibold">Time Sheet</div>
        <div className="text-xs text-neutralGray">
          View salary statements for each payroll period
        </div>

        <div className="flex flex-col gap-3 py-3">
          {breakdown?.map((item) => {
            const {
              year,
              month,
              netPay,
              basicPay,
              salaries,
              taxableAllowances,
              deductions,
              contributions,
              taxableIncome,
              withholdingTax,
              nonTaxbles,
            } = item || {};

            return (
              <>
                <Accordion
                  icon={
                    <Io5icons.IoPersonOutline className=" text-xl text-primaryBlue" />
                  }
                  title={
                    <div className="flex justify-between gap-40">
                      <div>{`${month} ${year}`}</div>
                      <div className="flex gap-5">
                        :
                        <div className="text-primaryBlue">
                          {amountFormatter(netPay)}
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div className="my-4 flex justify-between">
                    <div className="text-sm font-medium text-primaryBlue">
                      BASIC SALARY
                    </div>
                    <div className="text-sm font-medium">
                      {amountFormatter(basicPay)}
                    </div>
                  </div>

                  {breakdowLayout(salaries)}
                  {breakdowLayout(taxableAllowances)}
                  {breakdowLayout(deductions)}
                  {breakdowLayout(contributions)}
                  <div className="flex justify-between text-sm ">
                    <div className="text-primaryBlue">TAXABLE INCOME</div>
                    <div>{taxableIncome}</div>
                  </div>
                  <div className="flex justify-between text-sm ">
                    <div className="text-primaryBlue">WITHHOLDING TAX</div>
                    <div>{`(${withholdingTax})`}</div>
                  </div>
                  {breakdowLayout(nonTaxbles)}
                  <div className="flex justify-between font-medium">
                    <div>NET PAY</div>
                    <div>{netPay}</div>
                  </div>
                  <div className="mt-2 flex flex-row justify-end">
                    <div
                      className="btn btn-info flex items-center rounded-lg bg-primaryBlue px-6 py-2 text-highlight"
                      onClick={submitFunc}
                    >
                      Save
                    </div>
                  </div>
                </Accordion>
              </>
            );
          })}
        </div>
      </div>
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
      const { employeeId, employee, img } = props || {};
      return (
        <div className="flex flex-row">
          <img
            src={img}
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
      </div>
    ) : null;
  };

  const breakdowLayout = (details) => {
    const { name, amount, items } = details || {};

    return (
      <>
        {/* {details?.map((data) => {
          return (
            <> */}
        <div className="my-6 flex justify-between bg-highlight">
          <div className="px-2 text-base">{name}</div>
          <div className="px-2 text-base">{amount}</div>
        </div>
        <div className="my-4 mt-4  grid grid-cols-5 gap-2 px-4">
          <div className=" col-span-2 flex items-center">
            <span className=" text-xs text-neutralGray">NAME</span>
          </div>
          <div className="col-span-2 text-xs text-neutralGray">AMOUNT</div>
          <div className="flex justify-end text-xs text-neutralGray ">
            REMOVE
          </div>

          {items.map((item) => {
            const { name, amount } = item || {};
            return (
              <>
                <div class="col-span-2 text-base">
                  {name.length ? (
                    <div>{name}</div>
                  ) : (
                    <select class="p-1 shadow-sm">
                      <option>Select Type</option>
                      <option>Option 2</option>
                      <option>Option 3</option>
                    </select>
                  )}
                </div>
                <div class="col-span-2 text-base">
                  <input
                    type="number"
                    class="p-1 shadow-sm"
                    defaultValue="0"
                    value={amount}
                  />
                </div>
                <div className="flex justify-end text-xs text-neutralGray ">
                  <Io5icons.IoCloseCircleOutline className="text-xl text-stateRed" />
                </div>
              </>
            );
          })}

          <div className="col-span-2 my-2">
            <button className="flex flex-row items-center text-primaryBlue">
              <Io5icons.IoAdd />
              Add
            </button>
          </div>
        </div>
        {/* </>
          );
        }
        )} */}
      </>
    );
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
