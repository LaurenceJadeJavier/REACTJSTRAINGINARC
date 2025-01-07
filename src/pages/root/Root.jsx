import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { loadingStore } from "../../utils/zustand/LoadingStore/loadingStore";
import { shallow } from "zustand/shallow";
import HOCLoading from "../../components/loading/page/HOCLoading";
export default function Root() {
  // const navigate = useNavigate();
  // useEffect(() => {
  //   const accountLogged = false;
  //   if (!accountLogged) return navigate("/login");
  //   else navigate("/admin/dashboard");
  // }, []);
  const { isOpen } = loadingStore((state) => state, shallow);

  return (
    <>
      {isOpen && <HOCLoading />}
      <Outlet />
    </>
  );
}
