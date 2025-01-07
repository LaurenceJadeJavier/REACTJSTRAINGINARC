import Announcement from "../pages/admin/announcement/Announcement";
import Chat from "../pages/admin/chat/Chat";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import Home from "../pages/admin/home/Home";
import Payslip from "../pages/admin/home/Payslip/Payslip";
import Request from "../pages/admin/home/Request/Request";
import Employees from "../pages/admin/employees/Employees";
import HolidayType from "../pages/admin/hrsetup/holiday-type/HolidayType";

import DesignationType from "../pages/admin/hrsetup/designation-type/DesignationType";
import LeaveType from "../pages/admin/hrsetup/leave-type/LeaveType";
import SystemSetting from "../pages/admin/system-setting/SystemSetting";
import CompanyProfile from "../pages/admin/system-setting/company-profile/CompanyProfile";
import RestrictionType from "../pages/admin/system-setting/restriction-type/RestrictionType";
import Role, { roleLoader } from "../pages/admin/system-setting/role/Role";
import Form from "../pages/admin/system-setting/role/components/Form";
import FormEmployee from "../pages/admin/employees/component/Form";
import View from "../pages/admin/system-setting/role/components/View";

import ForgotPassword from "../pages/auth/forgotpassword/ForgotPassword";
import Login from "../pages/auth/login/Login";
import * as Io5Icons from "react-icons/io5";
import AllowanceType, {
  allowanceTypeLoader,
} from "../pages/admin/hrsetup/allowance-type/AllowanceType";
import DocumentType from "../pages/admin/hrsetup/document-type/DocumentType";
import ScheduleType from "../pages/admin/hrsetup/schedule-type/ScheduleType";
// import PayslipHRSetup, {
//   payslipLoader,
// } from "../pages/admin/hrsetup/payslip/Payslip";
import Schedule from "../pages/admin/schedule/Schedule";
import FailureToLog from "../pages/admin/file-request/Failure-to-log";
import Department from "../pages/admin/hrsetup/department/Department";
import TimeSheet from "../pages/admin/timesheet/TimeSheet";
import ViewEmployee from "../pages/admin/timesheet/view-employee/ViewEmployee";
import ViewModuleEmployee from "../pages/admin/employees/component/ViewEmployee";
import RestDayWork from "../pages/admin/file-request/rest-day-work/RestDayWork";
import FileTypes from "../pages/admin/file-request/FileTypes";
import OfficialBusiness from "../pages/admin/file-request/official-business/OfficialBusiness";
import Trainings, { trainingsLoader } from "../pages/admin/training/Trainings";
import ManageAttendees, {
  manageAttendeesLoader,
} from "../pages/admin/training/View/manage-attendee/ManageAttendees";
import PayrollPeriod, {
  PayrollPeriodLoader,
} from "../pages/admin/hrsetup/payroll-period/PayrollPeriod";
import Performance from "../pages/admin/performance/Performance";
import Asset from "../pages/admin/asset/Asset";
import PayrollComponent from "../pages/admin/hrsetup/payroll-component/PayrollComponent";
import Recruitment from "../pages/admin/recruitment/Recruitment";
import CreateJobPosting from "../pages/admin/recruitment/Pages/create-job-post/CreateJobPosting";
import ViewJobPosting from "../pages/admin/recruitment/Pages/view-job-post/ViewJobPosting";
import Careers from "../pages/public/careers/Careers";
import ViewCareer from "../pages/public/careers/pages/view-careers/ViewCareer";
import ApplicationForm from "../pages/public/careers/pages/application-form/ApplicationForm";
import ManageRecruitment, {
  manageRecruitmentLoader,
} from "../pages/admin/recruitment/Pages/manage-recruitment/ManageRecruitment";
import ManageApplicants, {
  manageApplicantsLoadder,
} from "../pages/admin/recruitment/Pages/manage-applicants/ManageApplicants";
import Loan, { LoanLoader } from "../pages/admin/payroll/Loan/Loan";
import ViewLoan, { ViewLoanLoader } from "../pages/admin/payroll/Loan/ViewLoan";
import Backpay, { BackpayLoader } from "../pages/admin/payroll/Backpay/Backpay";
import ViewBackpay from "../pages/admin/payroll/Backpay/ViewBackpay";
import Payroll from "../pages/admin/payroll/Payroll/Payroll";
import ScheduleCalendar from "../pages/admin/schedule/View/ScheduleCalendar";
import ScheduleHistory, {
  scheduleFilterByMonthLoader,
} from "../pages/admin/schedule/View/ScheduleHistory";
import UpdateEmpSchedule from "../pages/admin/schedule/View/UpdateEmpSchedule";
import Account from "../pages/admin/account/Account";
import ThirteenthMonth from "../pages/admin/payroll/13thMonth/pages/ThirteenthMonth";
import ManageThirtheenthMonth from "../pages/admin/payroll/13thMonth/pages/ManageThirtheenthMonth/ManageThirtheenthMonth";
import Finance from "../pages/admin/finance/Finance";
import ViewAnnouncement from "../pages/admin/announcement/view-all/ViewAnnouncement";

