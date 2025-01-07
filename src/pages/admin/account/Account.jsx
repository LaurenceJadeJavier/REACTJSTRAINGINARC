import React, { useEffect, useState } from "react";
import * as Io5icons from "react-icons/io5";
import { shallow } from "zustand/shallow";

import Accordion from "../../../components/accordion/Accordion";
import { CustomInput } from "../../../components/inputs/CustomInput";
import { alertModalStore } from "../../../utils/zustand/AlertModalStore/alertModalStore";
import { employeeIDStore } from "../../../utils/zustand/AdminStore/EmployeeStore/EmployeeID";
import moment from "moment";
import { employeeStore } from "../../../utils/zustand/AdminStore/Employee/employeeStore";
import { PUT } from "../../../services/api";

export default function Account() {
  const [pageType, setPageType] = useState("Employee Profile");

  const { employeeidData } = employeeIDStore((state) => state, shallow);
  const { fetchEmployeeById, employeeInfo } = employeeStore(
    (state) => state,
    shallow,
  );

  useEffect(() => {
    if (employeeidData?.isEmployee?._id) {
      fetchEmployeeById(employeeidData?.isEmployee?._id);
    }
  }, [employeeidData]);

  const profilePlaceHolder = () => {
    const {
      fullName,
      mobileNo,
      designation_id: { name },
    } = employeeidData?.isEmployee || {};

    return (
      <div className="mb-4 mt-7 flex rounded-xl bg-primaryBlue p-6">
        <img
          src="https://cdn.discordapp.com/attachments/1027820284960575610/1149203122418356294/ava.png"
          alt=""
          className="w-20"
        />
        <div className="mx-4 flex flex-col justify-center text-white">
          <div className="text-lg font-medium">{fullName ?? "-"}</div>
          <div className="text-sm">{mobileNo ?? "-"}</div>
          <div className="text-sm">{name ?? "-"}</div>
        </div>
      </div>
    );
  };

  const tabList = () => {
    const tailwindStylee =
      "border-primaryBlue border bg-blue-50 text-primaryBlue";
    const tabs = ["Employee Profile", "Update Password"];
    return (
      <div className="flex">
        {tabs.map((tab) => (
          <div
            key={tab}
            className={`cursor-pointer rounded-2xl  px-4 py-2 text-sm font-medium text-neutralGray ${
              tab === pageType && tailwindStylee
            }`}
            onClick={() => setPageType(tab)}
          >
            {tab}
          </div>
        ))}
      </div>
    );
  };

  const personalDetailsLayout = () => {
    return (
      <>
        <div className="mt-8">
          <div className="text-xl font-medium">Employee Profile</div>
          <div className="text-sm text-neutralGray">
            Important information about you
          </div>
        </div>
        <Accordion
          icon={
            <Io5icons.IoPersonOutline className=" text-xl text-primaryBlue" />
          }
          title="General Information"
        >
          {personalDetails()}
        </Accordion>
        <Accordion
          icon={
            <Io5icons.IoDocumentTextOutline className=" text-xl text-primaryBlue" />
          }
          title="Documents"
        >
          {documentsDetails()}
        </Accordion>
        <Accordion
          icon={
            <Io5icons.IoWalletOutline className=" text-xl text-primaryBlue" />
          }
          title="Payroll Details"
        >
          {payrollDetails()}
        </Accordion>
      </>
    );
  };

  return (
    employeeInfo.length !== 0 && (
      <>
        <div className="text-3xl font-medium">Account</div>
        <div className="text-base text-neutralDark">
          View and manage your account here
        </div>
        {profilePlaceHolder()}
        <div className="rounded-2xl bg-white px-4 py-6 shadow-xl">
          {tabList()}
          {pageType === "Employee Profile" ? (
            personalDetailsLayout()
          ) : (
            <UpdatePassLayout />
          )}
        </div>
      </>
    )
  );

  function personalDetails() {
    const {
      fullName,
      mobileNo,
      gender,
      dateOfBirth,
      email,
      emp_no,
      date_hired,
      status,
      isActive,
      assigned_employee,
      dept_id,
      designation_id,
    } = employeeidData?.isEmployee || {};

    const { leave_credits } = employeeInfo || {};

    const staticDetails = [
      {
        title: "PERSONAL DETAILS",
        details: [
          {
            tittle: "Full Name",
            value: fullName,
          },
          {
            tittle: "Gender",
            value: gender,
          },
          {
            tittle: "Date of Birth",
            value: moment(dateOfBirth).format("MMM DD, YYYY"),
          },
          {
            tittle: "Contact Number",
            value: "0" + mobileNo,
          },
          {
            tittle: "Email Address",
            value: email,
          },
        ],
      },
      {
        title: "JOB DETAILS",
        details: [
          {
            tittle: "Employee ID",
            value: emp_no,
          },
          {
            tittle: "Date Hired",
            value: moment(date_hired).format("MMM DD, YYYY"),
          },
          {
            tittle: "Employment Type",
            value: status,
          },
          {
            tittle: "Status",
            value: isActive ? "Active" : "In Active",
          },
          {
            tittle: "Assigned Role",
            value: assigned_employee ?? "-",
          },
          {
            tittle: "Department",
            value: dept_id?.name,
          },
          {
            tittle: "Designation",
            value: designation_id?.name,
          },
          {
            tittle: "Schedule Type",
            value: "Regular Schedule",
          },
        ],
      },
    ];

    const tablerowLayout = (title, value) => {
      return (
        <>
          <div className="col-span-1  flex flex-row text-base text-neutralGray md:justify-between">
            <span>{title}</span>
            <span>:</span>
          </div>
          <div className="col-span-1 text-base text-neutralDark md:col-span-2">
            {value}
          </div>
        </>
      );
    };

    return (
      <>
        <div className="my-2 ml-9 ">
          {staticDetails.map((staticDetail) => {
            return (
              <>
                <span className="text-xs text-primaryBlue">
                  {staticDetail.title}
                </span>
                <div className="mb-8 mt-2 grid gap-2 md:grid-cols-6">
                  {staticDetail.details.map((detail) => {
                    return tablerowLayout(detail.tittle, detail.value);
                  })}
                </div>
              </>
            );
          })}
          <span className="text-xs text-primaryBlue">LEAVE CREDITS</span>
          <div className="mb-8 mt-2 grid gap-2 md:grid-cols-6">
            {leave_credits.map(({ name, credits }) => (
              <>
                <div className="col-span-1 flex flex-row text-base text-neutralGray md:justify-between">
                  <span>{name}</span>
                  <span>:</span>
                </div>
                <div className="col-span-1 text-base text-neutralDark md:col-span-5 ">
                  {credits}
                </div>
              </>
            ))}
          </div>
          <span className="text-xs text-primaryBlue">LOGIN TYPE</span>
          <div className="mb-8 mt-2 grid gap-2 md:grid-cols-6">
            <div className="col-span-1 flex flex-row text-base text-neutralGray md:justify-between">
              <span>Type</span>
              <span>:</span>
            </div>
            <div className="col-span-1 text-base text-neutralDark md:col-span-5 ">
              IP Restricted
            </div>
          </div>
        </div>
      </>
    );
  }

  function documentsDetails() {
    const { documents } = employeeInfo || {};

    return (
      <div className="my-2 ml-9 ">
        <span className="text-xs uppercase text-primaryBlue">
          list of documents
        </span>
        {documents.map(({ name, url, createdAt }) => {
          return (
            <div
              className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-5"
              key={name}
            >
              <div className="col-span-1 flex items-center md:col-span-2">
                <span className="mr-1 flex h-[100%] w-10 items-center justify-center rounded bg-lightBlue p-1">
                  <Io5icons.IoDocumentText className="text-2xl text-neutralLight" />
                </span>
                <div className="flex flex-col">
                  <span className="">{name}</span>
                  <span className="text-sm text-neutralGray">{name}</span>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2">
                Date Added: {moment(createdAt).format("MMMM DD, YYYY")}
              </div>
              <div className="col-span-1 flex md:justify-end ">
                <Io5icons.IoDownloadOutline className="text-2xl text-primaryBlue" />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function payrollDetails() {
    const {
      basicPays,
      sss_no,
      philhealth_no,
      tin_no,
      pagibig_no,
      emp_bank_acc,
    } = employeeInfo || {};

    const staticDetails = [
      {
        title: "BASIC PAY",
        details: [
          {
            tittle: "Annual",
            value: basicPays?.annual,
          },
          {
            tittle: "Monthly",
            value: basicPays?.monthly,
          },
          {
            tittle: "Semi Monthly",
            value: basicPays?.semi_monthly,
          },
          {
            tittle: "Daily",
            value: basicPays?.daily,
          },
        ],
      },
      {
        title: "CONTRIBUTION INFORMATION",
        details: [
          {
            tittle: "GSIS/SSS NO",
            value: sss_no,
          },
          {
            tittle: "PhilHealth",
            value: philhealth_no,
          },
          {
            tittle: "TIN Number",
            value: tin_no,
          },
          {
            tittle: "PAGIBIG Number",
            value: pagibig_no,
          },
        ],
      },
    ];

    const tablerowLayout = (title, value) => {
      return (
        <>
          <div className="col-span-1  flex flex-row text-base text-neutralGray md:justify-between">
            <span>{title}</span>
            <span>:</span>
          </div>
          <div className="col-span-1 text-base text-neutralDark md:col-span-2 ">
            {value}
          </div>
        </>
      );
    };

    return (
      <>
        <div className="my-2 ml-9 ">
          {staticDetails.map((staticDetail) => {
            return (
              <>
                <span className="text-xs text-primaryBlue">
                  {staticDetail.title}
                </span>
                <div className="mb-8 mt-2 grid gap-2 md:grid-cols-6">
                  {staticDetail.details.map((detail) => {
                    return tablerowLayout(detail.tittle, detail.value);
                  })}
                </div>
              </>
            );
          })}
          <span className="text-xs text-primaryBlue">
            BANK ACCOUNT INFORMATION
          </span>
          <div className="mb-8 mt-2 grid gap-2 md:grid-cols-6">
            <div className="col-span-1  flex flex-row text-base text-neutralGray md:justify-between">
              <span>Bank</span>
              <span>:</span>
            </div>
            <div className="col-span-1 text-base text-neutralDark md:col-span-5 ">
              {emp_bank_acc?.name}
            </div>
            <div className="col-span-1  flex flex-row text-base text-neutralGray md:justify-between">
              <span>Account</span>
              <span>:</span>
            </div>
            <div className="col-span-1 text-base text-neutralDark md:col-span-5 ">
              {emp_bank_acc?.account}
            </div>
          </div>
        </div>
      </>
    );
  }
}

const UpdatePassLayout = () => {
  const { openConfirmModal, openSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
  );

  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [formValues, setFormValues] = useState({});

  const onHandleChange = ({ target }) => {
    const { value, name } = target;
    setFormValues({ ...formValues, [name]: value });
  };

  const updateAPI = async () => {
    await PUT("/users/password", formValues).then(({ status }) => {
      if (status === 201) {
        setFormValues({});
        openSuccessModal({
          title: "Success!",
          message: "Your changes has been successfully saved.",
          closeNameBtn: "Ok",
        });
      }
    });
  };

  const updateConfirmation = () => {
    openConfirmModal({
      title: "Are you sure?",
      message: "Are you sure you want to update this?",
      closeNameBtn: "Cancel",
      confirmNameBtn: "Yes, Update",
      modalAction: () => updateAPI(),
    });
  };
  return (
    <>
      <div className="my-8">
        <div className="text-xl font-medium">Update Password</div>
        <div className="text-sm text-neutralGray">Create strong password</div>
      </div>
      <div className="md:w-1/2">
        <div className="relative flex">
          <CustomInput
            name="oldPassword"
            type={showCurrentPass ? "text" : "password"}
            label="Current Password"
            value={formValues.oldPassword}
            onChange={onHandleChange}
            required
          />
          <div
            className="absolute right-2 top-5 h-[80%] cursor-pointer rounded-r-md   text-gray-400 "
            onClick={() => setShowCurrentPass(!showCurrentPass)}
          >
            {showCurrentPass ? (
              <Io5icons.IoEyeOutline />
            ) : (
              <Io5icons.IoEyeOffOutline />
            )}
          </div>
        </div>
        <div className="relative flex">
          <CustomInput
            name="newPassword"
            type={showNewPass ? "text" : "password"}
            label="New Password"
            value={formValues.newPassword}
            onChange={onHandleChange}
            required
          />
          <div
            className="absolute right-2 top-5 h-[80%] cursor-pointer rounded-r-md   text-gray-400 "
            onClick={() => setShowNewPass(!showNewPass)}
          >
            {showNewPass ? (
              <Io5icons.IoEyeOutline />
            ) : (
              <Io5icons.IoEyeOffOutline />
            )}
          </div>
        </div>
        <div className="relative flex">
          <CustomInput
            name="confirmPassword"
            type={showConfirmPass ? "text" : "password"}
            label="Confirm Password"
            value={formValues.showConfirmPass}
            onChange={onHandleChange}
            required
          />
          <div
            className="absolute right-2 top-5 h-[80%] cursor-pointer rounded-r-md   text-gray-400 "
            onClick={() => setShowConfirmPass(!showConfirmPass)}
          >
            {showConfirmPass ? (
              <Io5icons.IoEyeOutline />
            ) : (
              <Io5icons.IoEyeOffOutline />
            )}
          </div>
        </div>
        <div className="mt-6 flex">
          <div
            className="flex items-center rounded-lg bg-primaryBlue px-6  py-2 text-highlight hover:cursor-pointer"
            onClick={updateConfirmation}
          >
            Save Changes
          </div>
        </div>
      </div>
    </>
  );
};
