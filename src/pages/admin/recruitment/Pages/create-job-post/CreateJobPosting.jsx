import React, { useEffect, useState } from "react";
import CancelButton from "../../../../../components/buttons/cancel-button/CancelButton";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CustomInput } from "../../../../../components/inputs/CustomInput";
import CustomTextArea from "../../../../../components/inputs/CustomTextArea";
import { alertModalStore } from "../../../../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";
import BackButton from "../../../../../components/buttons/back-button/BackButton";
import { POST, PUT } from "../../../../../services/api";
import { recruitmentStore } from "../../../../../utils/zustand/AdminStore/Recruitment/RecruitmentStore";
import { CustomSelect } from "../../../../../components/inputs/CustomSelect";

export default function CreateJobPosting() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // Global State
  const { fetchAllRecruitment } = recruitmentStore((state) => state, shallow);
  const { openConfirmModal, openSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
  );

  // Form Object
  const formObject = {
    title: "",
    noOfApplicants: 0,
    desc: "",
    status: "",
    qualificationAndRequirements: [],
    responsibilities: [],
    skillsAndAbilities: [],
    companyInfo: "",
    compensationAndBenefits: [],
    applicationProcess: "",
    deadline: "",
    contactInfo: "",
    urlKey: "",
    location: "",
    experience: "",
    work_level: "",
    job_type: "",
    salary: "",
  };

  // Local State
  const [formValues, setFormValues] = useState(formObject);
  const [isEmpty, setIsEmpty] = useState(false);
  const [responsibiltyCounter, setresponsibiltyCounter] = useState(1);
  const [qualificationCounter, setQualificationCounter] = useState(1);

  useEffect(() => {
    setUserData();
  }, [state]);

  // Converted String Data To Object
  const organizedObjectUserData = () => {
    const { desc } = state || {};
    const convertedStringToJsonData = desc ? JSON.parse(desc) : {};
    const {
      desc: description,
      qualification,
      responsibilities,
    } = convertedStringToJsonData || {};
    const convertedDescriptionData = {
      desc: description ?? "",
      qualificationAndRequirements: qualification ?? [],
      responsibilities: responsibilities ?? [],
    };
    const formValuesOrganizedData = { ...state, ...convertedDescriptionData };

    return { formValuesOrganizedData, qualification, responsibilities };
  };

  const setUserData = () => {
    if (!state) return null;
    const { formValuesOrganizedData, qualification, responsibilities } =
      organizedObjectUserData();

    setFormValues(formValuesOrganizedData ?? formObject);
    setresponsibiltyCounter(responsibilities.length ?? 0);
    return setQualificationCounter(qualification.length ?? 0);
  };

  // Validate Form Values Action
  const validateFormValues = () => {
    const {
      title,
      location,
      deadline,
      experience,
      work_level,
      job_type,
      salary,
      desc,
    } = formValues || {};

    return (
      !title ||
      !location ||
      !deadline ||
      !experience ||
      !work_level ||
      !job_type ||
      !salary ||
      !desc
    );
  };

  // Reorganized Description Data (Converted from string to object)
  const reorganizedDescriptionStringToObject = () => {
    const { desc, qualificationAndRequirements, responsibilities } =
      formValues || {};

    const descriptionData = {
      desc: desc ?? "",
      qualification: qualificationAndRequirements ?? [],
      responsibilities: responsibilities ?? [],
    };

    return JSON.stringify(descriptionData);
  };

  // Create Job Posting Action (Service)
  const createJobPostingAction = async () => {
    const validateForm = validateFormValues();
    if (validateForm) return setIsEmpty(true);

    const params = {
      ...formValues,
      desc: reorganizedDescriptionStringToObject(),
      status: "ongoing",
    };

    try {
      const { status } = await POST("/recruitments", params);
      return status === 201 && serviceActionSuccess();
    } catch (err) {
      console.log(`err:`, err);
    }
  };

  // Update Job Posting Action (Service)
  const updateJobPostingAction = async () => {
    const validateForm = validateFormValues();
    if (validateForm) return setIsEmpty(true);

    const params = {
      ...formValues,
      desc: reorganizedDescriptionStringToObject(),
    };

    try {
      const { status } = await PUT("/recruitments/" + id, params);
      return status === 201 && serviceActionSuccess();
    } catch (err) {
      console.log(`err:`, err);
    }
  };

  const serviceActionSuccess = () => {
    fetchAllRecruitment();
    openSuccessModal();
    return navigate("/admin/recruitment");
  };

  // const submitFunc =
  const jobPostingForm = () => {
    const listedRequirementForm = (props) => {
      const { counter, setCounter, element, title, setValue } = props || {};

      const handleOnChange = (e, i) => {
        const data = e.target.value;
        const objectData = formValues[element];
        objectData[i] = data;
        return setValue((data) => ({
          ...data,
          [element]: objectData,
        }));
      };

      const requirementsObject = (_x, i) => {
        const count = i + 1;
        return (
          <div key={i} className="flex flex-row items-center gap-2">
            <CustomInput
              className="peer w-full bg-transparent px-2 py-2"
              value={formValues[element][i]}
              type="text"
              label={count + ". " + title}
              onChange={(e) => handleOnChange(e, i)}
            />
            {i > 0 && (
              <div
                className="mb-4 cursor-pointer rounded-full bg-gray-100 p-1 px-2 text-center text-xs font-bold text-gray-500 hover:bg-red-100 hover:text-red-500"
                onClick={() => {
                  const objectData = formValues[element];
                  objectData.splice(i, 1);
                  setCounter(objectData.length);
                  return setValue((data) => ({
                    ...data,
                    [element]: objectData,
                  }));
                }}
              >
                X
              </div>
            )}
          </div>
        );
      };

      return (
        <div className="col-span-full">
          <div className="my-2 text-xs text-neutralGray">{title ?? "--"}</div>
          {[...Array(counter)].map(requirementsObject)}
          <div
            className="cursor-pointer text-sm text-primaryBlue"
            onClick={() => setCounter((data) => data + 1)}
          >
            + Add New {title ?? null}
          </div>
        </div>
      );
    };

    const jobQualificationList = () => {
      const propsContainer = {
        counter: qualificationCounter,
        setCounter: setQualificationCounter,
        element: "qualificationAndRequirements",
        title: "Job Qualification",
        setValue: setFormValues,
      };

      return listedRequirementForm(propsContainer);
    };

    const jobResponsibilityList = () => {
      const propsContainer = {
        counter: responsibiltyCounter,
        setCounter: setresponsibiltyCounter,
        element: "responsibilities",
        title: "Job Responsibility",
        setValue: setFormValues,
      };

      return listedRequirementForm(propsContainer);
    };

    const formElements = [
      {
        grid: 6,
        label: "Title",
        type: "text",
        name: "title",
      },
      {
        grid: 3,
        label: "Location",
        type: "text",
        name: "location",
      },
      {
        grid: 3,
        label: "Deadline",
        type: "date",
        name: "deadline",
      },
      {
        grid: 3,
        label: "Experience",
        type: "text",
        name: "experience",
      },
      {
        grid: 3,
        label: "Work Level",
        type: "text",
        name: "work_level",
      },
      {
        grid: 3,
        label: "Job Type",
        type: "text",
        name: "job_type",
      },
      {
        grid: 3,
        label: "Offer Salary",
        type: "number",
        name: "salary",
      },
    ];

    const handleOnChange = (e) => {
      const { name, value } = e.target || {};
      return setFormValues((data) => ({ ...data, [name]: value }));
    };

    const statusSelection = [
      {
        value: "ongoing",
        label: "On Going",
      },
      {
        value: "cancelled",
        label: "Cancelled",
      },
      {
        value: "completed",
        label: "Completed",
      },
    ];

    const renderStyle = (value) => {
      if (value == "ongoing") return " text-stateOrange";
      if (value == "completed") return " text-stateGreen";
      if (value == "cancelled") return "text-stateRed";
    };

    return (
      <div>
        <div className="mb-4 mt-8 text-xs text-neutralGray">Job Details</div>
        {id && (
          <div className={`w-40 ${renderStyle(formValues.status)}`}>
            <CustomSelect
              name="status"
              label="Status"
              placeholder="Please Select Status"
              value={formValues.status}
              isRequired={true}
              isEmpty={isEmpty}
              onChange={handleOnChange}
              options={statusSelection}
            />
          </div>
        )}
        <div className="grid gap-3 md:grid-cols-12">
          {formElements.map((item, key) => {
            const { grid, label, type, name } = item || {};
            return (
              <div key={key} className={"md:col-span-" + grid}>
                <CustomInput
                  name={name}
                  type={type}
                  label={label}
                  value={formValues[name]}
                  isRequired={true}
                  isEmpty={isEmpty}
                  onChange={handleOnChange}
                />
              </div>
            );
          })}
          <div className="col-span-full">
            <div className="my-2 text-xs text-neutralGray">Job Description</div>
            <CustomTextArea
              name="desc"
              label="Description"
              rows="5"
              value={formValues.desc}
              isRequired={true}
              isEmpty={isEmpty}
              onChange={handleOnChange}
            />
          </div>
          <div className="col-span-full">{jobResponsibilityList()}</div>
          <div className="col-span-full">{jobQualificationList()}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <CancelButton navigateTo="/admin/recruitment" />
      <div className="mt-5 min-h-fit w-full rounded-xl bg-white p-5 drop-shadow-xl">
        <div className="text-xl font-semibold text-neutralDark">
          {id ? "Update Job Post" : "Add New Job Post"}
        </div>
        {jobPostingForm()}
        <div className="flex justify-end">
          <div
            onClick={() => {
              if (!id) return createJobPostingAction();
              return openConfirmModal({
                modalAction: () => updateJobPostingAction(),
              });
            }}
            className="mt-2 flex items-center rounded-lg bg-primaryBlue px-6 py-2 text-highlight hover:cursor-pointer"
          >
            {!id ? "Add" : "Save Changes"}
          </div>
        </div>
      </div>
    </>
  );
}