export const publicRoute = [
  {
    id: 1,
    index: true,
    element: <Login />,
  },
  {
    id: 2,
    path: "/forgotpassword",
    element: <ForgotPassword />,
  },
  {
    id: 3,
    path: "/careers",
    element: <Careers />,
    childElement: [
      {
        key: 1,
        childTitle: "career",
        path: "/careers/:id",
        element: <ViewCareer />,
      },
      {
        key: 2,
        childTitle: "application",
        path: "/careers/:id/application-form",
        element: <ApplicationForm />,
      },
    ],
  },
];

export const privateRoute = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    element: <Dashboard />,
    icon: <Io5Icons.IoGridOutline />,
    activeIcon: <Io5Icons.IoGrid />,
    role: ["admin"],
  },
  {
    title: "View Announcement",
    path: "/:role/:module/announcement-view",
    element: <ViewAnnouncement />,
    isHidden: true,
    role: ["admin"],
  },
  {
    title: "Home",
    path: "/admin/home",
    element: <Home />,
    isDropdown: false,
    icon: <Io5Icons.IoHomeOutline />,
    activeIcon: <Io5Icons.IoHome />,
    role: ["admin"],
    childElement: [
      {
        key: 1,
        childTitle: "Payslip",
        path: "/admin/home/payslip",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <Payslip />,
        role: ["admin"],
      },
      {
        key: 1,
        childTitle: "Request",
        path: "/admin/home/request",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <Request />,
        role: ["admin"],
      },
    ],
  },
  {
    title: "HR Setup",
    path: "/admin/hr-setup",
    element: <div>HR Setup page</div>,
    isDropdown: true,
    childElement: [
      {
        childTitle: "Department",
        path: "/admin/hr-setup/department",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <Department />,
        role: ["admin"],
      },
      {
        childTitle: "Designation Type",
        path: "/admin/hr-setup/designation-type",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <DesignationType />,
        role: ["admin"],
      },
      {
        childTitle: "Document Type",
        path: "/admin/hr-setup/document-type",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <DocumentType />,
        role: ["admin"],
      },
      {
        childTitle: "Holiday",
        path: "/admin/hr-setup/holidays",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <HolidayType />,
        role: ["admin"],
      },
      {
        childTitle: "Payroll Component",
        path: "/admin/hr-setup/payslip-type",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <PayrollComponent />,
        role: ["admin"],
      },
      {
        childTitle: "Payroll Period",
        path: "/admin/hr-setup/payroll-period",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <PayrollPeriod />,
        loader: PayrollPeriodLoader,
        role: ["admin"],
      },
      {
        childTitle: "Schedule Type",
        path: "/admin/hr-setup/schedule-type",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <ScheduleType />,
        role: ["admin"],
      },
      {
        childTitle: "Leave Type",
        path: "/admin/hr-setup/leave-type",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <LeaveType />,
        role: ["admin"],
      },
    ],
    icon: <Io5Icons.IoFolderOpenOutline />,
    activeIcon: <Io5Icons.IoFolderOpen />,
    role: ["admin"],
  },
  {
    title: "Chat",
    path: "/admin/chat",
    element: <Chat />,
    icon: <Io5Icons.IoChatboxOutline />,
    activeIcon: <Io5Icons.IoChatbox />,
    role: ["admin"],
  },
  {
    title: "Employees",
    path: "/admin/employees",
    element: <Employees />,
    childElement: [
      {
        key: 1,
        childTitle: "Company Profile",
        path: "admin/employees/create-employee/*",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <FormEmployee />,
        role: ["admin"],
      },
      {
        key: 1,
        childTitle: "Company Profile",
        path: "admin/employees/manage-employee/:id/*",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <FormEmployee />,
        role: ["admin"],
      },
      {
        key: 1,
        childTitle: "Company Profile",
        path: "admin/employees/view-employee/:id",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <ViewModuleEmployee />,
        role: ["admin"],
      },
    ],
    icon: <Io5Icons.IoPeopleOutline />,
    activeIcon: <Io5Icons.IoPeople />,
    role: ["admin"],
  },
  {
    title: "Schedule",
    path: "/admin/schedule",
    element: <Schedule />,
    icon: <Io5Icons.IoCalendarOutline />,
    activeIcon: <Io5Icons.IoCalendar />,
    childElement: [
      {
        key: 1,
        childTitle: "Create",
        path: "/admin/schedule/form",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <ScheduleCalendar />,
        role: ["admin"],
      },
      {
        key: 2,
        childTitle: "Update",
        path: "/admin/schedule/form/:id",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <ScheduleCalendar />,
        role: ["admin"],
      },
      {
        key: 3,
        childTitle: "View",
        path: "/admin/schedule/view/:id",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <ScheduleHistory />,
        loader: scheduleFilterByMonthLoader,
        role: ["admin"],
      },
      {
        key: 4,
        childTitle: "Update Schedule",
        path: "/admin/schedule/view/:id/update",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <UpdateEmpSchedule />,
        role: ["admin"],
      },
    ],
    role: ["admin"],
  },
  {
    title: "Time Sheet",
    path: "/admin/time-sheet",
    element: <TimeSheet />,
    icon: <Io5Icons.IoTimeOutline />,
    activeIcon: <Io5Icons.IoTime />,
    role: ["admin"],
    isDropdown: false,
    childElement: [
      {
        key: 1,
        childTitle: "Payslip",
        path: "/admin/time-sheet/viewemployee",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <ViewEmployee />,
        role: ["admin"],
      },
    ],
  },
  {
    title: "File Request",
    path: "/admin/file-request",
    element: <div>File Request page</div>,
    icon: <Io5Icons.IoDocumentTextOutline />,
    activeIcon: <Io5Icons.IoDocumentText />,
    role: ["admin"],
    isDropdown: true,
    childElement: [
      {
        key: 1,
        childTitle: "Leave",
        path: "/admin/file-request/leave",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <FileTypes />,
        loader: () => "leave",
        role: ["admin"],
      },
      {
        key: 2,
        childTitle: "Overtime",
        path: "/admin/file-request/overtime",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <FileTypes />,
        loader: () => "overtime",
        role: ["admin"],
      },
      {
        key: 3,
        childTitle: "Official Business",
        path: "/admin/file-request/official-business",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <OfficialBusiness />,
        // loader: FileTypesLoader,
        role: ["admin"],
      },
      {
        key: 4,
        childTitle: "Failure to Log",
        path: "/admin/file-request/failure-to-log",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <FailureToLog />,
        role: ["admin"],
      },
      {
        key: 2,
        childTitle: "Rest Day Work",
        path: "/admin/file-request/rest-day-work",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <RestDayWork />,
        role: ["admin"],
      },
    ],
  },

  {
    title: "Payroll",
    path: "/admin/payroll",
    icon: <Io5Icons.IoCalculatorOutline />,
    activeIcon: <Io5Icons.IoCalculator />,
    element: <div>Payroll page</div>,
    role: ["admin"],
    isDropdown: true,
    childElement: [
      {
        childTitle: "Payroll",
        path: "/admin/payroll/payroll/view",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <Payroll />,
        role: ["admin"],
      },
      {
        key: 3,
        childTitle: "13th Month",
        path: "/admin/payroll/13th-month",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <ThirteenthMonth />,
        loader: BackpayLoader,
        role: ["admin"],
        isDropdown: false,
        childElement: [
          {
            childTitle: "View",
            path: "/admin/payroll/13th-month/:id",
            icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
            activeIcon: (
              <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />
            ),
            element: <ManageThirtheenthMonth />,
            role: ["admin"],
          },
        ],
      },
      {
        childTitle: "Loan",
        path: "/admin/payroll/loan",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <Loan />,
        loader: LoanLoader,
        role: ["admin"],
        isDropdown: false,
        childElement: [
          {
            childTitle: "View",
            path: "/admin/payroll/loan/view",
            icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
            activeIcon: (
              <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />
            ),
            element: <ViewLoan />,
            loader: ViewLoanLoader,
            role: ["admin"],
          },
        ],
      },
      {
        key: 2,
        childTitle: "Backpay",
        path: "/admin/payroll/backpay",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <Backpay />,
        loader: BackpayLoader,
        role: ["admin"],
        isDropdown: false,
        childElement: [
          {
            childTitle: "View",
            path: "/admin/payroll/backpay/view",
            icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
            activeIcon: (
              <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />
            ),
            element: <ViewBackpay />,
            role: ["admin"],
          },
        ],
      },
    ],
  },
  {
    title: "Finance",
    path: "/admin/finance",
    element: <Finance />,
    icon: <Io5Icons.IoCashOutline />,
    activeIcon: <Io5Icons.IoCash />,
    role: ["admin"],
  },
  {
    title: "Announcement",
    path: "/admin/announcement",
    element: <Announcement />,
    icon: <Io5Icons.IoMegaphoneOutline />,
    activeIcon: <Io5Icons.IoMegaphone />,
    role: ["admin"],
  },
  {
    title: "Assets",
    path: "/admin/assets",
    element: <Asset />,
    icon: <Io5Icons.IoFileTrayStackedOutline />,
    activeIcon: <Io5Icons.IoFileTrayStacked />,
    role: ["admin"],
  },
  {
    title: "Performance",
    path: "/admin/performance",
    element: <Performance />,
    icon: <Io5Icons.IoClipboardOutline />,
    activeIcon: <Io5Icons.IoClipboard />,
    role: ["admin"],
  },
  {
    title: "Training",
    path: "/admin/training",
    element: <Trainings />,
    loader: trainingsLoader,
    icon: <Io5Icons.IoEaselOutline />,
    activeIcon: <Io5Icons.IoEasel />,
    role: ["admin"],
    childElement: [
      {
        key: 1,
        childTitle: "Company Profile",
        path: "admin/training/manage-attendees/:id",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <ManageAttendees />,
        loader: manageAttendeesLoader,
        role: ["admin"],
      },
    ],
  },
  {
    title: "Recruitment",
    path: "/admin/recruitment",
    element: <Recruitment />,
    childElement: [
      {
        key: 1,
        childTitle: "Create Recruitment",
        path: "admin/recruitment/create-job-post",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <CreateJobPosting />,
        role: ["admin"],
      },
      {
        key: 2,
        childTitle: "Update Recruitment",
        path: "admin/recruitment/update-job-post/:id",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <CreateJobPosting />,
        role: ["admin"],
      },
      {
        key: 3,
        childTitle: "View Job Post",
        path: "admin/recruitment/view-job-post/:id",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <ViewJobPosting />,
        role: ["admin"],
      },
      {
        key: 4,
        childTitle: "Manage Applicants",
        path: "admin/recruitment/manage-applicants/:id",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <ManageRecruitment />,
        role: ["admin"],
        loader: manageRecruitmentLoader,
      },
      {
        key: 4,
        childTitle: "Manage Applicants",
        path: "admin/recruitment/manage-applicants/:id/applicants/:id",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <ManageApplicants />,
        role: ["admin"],
        loader: manageApplicantsLoadder,
      },
    ],
    icon: <Io5Icons.IoPersonAddOutline />,
    activeIcon: <Io5Icons.IoPersonAdd />,
    role: ["admin"],
  },
  {
    title: "System Setting",
    path: "/admin/system-setting",
    // element: <SystemSetting />,
    element: <div>SystemSetting</div>,
    isDropdown: true,
    childElement: [
      {
        childTitle: "Company Profile",
        path: "/admin/system-setting/company-profile",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <CompanyProfile />,
        role: ["admin"],
      },

      {
        childTitle: "Restriction Type",
        path: "/admin/system-setting/restriction-type",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <RestrictionType />,
        role: ["admin"],
      },
      {
        childTitle: "Role",
        path: "/admin/system-setting/role",
        icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
        activeIcon: <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />,
        element: <Role />,
        loader: roleLoader,
        isDropdown: false,
        childElement: [
          {
            childTitle: "View",
            path: "/admin/system-setting/role/view",
            icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
            activeIcon: (
              <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />
            ),
            element: <View />,
            role: ["admin"],
          },
          {
            childTitle: "Form",
            path: "/admin/system-setting/role/form",
            icon: <Io5Icons.IoEllipse className="h-2 w-2 text-highlight" />,
            activeIcon: (
              <Io5Icons.IoEllipse className="h-2 w-2 text-primaryBlue" />
            ),
            element: <Form />,
            role: ["admin"],
          },
        ],
        role: ["admin"],
      },
    ],
    icon: <Io5Icons.IoSettingsOutline />,
    activeIcon: <Io5Icons.IoSettings />,
    role: ["admin"],
  },
  {
    title: "Account",
    path: "/admin/account",
    element: <Account />,
    icon: <Io5Icons.IoPersonCircleOutline />,
    activeIcon: <Io5Icons.IoPersonCircle />,
    role: ["admin"],
  },
];
