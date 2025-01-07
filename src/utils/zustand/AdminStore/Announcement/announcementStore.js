import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/announcements");
  return set({
    announcement: data,
  });
};

const announcement = {
  announcement: [],
};

const createAnnouncementStore = (set) => ({
  ...announcement,
  fetchAllAnnouncement: () => fetchAll(set),
  storeAllAnnouncement: (data) =>
    set({
      announcement: data,
    }),
});

export const announcementStore = createWithEqualityFn(createAnnouncementStore);
