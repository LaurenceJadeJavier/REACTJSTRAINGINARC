import React, { useEffect, useState } from "react";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import * as Io5icons from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { employeeStore } from "../../../../utils/zustand/AdminStore/Employee/employeeStore";
import { shallow } from "zustand/shallow";

export default function PayrollDetails({ setFormProps }) {
  const navigate = useNavigate();
  const { id } = useParams();

  //global state
  const { storeEmployeeForm, employeeForm } = employeeStore(
    (state) => state,
    shallow,
  );

  //local state
  const [basicPay, setBasicPay] = useState(employeeForm?.basicPays);
  const [contribution, setContribution] = useState(employeeForm?.contribution);
  const [bankAcc, setBankAcc] = useState(employeeForm?.emp_bank_acc);

  const basicPayOnChangeHanlder = (e) => {
    const { value, name } = e.target;
    setBasicPay((prev) => ({ ...prev, [name]: value }));
  };
  const contributionOnChangeHanlder = (e) => {
    const { value, name } = e.target;
    setContribution({ ...contribution, [name]: value });
  };
  const bankAccounceHandler = (e) => {
    const { value, name } = e.target;
    setBankAcc((prev) => ({ ...prev, [name]: value }));
  };

  //use in save changes button -> update
  useEffect(() => {
    setFormProps({
      ...employeeForm,
      basicPays: basicPay,
      contribution: contribution,
      emp_bank_acc: bankAcc,
    });
  }, [basicPay, contribution, bankAcc]);

  return (
    <>
      <div className="flex h-full flex-col justify-between pb-10">
        <div>
          {payrollDetails()}
          {contributionInformation()}
          {bankAccountInformationLayout()}
        </div>
        {navigationLayout()}
      </div>
    </>
  );

  //Basic pay layout
  function payrollDetails() {
    const { annual, monthly, semi_monthly, hourly, daily } = basicPay || {};
    return (
      <>
        <div className="flex flex-col">
          <span className="text-base font-medium text-neutralDark">
            Basic Pay
          </span>

          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <CustomInput
                name="annual"
                type="number"
                label="Annual"
                value={annual}
                onChange={basicPayOnChangeHanlder}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <CustomInput
                name="monthly"
                type="number"
                label="Monthly"
                value={monthly}
                onChange={basicPayOnChangeHanlder}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <CustomInput
                name="semi_monthly"
                type="number"
                label="Semi Monthly"
                value={semi_monthly}
                onChange={basicPayOnChangeHanlder}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <CustomInput
                name="daily"
                type="number"
                label="Daily"
                value={daily}
                onChange={basicPayOnChangeHanlder}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <CustomInput
                name="hourly"
                type="number"
                label="Hourly"
                value={hourly}
                onChange={basicPayOnChangeHanlder}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  //contribution layout
  function contributionInformation() {
    const { sss_no, philhealth_no, tin_no, pagibig_no } = contribution || {};
    return (
      <>
        <div className="my-8 flex flex-col">
          <span className="text-base font-medium text-neutralDark">
            Contribution Information
          </span>
          <span className="text-sm  text-neutralGray">
            Identification numbers issued by government agencies
          </span>
          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <CustomInput
                name="sss_no"
                type="number"
                label="GSIS/SSS NO"
                value={sss_no}
                onChange={contributionOnChangeHanlder}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <CustomInput
                name="philhealth_no"
                type="number"
                label="PhilHealth"
                value={philhealth_no}
                onChange={contributionOnChangeHanlder}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <CustomInput
                name="tin_no"
                type="number"
                label="TIN Number"
                value={tin_no}
                onChange={contributionOnChangeHanlder}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <CustomInput
                name="pagibig_no"
                type="number"
                label="PAGIBIG Number"
                value={pagibig_no}
                onChange={contributionOnChangeHanlder}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  //bank account layout
  function bankAccountInformationLayout() {
    return (
      <>
        <div className="flex flex-col">
          <span className="text-base font-medium text-neutralDark">
            Bank Account Information
          </span>

          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <CustomInput
                type="text"
                label="Bank"
                name="name"
                value={bankAcc?.name}
                onChange={bankAccounceHandler}
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <CustomInput
                type="number"
                label="Account"
                name="account"
                value={bankAcc?.account}
                onChange={bankAccounceHandler}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  //next and prev button layout
  function navigationLayout() {
    return (
      <>
        <div className="mt-10 grid grid-cols-1 gap-2 justify-self-end md:grid-cols-5">
          <div className="col-span-1 flex flex-row justify-between text-right md:col-span-5">
            <div
              onClick={() =>
                navigate(
                  `/admin/employees/${
                    id ? `manage-employee/${id}` : "create-employee"
                  }/step-2`,
                )
              }
              className="flex items-center  px-6 py-2 text-primaryBlue hover:cursor-pointer"
            >
              <Io5icons.IoArrowBackOutline className="mr-2" />
              Previous Page
            </div>
            <div
              onClick={() => {
                navigate(
                  `/admin/employees/${
                    id ? `manage-employee/${id}` : "create-employee"
                  }/step-4`,
                );
                return storeEmployeeForm({
                  ...employeeForm,
                  basicPays: basicPay,
                  contribution: contribution,
                  emp_bank_acc: bankAcc,
                });
              }}
              className="flex items-center rounded-lg bg-primaryBlue px-6  py-2 text-highlight hover:cursor-pointer"
            >
              Next
              <Io5icons.IoArrowForwardOutline className="ml-2" />
            </div>
          </div>
        </div>
      </>
    );
  }
}
