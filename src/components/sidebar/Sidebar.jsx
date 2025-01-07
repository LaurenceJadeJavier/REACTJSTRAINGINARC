import React, { Suspense, useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { privateRoute } from "../../routes/routes";
import * as BiIcons from "react-icons/bi";
import * as Io5icons from "react-icons/io5";
import { GETALL } from "../../services/api";
import { designationTypeStore } from "../../utils/zustand/AdminStore/HrSetup/designationTypeStore";
import { shallow } from "zustand/shallow";
import { loadingStore } from "../../utils/zustand/LoadingStore/loadingStore";
import { holidayStore } from "../../utils/zustand/AdminStore/HrSetup/holidayStore";
import { departmentStore } from "../../utils/zustand/AdminStore/HrSetup/departmentStore";
import { adminApi } from "../../services/apiList";
import { leaveTypeStore } from "../../utils/zustand/AdminStore/HrSetup/leaveTypeStore";
import { documentTypeStore } from "../../utils/zustand/AdminStore/HrSetup/documentTypeStore";
import { employeeStore } from "../../utils/zustand/AdminStore/Employee/employeeStore";
import { failureToLogStore } from "../../utils/zustand/FileRequest/failureToLog";
import { announcementStore } from "../../utils/zustand/AdminStore/Announcement/announcementStore";
import { schedTypeStore } from "../../utils/zustand/AdminStore/HrSetup/schedTypeStore";
import { applicationStore } from "../../utils/zustand/AdminStore/ApplicationStore/applicationStore";
import { scheduleStore } from "../../utils/zustand/AdminStore/Schedule/scheduleStore";
import { leaveStore } from "../../utils/zustand/FileRequest/leave";
import { officialBusinessStore } from "../../utils/zustand/FileRequest/officialBusiness";
import { overtimeStore } from "../../utils/zustand/FileRequest/overtime";
import { timesheetStore } from "../../utils/zustand/AdminStore/Timesheet/TimesheetStore";
import { payrollComponentStore } from "../../utils/zustand/AdminStore/HrSetup/payrollComponent";
import { trainingStore } from "../../utils/zustand/AdminStore/Trainings/trainingsStore";
import { performanceStore } from "../../utils/zustand/AdminStore/Performance/performanceStore";
import { payrollPeriodStore } from "../../utils/zustand/AdminStore/HrSetup/payrollPeriod";
import { employeeIDStore } from "../../utils/zustand/AdminStore/EmployeeStore/EmployeeID";
import { companyStore } from "../../utils/zustand/AdminStore/SystemSetting/companyStore";
import { authStore } from "../../utils/zustand/AuthStore/authStore";
import { loanStore } from "../../utils/zustand/AdminStore/Loan/loanStore";
import { financeStore } from "../../utils/zustand/AdminStore/Finance/financeStore";
import { recruitmentStore } from "../../utils/zustand/AdminStore/Recruitment/RecruitmentStore";
import { assetStore } from "../../utils/zustand/AdminStore/Asset/assetStore";
import { restrictionStore } from "../../utils/zustand/AdminStore/Restriction/restrictionStore";
import { notificationStore } from "../../utils/zustand/NotificationStore/notificationStore";
import { payrollListStore } from "../../utils/zustand/AdminStore/Payroll/Payroll-list";

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  //response from loader
  const result = useLoaderData();

  const user = "admin";

  //global state
  const { loadingHoc } = loadingStore((state) => state, shallow);
  const { storeAllDesignationType } = designationTypeStore(
    (state) => state,
    shallow,
  );
  const { storeAllHoliday } = holidayStore((state) => state, shallow);
  const { storeAllDepartment } = departmentStore((state) => state, shallow);
  const { storeAllScheduleType } = schedTypeStore((state) => state, shallow);
  const { storeAllLeaveType } = leaveTypeStore((state) => state, shallow);
  const { storeAllDocumentType } = documentTypeStore((state) => state, shallow);
  const { storeAllEmployee } = employeeStore((state) => state, shallow);
  const { storeAllFailureToLog } = failureToLogStore((state) => state, shallow);
  const { storeAllLeave } = leaveStore((state) => state, shallow);
  const { storeAllOvertime } = overtimeStore((state) => state, shallow);
  const { storeAllAnnouncement } = announcementStore((state) => state, shallow);
  const { storeAllTimesheet } = timesheetStore((state) => state, shallow);
  const { storeAllTraining } = trainingStore((state) => state, shallow);
  const { storeAllSchedule } = scheduleStore((state) => state, shallow);
  const { storeAllEmployeeID } = employeeIDStore((state) => state, shallow);
  const { storeAllLoan } = loanStore((state) => state, shallow);
  const { storeAllRestriction } = restrictionStore((state) => state, shallow);
  const { storeAllApplication, storeUserfileApplicationData } =
    applicationStore((state) => state, shallow);
  const { storeAllPayrollComponent } = payrollComponentStore(
    (state) => state,
    shallow,
  );
  const { storeAllOfficialBusinesses } = officialBusinessStore(
    (state) => state,
    shallow,
  );
  const { storeAllPerformance } = performanceStore((state) => state, shallow);
  const { storeAllPayrollPeriod } = payrollPeriodStore(
    (state) => state,
    shallow,
  );
  const { storeAllCompany } = companyStore((state) => state, shallow);
  const { storeUserAuth, userInformation } = authStore(
    (state) => state,
    shallow,
  );
  const { fetchAllFinance } = financeStore((state) => state, shallow);
  const { storeAllRecruitment } = recruitmentStore((state) => state, shallow);
  const { storeAllAsset } = assetStore((state) => state, shallow);
  const { storeAllPayrollList } = payrollListStore((state) => state, shallow);
  const { fetchNotification } = notificationStore((state) => state, shallow);

  //local state
  const [showSidebar, setShowSidebar] = useState(true);

  //get response
  function getResponse(ApiName) {
    const matchApi = adminApi.findIndex((data) => data === ApiName);
    return result[matchApi]?.data ?? [];
  }

  // useEffect(() => {
  //   if (result.status === 404) return navigate("/");
  // }, [result]);

  //stores response to zustand
  const adminRoutes = () => {
    // Get Action With _id/token parameter value
    storeUserfileApplicationData();

    // Get Action
    storeAllPayrollComponent(getResponse("/payroll-comps"));
    storeAllDesignationType(getResponse("/designations"));
    storeAllHoliday(getResponse("/holidays"));
    storeAllDepartment(getResponse("/departments"));
    storeAllScheduleType(getResponse("/schedule-types"));
    storeAllLeaveType(getResponse("/leave-types"));
    storeAllDocumentType(getResponse("/document-types"));
    storeAllEmployee(getResponse("/employees"));
    storeAllFailureToLog(getResponse("/applications?type=failure_to_log"));
    storeAllLeave(getResponse("/applications?type=leave"));
    storeAllOvertime(getResponse("/applications?type=overtime"));
    storeAllAnnouncement(getResponse("/announcements"));
    storeAllTraining(getResponse("/trainings"));
    storeAllApplication(getResponse("/applications"));
    storeAllTimesheet(getResponse("/attendances"));
    storeAllSchedule(getResponse("/schedules"));
    storeAllPayrollComponent(getResponse("/payroll-comps"));
    storeAllEmployeeID(getResponse("/users/info"));
    storeAllLoan(getResponse("/loans"));
    storeAllOfficialBusinesses(
      getResponse("/applications?type=official_bussiness"),
    );
    storeAllPerformance(getResponse("/performances"));
    storeAllPayrollPeriod(getResponse("/payroll-periods"));
    storeAllCompany(getResponse("/companies"));
    storeUserAuth(getResponse("/users/info"));
    fetchAllFinance(getResponse("/bank-accs"));
    storeAllRecruitment(getResponse("/recruitments"));
    storeAllAsset(getResponse("/assets"));
    storeAllPayrollList(getResponse("/payroll-lists"));
    storeAllRestriction(getResponse("/restrictions"));

    const { _id, dept_id } = userInformation?.isEmployee ?? {};
    const queryForEmp = dept_id
      ? `emp_id=${_id}&dept_id=${dept_id?._id}&published=true`
      : `emp_id=${_id}&published=true`;
    const queryForAdmin = "published=true";
    fetchNotification(
      userInformation?.isEmployee ? queryForEmp : queryForAdmin,
    );

    return loadingHoc(false);
  };

  const fetchList = async () => {
    loadingHoc(true);
    if (user === "admin") return adminRoutes();
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoutFunction = () => {
    localStorage.clear();
    return navigate("/");
  };

  //hide and show sidebar
  const handleResize = () => {
    if (window?.innerWidth > 770) {
      setShowSidebar(true);
    } else {
      return setShowSidebar(false);
    }
  };
  useEffect(() => {
    window?.addEventListener("resize", handleResize);

    return async () => {
      window?.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window]);

  //matching path
  const pathChecker = (data) => {
    const [, second, third] = pathname.split("/");
    const isSamePath = `/${second}/${third}` === data.path;
    return isSamePath;
  };

  //sidebar child dropdown navigation
  const dropDownNavigation = (data) => {
    return (
      <details open={false} className="relative">
        <summary
          data-tip={data.title}
          className={`${
            showSidebar ? "flex" : "tooltip tooltip-right z-50"
          }  cursor-pointer flex-row items-center gap-2 p-3 transition-all hover:scale-105 ${
            pathChecker(data)
              ? "rounded-lg bg-lightBlue text-primaryBlue"
              : "text-neutralDark"
          }`}
        >
          <div className="text-xl">
            {pathChecker(data) ? data.activeIcon : data.icon}
          </div>
          {showSidebar && <div>{data.title}</div>}
        </summary>

        <ul
          className={` ${
            !showSidebar
              ? "absolute  left-16 top-4 z-40 w-48 rounded-b-xl rounded-tr-xl bg-white p-5 drop-shadow-xl"
              : "p-2"
          } ml-4 flex flex-col gap-3 `}
        >
          {data.childElement.map((childData) => (
            <Link
              to={childData.path}
              key={childData.childTitle}
              className="flex flex-row items-center gap-2 transition-all hover:scale-105"
            >
              <div>
                {pathname === childData.path
                  ? childData.activeIcon
                  : childData.icon}
              </div>
              <div>{childData.childTitle}</div>
            </Link>
          ))}{" "}
        </ul>
      </details>
    );
  };

  //sidebar parent navigation
  const parentNavigation = (data) => {
    return (
      <div key={data.title}>
        <Link
          to={data.path}
          data-tip={data.title}
          className={`${
            showSidebar ? "flex" : "tooltip tooltip-right z-50"
          } flex-row items-center gap-2 p-3 transition-all  hover:scale-105 ${
            pathChecker(data)
              ? "rounded-lg bg-lightBlue text-primaryBlue"
              : "text-neutralDark"
          }`}
        >
          <div className="text-xl">
            {pathChecker(data) ? data.activeIcon : data.icon}
          </div>
          {showSidebar && <div>{data.title}</div>}
        </Link>
      </div>
    );
  };

  //filter all routes based on the user role
  const sideBarContent = () => {
    const routeList = privateRoute.filter(
      ({ role }) => role.indexOf(user) >= 0,
    );

    const childNavigation = (data) => {
      return (
        <li key={data.title}>
          {data.isDropdown ? dropDownNavigation(data) : parentNavigation(data)}
        </li>
      );
    };

    return (
      <ul className={`flex h-full flex-col  justify-center gap-1  `}>
        {routeList?.map(
          (data) =>
            !data?.isHidden &&
            (data.childElement
              ? childNavigation(data)
              : parentNavigation(data)),
        )}
        <div className="flex flex-col gap-1">
          <button
            onClick={logoutFunction}
            className={`flex flex-row items-center gap-2 p-3 text-stateRed`}
          >
            <div className="text-xl">
              <Io5icons.IoLogOutOutline />
            </div>
            {showSidebar && <div>Logout</div>}
          </button>
        </div>
      </ul>
    );
  };

  return (
    <div className="flex h-full min-h-screen w-full flex-row bg-white  drop-shadow-xl ">
      <div
        className={` z-20 flex h-full min-h-full flex-col justify-between gap-4  ${
          showSidebar
            ? " w-[80vw]  basis-auto  md:w-full md:basis-1/5"
            : "w-fit "
        } `}
      >
        <div className={`flex h-full flex-col`}>
          <div className="flex flex-row gap-1  p-2 md:p-5">
            <button>
              <BiIcons.BiMenuAltLeft
                className=" text-3xl font-bold text-primaryBlue "
                onClick={() => setShowSidebar(!showSidebar)}
              />
            </button>

            {showSidebar && (
              <div className=" text-xl font-semibold text-primaryBlue ">
                LOGO
              </div>
            )}
          </div>
          <div className="scrollbar-hidden h-full w-full bg-white p-2 md:p-5">
            {sideBarContent()}
          </div>
        </div>
      </div>
      <div
        className={`${
          showSidebar ? " basis-full md:basis-4/5" : "w-full"
        } z-10  min-h-screen bg-lightBlue px-8 py-5`}
      >
        <Suspense fallback={<p>loading...</p>}>{user && <Outlet />}</Suspense>
      </div>
    </div>
  );
}

//fetching all API's
export const sidebarLoader = async () => {
  const user = "admin";

  // const list = routeList.filter(({ role }) => role === user);
  const response = await GETALL(adminApi);

  return response;
};
