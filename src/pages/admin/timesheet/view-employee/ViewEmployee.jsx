import React, { useEffect, useState } from "react";
import BackButton from "../../../../components/buttons/back-button/BackButton";
import * as Io5icons from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import DataTable from "../../../../components/tables/datatable/DataTable";
import { CustomDatePicker } from "../../../../components/inputs/CustomDatePicker";

import UpdateTimesheet from "../Modals/UpdateTimesheet";
import { GET, PUT } from "../../../../services/api";
import moment from "moment";
import { CustomSelectCutoff } from "../../../../components/inputs/CustomSelectCutoff";
import { shallow } from "zustand/shallow";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";

export const DropdownUI = (
  setOpenModal,
  original,
  setFormValues,
  setGetUpdatedDate,
) => {
  return (
    <div className="flex justify-center">
      <Io5icons.IoCreateOutline
        className="cursor-pointer text-lg text-primaryBlue"
        onClick={
          original.attendance
            ? () => {
                setFormValues({
                  ...original.attendance,
                });
                setGetUpdatedDate(original?.attendance?.time_in);
                setOpenModal("updatetimesheet");
              }
            : () => {}
        }
      />
    </div>
  );
};

export default function ViewEmployee() {
  const { state } = useLocation();
  const { accessor } = createColumnHelper();

  const [openModal, setOpenModal] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);

  const [startDate, setStartDate] = useState(new Date());
  const [cutOffData, setCuttOffData] = useState({
    title: "Monthly Cut-off 1-31",
    value: "",
  });

  const [formValues, setFormValues] = useState({});
  const [getUpdatedDate, setGetUpdatedDate] = useState("");

  const { openConfirmModal, openSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
  );
  const { loadingHoc } = loadingStore((state) => state, shallow);

  useEffect(() => {
    getAttendancesAPI();
  }, [startDate, cutOffData]);

  const getAttendancesAPI = async () => {
    loadingHoc(true);
    const stringDate = startDate.toString();
    const momentMonth = moment(stringDate).format("M");
    const momentYear = moment(stringDate).format("YYYY");

    await GET(
      `/attendances/employees/${state?._id}?month=${momentMonth}&${momentYear}${cutOffData?.value}`,
    ).then(({ data, status }) => {
      if (status === 200) {
        setAttendanceData(data);
        return loadingHoc(false);
      } else return loadingHoc(false);
    });
  };

  const updateSuccessAction = async () => {
    loadingHoc(true);
    const { time_in, time_out, _id } = formValues || {};
    //separate time and date
    const getSplitTimeIn = time_in.split("T");
    const getSplitTimeOut = time_out.split("T");

    //get the selected date
    const date = moment(getUpdatedDate).format("YYYY-MM-DD");

    const params = {
      ...formValues,

      //combine selected date and time
      time_in: `${date}T${getSplitTimeIn[1]}`,
      time_out: `${date}T${getSplitTimeOut[1]}`,
    };

    const { status } = await PUT(`attendances/${_id}`, params);
    if (status === 201) return clearModalValues();
    else return loadingHoc(false);
  };

  //clear modal
  const clearModalValues = () => {
    setOpenModal("");
    setFormValues({});
    setGetUpdatedDate("");
    getAttendancesAPI();
    loadingHoc(false);
    return openSuccessModal({
      title: "Success!",
      message: "Your changes has been successfully saved.",
      closeNameBtn: "Ok",
    });
  };

  const updateTimeInandOut = () => {
    openConfirmModal({
      title: "Are you sure?",
      message: "Are you sure you want to update this?",
      closeNameBtn: "Cancel",
      confirmNameBtn: "Yes, Update",
      modalAction: () => updateSuccessAction(),
    });
  };

  const renderHeader = () => {
    const filterCutOff = [
      {
        title: "Monthly Cut-off 1-31",
        value: "",
      },
      {
        title: "First Cut-off 1-15",
        value: "&cutoff=1",
      },
      {
        title: "Second Cut-off 16-31",
        value: "&cutoff=2",
      },
    ];

    return (
      <div className="flex flex-row justify-between">
        <span className="text-xl font-medium text-neutralDark">
          Employee Monthly Timesheet
        </span>
        <div className="flex flex-row items-center gap-2">
          <CustomDatePicker state={startDate} setState={setStartDate} />
          <CustomSelectCutoff
            selectData={filterCutOff}
            setCuttOffData={setCuttOffData}
          />
          <button className="flex flex-row gap-2 rounded-xl bg-primaryBlue px-4 py-2">
            <span className="text-sm font-normal text-white">Download</span>
            <Io5icons.IoDownloadOutline className="text-sm text-white" />
          </button>
        </div>
      </div>
    );
  };

  const renderProfile = (
    <div className="mt-8 flex flex-row gap-4">
      <div className="rounded-full border border-neutralDark p-1">
        <img
          className="h-20 w-20 rounded-full"
          src={state?.emp_img}
          alt="employeeimg"
        />
      </div>
      <div className="flex flex-col justify-evenly">
        <div className="flex flex-row items-center gap-2">
          <span className="text-base font-medium text-neutralDark">
            {state?.firstName}
            {state?.middleName ? " " : null}
            {state?.middleName} {state?.lastName}
          </span>
        </div>
        <span className="text-sm font-normal text-neutralDark">
          {state?.departments?.name}
        </span>
        <span className="text-sm font-normal text-neutralDark">
          {state?.designations?.name}
        </span>
      </div>
    </div>
  );

  const timesheetTable = () => {
    const columnData = [
      {
        id: "date",
        header: "Date",
        style: "text-xs truncate",
        cell: ({ row: { original } }) =>
          moment(original?.date).format("MMM DD"),
      },
      {
        id: "timein",
        header: "Time In",
        style: "text-xs truncate",
        cell: ({ row: { original } }) =>
          original?.attendance?.time_in
            ? moment(original?.attendance?.time_in).format("h:mm A")
            : "-",
      },
      {
        id: "lunch_out",
        header: "Lunch Out",
        style: "text-xs truncate",
        cell: ({ row: { original } }) =>
          original?.attendance?.lunch_out
            ? moment(original?.attendance?.lunch_out).format("h:mm A")
            : "-",
      },
      {
        id: "lunch_in",
        header: "Lunch In",
        style: "text-xs truncate",
        cell: ({ row: { original } }) =>
          original?.attendance?.lunch_in
            ? moment(original?.attendance?.lunch_in).format("h:mm A")
            : "-",
      },
      {
        id: "time_out",
        header: "Time Out",
        style: "text-xs truncate",
        cell: ({ row: { original } }) =>
          original?.attendance?.time_out
            ? moment(original?.attendance?.time_out).format("h:mm A")
            : "-",
      },
      {
        id: "sched_in",
        header: "Sched In",
        style: "text-xs truncate",
        cell: ({ row: { original } }) =>
          original?.schedule?.start_time
            ? moment(original?.schedule?.start_time).format("h:mm A")
            : "-",
      },
      {
        id: "sched_out",
        header: "Sched Out",
        style: "text-xs truncate",
        cell: ({ row: { original } }) =>
          original?.schedule?.end_time
            ? moment(original?.schedule?.end_time).format("h:mm A")
            : "-",
      },
      {
        id: "late_time",
        header: "Late Time",
        style: "text-xs truncate",
        cell: ({ row: { original } }) =>
          original?.calcWorkHrs?.lateTime
            ? original?.calcWorkHrs?.lateTime
            : "0",
      },
      {
        id: "under_time",
        header: "Under Time",
        style: "text-xs truncate",
        cell: ({ row: { original } }) =>
          original?.calcWorkHrs?.underTime
            ? original?.calcWorkHrs?.underTime
            : "0",
      },
      {
        id: "hoursofwork",
        header: "Hours of Work",
        style: "text-xs truncate",
        cell: ({ row: { original } }) =>
          original?.calcWorkHrs?.schedHrs
            ? original?.calcWorkHrs?.schedHrs
            : "0",
      },
      {
        id: "status",
        header: "Status",
        style: "text-xs truncate",
        cell: ({ row: { original } }) => statusLayout(original),
      },
      {
        id: "_id",
        header: "Update",
        style: "text-xs truncate",
        cell: ({ row: { original } }) =>
          DropdownUI(setOpenModal, original, setFormValues, setGetUpdatedDate),
      },
    ];

    const statusLayout = ({ application }) => {
      return (
        <div className="capitalize">
          {application?.length > 0 ? application[0]?.type : "-"}
        </div>
      );
    };

    // Table Column
    const columns = columnData.map((item) =>
      accessor(item?.id, {
        ...item,
      }),
    );

    // Table Config
    const tableProps = {
      columns,
      rows: attendanceData,
    };

    return tableProps && <DataTable {...tableProps} />;
  };

  return (
    <div>
      <BackButton navigateTo="/admin/time-sheet" />
      <div className="mt-6 rounded-2xl bg-white px-4 py-6">
        {renderHeader()}
        {renderProfile}
        {timesheetTable()}
      </div>
      <UpdateTimesheet
        openModal={openModal}
        setOpenModal={setOpenModal}
        action={updateTimeInandOut}
        formValues={formValues}
        setFormValues={setFormValues}
      />
    </div>
  );
}
