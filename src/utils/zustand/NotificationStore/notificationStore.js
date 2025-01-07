import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../services/api";
import socket from "../../socket/socket";

//store list of notification
const notification = {
  announcementNotif: [],
};

//trigger when receive new notification
const newNotification = (set, notifList, empId, deptId, isAdmin) => {
  let copyNotif = [...notifList];
  socket.on("announcement", (res) => {
    copyNotif.unshift(res);
    if (isAdmin) {
      set({
        announcementNotif: copyNotif,
      });
    }

    if (res?.dept_list?.includes(deptId) || res?.emp_list?.includes(empId)) {
      set({
        announcementNotif: copyNotif,
      });
    } else {
      return set({
        announcementNotif: copyNotif,
      });
    }
  });
};

//fetch notification based on query
const fetchNotification = async (set, query) => {
  const { status, data } = await GET(`/announcements?${query}`);
  if (status === 200) {
    return set({
      announcementNotif: data ?? [],
    });
  }
};

const createNotificationStore = (set) => ({
  ...notification,
  getAllNotification: (data) => getAllNotification(set, data),
  fetchNotification: (query) => fetchNotification(set, query),
  newNotification: (notifList, empId, deptId, isAdmin) =>
    newNotification(set, notifList, empId, deptId, isAdmin),
});

export const notificationStore = createWithEqualityFn(createNotificationStore);
