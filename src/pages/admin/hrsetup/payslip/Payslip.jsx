import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { useLoaderData } from "react-router-dom";
import * as Lucideicons from "react-icons/lu";

// Components
import DataTable from "../../../components/tables/datatable/DataTable";
import PayrollStatus from "../../../components/status-color/PayrollStatus";
import ManagePayroll from "./View/ManagePayroll";
export default function Payroll() {
  const rows = useLoaderData();
  const { accessor } = createColumnHelper();

  // Local State
  const [tableData, setTableData] = useState(rows);
  const [selectedTab, setSelectedTab] = useState("All");
  const [manageView, setManageView] = useState(false);
  const [payrollContainer, setPayrollContainer] = useState({});

  // Payroll Type Table
  const payrollTable = () => {
    // Filter Tab
    const filterDataByTabAction = (tabName) => {
      if (tabName === "All") return setTableData(rows);
      const filteredData = rows.filter((item) => item.status === tabName);
      return setTableData(filteredData);
    };

    // Tab Selection
    const tabSelection = [
      {
        name: "All",
        isSelected: selectedTab === "All",
        selectTabAction: () => {
          filterDataByTabAction("All");
          return setSelectedTab("All");
        },
      },
      {
        name: "In Review",
        isSelected: selectedTab === "In Review",
        selectTabAction: () => {
          filterDataByTabAction("inReview");
          return setSelectedTab("In Review");
        },
      },
      {
        name: "For Approval",
        isSelected: selectedTab === "For Approval",
        selectTabAction: () => {
          filterDataByTabAction("forApproval");
          return setSelectedTab("For Approval");
        },
      },
      {
        name: "Approved",
        isSelected: selectedTab === "Approved",
        selectTabAction: () => {
          filterDataByTabAction("approved");
          return setSelectedTab("Approved");
        },
      },
      {
        name: "Declined",
        isSelected: selectedTab === "Declined",
        selectTabAction: () => {
          filterDataByTabAction("declined");
          return setSelectedTab("Declined");
        },
      },
      {
        name: "Void",
        isSelected: selectedTab === "Void",
        selectTabAction: () => {
          filterDataByTabAction("void");
          return setSelectedTab("Void");
        },
      },
    ];

    // Table Column
    const columns = [
      accessor("payrollPeriod", {
        id: "payrollPeriod",
        header: "Payroll Period",
        cell: (info) => info.getValue(),
      }),
      accessor("department", {
        id: "department",
        header: "Department",
        cell: (info) => info.getValue(),
      }),
      accessor("status", {
        id: "status",
        header: "Status",
        accessoryKey: "status",
        cell: (info) => <PayrollStatus status={info.getValue()} />,
      }),
      accessor("_id", {
        id: "_id",
        header: "Action",
        style: "w-20 ",
        cell: (info) => (
          <div
            className="flex cursor-pointer justify-center text-lg text-primaryBlue"
            onClick={() => {
              setPayrollContainer(info.row.original);
              return setManageView(!manageView);
            }}
          >
            <Lucideicons.LuFolderCog />
          </div>
        ),
      }),
    ];

    // Table Config
    const tableProps = {
      columns,
      rows: tableData,
      title: "Payroll",
      subTitle: "List of generated payrolls",
      tableTab: tabSelection,
      // openFormAction,
      // setOpenForm,
    };

    return !manageView ? (
      <div className="h-fit w-full rounded-xl bg-white p-5 drop-shadow-xl">
        <DataTable {...tableProps} />
      </div>
    ) : null;
  };

  // // Perfomance Manage Details View
  // const payrollManage = () => {
  //   return (
  //     manageView && (
  //       <ManagePayroll
  //         payrollContainer={payrollContainer}
  //         setHistoryView={setManageView}
  //       />
  //     )
  //   );
  // };

  return (
    <>
      {payrollTable()}
      {/* {payrollManage()} */}
    </>
  );
}

