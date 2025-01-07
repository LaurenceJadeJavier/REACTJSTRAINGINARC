import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";
import { authStore } from "../../AuthStore/authStore";

const applcationObject = {
  applicationData: [],
  filteredApplicationData: [],
  userApplicationData: [],
  specificUserApplicationData: [],
};

// Filter Table Tab Data
export const filterDataByTabAction = (tableData, tabName, tableColumn) => {
  if (tabName === "All" || tabName === "all") return tableData;
  const filteredData = tableData.filter(
    (item) => item[tableColumn] === tabName,
  );
  return filteredData;
};

const filterApplicationData = (tabName, set) => {
  // Set To Filter Column
  const filterColumn = "status";
  const tableData = applicationStore.getState().applicationData;
  const filteredData = filterDataByTabAction(tableData, tabName, filterColumn);
  return set({ filteredApplicationData: filteredData });
};

// Reorganized Data For Request Leave Display Table
const organizedFileApplicationDataAction = (tableData) => {
  const filterColumn = "type";
  let filterData = [
    {
      title: "Leave",
      value: "leave",
    },
    {
      title: "Overtime",
      value: "overtime",
    },
    {
      title: "Official Business",
      value: "official_bussiness",
    },
    {
      title: "Failure To Log",
      value: "failure_to_log",
    },
    {
      title: "Rest Day Work",
      value: "rest_day",
    },
  ];

  return filterData.map((item) => {
    const { title, value } = item || {};
    return {
      title: title,
      data: filterDataByTabAction(tableData, value, filterColumn),
    };
  });
};

// Get Application Data Action
const fetchAllApplicationData = async (set) => {
  const { data, status } = await GET("/applications");
  if (status === 200)
    return set({ filteredApplicationData: data, applicationData: data });
};

// Get Application Data Action
const fetchUserApplicationData = async (set) => {
  const userData = authStore.getState().userInformation?.isEmployee;
  if (!userData) return set({ specificUserApplicationData: [] });

  const { status, data } = await GET(
    "/applications/employees/" + userData?._id,
  );
  if (status === 200) {
    const reorganizedData = organizedFileApplicationDataAction(data);
    return set({
      specificUserApplicationData: reorganizedData,
      userApplicationData: data.slice(0, 3),
    });
  }
};

const createDepartmentStore = (set) => ({
  ...applcationObject,
  fetchApplicationData: () => fetchAllApplicationData(set),
  storeFilterApplicationData: (tabName) => filterApplicationData(tabName, set),
  storeUserfileApplicationData: () => fetchUserApplicationData(set),
  storeAllApplication: (data) => {
    set({ filteredApplicationData: data, applicationData: data });
  },
});

export const applicationStore = createWithEqualityFn(createDepartmentStore);
