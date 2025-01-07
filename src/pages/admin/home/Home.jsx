import React, { Fragment, useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import momentPlugin from "@fullcalendar/moment";
import interactionPlugin from "@fullcalendar/interaction"; // for selectable
import timeGridPlugin from "@fullcalendar/timegrid";
import { Calendar } from "@fullcalendar/core";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

// components
import ApplicationRequest from "./Application/ApplicationRequest";
import ViewAnnouncement from "./Modals/ViewAnnouncement";

// Images
import profilebg from "../../../assets/background_image/homeprofilebg.png";

// Icons
import * as Io5icons from "react-icons/io5";
import ApplicationHistory from "./Application/ApplicationHistory";
import { applicationStore } from "../../../utils/zustand/AdminStore/ApplicationStore/applicationStore";
import { shallow } from "zustand/shallow";
import DataTable from "../../../components/tables/datatable/DataTable";
import { createColumnHelper } from "@tanstack/table-core";
import { GET } from "../../../services/api";
import moment from "moment";
import { Menu, Transition } from "@headlessui/react";
import { CustomDatePicker } from "../../../components/inputs/CustomDatePicker";
import TimeinAndTimeout from "./components/TimeinAndTimeout";
import { employeeIDStore } from "../../../utils/zustand/AdminStore/EmployeeStore/EmployeeID";
import { employeeAccStore } from "../../../utils/zustand/EmployeeStore/EmployeeAccStore";
import { authStore } from "../../../utils/zustand/AuthStore/authStore";
import fullNameFormat from "../../../utils/NameFormat/fullNameFormat";
import Notification from "../../../components/notifcation/Notification";

const filterCutOff = [
  {
    title: "First Cut-off 1-15",
    value: "&cutoff=1",
  },
  {
    title: "Second Cut-off 16-31",
    value: "&cutoff=2",
  },
  {
    title: "Monthly Cut-off 1-31",
    value: "",
  },
];

export default function Home() {
  const calendarRef = useRef();
  const navigate = useNavigate();
  const { accessor } = createColumnHelper();

  // Global State
  const { applicationData } = applicationStore((state) => state, shallow);
  const { employeeidData } = employeeIDStore((state) => state, shallow);
  const { userInformation } = authStore((state) => state, shallow);

  const { isEmployee } = userInformation ?? {};

  const [startDate, setStartDate] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [openModal, setOpenModal] = useState("");
  const [selected, setSelected] = useState(filterCutOff[0]);
  const [getCalendarData, setGetCalendarData] = useState([]);

  useEffect(() => {
    if (employeeidData?.isEmployee?._id) {
      getAttendancesAPI();
    }
  }, [selected, startDate, employeeidData]);

  useEffect(() => {
    if (employeeidData?.isEmployee?._id) {
      getEmployeeScheduleAPI();
    }
  }, [employeeidData]);

  const getAttendancesAPI = async () => {
    const stringDate = startDate.toString();
    const momentMonth = moment(stringDate).format("M");
    const momentYear = moment(stringDate).format("YYYY");

    await GET(
      `/attendances/employees/${employeeidData?.isEmployee?._id}?month=${momentMonth}&${momentYear}${selected?.value}`,
    ).then(({ data, status }) => {
      if (status === 200) {
        setAttendanceData(data);
      }
    });
  };

  const getEmployeeScheduleAPI = async () => {
    let calendarFilteredData = [];
    const stringDate = calendarDate.toString();
    const momentMonth = moment(stringDate).format("M");
    const momentYear = moment(stringDate).format("YYYY");

    await GET(
      `/schedules/employees/${employeeidData?.isEmployee?._id}?month=${momentMonth}&year=${momentYear}`,
    ).then(({ data, status }) => {
      if (status === 200) {
        data.map(({ holiday, application }) => {
          if (holiday.length > 0) {
            return holiday.filter((item) => {
              const changeData = {
                type: "holiday",
                name: item?.name,
                title: item?.type,
                start: moment(item?.date).format("YYYY-MM-DD"),
              };
              calendarFilteredData.push(changeData);
            });
          }
          if (application.length > 0) {
            return application.filter((item) => {
              const changeData = {
                type: "application",
                name: item?.name,
                title: item?.type,
                start: moment(item?.start_time).format("YYYY-MM-DD"),
                end: moment(item?.end_time).format("YYYY-MM-DD"),
              };
              calendarFilteredData.push(changeData);
            });
          }
        });

        setGetCalendarData(calendarFilteredData);
      }
    });
  };

  const addMonths = (date, months, prev) => {
    if (prev === "prev") {
      date.setMonth(date.getMonth() - months);
    } else {
      date.setMonth(date.getMonth() + months);
    }

    return date;
  };

  const renderHeader = (
    <div className="pb-10 ">
      <div className="flex justify-between">
        <div className="flex flex-col ">
          <div className="text-2xl font-medium text-neutralDark">
            Good Day, {isEmployee?.firstName ?? ""}!
          </div>
          <div className="text-base font-normal text-neutralDark">
            Hope you have an amazing day full of success and happiness!
          </div>
        </div>
        <Notification viewRoute={"/admin/home"} />
      </div>
    </div>
  );

  const renderProfileDetails = () => {
    const { emp_no, designation_id, emp_img } = isEmployee ?? {};
    return (
      <div className="col-span-2">
        <div className="relative w-full">
          <img
            className="relative h-[183px] w-full rounded-2xl "
            src={profilebg}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            {emp_img ? (
              <div className="rounded-full border border-aquablue bg-neutralLight  text-white">
                <img
                  src={emp_img}
                  alt="Employee Image"
                  className="h-16 w-16 rounded-full text-white"
                />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full border border-aquablue bg-neutralLight p-2 text-white">
                <Io5icons.IoPerson className=" h-full w-full text-white" />
              </div>
            )}

            <span className="text-lg font-medium text-white">
              {fullNameFormat({ ...isEmployee, isMiddleInitial: true })}
            </span>
            <span className="text-normal text-sm capitalize text-white">
              {emp_no ?? "- - - -"}
            </span>
            <span className="text-normal text-sm capitalize text-white">
              {designation_id?.name ?? "- - - -"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const content = ({ event }) => {
      const { title, _def } = event ?? {};

      let textcolor = "";
      let texttitle = "";

      if (title === "official_bussiness") {
        texttitle = "Official Business";
      } else if (title === "failure_to_log") {
        texttitle = "Failure to Log";
      } else if (title === "overtime") {
        texttitle = "Overtime";
      } else if (title === "rest_day") {
        texttitle = "Rest Day";
      } else if (title === "leave") {
        texttitle = "Leave";
      } else if (title === "non-regular") {
        textcolor = "text-stateGreen";
      } else if (title === "regular") {
        textcolor = "text-stateOrange";
      }

      return (
        <>
          {_def?.extendedProps?.type === "application" && (
            <div
              className={`flex w-full flex-row rounded-[4px] bg-lightRed px-1 py-0.5`}
            >
              <div
                className={`overflow-hidden text-ellipsis text-xs font-medium capitalize text-stateRed`}
              >
                {texttitle}
              </div>
            </div>
          )}
          {_def?.extendedProps?.type === "holiday" && (
            <div className="flex flex-row items-center gap-1 rounded-[4px] bg-white px-1">
              <div>
                <Io5icons.IoEllipse className={`${textcolor} h-2 w-2`} />
              </div>
              <span className="overflow-hidden text-ellipsis text-sm font-medium capitalize text-neutralDark">
                {_def?.extendedProps?.name}
              </span>
            </div>
          )}
        </>
      );
    };

    return (
      <div className="rounded-2xl bg-white p-4 shadow-md">
        <div className="pb-6">
          <span className="text-base font-semibold text-neutralDark">
            Calender
          </span>
        </div>
        <div>
          <FullCalendar
            ref={calendarRef}
            plugins={[
              interactionPlugin,
              dayGridPlugin,
              momentPlugin,
              timeGridPlugin,
            ]}
            initialView="dayGridMonth"
            weekends={true}
            events={getCalendarData}
            eventContent={content}
            titleFormat="MMMM YYYY"
            customButtons={{
              myCustomButton: {
                icon: "chevron-left",
                click: () => {
                  const calendarAPI = calendarRef?.current?.getApi();
                  calendarAPI?.prev();
                  const result = addMonths(calendarDate, 1, "prev");
                  getEmployeeScheduleAPI();
                  return setCalendarDate(result);
                },
              },
              myCustomButton2: {
                icon: "chevron-right",
                click: () => {
                  const calendarAPI = calendarRef?.current?.getApi();
                  calendarAPI?.next();
                  const result = addMonths(calendarDate, 1, "next");
                  getEmployeeScheduleAPI();
                  return setCalendarDate(result);
                },
              },
            }}
            headerToolbar={{
              start: "myCustomButton,myCustomButton2",
              center: "title",
              end: "",
            }}
          />
        </div>
      </div>
    );
  };

  const renderAttendance = () => {
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
          id: "day",
          header: "Day",
          style: "text-xs truncate",
          cell: ({ row: { original } }) =>
            moment(original?.date).format("dddd"),
        },
        {
          id: "timein",
          header: "Time In",
          style: "text-xs truncate",
          cell: ({ row: { original } }) =>
            original?.attendance
              ? moment(original?.attendance?.time_in).format("h:mm A")
              : "-",
        },
        {
          id: "time_out",
          header: "Time Out",
          style: "text-xs truncate",
          cell: ({ row: { original } }) =>
            original?.attendance
              ? moment(original?.attendance?.time_out).format("h:mm A")
              : "-",
        },
        {
          id: "sched_in",
          header: "Sched In",
          style: "text-xs truncate",
          cell: ({ row: { original } }) =>
            original?.attendance
              ? moment(original?.attendance?.sched_in).format("h:mm A")
              : "-",
        },
        {
          id: "sched_out",
          header: "Sched Out",
          style: "text-xs truncate",
          cell: ({ row: { original } }) =>
            original?.attendance
              ? moment(original?.attendance?.sched_out).format("h:mm A")
              : "-",
        },
        {
          id: "late_time",
          header: "Late Time",
          style: "text-xs truncate",
          cell: ({ row: { original } }) =>
            original?.attendance ? original?.attendance?.late_time : "-",
        },
        {
          id: "hoursofwork",
          header: "Hours of Work",
          style: "text-xs truncate",
          cell: ({ row: { original } }) =>
            original?.attendance ? original?.attendance?.hrs_work : "-",
        },
        {
          id: "under_time",
          header: "Under Time",
          style: "text-xs truncate",
          cell: ({ row: { original } }) =>
            original?.attendance ? original?.attendance?.under_time : "-",
        },
        {
          id: "status",
          header: "Status",
          style: "text-xs truncate",
          cell: ({ row: { original } }) => (
            <div className="uppercase">
              {original?.attendance ? original?.attendance?.status : "-"}
            </div>
          ),
        },
      ];

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

    const renderSelectCutoff = (
      <div className="">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-primaryBlue hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
              {selected?.title}
              <Io5icons.IoChevronDownOutline
                className="-mr-1 ml-2 h-5 w-5 text-primaryBlue"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1 ">
                {filterCutOff.map((item) => (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setSelected(item)}
                        className={`${
                          active
                            ? "bg-primaryBlue/40 text-white"
                            : "text-neutralDark"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {item?.title}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    );

    return (
      <div className="rounded-2xl bg-white p-4 shadow-md">
        <div className="flex flex-row items-center justify-between">
          <span className="text-base font-semibold text-neutralDark">
            Time Attendance
          </span>
          <div className="flex w-fit flex-row items-center gap-1 rounded-2xl bg-lightBlue p-2">
            <Io5icons.IoPrintOutline className="h-4 w-4 text-primaryBlue" />
            <span className="text-sm text-primaryBlue">Print</span>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between pt-4">
          <CustomDatePicker state={startDate} setState={setStartDate} />
          {renderSelectCutoff}
        </div>
        {timesheetTable()}
      </div>
    );
  };

  return (
    <div>
      {renderHeader}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Container */}
        <div className="col-span-4 grid grid-cols-2 gap-4">
          {renderProfileDetails()}
          <ApplicationRequest navigate={navigate} />

          <ApplicationHistory navigate={navigate} data={applicationData} />
        </div>
        {/* Right Container */}
        <div className="col-span-8 flex basis-[67%] flex-col gap-4">
          <TimeinAndTimeout />
          {renderCalendar()}
        </div>
        <div className="col-span-12">{renderAttendance()}</div>
      </div>
      <ViewAnnouncement openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}