export const payrollLoader = async () => {
  const employeeInformation = {
    totalLate: 0,
    totalOverTime: 10,
    basicPay: 20000,
    taxableIncome: 8700,
    withHoldingTax: 500,
    netPay: 9000,
    totalSalary: 2000,
    salary: [
      {
        title: "Absent",
        value: "absent",
        amount: 500,
      },
      {
        title: "Late Deduction",
        value: "lateDeduction",
        amount: 500,
      },
      {
        title: "Undertime Deduction",
        value: "undertimeDeduction",
        amount: 500,
      },
      {
        title: "Overtime Deduction",
        value: "overtimeIncome",
        amount: 500,
      },
    ],
    totalNonTaxAllowance: 1000,
    nonTaxAllowance: [
      {
        title: "Travel Allowance",
        amount: 500,
      },
      {
        title: "Fuel Allowance",
        amount: "500",
      },
    ],
    totalTaxAllowance: 1000,
    taxAllowance: [
      {
        title: "Travel Allowance",
        amount: 500,
      },
      {
        title: "FuelAllowance",
        amount: 500,
      },
    ],
    totalDeduction: 1000,
    deduction: [
      {
        title: "Loan",
        amount: 500,
      },
    ],
    totalContribution: 1000,
    contribution: [
      {
        title: "SSS",
        amount: 3000,
      },
      {
        title: "Pag-Ibig",
        amount: 70,
      },
      {
        title: "Philhealth",
        amount: 1100,
      },
    ],
    // contribution: {
    //   sss: 0,
    //   pagibig: 0,
    //   philHealth: 0,
    // },
    totalLeaveDay: [
      {
        date: "Aug 8, 2023",
        type: "Vacation Leave",
        halfDay: "No",
        remarks: "Lorem ipsum dolor sit amet, consectetur",
      },
      {
        date: "Aug 5, 2023",
        type: "Sick Leave",
        halfDay: "No",
        remarks: "Lorem ipsum dolor sit amet, consectetur",
      },
    ],
    totalAbsentDay: [
      {
        date: "Aug 2, 2023",
      },
      {
        date: "Aug 3, 2023",
      },
    ],
    totalWorkDay: [
      {
        date: "Aug 10, 2023",
        timeIn: "8:00 AM",
        timeOut: "5:00 PM",
      },
      {
        date: "Aug 11, 2023",
        timeIn: "8:00 AM",
        timeOut: "5:00 PM",
      },
      {
        date: "Aug 12, 2023",
        timeIn: "8:00 AM",
        timeOut: "5:00 PM",
      },
      {
        date: "Aug 13, 2023",
        timeIn: "8:00 AM",
        timeOut: "5:00 PM",
      },
      {
        date: "Aug 14, 2023",
        timeIn: "8:00 AM",
        timeOut: "5:00 PM",
      },
    ],
  };

  const employeeDataSample = [
    {
      employeeId: "0001",
      employee: "Cardo Milen",
      img: "https://e1.pxfuel.com/desktop-wallpaper/28/668/desktop-wallpaper-profile-for-girls-profile-pics-cute-girl-beautiful-indian-woman.jpg",
      employeeInformation,
    },
    {
      employeeId: "0008",
      employee: "Melisa Perez",
      img: "https://cdn4.sharechat.com/beautifulgirlprofilepicture_2fd82a95_1601311911497_cmprsd_40.jpg?tenant=sc&referrer=pwa-sharechat-service&f=beautifulgirlprofilepicture_2fd82a95_1601311911497_cmprsd_40.jpg",
    },
    {
      employeeId: "0054",
      employee: "Melissa Miles",
      img: "https://i.pinimg.com/1200x/ba/37/bf/ba37bf9bc911f418ae7b6e32d7ddd641.jpg",
      employeeInformation,
    },
    {
      employeeId: "0062",
      employee: "Jennifer Banuod",
      img: "https://i0.wp.com/smsforwishes.com/wp-content/uploads/2022/05/105274370_103709461393684_681293867908537804_n.jpeg?resize=700%2C700&ssl=1",
    },
    {
      employeeId: "0063",
      employee: "Cecil Lorrie",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTGvEY12LCxbX-xySVH-AqdcL68uSdBAHqEtjM8BOlzXrM1Vd86A3CoguCjGeUKgmE7ss&usqp=CAU",
    },
    {
      employeeId: "0085",
      employee: "Rosabel Beauregard",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRegSgwrkL0Do-sak49xOn8rakCd8XfzN7j4K6LnivhBQYBB2lJk-WwmvgB8pnhEyhXOpE&usqp=CAU",
      employeeInformation,
    },
    {
      employeeId: "0098",
      employee: "Nyah Lorinda",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHmNGIT27oP6Fhuj3hVheDa7FYwFxwnp_PM1GxynxlsaIiYIJzI0mLKfvpwh6eNyaHkxA&usqp=CAU",
      employeeInformation,
    },
    {
      employeeId: "0098",
      employee: "Starla Britney",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkgTQZTQtq9cVSUJSmVu9cBeDKySIQwAXtrWbkwbtLVlgxW4tbMijjaR9OwAWRUBFv_p4&usqp=CAU",
      employeeInformation,
    },
    {
      employeeId: "0045",
      employee: "Ashlee Aspen",
      img: "https://i.pinimg.com/originals/c8/02/59/c80259383a2629318806f8be33be409d.jpg",
      employeeInformation,
    },
    {
      employeeId: "0065",
      employee: "Ashlee Aspen",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQw_FbIhBtCeKORndZx_KJF8tDTYggwEXE2Ezw5mjietL5HXq3UhZC193mo-ahedeD6264&usqp=CAU",
    },
    {
      employeeId: "0032",
      employee: "Ashlee Aspen",
      img: "https://i.pinimg.com/736x/e7/ab/95/e7ab952755a3473b8a0358824186555d.jpg",
      employeeInformation,
    },
  ];

  const rows = [
    {
      _id: 1,
      payrollPeriod: "Aug 01 - Aug 15 2023",
      department: "IT Department",
      status: "inReview",
      employee: employeeDataSample,
    },
    {
      _id: 2,
      payrollPeriod: "Jul 31 - Jul 16 2023",
      department: "Marketing Department",
      status: "forApproval",
    },
    {
      _id: 3,
      payrollPeriod: "Aug 01 - Aug 15 2023",
      department: "Accounting Department",
      status: "approved",
      employee: employeeDataSample,
    },
    {
      _id: 4,
      payrollPeriod: "Jul 31 - Jul 16 2023",
      department: "Marketing Department",
      status: "declined",
    },
    {
      _id: 5,
      payrollPeriod: "Jul 31 - Jul 16 2023",
      department: "Marketing Department",
      status: "void",
      employee: employeeDataSample,
    },
    {
      _id: 6,
      payrollPeriod: "Aug 01 - Aug 15 2023",
      department: "IT Department",
      status: "inReview",
    },
    {
      _id: 7,
      payrollPeriod: "Jul 31 - Jul 16 2023",
      department: "Marketing Department",
      status: "declined",
      employee: employeeDataSample,
    },
    {
      _id: 8,
      payrollPeriod: "Jul 31 - Jul 16 2023",
      department: "Marketing Department",
      status: "declined",
      employee: employeeDataSample,
    },
  ];
  return rows;
};
