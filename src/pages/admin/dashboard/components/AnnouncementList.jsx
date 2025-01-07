import React, { useState, useEffect } from "react";
import * as Io5icons from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { shallow } from "zustand/shallow";
import ViewModal from "../../../../components/modal/ViewModal";
import { authStore } from "../../../../utils/zustand/AuthStore/authStore";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";
import { GET } from "../../../../services/api";

export default function AnnouncementList({ viewRoute }) {
  const navigate = useNavigate();

  //global state
  // const { announcementNotif } = notificationStore((state) => state, shallow);
  const { userInformation } = authStore((state) => state, shallow);
  const { loadingHoc } = loadingStore((state) => state, shallow);

  //local state
  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewData, setViewData] = useState({});
  const [notif, setNotif] = useState({});
  const [announcementNotif, setAnnouncementNotif] = useState([]);

  useEffect(() => {
    //fetch new announcement
    const fetchApiNotification = async () => {
      loadingHoc(true);
      const { _id, dept_id } = userInformation?.isEmployee ?? {};
      const queryForEmp = dept_id
        ? `emp_id=${_id}&dept_id=${dept_id?._id}&published=true`
        : `emp_id=${_id}&published=true`;

      const queryForAdmin = "published=true";
      const query = userInformation?.isEmployee ? queryForEmp : queryForAdmin;
      const { status, data } = await GET(`/announcements?${query}`);
      if (status === 200) {
        setAnnouncementNotif(data);
        return loadingHoc(false);
      }
    };

    fetchApiNotification();
  }, [userInformation?.isEmployee, userInformation?.isAdmin]);

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

  //show menu layout after clicking bell icon
  const notificationList = () => {
    return (
      <div className="flex flex-col gap-5 ">
        <div className="flex flex-row items-center justify-between">
          <div className="font-medium">Announcement</div>
          <button
            className="text-sm text-primaryBlue"
            onClick={() => navigate(`${viewRoute}/announcement-view`)}
          >
            View all
          </button>
        </div>
        <div className="grid h-full grid-cols-1 gap-2 divide-y-2  divide-gray-100 overflow-y-scroll pr-2">
          {announcementNotif?.length > 0 ? (
            Object.keys(notif).map(
              (
                date, //map group by date example value -> Today or 25 September 2023 and etc.
              ) => (
                <div className="flex flex-col gap-1 pt-1" key={date}>
                  <div className="text-sm font-medium capitalize">{date}</div>
                  <div className="flex flex-col  gap-1">
                    {notif[date].map((data) => {
                      //map based on date as index
                      const { title, updatedAt } = data ?? {};
                      return (
                        <div
                          className="flex items-center gap-2 rounded-md"
                          key={updatedAt}
                        >
                          <div className="flex w-full flex-col text-sm">
                            <div className="flex    ">
                              <div className="w-52 overflow-hidden   truncate text-gray-400">
                                {title}
                              </div>{" "}
                            </div>
                          </div>
                          <button
                            className="rounded-full bg-highlight p-2 text-primaryBlue hover:bg-gray-300"
                            onClick={() => openModalFunc(data)} //function for viewing specific announcement
                          >
                            <Io5icons.IoEllipsisHorizontal />
                          </button>
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
    );
  };

  const closeViewModal = () => {
    setOpenViewModal(false);
    setViewData({});
  };

  //show view modal
  const viewAnnouncement = () => {
    const { title, updatedAt, details } = viewData ?? {};

    //view modal -> title layout
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
      {notificationList()}
    </div>
  );
}
