import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/employees");
  return set({
    employee: data,
  });
};

const fetchEmployeeById = async (set, id) => {
  const { data, status } = await GET(`/employees/${id}`);
  if (status === 200)
    return set({
      employeeInfo: data,
    });
};

const defaultValForm = {
  generalInfo: {},
  leave_credits: [],
  documents: [],
};

const employee = {
  employee: [],
  employeeInfo: [],
  employeeForm: defaultValForm,
  employeeView: "",
};

const createEmployeeStore = (set) => ({
  ...employee,
  fetchAllEmployee: () => fetchAll(set),
  fetchEmployeeById: (id) => fetchEmployeeById(set, id),
  storeAllEmployee: (data) =>
    set({
      employee: data,
    }),
  storeEmployeeForm: (data) =>
    set({
      employeeForm: data,
    }),
  storeEmployeeView: (data) =>
    set({
      employeeView: data,
    }),
  clearEmployeeInfo: () => set({ employeeInfo: {} }),
  clearEmployeeForm: () => set({ employeeForm: defaultValForm }),
});

export const employeeStore = createWithEqualityFn(createEmployeeStore);
