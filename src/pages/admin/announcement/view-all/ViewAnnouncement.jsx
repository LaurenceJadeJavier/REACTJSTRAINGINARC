import React, { useState } from "react";
import DataTable from "../../../../components/tables/datatable/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import BackButton from "../../../../components/buttons/back-button/BackButton";
import ViewModal from "../../../../components/modal/ViewModal";
import * as Io5icons from "react-icons/io5";
import { notificationStore } from "../../../../utils/zustand/NotificationStore/notificationStore";
import { shallow } from "zustand/shallow";
import moment from "moment";

export default function ViewAnnouncement() {
  const { accessor } = createColumnHelper();

  //global state
  const { announcementNotif } = notificationStore((state) => state, shallow); //table rows

  //local state
  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewData, setViewData] = useState({});

  const openModalFunc = (data) => {
    setViewData(data);
    setOpenViewModal(true);
  };

  //table columns
  const columns = [
    accessor("updatedAt", {
      id: "updatedAt",
      header: "Date and Time",
      cell: ({ row }) => {
        const { updatedAt } = row?.original ?? {};
        return <div>{moment(updatedAt).format("MMMM DD, YYYY")}</div>;
      },
    }),
    accessor("title", {
      id: "title",
      header: "Title",
      cell: (info) => info.getValue(),
    }),

    accessor("_id", {
      id: "_id",
      header: "Action",
      style: "w-20 ",
      cell: ({ row }) => (
        <div
          className="flex cursor-pointer items-center justify-center"
          onClick={() => openModalFunc(row?.original)}
        >
          <Io5icons.IoReaderOutline className="text-xl text-primaryBlue" />
        </div>
      ),
    }),
  ];

  const tableProps = {
    columns,
    rows: announcementNotif,
    title: "List of Announcement",
    searchOption: true,
  };

  const closeViewModal = () => {
    setOpenViewModal(false);
    setViewData({});
  };

  //view modal layout
  const viewAnnouncement = () => {
    const { title, updatedAt, details } = viewData ?? {};

    const customTitle = () => (
      <div className="flex flex-col">
        <div className="text-xl font-medium">{title}</div>
        <div className="flex items-center gap-1 text-sm text-primaryBlue">
          <Io5icons.IoCalendarClearOutline />
          <span>{moment(updatedAt)?.format("DD MMMM YYYY")}</span>
        </div>
      </div>
    );

    const body = () => {
      return <div className="pt-5">{details}</div>;
    };

    const modalProps = {
      customTitle: customTitle(),
      body: body(),
      close: {
        name: "Close",
        btnFunction: () => closeViewModal(),
      },
      isOpen: openViewModal,
      maxWidth: "max-w-2xl",
    };

    return <ViewModal {...modalProps} />;
  };

  return (
    <div className="flex flex-col gap-5">
      {viewAnnouncement()}
      <BackButton navigateTo={-1} />

      <div className="h-fit w-full rounded-xl bg-white p-5 drop-shadow-xl">
        <DataTable {...tableProps} />
      </div>
    </div>
  );
}
