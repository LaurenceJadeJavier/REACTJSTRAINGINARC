import React, { useEffect, useState } from "react";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import * as Io5icons from "react-icons/io5";
import { CustomSelect } from "../../../../components/inputs/CustomSelect";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import defaultProfile from "../../../../assets/images/profile_placeholder.png";
import { useRef } from "react";
import { departmentStore } from "../../../../utils/zustand/AdminStore/HrSetup/departmentStore";
import { shallow } from "zustand/shallow";
import { designationTypeStore } from "../../../../utils/zustand/AdminStore/HrSetup/designationTypeStore";
import { leaveTypeStore } from "../../../../utils/zustand/AdminStore/HrSetup/leaveTypeStore";
import { employeeStore } from "../../../../utils/zustand/AdminStore/Employee/employeeStore";
import fileUpload from "../../../../utils/S3/fileUpload";
import { restrictionStore } from "../../../../utils/zustand/AdminStore/Restriction/restrictionStore";

export default function GeneralInformation({ setFormProps }) {
  const navigate = useNavigate();
  const { state } = useLocation();

  //use ref for image upload
  const inputRef = useRef();
  const location = useLocation();
  let { id } = useParams();

  //global state
  const { department } = departmentStore((state) => state, shallow);
  const { designationType } = designationTypeStore((state) => state, shallow);
  const { leaveType } = leaveTypeStore((state) => state, shallow);
  const { restrictionData } = restrictionStore((state) => state, shallow);

  const { storeEmployeeForm, employeeForm } = employeeStore(
    (state) => state,
    shallow,
  );

  //local state

  const defaultLeaveTypeVal = [
    {
      leaveType_id: "select",
      credits: 0,
    },
  ];

  const restricData = {
    restriction_type: employeeForm?.generalInfo?.restrictions
      ? employeeForm?.generalInfo?.restrictions?.ip
        ? "ip"
        : "location"
      : null,
    restriction_id: employeeForm?.generalInfo?.restrictions?._id ?? null,
  };

  const [generalInfo, setGeneralInfo] = useState({
    ...employeeForm.generalInfo,
    ...restricData,
  });
  const [leaveTypeList, setLeaveTypeList] = useState(defaultLeaveTypeVal);

  useEffect(() => {
    setLeaveTypeList(
      employeeForm?.leave_credits?.length > 0
        ? employeeForm?.leave_credits
        : defaultLeaveTypeVal,
    );
  }, [employeeForm?.leave_credits]);

  useEffect(() => {
    setFormProps({
      ...employeeForm,
      generalInfo: generalInfo,
      leave_credits: leaveTypeList,
    });
  }, [generalInfo, leaveTypeList]);

  const onHandleChange = (e) => {
    const { value, name, type, files } = e.target ?? {};

    // if (type === "file") {
    //   setGeneralInfo({
    //     ...generalInfo,
    //     [name]: URL.createObjectURL(files[0]),
    //     tempEmp_img: e,
    //   });
    // } else {
    setGeneralInfo({ ...generalInfo, [name]: value });
    // }
  };

  const imageHandleChange = (e) => {
    const params = {
      fileContent: e,
      apiFunction: apiFunction,
    };
    return fileUpload({ ...params });
  };

  const apiFunction = (s3image) => {
    return setGeneralInfo({ ...generalInfo, emp_img: s3image });
  };

  useEffect(() => {
    if (id)
      return console.log("ifetfetched niya tong employee na may id na" + id);
    // after fetching restore sa zustand
    return () => {
      // kill mo yung fetch
    };
  }, []);

  return (
    <>
      <div className="pb-10">
        {personalDetails()}
        {employmentDetails()}
        {leaveCredits()}
        {loginType()}
        {navigationLayout()}
      </div>
    </>
  );

  function personalDetails() {
    const {
      firstName,
      middleName,
      lastName,
      suffix,
      emp_img,
      gender,
      dateOfBirth,
      email,
      mobileNo,
    } = generalInfo ?? {};
    return (
      <div className="flex flex-col">
        <span className="text-base font-medium text-neutralDark">
          Personal Details
        </span>
        <span className="text-sm  text-neutralGray">
          Please complete the following fields
        </span>
        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-5">
          <div className="col-span-1">
            <CustomInput
              type="text"
              label="First Name"
              name="firstName"
              value={firstName}
              onChange={onHandleChange}
              isRequired
            />
          </div>
          <div className="col-span-1">
            <CustomInput
              type="text"
              label="Middle Name (Optional)"
              name="middleName"
              value={middleName}
              onChange={onHandleChange}
            />
          </div>
          <div className="col-span-1">
            <CustomInput
              type="text"
              label="Last Name"
              name="lastName"
              value={lastName}
              onChange={onHandleChange}
              isRequired
            />
          </div>
          <div className="col-span-1">
            <CustomInput
              type="text"
              label="Suffix (Optional)"
              name="suffix"
              value={suffix}
              onChange={onHandleChange}
            />
          </div>
          <div className="col-span-1 row-span-5 flex flex-row justify-center">
            <div className="group/item relative flex h-48 w-48 rounded-lg border-2 border-dashed border-primaryBlue">
              <img
                src={emp_img ?? defaultProfile}
                alt="company_logo"
                className="h-full w-full rounded-lg bg-cover bg-center object-cover"
              />
              <div
                className="group/edit absolute bottom-0  z-40 h-14 w-full  rounded-b-md hover:cursor-pointer group-hover/item:visible  group-hover/item:bg-primaryBlue "
                onClick={() => inputRef.current.click()}
              >
                <div className="group/edit invisible absolute left-0 top-0 z-40 flex  h-full w-full  flex-row items-center justify-center gap-1 text-white group-hover/item:visible">
                  <Io5icons.IoAddCircleOutline className="text-lg" />
                  <div className="text-sm">Add Image</div>
                </div>
              </div>
              <input
                type="file"
                hidden
                ref={inputRef}
                name="emp_img"
                onChange={imageHandleChange}
              />
            </div>
          </div>

          <div className="col-span-1 row-span-3 md:col-span-2">
            <CustomSelect
              label="Gender"
              placeholder="Select"
              name="gender"
              value={gender}
              onChange={onHandleChange}
              isRequired
              options={[
                {
                  label: "Male",
                  value: "male",
                },
                {
                  label: "Female",
                  value: "female",
                },
              ]}
            />
          </div>
          <div className="col-span-1 row-span-3 md:col-span-2">
            <CustomInput
              type="date"
              label="Date of Birth"
              name="dateOfBirth"
              value={dateOfBirth}
              onChange={onHandleChange}
              isRequired
            />
          </div>
          <div className="col-span-1 row-span-3 md:col-span-2">
            <CustomInput
              type="number"
              label="Contact Number"
              name="mobileNo"
              value={mobileNo}
              onChange={(e) => e.target.value.length <= 11 && onHandleChange(e)}
              isRequired
              isMobileNum
            />
          </div>
          <div className="col-span-1 row-span-3 md:col-span-2">
            <CustomInput
              type="email"
              label="Email"
              name="email"
              value={email}
              onChange={onHandleChange}
              isRequired
              isEmail
            />
          </div>
        </div>
      </div>
    );
  }
  function employmentDetails() {
    const { emp_no, status, date_hired, dept_id, designation_id } =
      generalInfo ?? {};

    const statusList = [
      {
        _id: 1,
        label: "Active",
        value: "regular",
      },
      {
        _id: 2,
        label: "Non Regular",
        value: "non-regular",
      },
      {
        _id: 3,
        label: "Floating",
        value: "floating",
      },
      {
        _id: 4,
        label: "Resigned",
        value: "resigned",
      },
      {
        _id: 5,
        label: "Terminated",
        value: "terminated",
      },
    ];

    const departmentList = department?.map((data) => ({
      ...data,
      value: data._id,
      label: data.name,
    }));

    const designationList = designationType?.map((data) => ({
      ...data,
      value: data._id,
      label: data.name,
    }));

    return (
      <div className="mt-10 flex flex-col">
        <span className="text-base font-medium text-neutralDark">
          Employment Details
        </span>
        <span className="text-sm  text-neutralGray">
          Please complete the following fields
        </span>
        <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-5">
          <div className="col-span-1 md:col-span-2">
            <CustomInput
              type="text"
              label="Employee ID"
              name="emp_no"
              value={emp_no}
              onChange={onHandleChange}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <CustomSelect
              label="Employment Type"
              name="status"
              value={status}
              onChange={onHandleChange}
              placeholder="Select"
              options={statusList}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <CustomInput
              type="date"
              label="Date Hired"
              name="date_hired"
              value={date_hired}
              onChange={onHandleChange}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <CustomSelect
              label="Department"
              name="dept_id"
              value={dept_id}
              onChange={onHandleChange}
              placeholder="Select"
              options={departmentList}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <CustomSelect
              name="designation_id"
              value={designation_id}
              onChange={onHandleChange}
              placeholder="Select"
              label="Designation"
              options={designationList}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <CustomSelect
              value={"value"}
              label="Assigned Role"
              options={[
                {
                  label: "Select",
                  value: "select",
                },
                {
                  label: "Role Model",
                  value: "Role Model",
                },
                {
                  label: "Leader",
                  value: "Leader",
                },
              ]}
            />
          </div>
        </div>
      </div>
    );
  }
  function leaveCredits() {
    const addLeaveCredits = () => {
      setLeaveTypeList([
        ...leaveTypeList,
        {
          leaveType_id: "select",
          credits: 0,
        },
      ]);
    };

    // const removeLeaveCredits = (index) => {
    //   const copyInputList = [...leaveTypeList];
    //   copyInputList.splice(index, 1);
    //   return setInputList([...copyInputList]);
    // };

    const onHandleChangeLeaveCredits = (e, index) => {
      const { name, value } = e.target;
      const copyList = [...leaveTypeList];
      copyList[index][name] = value;
      return setLeaveTypeList([...copyList]);
    };

    const leaveList = leaveType?.map((data) => ({
      ...data,
      value: data._id,
      label: data.name,
    }));

    return (
      <div className="mt-10 flex flex-col">
        <span className="text-base font-medium text-neutralDark">
          Leave Credits
        </span>
        <span className="text-sm  text-neutralGray">
          Set the total number of leave days this employee can have
        </span>
        <div className="mt-2 flex flex-col">
          {leaveTypeList?.map(({ leaveType_id, credits }, index) => {
            return (
              <div
                className="grid grid-cols-1 gap-2 md:grid-cols-5"
                key={index}
              >
                <div className="col-span-1 md:col-span-2">
                  <CustomSelect
                    value={leaveType_id}
                    onChange={(e) => onHandleChangeLeaveCredits(e, index)}
                    name="leaveType_id"
                    placeholder="Select"
                    label="Leave Type"
                    options={leaveList}
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <CustomInput
                    type="number"
                    label="Credits"
                    value={credits}
                    onChange={(e) => onHandleChangeLeaveCredits(e, index)}
                    name="credits"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="col-span-2">
          <button
            className="flex flex-row items-center text-primaryBlue"
            onClick={() => {
              addLeaveCredits();
            }}
          >
            <Io5icons.IoAdd />
            Add
          </button>
        </div>
      </div>
    );
  }
  function loginType() {
    const { restriction_type, restriction_id } = generalInfo;

    const restriction = [
      {
        value: "location",
        label: "Location",
      },
      {
        value: "ip",
        label: "IP Restriction",
      },
    ];

    return (
      <div className="mt-10 flex flex-col">
        <span className="text-base font-medium text-neutralDark">
          Login Type
        </span>

        <div className="mt-4 grid grid-cols-5 gap-2">
          <div className="col-span-2 ">
            <CustomSelect
              value={restriction_type}
              onChange={({ target }) => {
                setGeneralInfo({
                  ...generalInfo,
                  restriction_type: target.value,
                  restriction_id: "select",
                });
              }}
              name="restriction_type"
              label="Restriction Type"
              options={restriction}
            />
          </div>
          {restriction_type && (
            <div className="col-span-2 ">
              <CustomSelect
                value={restriction_id}
                onChange={onHandleChange}
                name="restriction_id"
                label={
                  restriction_type === "ip" ? "IP Restriction" : "Location"
                }
                options={
                  restrictionData?.length > 0
                    ? restrictionData
                        .filter(({ ip }) =>
                          restriction_type === "ip" ? ip : !ip,
                        )
                        ?.map(({ _id, description, ip }) => ({
                          value: _id,
                          label: ip ?? description,
                        }))
                    : []
                }
              />
            </div>
          )}
        </div>
      </div>
    );
  }
  function navigationLayout() {
    return (
      <div className="mt-10 grid grid-cols-1 gap-2 md:grid-cols-5">
        <div className="  col-span-1 flex flex-row justify-end text-right md:col-span-5">
          <div
            onClick={() => {
              navigate(
                `/admin/employees/${
                  id ? `manage-employee/${id}` : "create-employee"
                }/step-2`,
              );
              return storeEmployeeForm({
                ...employeeForm,
                generalInfo: generalInfo,
                leave_credits: leaveTypeList,
              });
            }}
            className="btn btn-info flex items-center rounded-lg bg-primaryBlue px-6 py-2 text-highlight"
          >
            Next
            <Io5icons.IoArrowForwardOutline className="ml-2" />
          </div>
        </div>
      </div>
    );
  }
}
