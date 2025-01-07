import React, { useEffect, useState } from "react";
import BackButton from "../../../../components/buttons/back-button/BackButton";
import HorizontalLine from "../../../../components/seperator-line/HorizontalLine";
import * as Io5icons from "react-icons/io5";
import Accordion from "../../../../components/accordion/Accordion";
import defaultLogo from "../../../../assets/images/logo_placeholder.png";
import { useNavigate, useParams } from "react-router-dom";
import { employeeStore } from "../../../../utils/zustand/AdminStore/Employee/employeeStore";
import { shallow } from "zustand/shallow";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";
import fullNameFormat from "../../../../utils/NameFormat/fullNameFormat";
import defaultImage from "../../../../assets/images/blankProfile.jpg";
import moment from "moment";
import { GET } from "../../../../services/api";
import { payrollPeriodStore } from "../../../../utils/zustand/AdminStore/HrSetup/payrollPeriod";
import { CustomSelectCutoff } from "../../../../components/inputs/CustomSelectCutoff";

export default function ViewEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchEmployeeById, employeeInfo, clearEmployeeInfo } = employeeStore(
    (state) => state,
    shallow,
  );
  const { loadingHoc } = loadingStore((state) => state, shallow);
  const { payrollPeriods } = payrollPeriodStore((state) => state, shallow);

  const [empPayslipData, setEmpPayslipData] = useState([]);
  const [cutOffData, setCuttOffData] = useState("");

  useEffect(() => {
    loadingHoc(true);
    const fetcherInfo = async () => {
      await fetchEmployeeById(id);
      return loadingHoc(false);
    };
    fetcherInfo();
  }, [id]);

  useEffect(() => {
    employeePayslipAPI();
  }, [payrollPeriods]);

  const employeePayslipAPI = async () => {
    await GET(
      `/payroll-lists/employees/${id}/periods/${
        cutOffData?.value ?? payrollPeriods[0]._id
      }`,
    ).then(({ data, status }) => {
      if (status === 200) {
        setEmpPayslipData(data);
      }
    });
  };

  const backBtnFunction = () => {
    navigate("/admin/employees");
    return clearEmployeeInfo();
  };

  return (
    <div className="">
      <BackButton func={() => backBtnFunction()} />
      <div className="scrollbar-hidden mt-2 h-full max-h-[93vh] min-h-[93vh] w-full overflow-y-auto rounded-xl bg-white p-5 drop-shadow-xl">
        {profileDetails()}
        <HorizontalLine />
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
        <Accordion
          icon={
            <Io5icons.IoCashOutline className=" text-xl text-primaryBlue" />
          }
          title="Payslip Details"
        >
          {payslipDetails()}
        </Accordion>
      </div>
    </div>
  );

  function profileDetails() {
    const { isActive, emp_no, departments, designations, emp_img } =
      employeeInfo ?? {};
    return (
      <div className="md:flex md:flex-row">
        <img
          src={emp_img ? emp_img : defaultImage}
          alt="Employee Image"
          className="mx-2 h-32 w-32 rounded-full border border-neutralDark p-1"
        />
        <div className="flex flex-col justify-around md:ml-5">
          <span className="text-2xl font-semibold text-neutralDark">
            {fullNameFormat({ ...employeeInfo, isMiddleInitial: true })}
          </span>
          <span className="text-base text-neutralDark">
            {isActive ? "ACTIVE" : "INACTIVE"}{" "}
          </span>
          <span className="text-base text-neutralDark">{emp_no ?? "-"}</span>
          <span className="text-base capitalize text-neutralDark">
            {departments?.name ?? "-"} {`- ${designations?.name}`}
          </span>
        </div>
      </div>
    );
  }
  function personalDetails() {
    const {
      gender,
      dateOfBirth,
      mobileNo,
      email,
      emp_no,
      date_hired,
      status,
      isActive,
      departments,
      designations,
      leave_credits,
      restrictions,
    } = employeeInfo ?? {};
    const staticDetails = [
      {
        title: "PERSONAL DETAILS",
        details: [
          {
            tittle: "Full Name",
            value: fullNameFormat(employeeInfo),
          },
          {
            tittle: "Gender",
            value: <div className="capitalize">{gender}</div>,
          },
          {
            tittle: "Date of Birth",
            value: moment(dateOfBirth).format("MM/DD/YYYY"),
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
            value: emp_no ?? "-",
          },
          {
            tittle: "Date Hired",
            value: date_hired ? moment(date_hired).format("MM/DD/YYYY") : "-",
          },
          {
            tittle: "Employment Type",
            value: <div className="capitalize">{status}</div>,
          },
          {
            tittle: "Status",
            value: isActive ? "Active" : "Inactive",
          },
          {
            tittle: "Assigned Role",
            value: "STATIC",
          },
          {
            tittle: "Department",
            value: departments?.name,
          },
          {
            tittle: "Designation",
            value: designations?.name,
          },
          {
            tittle: "Schedule Type",
            value: "STATIC",
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
          <span className="text-xs text-primaryBlue">LEAVE CREDITS</span>
          <div className="mb-8 mt-2 grid gap-2 md:grid-cols-6">
            {leave_credits?.length > 0
              ? leave_credits.map(({ credits, name, _id }) => (
                  <>
                    <div
                      className="col-span-1  flex flex-row text-base text-neutralGray md:justify-between"
                      key={_id}
                    >
                      <span className="capitalize">{name}</span>
                      <span>:</span>
                    </div>
                    <div className="col-span-1 text-base text-neutralDark md:col-span-5 ">
                      {credits}
                    </div>
                  </>
                ))
              : "-"}{" "}
          </div>

          <span className="text-xs text-primaryBlue">LOGIN TYPE</span>
          <div className="mb-8 mt-2 grid gap-2 md:grid-cols-6">
            <div className="col-span-1  flex flex-row text-base text-neutralGray md:justify-between">
              <span>Type</span>
              <span>:</span>
            </div>
            <div className="col-span-1 text-base text-neutralDark md:col-span-5 ">
              {restrictions
                ? restrictions?.ip
                  ? `IP Restriction - ${restrictions?.ip}`
                  : `Location - ${restrictions?.description}`
                : "-"}
            </div>
          </div>
        </div>
      </>
    );
  }

  function documentsDetails() {
    const { documents } = employeeInfo ?? {};

    return (
      <div className="my-2 ml-9 ">
        <span className="text-xs text-primaryBlue">LIST OF DOCUMENTS</span>
        {documents?.length > 0
          ? documents.map(({ createdAt, name, url, _id }) => {
              const fileName = url.split(
                "https://malabons3.s3.ap-southeast-1.amazonaws.com/malabon/",
              )[1];
              return (
                <div
                  className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-5"
                  key={_id}
                >
                  <div className="col-span-1 flex items-center md:col-span-2">
                    <span className="mr-1 flex h-[100%] w-10 items-center justify-center rounded bg-lightBlue p-1">
                      <Io5icons.IoDocumentText className="text-2xl text-neutralLight" />
                    </span>
                    <div className="flex max-w-sm flex-col overflow-hidden text-ellipsis">
                      <span className="">{name}</span>
                      <span className=" text-sm text-neutralGray">
                        {fileName}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    Date Added: {moment(createdAt).format("LL")}
                  </div>
                  <div className="col-span-1 flex md:justify-end ">
                    <a href={url} target="_blank">
                      <Io5icons.IoDownloadOutline className="text-2xl text-primaryBlue" />
                    </a>
                  </div>
                </div>
              );
            })
          : "No files added"}
      </div>
    );
  }
  function payrollDetails() {
    const {
      basicPays,
      sss_no,
      tin_no,
      pagibig_no,
      philhealth_no,
      emp_bank_acc,
    } = employeeInfo ?? {};

    const { annual, monthly, semi_monthly, daily } = basicPays ?? {};
    const staticDetails = [
      {
        title: "BASIC PAY",
        details: [
          {
            tittle: "Annual",
            value: annual?.toFixed(2) ?? "-",
          },
          {
            tittle: "Monthly",
            value: monthly?.toFixed(2) ?? "-",
          },
          {
            tittle: "Semi Monthly",
            value: semi_monthly?.toFixed(2) ?? "-",
          },
          {
            tittle: "Daily",
            value: daily?.toFixed(2) ?? "-",
          },
        ],
      },
      {
        title: "CONTRIBUTION INFORMATION",
        details: [
          {
            tittle: "GSIS/SSS NO",
            value: sss_no ?? "-",
          },
          {
            tittle: "PhilHealth",
            value: philhealth_no ?? "-",
          },
          {
            tittle: "TIN Number",
            value: tin_no ?? "-",
          },
          {
            tittle: "PAGIBIG Number",
            value: pagibig_no ?? "-",
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
              {emp_bank_acc?.name ?? "-"}
            </div>
            <div className="col-span-1  flex flex-row text-base text-neutralGray md:justify-between">
              <span>Account</span>
              <span>:</span>
            </div>
            <div className="col-span-1 text-base text-neutralDark md:col-span-5 ">
              {emp_bank_acc?.account ?? "-"}
            </div>
          </div>
        </div>
      </>
    );
  }
  function payslipDetails() {
    let filterData = [];

    payrollPeriods.filter(({ start_day, end_day, _id }) => {
      if (_id) {
        const changeData = {
          title: `${moment(start_day).format("MMM")} ${moment(start_day).format(
            "DD",
          )} - ${moment(end_day).format("MMM")} ${moment(end_day).format(
            "DD",
          )} ${moment(end_day).format("YYYY")}`,
          value: _id,
        };
        return filterData.push(changeData);
      }
    });

    const { basicPays, taxables, nonTaxables, witholdings, contributions } =
      empPayslipData || [];

    return (
      payrollPeriods.length !== 0 && (
        <>
          <div className="mb-10 mt-2 flex flex-row items-center gap-2">
            <CustomSelectCutoff
              selectData={filterData || {}}
              setCuttOffData={setCuttOffData}
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="h-14 w-14 rounded-full border border-neutralDark">
              <img
                src={defaultLogo}
                alt="company_logo"
                className=" h-full  w-full rounded-full border-neutralDark bg-cover bg-center object-cover"
              />
            </div>
            <span className="my-3 text-2xl font-medium">PAYSLIP</span>
            <span className="text-sm font-medium text-neutralGray">
              Pay Period : {cutOffData?.title ?? filterData[0]?.title}
            </span>
          </div>
          <div className="my-5">
            <div className="mb-2 flex flex-row justify-between bg-highlight px-4 py-1">
              <span className="text-sm font-medium text-primaryBlue">
                EMPLOYEE EARNINGS
              </span>
              <span className="text-sm font-medium text-neutralGray">
                {basicPays?.semi_monthly ?? "0"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2  px-6">
              <div className="col-span-1 text-xs text-neutralGray">
                DESCRIPTION
              </div>
              <div className="col-span-1 text-xs text-neutralGray">AMOUNT</div>
              <div className="col-span-1 text-base text-neutralDark">
                Basic Pay Salary ({basicPays?.monthly}/Month )
              </div>
              <div className="col-span-1 text-base text-neutralDark">
                {basicPays?.semi_monthly ?? "0"}
              </div>
            </div>
          </div>
          <div className="my-5">
            <div className="mb-2 flex flex-row justify-between bg-highlight px-4 py-1">
              <span className="text-sm font-medium text-primaryBlue">
                TAXABLE ALLOWANCE
              </span>
              <span className="text-sm font-medium text-neutralGray">
                {taxables?.total ?? "0"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2  px-6">
              <div className="col-span-1 text-xs text-neutralGray">
                DESCRIPTION
              </div>
              <div className="col-span-1 text-xs text-neutralGray">AMOUNT</div>
              {taxables?.list.map(({ amount, payroll_comp_id }) => (
                <>
                  <div className="col-span-1 text-base text-neutralDark">
                    {payroll_comp_id?.description ?? "0"}
                  </div>
                  <div className="col-span-1 text-base text-neutralDark">
                    {amount ?? "0"}
                  </div>
                </>
              ))}
            </div>
          </div>
          <div className="my-5">
            <div className="mb-2 flex flex-row justify-between bg-highlight px-4 py-1">
              <span className="text-sm font-medium text-primaryBlue">
                CONTRIBUTION AND DEDUCTIONS
              </span>
              <span className="text-sm font-medium text-neutralGray">
                850.00
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 px-6">
              <div className="col-span-1 text-xs text-neutralGray">
                DESCRIPTION
              </div>
              <div className="col-span-1 text-xs text-neutralGray">AMOUNT</div>
              {contributions?.list.map(({ amount, payroll_comp_id }) => (
                <>
                  <div className="col-span-1 text-base text-neutralDark">
                    {payroll_comp_id?.description ?? "0"}
                  </div>
                  <div className="col-span-1 text-base text-neutralDark">
                    {amount ?? "0"}
                  </div>
                </>
              ))}
            </div>
            <div className="mt-4 flex flex-row justify-between  py-1 pl-6 pr-5">
              <span className="text-sm font-medium ">TAXABLE INCOME</span>
              <span className="text-sm font-medium">
                {taxables?.total ?? "0"}
              </span>
            </div>
            <div className="flex flex-row justify-between  py-1 pl-6 pr-5">
              <span className="text-sm font-medium ">WITHHOLDING TAX</span>
              <span className="text-sm font-medium">
                ({witholdings?.total ?? "0"})
              </span>
            </div>
            <div className="my-5">
              <div className="mb-2 flex flex-row justify-between bg-highlight px-4 py-1">
                <span className="text-sm font-medium text-primaryBlue">
                  NON TAXABLE ALLOWANCE
                </span>
                <span className="text-sm font-medium text-neutralGray">
                  {nonTaxables?.total ?? "0"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2  px-6">
                <div className="col-span-1 text-xs text-neutralGray">
                  DESCRIPTION
                </div>
                <div className="col-span-1 text-xs text-neutralGray">
                  AMOUNT
                </div>
                {nonTaxables?.list.map(({ amount, payroll_comp_id }) => (
                  <>
                    <div className="col-span-1 text-base text-neutralDark">
                      {payroll_comp_id?.description ?? "0"}
                    </div>
                    <div className="col-span-1 text-base text-neutralDark">
                      {amount ?? "0"}
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-row justify-between  px-4 py-1">
            <span className="text-sm font-medium ">TAXABLE INCOME</span>
            <span className="text-sm font-medium ">
              {taxables?.total ?? "-"}
            </span>
          </div>
        </>
      )
    );
  }
}
