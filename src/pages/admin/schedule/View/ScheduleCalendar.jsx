import FullCalendar from "@fullcalendar/react";
import React, { useEffect, useState } from "react";
import * as Io5icons from "react-icons/io5";
import dayGridPlugin from "@fullcalendar/daygrid";
import momentPlugin from "@fullcalendar/moment";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction"; // for selectable
import timeGridPlugin from "@fullcalendar/timegrid";
import CancelButton from "../../../../components/buttons/cancel-button/CancelButton";
import { useNavigate } from "react-router";
import FormModal from "../../training/components/FormModal";
import { CustomMultiSelect } from "../../../../components/inputs/CustomMultiSelect";
import { departmentStore } from "../../../../utils/zustand/AdminStore/HrSetup/departmentStore";
import { shallow } from "zustand/shallow";
import { schedTypeStore } from "../../../../utils/zustand/AdminStore/HrSetup/schedTypeStore";
import moment from "moment";
import employeeIcon from "../../../../assets/images/employee_icon.png";
import "../../../../assets/css/Scrollbar.css";
import { GET, POST, Toast } from "../../../../services/api";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";
export default function ScheduleCalendar() {
  const navigate = useNavigate();

  const { openDeleteModal, openSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
  );
  const { department } = departmentStore((state) => state, shallow);
  const { scheduleType } = schedTypeStore((state) => state, shallow);
  const { loadingHoc } = loadingStore((state) => state, shallow);

  const [tempEvents, setTempEvents] = useState([]);
  const [emp_ids, setEmpIds] = useState([]);
  const [deptId, setDeptId] = useState([]);
  const [empList, setEmpList] = useState([]);

  //drag function for the list of schedule type
  useEffect(() => {
    let draggableEl = document.getElementById("external-events");
    const draggable = new Draggable(draggableEl, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        let title = eventEl.getAttribute("name");
        let scheduleType_id = eventEl.getAttribute("_id");
        let start_time = eventEl.getAttribute("start_time");
        let end_time = eventEl.getAttribute("end_time");
        return {
          title,
          scheduleType_id,
          start_time,
          end_time,
        };
      },
    });

    return () => draggable.destroy(); //prevent rerender
  }, []); // Empty dependency array to run this effect only once

  //fetch employee list by department
  useEffect(() => {
    const fetchEmployees = async () => {
      if (deptId.length > 0) {
        const empIdList = deptId.map(({ _id }) => "deptid=" + _id + "&");

        const { data } = await GET(`/employees?${empIdList.join("")}`);

        return setEmpList(data);
      } else {
        return setEmpList([]);
      }
    };
    fetchEmployees();
  }, [deptId]);

  //create employees schedule API
  const createAPI = async () => {
    loadingHoc(true);

    const schedules = tempEvents.map(({ end_date, ...rest }) => ({
      ...rest,
      end_date: end_date !== "" ? end_date : rest.start_date,
    }));

    const params = {
      schedules,
      emp_ids,
    };

    const { status } = await POST("/schedules/employees", params);
    if (status === 201) {
      loadingHoc(false);
      openSuccessModal();
      navigate("/admin/schedule");
    } else {
      return loadingHoc(false);
    }
  };

  const validateInputs = () => {
    if (emp_ids?.length === 0)
      return Toast.fire({
        icon: "info",
        title: "Please select employee",
        timer: 2000,
      });
    if (tempEvents?.length === 0)
      return Toast.fire({
        icon: "info",
        title: "Please add schedule",
        timer: 2000,
      });
    return createAPI();
  };

  // Navigation Display
  const headerDisplay = () => {
    return (
      <div className="flex flex-row items-center justify-between">
        <CancelButton func={() => navigate("/admin/schedule")} />
        <div>
          <button
            onClick={() => validateInputs()}
            className="btn btn-info rounded-2xl bg-primaryBlue px-16 text-sm  font-normal capitalize text-white"
          >
            Create
          </button>
        </div>
      </div>
    );
  };

  //remove and add employees into array
  const updateSelectEmployee = (_id) => {
    let copyEmpId = [...emp_ids];
    if (emp_ids?.length > 0) {
      const checkIfExist = emp_ids.findIndex((data) => data === _id);

      if (checkIfExist >= 0) {
        copyEmpId.splice(checkIfExist, 1);
        setEmpIds(copyEmpId);
      } else {
        copyEmpId.push(_id);
        setEmpIds(copyEmpId);
      }
    } else {
      copyEmpId.push(_id);
      return setEmpIds(copyEmpId);
    }
  };

  const listOfEmployeeDisplay = () => {
    const checkListSelection = () => {
      const checkListOptionsDisplay = (item, index) => {
        const { firstName, lastName, _id } = item ?? {};
        return (
          <div key={index}>
            <div className="flex flex-row items-center gap-2 py-2">
              <div className="pt-1">
                <input
                  type="checkbox"
                  onChange={(e) => updateSelectEmployee(_id)}
                  className="checkbox-info checkbox checkbox-sm"
                />
              </div>
              <div className="text-sm text-neutralGray">
                {firstName + " " + lastName}
              </div>
            </div>
          </div>
        );
      };
      return (
        //show list of employee based on the selected departments
        <div className="flex h-full max-h-72 flex-col divide-y overflow-hidden overflow-y-scroll px-2">
          {empList?.map(checkListOptionsDisplay)}
        </div>
      );
    };

    return (
      <div className="flex h-full flex-col gap-3 rounded-xl bg-white p-4 drop-shadow-xl">
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col">
            <div className="text-sm font-semibold">List of Employees</div>
            <div className="text-xs">
              Select the employee you'd like to create a schedule for
            </div>
          </div>
        </div>
        <div>
          <CustomMultiSelect
            label="Department"
            placeholder="Select Multiple"
            options={departmentList}
            isMulti={true}
            // name="types"
            value={deptId}
            onChange={(e) => setDeptId(e)}
            closeMenuOnSelect={false}
            // isRequired
          />
        </div>

        {empList?.length > 0 ? (
          checkListSelection()
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <img src={employeeIcon} alt="empty" />
            <div className="text-primaryBlue">
              No employee has been selected
            </div>
            <div className="text-sm text-neutralGray">
              Choose departments to pick employees from
            </div>
          </div>
        )}
      </div>
    );
  };

  //restructure department for multi select option
  const departmentList = department?.map((data) => ({
    ...data,
    value: data._id,
    label: data.name,
  }));

  const bodyDisplay = () => {
    return (
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex basis-2/6 flex-col gap-5">
          {listOfEmployeeDisplay()}
          {scheduleTypeDisplay()}
        </div>
        <div className="grow basis-2/6">{renderCalendar()}</div>
      </div>
    );
  };

  //list of schedule type
  const scheduleShiftListSelection = (item, index) => {
    const { name, _id, start_time, end_time } = item || {};
    const dragProps = {
      _id,
      name,
      start_time,
      end_time,
      key: _id,
    };

    return (
      <div
        className="fc-event mb-1 cursor-pointer  rounded-lg border border-primaryBlue bg-white p-3 text-sm"
        {...dragProps}
      >
        <div className="flex flex-row items-center gap-2">
          <div className="capitalize text-neutralDark">{name}</div>{" "}
          <div className="overflow-hidden text-xs text-neutralGray">
            {moment(start_time).format("hh:mm A")} -{" "}
            {moment(end_time).format("hh:mm A")}
          </div>
        </div>
      </div>
    );
  };
  const scheduleShiftList = () => {
    return (
      <div
        id="external-events"
        className="custom-scrollbar flex max-h-40 flex-col gap-2 overflow-hidden overflow-y-scroll px-2"
      >
        {scheduleType.map(scheduleShiftListSelection)}
      </div>
    );
  };
  const scheduleTypeDisplay = () => {
    return (
      <div className="flex flex-col gap-3 rounded-xl bg-white p-4 drop-shadow-xl">
        <div className="flex flex-col">
          <div className="text-sm font-semibold">Schedule Type</div>
          <div className="text-xs">Drag these onto the calendar:</div>
        </div>
        {scheduleShiftList()}
      </div>
    );
  };

  // Calendar Display
  const renderCalendar = () => {
    const content = ({ event }) => {
      const { title, _def } = event ?? {};
      return (
        <div className="flex flex-row gap-2">
          <div className="overflow-hidden text-ellipsis text-sm font-thin capitalize">
            {title} {moment(_def.extendedProps.start_time).format("hh:mm A")} -{" "}
            {moment(_def.extendedProps.end_time).format("hh:mm A")}
          </div>
        </div>
      );
    };

    //get events on the calendar
    const handleEvents = (events) => {
      let container = events.map(({ _def, startStr, endStr, title }) => ({
        ..._def.extendedProps,
        title,
        start_date: startStr,
        end_date: endStr,
      }));

      return setTempEvents(container);
    };

    //delete function for every events created
    const handleEventClick = (clickInfo) => {
      openDeleteModal({
        title: "Remove schedule?",
        message: `Are you sure you want to delete the ${clickInfo.event.title} `,
        modalAction: () => {
          clickInfo.event.remove();
        },
      });
    };

    return (
      <div className="rounded-xl bg-white p-4 drop-shadow-xl">
        <FullCalendar
          plugins={[
            interactionPlugin,
            dayGridPlugin,
            momentPlugin,
            timeGridPlugin,
          ]}
          initialView="dayGridMonth"
          editable={true}
          selectable={false}
          eventOverlap={false}
          selectMirror={true}
          dayMaxEvents={true}
          events={[]}
          eventContent={content}
          titleFormat="MMMM YYYY"
          headerToolbar={{
            start: "prev,next",
            center: "title",
            end: "",
          }}
          // select={handleDateSelect}
          // // eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          // eventClick={(e) => handleEvents(e)}
          eventsSet={handleEvents}
          // eventDrop={handleEventDrop}
          droppable={true}
          // eventReceive={handleEventReceive}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {headerDisplay()}
      {bodyDisplay()}
    </div>
  );
}
