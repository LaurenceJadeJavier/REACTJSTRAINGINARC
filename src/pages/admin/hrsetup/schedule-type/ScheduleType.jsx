import React, { useEffect, useState } from "react";
import DataTable from "../../../../components/tables/datatable/DataTable";
import * as Io5icons from "react-icons/io5";
import DropdownMenu from "../../../../components/menu/DropdownMenu";
import FormModal from "../../../../components/modal/FormModal";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";
import { useLoaderData } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { schedTypeStore } from "../../../../utils/zustand/AdminStore/HrSetup/schedTypeStore";
import moment from "moment";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";
import { DELETE, POST, PUT } from "../../../../services/api";
import {
  ISOTimeToUTC,
  ISOUTCtoTime,
} from "../../../../utils/ISOTimeConverter/ISOTimeConverter";

export default function ScheduleType() {
  const { accessor } = createColumnHelper();

  // Global State
  const { loadingHoc } = loadingStore((state) => state, shallow);
  const { openConfirmModal, openSuccessModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);
  const { scheduleType, fetchAllScheduleType } = schedTypeStore(
    (state) => state,
    shallow,
  );

  const defaultValues = {
    name: "",
    start_time: "",
    end_time: "",
  };

  // Local State
  const [openForm, setOpenForm] = useState({});
  const [isEmpty, setIsEmpty] = useState(false);
  const [formValues, setFormValues] = useState(defaultValues);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(scheduleType);
  }, [scheduleType]);

  // Clear Modal Value Action
  const clearModal = () => {
    setOpenForm({});
    setFormValues(defaultValues);
    setIsEmpty(false);
    loadingHoc(false);
  };

  const onHandleChange = ({ target }) => {
    const { name, value, type } = target;

    if (type === "time") {
      //convert time to UTC Timestamp
      setFormValues({ ...formValues, [name]: ISOTimeToUTC(value) });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const addAPI = async () => {
    const { status } = await POST("/schedule-types", formValues);
    if (status === 201) {
      openSuccessModal();
      clearModal();
      return fetchAllScheduleType();
    } else {
      return loadingHoc(false);
    }
  };

  const updateAPI = async () => {
    loadingHoc(true);
    const { status } = await PUT(
      `/schedule-types/${formValues?._id}`,
      formValues,
    );
    if (status === 201) {
      openSuccessModal({
        title: "Success!",
        message: "Your changes has been successfully saved.",
        closeNameBtn: "Ok",
      });
      clearModal();
      return fetchAllScheduleType();
    } else {
      loadingHoc(false);
    }
  };

  // Schedule Modal Form
  const scheduleTypeForm = () => {
    const isAdd = openForm.action === "Add";

    const body = () => {
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="col-span-1 md:col-span-2">
            <CustomInput
              label="Name"
              name="name"
              value={formValues.name}
              onChange={onHandleChange}
              isRequired
              isEmpty={isEmpty}
            />
          </div>
          <CustomInput
            type="time"
            name="start_time"
            label="Start Time"
            value={ISOUTCtoTime(formValues?.start_time)}
            onChange={onHandleChange}
            isRequired
            isEmpty={isEmpty}
          />
          <CustomInput
            type="time"
            name="end_time"
            label="End Time"
            value={ISOUTCtoTime(formValues.end_time)}
            onChange={onHandleChange}
            isRequired
            isEmpty={isEmpty}
          />
        </div>
      );
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

    const validateField = () => {
      const { name, start_time, end_time } = formValues ?? {};
      if (!name || !start_time || !end_time) return setIsEmpty(true);
      else return submitFunc();
    };

    const modalProps = {
      title: isAdd ? "Add New Schedule Type" : "Update Schedule Type",
      body: body(),
      submit: {
        name: isAdd ? "Add" : "Update",
        btnFunction: () => validateField(),
      },
      cancel: {
        name: "Cancel",
        btnFunction: () => clearModal(),
      },
      isOpen: openForm.isOpen,
      maxWidth: "max-w-lg",
    };

    return <FormModal {...modalProps} />;
  };

  // Schedule Table
  const scheduleTable = () => {
    const actionList = [
      {
        _id: 1,
        label: "Update",
        textColor: "text-primaryBlue",
        icon: <Io5icons.IoCreateOutline />,
        itemFunction: ({ original }) => {
          setOpenForm({
            action: "Update",
            isOpen: true,
          });
          return setFormValues(original);
        },
      },
      {
        _id: 2,
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
      const { status } = await DELETE(`/schedule-types/${_id}`);

      if (status === 201) {
        openSuccessModal({
          title: "Success!",
          message: "Deleted Successfully!",
          closeNameBtn: "Ok",
        });
        fetchAllScheduleType();
        return loadingHoc(false);
      } else return loadingHoc(false);
    };

    const columns = [
      accessor("name", {
        id: "name",
        header: "Name",
        cell: (info) => info.getValue(),
      }),
      accessor("start_time", {
        id: "start_time",
        header: "Work Starts",
        cell: (info) => moment(info?.getValue()).format("LT"),
      }),
      accessor("end_time", {
        id: "end_time",
        header: "Work Ends",
        cell: (info) => moment(info?.getValue()).format("LT"),
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
      setOpenForm({ action: "Add", isOpen: true });
    };

    const searchData = (value) => {
      const patternData = (item) =>
        pattern.test(item?.name) ||
        pattern.test(moment(item?.start_time).format("LT")) ||
        pattern.test(moment(item?.end_time).format("LT"));

      const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
      const fltdData = scheduleType.filter((item) => patternData(item));
      setTableData(fltdData);
    };

    const tableProps = {
      columns,
      rows: tableData,
      title: "Schedule Type",
      subTitle: "List of schedule types",
      btnName: "New Schedule Type",
      openFormAction,
      setOpenForm,
      searchOption: true,
      searchData,
    };

    return <DataTable {...tableProps} />;
  };

  return (
    <div className="h-fit w-full rounded-xl bg-white p-5 drop-shadow-xl">
      {scheduleTypeForm()}
      {scheduleTable()}
    </div>
  );
}
