import { createColumnHelper } from "@tanstack/react-table";
import React, { useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import DataTable from "../../../../../components/tables/datatable/DataTable";
import * as Io5icons from "react-icons/io5";
import FormModal from "./components/FormModal";
import Form from "./components/Form";
import { alertModalStore } from "../../../../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";
import BackButton from "../../../../../components/buttons/back-button/BackButton";

export default function ManageApplicants() {
  const { id } = useParams();
  const rows = useLoaderData();
  const { accessor } = createColumnHelper();

  const { openConfirmModal, openSuccessModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);

  const [tableData, setTableData] = useState(rows);
  const [openForm, setOpenForm] = useState({});
  const [formValues, setFormValues] = useState({});

  const clearModal = () => {
    setOpenForm({});
  };

  const openFormAction = () => {
    return setOpenForm({
      isOpen: true,
    });
  };

  const columns = [
    accessor("status", {
      id: "status",
      header: "Status",
      cell: (info) => info.getValue(),
    }),
    accessor("date", {
      id: "date",
      header: "Date",
      cell: (info) => info.getValue(),
    }),
    accessor("remarks", {
      id: "remarks",
      header: "Remarks",
      cell: (info) => info.getValue(),
    }),
  ];

  const headDetails = () => {
    return (
      <>
        <div className="mt-4">
          <div className="text-base font-medium text-neutralDark">
            Applicant’s Details
          </div>
          <div className="mb-8 grid gap-1 md:grid-cols-6">
            <div className="col-span-1 flex flex-row py-1 text-base text-neutralGray md:justify-between">
              <span>Name</span>
              <span>:</span>
            </div>
            <div className="text-base text-neutralDark md:col-span-5 ">
              Juan S. Dela Cruz Jr.
            </div>
            <div className="col-span-1 flex flex-row text-base text-neutralGray md:justify-between">
              <span>Applying For</span>
              <span>:</span>
            </div>
            <div className="text-base text-neutralDark md:col-span-5 ">
              Content Marketing Specialist
            </div>
            <div className="col-span-1 flex flex-row text-base text-neutralGray md:justify-between">
              <span>Status</span>
              <span>:</span>
            </div>
            <div className="text-base text-neutralDark md:col-span-5 ">
              Interviewing
            </div>
            <div className="col-span-1 flex flex-row text-base text-neutralGray md:justify-between">
              <span>Contact Number</span>
              <span>:</span>
            </div>
            <div className="text-base text-neutralDark md:col-span-5 ">
              098765655434
            </div>
            <div className="col-span-1 flex flex-row text-base text-neutralGray md:justify-between">
              <span>Email Address</span>
              <span>:</span>
            </div>
            <div className="text-base text-neutralDark md:col-span-5 ">
              juan@mail.com
            </div>
          </div>
          <div className="col-span-1 flex items-center md:col-span-2">
            <di className="mr-1 flex h-10 w-10 items-center justify-center rounded bg-lightBlue p-1">
              <Io5icons.IoDocumentText className="text-2xl text-neutralLight" />
            </di>
            <div className="flex flex-col justify-center">
              <span className="">Resume</span>
              <span className="text-sm text-neutralGray">resume.pdf</span>
            </div>
            <div className="ml-6 hover:cursor-pointer">
              <Io5icons.IoDownloadOutline className="text-2xl text-primaryBlue" />
            </div>
          </div>
          <div className="my-6 flex flex-col md:flex-row md:justify-between">
            <div className="">
              <div className="font-medium text-neutralDark">
                Application History
              </div>
              <div className="text-sm text-neutralGray">
                Monitor the application’s progress
              </div>
            </div>
            <div
              onClick={openFormAction}
              className="flex items-center justify-center rounded-xl bg-primaryBlue px-6 py-2 text-highlight hover:cursor-pointer"
            >
              <Io5icons.IoCreateOutline className="mr-2 text-lg" />
              <span>Update Status</span>
            </div>
          </div>
        </div>
      </>
    );
  };

  const tableProps = {
    columns,
    rows: tableData,
    title: "Juan S. Dela Cruz Jr.’s Application",
    headDetails,
    hasPagination: false,
  };

  const trainingForm = () => {
    const body = () => {
      const formProps = {
        formValues,
        setFormValues,
      };
      return <Form {...formProps} />;
    };
    const submitFunc = () => {
      openConfirmModal({
        modalAction: () => {
          openSuccessModal({
            title: "Success!",
            message: "Your changes has been successfully saved.",
            closeNameBtn: "Ok",
          });
          clearModal();
        },
      });
    };
    const modalProps = {
      title: "Update Status",
      body: body(),
      submit: {
        name: "Update",
        btnFunction: () => submitFunc(),
      },
      cancel: {
        name: "Cancel",
        btnFunction: () => clearModal(),
      },
      isOpen: openForm.isOpen,
      maxWidth: "max-w-3xl",
    };
    return <FormModal {...modalProps} />;
  };
  return (
    <>
      <BackButton />
      <div className="mt-2 h-full w-full rounded-xl bg-white p-5 drop-shadow-xl">
        {trainingForm()}
        <DataTable {...tableProps} />
      </div>
    </>
  );
}

export const manageApplicantsLoadder = () => {
  const rows = [
    {
      _id: 1,
      status: "Interviewing",
      date: "August 09, 2023",
      remarks: "Sample Remarks",
    },
    {
      _id: 2,
      status: "On Hold",
      date: "July 09, 2023",
      remarks: "Sample Remarks",
    },
    {
      _id: 3,
      status: "Short Listed",
      date: "June 09, 2023",
      remarks: "Sample Remarks",
    },
    {
      _id: 4,
      status: "Under Review",
      date: "May 09, 2023",
      remarks: "Sample Remarks",
    },
    {
      _id: 5,
      status: "Received",
      date: "April 09, 2023",
      remarks: "Sample Remarks",
    },
  ];
  return rows;
};
