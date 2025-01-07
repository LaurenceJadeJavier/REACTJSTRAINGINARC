import React, { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import * as Io5icons from "react-icons/io5";
import { createColumnHelper } from "@tanstack/react-table";
import DataTable from "../../../components/tables/datatable/DataTable";
import DropdownMenu from "../../../components/menu/DropdownMenu";
import * as Lucide from "react-icons/lu";
import { alertModalStore } from "../../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";
import { recruitmentStore } from "../../../utils/zustand/AdminStore/Recruitment/RecruitmentStore";
import moment from "moment";
import { DELETE } from "../../../services/api";

export default function Recruitment() {
  const { accessor } = createColumnHelper();
  const navigate = useNavigate();

  // Global State
  const { recruitmentData, fetchAllRecruitment } = recruitmentStore(
    (state) => state,
    shallow,
  );
  const { openSuccessModal, openDeleteModal } = alertModalStore(
    (state) => state,
    shallow,
  );

  const [tableData, setTableData] = useState(recruitmentData);

  useEffect(() => {
    setTableData(recruitmentData);
  }, [recruitmentData]);

  // Delete Job Posting Serivce (API)
  const deleteRecruitmentDataAction = async (id) => {
    try {
      const { status } = await DELETE("/recruitments/" + id);
      return status === 201 && serviceActionSuccess();
    } catch (err) {
      console.error(`err:`, err);
    }
  };

  // Success Action
  const serviceActionSuccess = () => {
    fetchAllRecruitment();
    return openSuccessModal({
      title: "Success!",
      message: "Your changes has been successfully saved.",
      closeNameBtn: "Ok",
    });
  };

  const actionList = [
    {
      _id: 1,
      label: "View",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoReaderOutline />,
      itemFunction: ({ original }) =>
        navigate(`/admin/recruitment/view-job-post/${original._id}`),
    },
    {
      _id: 2,
      label: "Update Post",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoCreateOutline />,
      itemFunction: ({ original }) =>
        navigate(`/admin/recruitment/update-job-post/${original._id}`, {
          state: original,
        }),
    },
    {
      _id: 3,
      label: "Manage",
      textColor: "text-primaryBlue",
      icon: <Lucide.LuFolderCog />,
      itemFunction: ({ original }) =>
        navigate("manage-applicants/" + original._id),
    },
    {
      _id: 4,
      label: "Delete",
      textColor: "text-stateRed",
      icon: <Io5icons.IoTrashBinOutline />,
      itemFunction: ({ original }) => {
        return openDeleteModal({
          modalAction: () => deleteRecruitmentDataAction(original?._id),
        });
      },
    },
  ];

  const columns = [
    accessor("createdAt", {
      id: "createdAt",
      header: "Date Posted",
      cell: (info) =>
        info.getValue() ? moment(info.getValue()).format("LL") : "--",
    }),
    accessor("title", {
      id: "title",
      header: "Title",
      cell: (info) => info.getValue(),
    }),
    accessor("noOfApplicants", {
      id: "noOfApplicants",
      header: "No. of Applicants",
      cell: (info) => info.getValue(),
    }),
    accessor("status", {
      id: "status",
      header: "status",
      cell: (info) => {
        const renderStyle = (type) => {
          let newStyle = "";

          if (info.getValue() == "ongoing") {
            if (type === "color")
              return (newStyle = "bg-lightOrange text-stateOrange");
            return (newStyle = "On Going");
          }

          if (info.getValue() == "completed") {
            if (type === "color")
              return (newStyle = "bg-lightGreen text-stateGreen");
            return (newStyle = "Completed");
          }

          if (info.getValue() == "cancelled") {
            if (type === "color")
              return (newStyle = "bg-lightRed text-stateRed");
            return (newStyle = "Cancelled");
          }

          return newStyle;
        };
        return (
          <span className={`rounded-md p-2 ${renderStyle("color")}`}>
            {renderStyle("text")}
          </span>
        );
      },
    }),
    accessor("_id", {
      id: "_id",
      header: "Action",
      style: "w-20 ",
      cell: ({ row }) => (
        <div className="text-center">
          <DropdownMenu actionList={actionList} row={row} />
        </div>
      ),
    }),
  ];

  const openFormAction = () => {
    navigate("create-job-post");
  };

  const searchData = (value) => {
    const patternData = (item) =>
      pattern.test(moment(item.createdAt).format("LL")) ||
      pattern.test(item?.title) ||
      pattern.test(item?.noOfApplicants) ||
      pattern.test(item?.status);

    const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
    const fltdData = recruitmentData.filter((item) => patternData(item));
    setTableData(fltdData);
  };

  const tableProps = {
    columns,
    rows: tableData,
    title: "Recruitment",
    subTitle: "List of job posting",
    btnName: "New Job Post",
    openFormAction,
    searchOption: true,
    searchData,
  };

  return (
    <>
      <div className="h-fit w-full rounded-xl bg-white p-5 drop-shadow-xl">
        <DataTable {...tableProps} />
      </div>
    </>
  );
}
