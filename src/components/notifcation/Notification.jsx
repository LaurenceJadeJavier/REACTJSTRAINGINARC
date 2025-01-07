import { Menu, Transition } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import * as Io5icons from "react-icons/io5";
import ViewModal from "../modal/ViewModal";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { authStore } from "../../utils/zustand/AuthStore/authStore";
import { shallow } from "zustand/shallow";
import { notificationStore } from "../../utils/zustand/NotificationStore/notificationStore";
import socket from "../../utils/socket/socket";

export default function Notification({ viewRoute }) {
  const navigate = useNavigate();

  //global state
  const { userInformation } = authStore((state) => state, shallow);
  const { announcementNotif, newNotification } = notificationStore(
    (state) => state,
    shallow,
  );

  //local state
  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewData, setViewData] = useState({});
  const [notif, setNotif] = useState({});

  //trigger when new notif receive
  useEffect(() => {
    const { isAdmin, isEmployee } = userInformation ?? {};
    newNotification(
      announcementNotif,
      isEmployee?._id,
      isEmployee?.dept_id?._id,
      isAdmin,
    );
  }, [socket, announcementNotif]);

  //sort notification by date
  useEffect(() => {
    const notifcationList = Object.groupBy(
      announcementNotif,
      ({ updatedAt }) =>
        moment(updatedAt).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD") //if today's date is equal to notif date
          ? "Today"
          : moment(updatedAt).format("DD MMMM YYYY"), // format notif date to eq. 25 September 2023
    );
    setNotif(notifcationList);
  }, [announcementNotif]);

  //function for store selected details and open modal
  const openModalFunc = (data) => {
    setViewData(data);
    setOpenViewModal(true);
  };

  //show only when date today is equal to notif date eg. 2hours ago / 1 minute ago
  const validateDay = (updatedAt) => {
    if (
      moment(updatedAt).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
    ) {
      return moment(updatedAt).fromNow();
    }
  };

  //show menu layout after clicking bell icon
  const notificationMenu = () => {
    return (
      <Menu as="div" className="relative inline-block ">
        <div>
          <Menu.Button className=" inline-flex w-full flex-row items-center rounded-md bg-opacity-20 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ">
            <Io5icons.IoNotifications className="h-6 w-6 text-primaryBlue" />
          </Menu.Button>
        </div>

        {!openViewModal && (
          <Transition appear>
            <Menu.Items className="absolute right-0  z-30 w-[30rem] origin-top-right divide-y divide-gray-100  rounded-2xl bg-white shadow-2xl focus:outline-none">
              <div className="flex flex-col gap-2 p-5">
                <div className="flex flex-row items-center justify-between">
                  <div className="font-medium">Announcement</div>
                  <button
                    className="text-sm text-primaryBlue"
                    onClick={() => navigate(`${viewRoute}/announcement-view`)}
                  >
                    View all
                  </button>
                </div>
                <div className="grid max-h-72 grid-cols-1 gap-2 overflow-y-scroll pr-2">
                  {announcementNotif?.length > 0 ? (
                    Object.keys(notif).map(
                      (
                        date, //map group by date example value -> Today or 25 September 2023 and etc.
                      ) => (
                        <div className="flex flex-col gap-1 " key={date}>
                          <div className="text-sm font-medium capitalize">
                            {date}
                          </div>
                          <div className="flex flex-col  divide-y-2 divide-gray-100">
                            {notif[date].map((data) => {
                              //map based on date as index
                              const { title, details, updatedAt } = data ?? {};
                              return (
                                <div
                                  className="flex cursor-pointer items-center gap-2 rounded-md py-2 hover:bg-slate-100"
                                  key={updatedAt}
                                  onClick={() => openModalFunc(data)}
                                >
                                  <div className="rounded-md bg-highlight p-2">
                                    <Io5icons.IoNotifications className="h-7 w-7 text-neutralLight" />
                                  </div>
                                  <div className="flex w-full flex-col text-sm">
                                    <div className="flex  justify-between overflow-hidden truncate ">
                                      <div className="font-medium">{title}</div>{" "}
                                      <span className="text-xs font-light text-neutralGray">
                                        {validateDay(updatedAt)}
                                      </span>
                                    </div>
                                    <div className="w-72 overflow-hidden truncate text-neutralGray">
                                      {details}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ),
                    )
                  ) : (
                    //render if notification is empty or []
                    <div className="flex h-20 items-center justify-center text-gray-300">
                      Empty announcement.
                    </div>
                  )}
                </div>
              </div>
            </Menu.Items>
          </Transition>
        )}
      </Menu>
    );
  };

  const closeViewModal = () => {
    setOpenViewModal(false);
    setViewData({});
  };

  //show view modal
  const viewAnnouncement = () => {
    const { title, updatedAt, details } = viewData ?? {};

    const customTitle = () => (
      <div className="flex flex-col">
        <div className="text-xl font-medium">{title}</div>
        <div className="flex items-center gap-1 text-sm text-primaryBlue">
          <Io5icons.IoCalendarClearOutline />{" "}
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
    <div>
      {viewAnnouncement()}
      {notificationMenu()}
    </div>
  );
}
