import { createWithEqualityFn } from "zustand/traditional";

import { useNavigate } from "react-router-dom";
import { AUTH } from "../../../services/api";

const auth = {
  auth: [],
  userInformation: [],
};

const checkAuth = async (set) => {
  const navigate = useNavigate();
  return navigate("/admin/dashboard");
  // const response = await GET("/holidays");

  // return set({
  //   auth: data,
  // });
};

const fetchUserDetailsAction = async (token, set) => {
  const { status, data } = (await AUTH("/users/info", token)) || {};
  if (status === 200) return set({ userInformation: data ?? [] });
};

const createAuthStore = (set) => ({
  ...auth,
  checkAuth: () => checkAuth(set),
  storeUserAuthDetails: (token) => fetchUserDetailsAction(token, set),
  storeUserAuth: (data) =>
    set({
      userInformation: data,
    }),
});

export const authStore = createWithEqualityFn(createAuthStore);
