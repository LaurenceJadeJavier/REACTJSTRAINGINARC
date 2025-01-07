import React, { useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { shallow } from "zustand/shallow";

// Component
import Root from "./pages/root/Root";
import Sidebar, { sidebarLoader } from "./components/sidebar/Sidebar";
import { privateRoute, publicRoute } from "./routes/routes";
import AlertSuccessModal from "./components/alerts/AlertSuccessModal";
import AlertConfirmModal from "./components/alerts/AlertConfirmModal";
import AlertDeleteModal from "./components/alerts/AlertDeleteModal";

// Zustand Component
import { authStore } from "./utils/zustand/AuthStore/authStore";
import AlertFailedModal from "./components/alerts/AlertFailedModal";

// Temporary User Validation (User Info Getter Every Resfresh Action ) - To be revised
const checkIfUSerExist = (setterAction) => {
  const token = localStorage.getItem("token");
  return token && setterAction(token);
};

function App() {
  // Global State
  const { storeUserAuthDetails } = authStore((state) => state, shallow);

  useEffect(() => {
    // Store User Data To Global If User Token Exist
    checkIfUSerExist(storeUserAuthDetails);
  }, []);

  const recursiveRoute = (data) =>
    data.childElement ? (
      <>
        {!data.isDropdown && (
          <Route {...data} key={data.title ?? data.childTitle} />
        )}
        {data.childElement.map((childData) => {
          const { path } = childData;
          const rmQueryString = path.split("?")[0];
          const newChildData = { ...childData, path: rmQueryString };
          return recursiveRoute(newChildData);
        })}
      </>
    ) : (
      <Route {...data} key={data.title ?? data.childTitle} />
    );

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        {publicRoute.map((data, i) => recursiveRoute(data))}
        <Route element={<Sidebar />} loader={sidebarLoader}>
          {privateRoute.map((data) => recursiveRoute(data))}
        </Route>
        <Route path="/*" element={<div>page not found</div>} />
      </Route>,
    ),
  );

  return (
    <div className="min-h-screen  w-full bg-lightBlue bg-cover">
      <AlertSuccessModal />
      <AlertConfirmModal />
      <AlertFailedModal />
      <AlertDeleteModal />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
