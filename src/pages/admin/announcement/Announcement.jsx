import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import DataTable from "../../../components/tables/datatable/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import * as Io5icons from "react-icons/io5";
import DropdownMenu from "../../../components/menu/DropdownMenu";
import { alertModalStore } from "../../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";
import { CustomInput } from "../../../components/inputs/CustomInput";
import FormModal from "../../../components/modal/FormModal";
import Form from "./components/Form";
import View from "./components/View";
import ViewModal from "../../../components/modal/ViewModal";
import { announcementStore } from "../../../utils/zustand/AdminStore/Announcement/announcementStore";
import moment from "moment";
import CustomToggle from "../../../components/toggle/CustomToggle";
import { DELETE, GET, POST, PUT } from "../../../services/api";
import { loadingStore } from "../../../utils/zustand/LoadingStore/loadingStore";
import {
  ISOTimeToUTC,
  ISOUTCtoTime,
} from "../../../utils/ISOTimeConverter/ISOTimeConverter";

export default function Announcement() {
  const { accessor } = createColumnHelper();

  const { openConfirmModal, openSuccessModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);
  const { announcement, fetchAllAnnouncement } = announcementStore(
    (state) => state,
    shallow,
  );
  const { loadingHoc } = loadingStore((state) => state, shallow);

  const [openForm, setOpenForm] = useState({});
  const [openViewModal, setOpenViewModal] = useState({});
  const [formValues, setFormValues] = useState({
    to: "all",
  });
  const [isEmpty, setIsEmpty] = useState(false);
  const [tableData, setTableData] = useState(announcement);

  useEffect(() => {
    setTableData(announcement);
  }, [announcement]);

  const ViewAnnouncement = async ({ _id }) => {
    loadingHoc(true);
    const { data, status } = await GET(`/announcements/${_id}`);

    if (status === 200) {
      loadingHoc(false);
      return setOpenViewModal({
        data: data,
        isOpen: true,
      });
    } else {
      loadingHoc(false);
    }
  };

  const actionList = [
    {
      _id: 1,
      label: "View",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoReaderOutline />,
      itemFunction: ({ original }) => ViewAnnouncement(original),
    },
    {
      _id: 2,
      label: "Update",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoCreateOutline />,
      itemFunction: ({ original }) => {
        setOpenForm({
          action: "Update",
          isOpen: true,
        });
        const dept_list = original?.dept_list?.map((item) => ({
          label: item.name,
          value: item._id,
        }));

        return setFormValues({
          ...original,
          day: moment(original.date).format("YYYY-MM-DD"),
          time: ISOUTCtoTime(original.date),
          dept_list,
        });
      },
    },
    {
      _id: 3,
      label: "Delete",
      textColor: "text-stateRed",
      icon: <Io5icons.IoTrashBinOutline />,
      itemFunction: ({ original }) => {
        openDeleteModal({
          modalAction: () => deleteAPI(original),
        });
      },
    },
  ];

  const deleteAPI = async ({ _id }) => {
    loadingHoc(true);
    const { status } = await DELETE(`/announcements/${_id}`);
    if (status === 201) {
      loadingHoc(false);
      openSuccessModal({
        message: "Deleted Successfully!",
        closeNameBtn: "Ok",
      });
      return fetchAllAnnouncement();
    } else {
      return loadingHoc(false);
    }
  };

  const columns = [
    accessor("date", {
      id: "date",
      header: "Date and Time",
      cell: ({ row }) => {
        const { date } = row?.original ?? {};
        return <div>{moment(date).format("MMMM DD, YYYY | h:mm A")}</div>;
      },
    }),
    accessor("title", {
      id: "title",
      header: "Title",
      cell: (info) => info.getValue(),
    }),
    accessor("to", {
      id: "to",
      header: "Receiver",
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    accessor("isPublished", {
      id: "isPublished",
      header: "Published",
      cell: ({ row }) => {
        const { original } = row ?? {};
        const toggleProps = {
          activeLabel: "On",
          inactiveLabel: "Off",
          onChange: () =>
            openConfirmModal({
              title: "Are you sure?",
              message: "Are you sure you want to publish this announcement?",
              confirmNameBtn: "Yes, Publish",
              modalAction: () => updateStatus(original),
            }),
          value: original.isPublished,
        };
        return <CustomToggle {...toggleProps} />;
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

  const updateStatus = async (original) => {
    loadingHoc(true);

    const params = {
      isPublished: !original?.isPublished,
    };
    const { status } = await PUT(
      `/announcements/publish/${original?._id}`,
      params,
    );
    if (status === 201) {
      openSuccessModal({
        title: "Success!",
        message: "Your changes has been successfully saved.",
        closeNameBtn: "Ok",
      });
      clearModal();
      return fetchAllAnnouncement();
    } else {
      loadingHoc(false);
    }
  };

  const clearModal = () => {
    loadingHoc(false);
    setIsEmpty(false);
    setOpenForm({});
    setFormValues({ to: "add" });
  };

  const openFormAction = () => {
    return setOpenForm({
      action: "Add",
      isOpen: true,
    });
  };

  const searchData = (value) => {
    const patternData = (item) =>
      pattern.test(moment(item?.date).format("MMMM DD, YYYY | h:mm A")) ||
      pattern.test(item?.title) ||
      pattern.test(item?.to);

    const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
    const fltdData = announcement.filter((item) => patternData(item));
    setTableData(fltdData);
  };

  const tableProps = {
    columns,
    rows: tableData,
    title: "Announcement",
    subTitle: "List of announcements",
    btnName: "New Announcement",
    openFormAction,
    searchOption: true,
    searchData,
  };

  const addAPI = async () => {
    const convertedTime = ISOTimeToUTC(formValues.time).split("T")[1];

    const params = {
      ...formValues,
      date: `${formValues.day}T${convertedTime}`,
      dept_list:
        formValues.to === "all"
          ? []
          : formValues?.dept_list?.length > 0
          ? formValues?.dept_list.map(({ value }) => value)
          : [],
    };
    const { status } = await POST("/announcements", params);

    if (status === 201) {
      clearModal();
      openSuccessModal();
      return fetchAllAnnouncement();
    } else {
      loadingHoc(false);
    }
  };

  const updateAPI = async () => {
    loadingHoc(true);
    const convertedTime = ISOTimeToUTC(formValues.time).split("T")[1];

    const params = {
      ...formValues,
      date: `${formValues.day}T${convertedTime}`,
      dept_list:
        formValues.to === "all"
          ? []
          : formValues?.dept_list?.length > 0
          ? formValues?.dept_list.map(({ value }) => value)
          : [],
    };

    const { status } = await PUT(`/announcements/${formValues?._id}`, params);
    if (status === 201) {
      openSuccessModal({
        title: "Success!",
        message: "Your changes has been successfully saved.",
        closeNameBtn: "Ok",
      });
      clearModal();
      return fetchAllAnnouncement();
    } else {
      loadingHoc(false);
    }
  };

  const announcementForm = () => {
    const isAdd = openForm.action === "Add";

    const body = () => {
      const formProps = {
        formValues,
        setFormValues,
        isEmpty,
      };
      return <Form {...formProps} />;
    };

    const submitFunc = () => {
      if (isAdd) {
        loadingHoc(true);
        addAPI();
      } else {
        openConfirmModal({
          modalAction: () => updateAPI(),
        });
      }
    };

    const validateFields = () => {
      const { to, title, day, time, details, dept_list } = formValues || {};

      if (to === "departments") {
        if (!title || !day || !time || !details || dept_list?.length === 0)
          return setIsEmpty(true);
        else return submitFunc();
      } else {
        if (!title || !day || !time || !details) return setIsEmpty(true);
        else return submitFunc();
      }
    };

    const modalProps = {
      title: isAdd ? "Add New Announcement" : "Update Announcement",
      body: body(),
      submit: {
        name: isAdd ? "Add" : "Update",
        btnFunction: () => validateFields(),
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

  const viewAnnouncement = () => {
    const modalProps = {
      title: openViewModal.data?.title,
      body: <View openViewModal={openViewModal} />,
      close: {
        name: "Close",
        btnFunction: () =>
          setOpenViewModal({
            isOpen: false,
          }),
      },
      isOpen: openViewModal.isOpen,
      maxWidth: "max-w-3xl",
    };

    return <ViewModal {...modalProps} />;
  };

  return (
    <div className="h-fit w-full rounded-xl bg-white p-5 drop-shadow-xl">
      {announcementForm()}
      {viewAnnouncement()}
      <DataTable {...tableProps} />
    </div>
  );
}
