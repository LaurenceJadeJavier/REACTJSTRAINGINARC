import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../services/api";

// const fetchAll = async (set) => {
//   const { data } = await GET("/announcements");
//   return set({
//     announcement: data,
//   });
// };

const employeeAcc = {
  employeeAttendance: [],
};

const getTodayAttendance = async (set, _id) => {
  const { data, status } = await GET(`/attendances/employees/${_id}/today`);
  if (status === 200) {
    return set({
      employeeAttendance: data,
    });
  }
};

const createEmployeeAccStore = (set) => ({
  ...employeeAcc,
  getTodayEmpAttendance: (_id) => getTodayAttendance(set, _id),
});

export const employeeAccStore = createWithEqualityFn(createEmployeeAccStore);
