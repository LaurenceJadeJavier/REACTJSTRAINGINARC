import { useState } from "react";
import ScheduleTable from "./View/ScheduleTable";
import { scheduleStore } from "../../../utils/zustand/AdminStore/Schedule/scheduleStore";
import { shallow } from "zustand/shallow";
import { employeeStore } from "../../../utils/zustand/AdminStore/Employee/employeeStore";

export default function Schedule() {
  ///global state
  const { employee } = employeeStore((state) => state, shallow);

  // Local State
  const [containerView, setContainerView] = useState("table");

  const scheduleTableView = () => {
    const ifTableView = containerView === "table";
    const containerProps = {
      rows: employee,
      setView: setContainerView,
    };

    return ifTableView && <ScheduleTable {...containerProps} />;
  };

  return <div>{scheduleTableView()}</div>;
}
