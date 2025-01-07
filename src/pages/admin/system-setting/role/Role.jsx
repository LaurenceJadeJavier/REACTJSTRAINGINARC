import React, { useEffect, useState } from "react";
import BackButton from "../../../../components/buttons/back-button/BackButton";
import DataTable from "../../../../components/tables/datatable/DataTable";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import DropdownMenu from "../../../../components/menu/DropdownMenu";
import * as Io5icons from "react-icons/io5";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";

export default function Role() {
  const navigate = useNavigate();
  const { accessor } = createColumnHelper();
  const rows = useLoaderData();
  const { openSuccessModal, openDeleteModal } = alertModalStore(
    (state) => state,
    shallow,
  );
  const { pathname } = useLocation();

  const [tableData, setTableData] = useState(rows);

  useEffect(() => {
    setTableData(rows);
  }, [rows]);

  const viewRole = () => {
    navigate(pathname + "/view", {
      state: [],
    });
  };

  const actionList = [
    {
      _id: 1,
      label: "View",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoReaderOutline />,
      itemFunction: () => viewRole(),
    },
    {
      _id: 2,
      label: "Update",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoCreateOutline />,
      itemFunction: () =>
        navigate(pathname + "/form", {
          state: {
            formType: "update",
            data: [],
          },
        }),
    },
    {
      _id: 3,
      label: "Delete",
      textColor: "text-stateRed",
      icon: <Io5icons.IoTrashBinOutline />,
      itemFunction: () =>
        openDeleteModal({
          modalAction: () =>
            openSuccessModal({
              title: "Success!",
              message: "Deleted Successfully!",
              closeNameBtn: "Ok",
            }),
        }),
    },
  ];

  const columns = [
    accessor("name", {
      id: "name",
      header: "Name",
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    accessor("_id", {
      id: "_id",
      header: "Action",
      style: "w-20",
      cell: (info) => (
        <div className="text-center">
          <DropdownMenu actionList={actionList} />
        </div>
      ),
    }),
  ];

  const openFormAction = () => {
    return navigate(pathname + "/form", {
      state: {
        formType: "add",
        data: [],
      },
    });
  };

  const searchData = (value) => {
    const patternData = (item) => pattern.test(item.name);

    const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
    const fltdData = rows.filter((item) => patternData(item));
    setTableData(fltdData);
  };

  const tableProps = {
    btnName: "Add",
    columns,
    rows: tableData,
    title: "Role",
    openFormAction,
    subTitle: "Control user roles and access levels",
    searchOption: true,
    searchData,
  };

  return (
    <div className="flex flex-col gap-5">
      <BackButton />
      <div className="flex h-[90vh] rounded-xl bg-white p-7 drop-shadow-lg">
        <DataTable {...tableProps} />
      </div>
    </div>
  );
}

export const roleLoader = () => {
  const res = Array(5).fill({
    _id: 1,
    name: "Sample role",
  });

  return res;
};
