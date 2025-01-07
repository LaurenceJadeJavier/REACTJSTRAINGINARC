import React, { useEffect, useRef } from "react";
import { useState } from "react";
import * as Io5icons from "react-icons/io5";
import {
  useLocation,
  useNavigate,
  useNavigation,
  useParams,
} from "react-router-dom";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import FormModal from "../../../../components/modal/FormModal";
import fileUpload from "../../../../utils/S3/fileUpload";
import moment from "moment";
import { employeeStore } from "../../../../utils/zustand/AdminStore/Employee/employeeStore";
import { shallow } from "zustand/shallow";

export default function Documents({ setFormProps }) {
  const navigate = useNavigate();
  const fileRef = useRef();
  const { id } = useParams();
  const { storeEmployeeForm, employeeForm } = employeeStore(
    (state) => state,
    shallow,
  );

  const [documents, setDocuments] = useState(
    employeeForm?.documents?.length > 0 ? employeeForm?.documents : [],
  );

  const [openModal, setOpenModal] = useState(false);
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    setFormProps({
      ...employeeForm,
      documents: documents,
    });
  }, [documents]);

  const onHandleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file")
      return setFormValues({
        ...formValues,
        [name]: e,
        tempFileName: value.split("C:\\fakepath\\")[1],
      });
    else return setFormValues({ ...formValues, [name]: value });
  };

  const body = () => {
    return (
      <div className="grid grid-cols-1">
        <CustomInput
          label="Description"
          name="name"
          type="text"
          value={formValues.name}
          onChange={onHandleChange}
          // isRequired
          // isEmpty={isEmpty}
        />
        <div
          className=" flex h-[3.8rem]"
          onClick={() => fileRef.current.click()}
        >
          <div className=" flex h-full w-32 items-center justify-center rounded-l-md bg-[#A7CFF1] p-2 text-white">
            Choose File
          </div>
          <input
            className="w-full rounded-r-md bg-lightBlue px-2 focus:outline-none"
            type="text"
            value={formValues.tempFileName}
          />
          <input
            // label="Description"
            className="w-full bg-lightBlue focus:outline-none"
            name="url"
            hidden
            type="file"
            ref={fileRef}
            // value={formValues.url}
            onChange={onHandleChange}
            // isRequired
            // isEmpty={isEmpty}
          />
        </div>
      </div>
    );
  };

  const validateFields = () => {
    const params = {
      fileContent: formValues.url,
      apiFunction: documentUpload,
    };
    return fileUpload({ ...params });
  };

  const documentUpload = (file) => {
    const now = new Date();

    const isoString = now.toISOString();

    let listOfDocuments = [...documents];
    listOfDocuments.push({
      name: formValues.name,
      url: file,
      createdAt: isoString,
    });
    clearModal();
    return setDocuments(listOfDocuments);
  };

  const clearModal = () => {
    setOpenModal(false);
    setFormValues({});
  };

  const showDocumentsModal = () => {
    const modalProps = {
      title: "Upload File",
      body: body(),
      submit: {
        name: "Upload",
        btnFunction: () => validateFields(),
      },
      cancel: {
        name: "Cancel",
        btnFunction: () => clearModal(),
      },
      isOpen: openModal,
      maxWidth: "max-w-lg",
    };

    return <FormModal {...modalProps} />;
  };

  return (
    <div className="scrollbar-hidden overflow-y-aut flex  h-full  flex-col justify-between pb-10">
      {showDocumentsModal()}
      <div>
        {documentsLayout()}
        {filesList()}
      </div>
      {navigationLayout()}
    </div>
  );

  function documentsLayout() {
    return (
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="flex flex-col">
          <span className="text-base font-medium text-neutralDark">
            Documents
          </span>
          <span className="text-sm  text-neutralGray">
            List of employee’s important files
          </span>
        </div>
        <button
          className="flex items-center justify-center text-primaryBlue"
          onClick={() => setOpenModal(true)}
        >
          <Io5icons.IoAddCircleOutline className="mr-2" />
          Upload File
        </button>
      </div>
    );
  }
  function filesList() {
    const removeDoc = (index) => {
      let listOfDocuments = [...documents];
      listOfDocuments.splice(index, 1);
      return setDocuments(listOfDocuments);
    };
    return (
      <div>
        {documents?.length > 0 ? (
          documents?.map(({ name, url, createdAt }, index) => {
            const getFileName = url.split("/");
            const file = getFileName[getFileName?.length - 1]?.split("?X")[0];

            return (
              <div className="mt-6 grid grid-cols-3 gap-4 " key={index}>
                <div className="min-w-xs col-span-1 flex   items-center overflow-hidden truncate">
                  <span className="mr-1 flex h-fit  w-10 items-center justify-center rounded bg-lightBlue p-2">
                    <Io5icons.IoDocumentText className="text-2xl text-neutralLight" />
                  </span>
                  <div className="flex flex-col">
                    <span className="">{name}</span>
                    <div className=" text-sm text-neutralGray">
                      {file + file}
                    </div>
                  </div>
                </div>
                <div className="col-span-1 text-sm ">
                  Date Added: {moment(createdAt)?.format("LL")}
                </div>
                <div className="col-span-1 flex cursor-pointer md:justify-end">
                  <Io5icons.IoTrashBinOutline
                    className="text-2xl text-stateRed"
                    onClick={() => removeDoc(index)}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div>No documents added.</div>
        )}
      </div>
    );
  }
  function navigationLayout() {
    return (
      <>
        <div className="mt-10 grid grid-cols-1 gap-2 justify-self-end md:grid-cols-5">
          <div className="col-span-1 flex flex-row justify-between text-right md:col-span-5">
            <div
              onClick={() =>
                // navigate("/admin/employees/create-employee/step-1")
                navigate(
                  `/admin/employees/${
                    id ? `manage-employee/${id}` : "create-employee"
                  }/step-1`,
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
                  }/step-3`,
                );
                storeEmployeeForm({ ...employeeForm, documents: documents });
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
