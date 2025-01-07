import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import momentPlugin from "@fullcalendar/moment";

// Images
import profilebg from "../../../assets/background_image/homeprofilebg.png";

// Icons
import * as Io5icons from "react-icons/io5";
import ViewAnnouncement from "./Modals/ViewAnnouncement";
import { authStore } from "../../../utils/zustand/AuthStore/authStore";
import { shallow } from "zustand/shallow";
import fullNameFormat from "../../../utils/NameFormat/fullNameFormat";
import AnnouncementList from "./components/AnnouncementList";

export default function Dashboard() {
  const [openModal, setOpenModal] = useState("");
  const { userInformation } = authStore((state) => state, shallow);
  const { isEmployee, isAdmin } = userInformation ?? {};

  const renderHeader = (
    <div className="pb-10 pt-8">
      <div className="text-2xl font-medium capitalize text-neutralDark">
        Welcome, {isAdmin?.firstName ?? isEmployee?.firstName}!
      </div>
      <div className="text-base font-normal text-neutralDark">
        Hope you have an amazing day full of success and happiness!
      </div>
    </div>
  );

  const renderProfileDetails = () => {
    const { emp_no, designation_id, emp_img } = isAdmin
      ? isAdmin
      : isEmployee ?? {};
    const accountName = isAdmin ? isAdmin : isEmployee ?? {};
    return (
      <div className="col-span-2">
        <div className="relative w-full">
          <img
            className="relative h-[185px] w-full rounded-2xl "
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
              {fullNameFormat({ ...accountName, isMiddleInitial: true })}
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

  const renderTotalDetails = () => {
    const containersData = [
      {
        icon: <Io5icons.IoPerson className="text-lg text-primaryBlue" />,
        total: "100",
        description: "Total No. of Employee",
      },
      {
        icon: <Io5icons.IoBusiness className="text-lg text-primaryBlue" />,
        total: "100",
        description: "Total No. of Departments",
      },
      {
        icon: <Io5icons.IoBookmark className="text-lg text-primaryBlue" />,
        total: "100",
        description: "Total No. of Employee 2",
      },
      {
        icon: <Io5icons.IoIdCard className="text-lg text-primaryBlue" />,
        total: "100",
        description: "Total No. of Departments 2",
      },
      {
        icon: <Io5icons.IoReader className="text-lg text-primaryBlue" />,
        total: "100",
        description: "Total No. of Employee 3",
      },
      {
        icon: <Io5icons.IoPeople className="text-lg text-primaryBlue" />,
        total: "100",
        description: "Total No. of Departments 3",
      },
    ];

    return (
      <div className="col-span-5">
        <div className="grid grid-cols-3 gap-4">
          {containersData.map(({ icon, total, description }) => (
            <div
              className="flex flex-row items-center gap-3 rounded-2xl bg-white p-4 shadow-md"
              key={description}
            >
              <div className="rounded-2xl bg-lightBlue p-3.5">{icon}</div>
              <div className="flex flex-col">
                <span className="text-xl font-medium text-neutralDark">
                  {total}
                </span>
                <span className="text-xs text-neutralGray">{description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAnnouncement = () => {
    return (
      <div className="col-span-2 h-fit rounded-2xl bg-white p-4 shadow-md">
        <AnnouncementList viewRoute={"/admin/dashboard"} />
      </div>
    );
  };

  const renderCalendar = () => {
    const events = [
      {
        title: "Meeting",
        start: new Date("2023-08-15"),
      },
    ];

    const content = (eventInfo) => (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );

    return (
      <div className="col-span-5 rounded-2xl bg-white p-4 shadow-md">
        <div className="pb-6">
          <span className="text-base font-semibold text-neutralDark">
            Calender
          </span>
        </div>
        <div>
          <FullCalendar
            plugins={[dayGridPlugin, momentPlugin]}
            initialView="dayGridMonth"
            weekends={false}
            events={events}
            eventContent={content}
            titleFormat="MMMM YYYY"
            headerToolbar={{
              start: "prev,next",
              center: "title",
              end: "dayGridMonth,dayGridWeek,dayGridDay",
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderHeader}
      <div className="grid grid-cols-7 gap-6">
        {renderProfileDetails()}
        {renderTotalDetails()}
        {renderAnnouncement()}
        {renderCalendar()}
      </div>
      <ViewAnnouncement openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}
