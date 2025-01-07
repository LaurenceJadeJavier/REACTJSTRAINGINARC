import React, { useEffect, useState } from "react";
import * as Io5icons from "react-icons/io5";
import { createColumnHelper } from "@tanstack/react-table";
import DataTable from "../../../../components/tables/datatable/DataTable";
import BackButton from "../../../../components/buttons/back-button/BackButton";
import { useLoaderData, useNavigate, useParams } from "react-router";
import defaultImage from "../../../../assets/images/blankProfile.jpg";
import moment from "moment";
import { GET } from "../../../../services/api";
import { employeeStore } from "../../../../utils/zustand/AdminStore/Employee/employeeStore";
import { shallow } from "zustand/shallow";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function ScheduleHistory() {
  const monthLoader = useLoaderData();

  const { accessor } = createColumnHelper();
  const { id } = useParams();

  const navigate = useNavigate();
  // Navigation Display
  const headerDisplay = () => {
    return <BackButton func={() => navigate("/admin/schedule")} />;
  };
  const currentYear = moment().format("YYYY") * 1;
  const currentMonth = moment().format("M") * 1;

  const { fetchEmployeeById, employeeInfo } = employeeStore(
    (state) => state,
    shallow,
  );
  const { loadingHoc } = loadingStore((state) => state, shallow);

  const [selectedMonth, setSelectedMonth] = useState(
    currentMonth + "," + currentYear,
  );

  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchTableData = async () => {
      loadingHoc(true);
      const selectedMY = selectedMonth.split(",") ?? [];

      const { status, data } = await GET(
        `/schedules/employees/${id}?month=${selectedMY[0]}&year=${selectedMY[1]}`,
      );
      if (status === 200) {
        loadingHoc(false);
        return setRows(data);
      } else {
        return loadingHoc(false);
      }
    };
    fetchTableData();
  }, [selectedMonth]);

  useEffect(() => {
    fetchEmployeeById(id);
  }, [id]);

  // User Details Display
  const bodyDisplay = () => {
    const { firstName, lastName, departments, designations, emp_img } =
      employeeInfo ?? {};
    return (
      <div className="mt-4 rounded-xl bg-white p-4 drop-shadow-xl">
        <div className="flex flex-col gap-5 px-1">
          <div className="flex flex-row justify-between">
            <div className="text-lg font-semibold">
              Employee Monthly Schedule
            </div>
            <div className="flex gap-2">
              <select
                value={selectedMonth}
                onChange={({ target }) => setSelectedMonth(target.value)}
                className="w-fit rounded-2xl bg-lightBlue px-2 text-sm text-primaryBlue focus:outline-none"
              >
                {monthLoader?.map((monthYear, index) => (
                  <option key={index} value={[monthYear.month, monthYear.year]}>
                    {monthYear.value}
                  </option>
                ))}
              </select>

              <button
                onClick={() => navigate(`/admin/schedule/view/${id}/update`)}
                className="btn btn-info flex items-center gap-1 rounded-2xl bg-primaryBlue capitalize text-white"
              >
                <div>
                  <Io5icons.IoCreateOutline className="h-4 w-4" />
                </div>
                <span>Update Schedule</span>
              </button>
            </div>
          </div>

          <div className="flex flex-row items-center justify-start gap-2">
            <div>
              <img
                src={emp_img ?? defaultImage}
                alt="asdasd"
                className="h-20 w-20 rounded-full border border-neutralDark p-1"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-medium capitalize">
                {firstName + " " + lastName}
              </div>
              <div className="text-sm capitalize">
                {departments ? departments.name : "-"}
              </div>
              <div className="text-sm capitalize">
                {designations ? designations.name : "-"}
              </div>
            </div>
          </div>
          <div> {tableDisplay()}</div>
        </div>
      </div>
    );
  };

  // Table Display
  const tableDisplay = () => {
    const columns = [
      accessor("date", {
        id: "date",
        header: "Date",
        cell: (info) => moment(info.getValue()).format("LL"),
      }),
      accessor("holiday", {
        id: "holiday",
        header: "Type",
        cell: ({ row }) => {
          const { original } = row || {};
          const { holiday } = original || {};
          const fomatValue = (data) => {
            return data.split("-").join(" ");
          };
          if (!holiday.length) return "Regular Day";
          return holiday.map((day) => (
            <span className="capitalize">{fomatValue(day.type)}</span>
          ));
        },
      }),
      accessor("schedulesType", {
        id: "schedulesType",
        header: "Schedule Type",
        cell: ({ row }) => {
          const { schedulesType } = row.original ?? {};
          return (
            <div>
              {schedulesType ? (
                <div className="flex gap-2">
                  {schedulesType.name}
                  <span className="text-darkGray/80">
                    ( {moment(schedulesType.start_time).format("LT")}-
                    {moment(schedulesType.end_time).format("LT")} )
                  </span>
                </div>
              ) : (
                "-"
              )}
            </div>
          );
        },
      }),
    ];

    const tableProps = {
      columns,
      rows,
      searchOption: false,
    };

    return <DataTable {...tableProps} />;
  };

  return (
    <div>
      {headerDisplay()}
      {bodyDisplay()}
    </div>
  );
}

const scheduleHistoryData = [
  {
    _id: 1,
    date: "April 01, 2023",
    type: "Regular",
    scheduleType: "Morning Shift",
  },
  {
    _id: 1,
    date: "April 01, 2023",
    type: "Special Holiday",
    scheduleType: "Night Shift",
  },
  {
    _id: 1,
    date: "April 01, 2023",
    type: "Regular Holiday",
    scheduleType: "Morning Shift",
  },
];

export const scheduleFilterByMonthLoader = () => {
  const currentYear = moment().format("YYYY") * 1;
  const monthYearArray = [];

  for (let year = currentYear + 2; year >= currentYear; year--) {
    months.forEach((month, index) => {
      monthYearArray.unshift({
        month: index + 1,
        year,
        value: `${month} ${year}`,
      });
    });
  }

  return monthYearArray;
};
