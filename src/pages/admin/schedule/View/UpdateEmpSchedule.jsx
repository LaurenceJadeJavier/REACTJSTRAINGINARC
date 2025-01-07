import FullCalendar from "@fullcalendar/react";
import React, { useEffect, useState } from "react";
import * as Io5icons from "react-icons/io5";
import dayGridPlugin from "@fullcalendar/daygrid";
import momentPlugin from "@fullcalendar/moment";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction"; // for selectable
import timeGridPlugin from "@fullcalendar/timegrid";
import CancelButton from "../../../../components/buttons/cancel-button/CancelButton";
import { useNavigate, useParams } from "react-router";
import FormModal from "../../training/components/FormModal";

import { shallow } from "zustand/shallow";
import { schedTypeStore } from "../../../../utils/zustand/AdminStore/HrSetup/schedTypeStore";
import moment from "moment";
import blankProfile from "../../../../assets/images/blankProfile.jpg";
import "../../../../assets/css/Scrollbar.css";
import { GET, POST, PUT, Toast } from "../../../../services/api";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";
import { employeeStore } from "../../../../utils/zustand/AdminStore/Employee/employeeStore";
export default function UpdateEmpSchedule() {
  const navigate = useNavigate();
  const { id } = useParams();
  //local state
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [tempEvents, setTempEvents] = useState([]);

  //global state
  const { openDeleteModal, openSuccessModal, openConfirmModal } =
    alertModalStore((state) => state, shallow);
  const { fetchEmployeeById, employeeInfo } = employeeStore(
    (state) => state,
    shallow,
  );
  const { scheduleType } = schedTypeStore((state) => state, shallow);
  const { loadingHoc } = loadingStore((state) => state, shallow);

  //drag and drop function, adding event into calendar
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
    return () => draggable.destroy();
  }, []);

  useEffect(() => {
    //restructure data from employee schedule
    if (employeeInfo?.schedules?.length > 0) {
      const sched = employeeInfo?.schedules.map(
        ({ end_date, schedule_types, start_date, ...rest }) => ({
          ...rest,
          end_time: schedule_types.end_time,
          start_time: schedule_types.start_time,
          start: moment(start_date).format("YYYY-MM-DD"),
          end: moment(end_date).format("YYYY-MM-DD"),
          tempStart: moment(start_date).format("YYYY-MM-DD"),
          tempEnd:
            end_date === start_date
              ? ""
              : moment(end_date).format("YYYY-MM-DD"),
          title: schedule_types.name,
        }),
      );
      setCalendarEvents(sched);
    }
  }, [employeeInfo.schedules]);

  useEffect(() => {
    fetchEmployeeById(id);
  }, [id]);

  const askConfirmation = async () => {
    openConfirmModal({
      modalAction: () => updateAPI(),
    });
  };

  const validateInputs = () => {
    if (tempEvents?.length === 0)
      return Toast.fire({
        icon: "info",
        title: "Please add schedule",
        timer: 2000,
      });
    else return askConfirmation();
  };

  const updateAPI = async () => {
    loadingHoc(true);
    const schedules = tempEvents.map(({ end_date, ...rest }) => ({
      ...rest,
      end_date: end_date !== "" ? end_date : rest.start_date,
    }));

    const { status } = await PUT(`/schedules/employees/${id}`, { schedules });
    if (status === 201) {
      loadingHoc(false);
      openSuccessModal();
      navigate(-1);
    } else {
      return loadingHoc(false);
    }
  };

  // Navigation Display
  const headerDisplay = () => {
    return (
      <div className="flex flex-row items-center justify-between">
        <CancelButton func={() => navigate(-1)} />
        <div>
          <button
            onClick={() => validateInputs()}
            className="btn btn-info rounded-2xl bg-primaryBlue px-16 text-sm  font-normal capitalize text-white"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  };

  //display employee information
  const employeeDetails = () => {
    const { firstName, lastName, departments, designations, emp_img } =
      employeeInfo ?? {};
    return (
      <div className="flex h-fit flex-col items-center justify-center gap-3 rounded-xl bg-white py-10 drop-shadow-xl">
        <div className="flex flex-col items-center justify-center gap-1">
          <img
            src={emp_img ?? blankProfile}
            alt="blankProfile"
            className="h-20 w-20 rounded-full p-1 ring-2 ring-neutralDark"
          />
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
    );
  };

  const bodyDisplay = () => {
    return (
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex basis-2/6 flex-col gap-5">
          {employeeDetails()}
          {scheduleTypeDisplay()}
        </div>
        <div className="grow basis-2/6">{renderCalendar()}</div>
      </div>
    );
  };

  const scheduleShiftListSelection = (item) => {
    const { name, _id, start_time, end_time } = item || {};

    //passing props added to calendar events
    const dragProps = {
      _id,
      name,
      start_time,
      end_time,
      key: _id,
    };

    return (
      <div
        className="fc-event mb-1 cursor-pointer rounded-lg border border-primaryBlue bg-white p-3 text-sm"
        {...dragProps}
      >
        <div className="flex flex-row items-center gap-2">
          <div className="capitalize text-neutralDark">{name}</div>{" "}
          <div className="text-xs text-neutralGray">
            {moment(start_time).format("hh:mm A")} -{" "}
            {moment(end_time).format("hh:mm A")}
          </div>
        </div>
      </div>
    );
  };

  //display schedule type list
  const scheduleShiftList = () => {
    return (
      <div
        id="external-events"
        className="custom-scrollbar flex h-full max-h-96 flex-col gap-2 overflow-hidden overflow-y-scroll px-2"
      >
        {scheduleType.map(scheduleShiftListSelection)}
      </div>
    );
  };
  const scheduleTypeDisplay = () => {
    return (
      <div className="flex h-full flex-col gap-3 rounded-xl bg-white p-4 drop-shadow-xl">
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

    // getting events and restructure
    const handleEvents = (events) => {
      let container = events.map(({ _def, startStr, endStr, title }) => {
        const { _id, tempStart, tempEnd, scheduleType_id } =
          _def.extendedProps ?? {};
        if (_id) {
          if (tempStart !== startStr || tempEnd !== endStr) {
            const params = {
              title,
              scheduleType_id,
              start_date: startStr,
              end_date: endStr,
            };
            return params;
          } else {
            const params = {
              ..._def.extendedProps,
              title,
              start_date: startStr,
              end_date: endStr,
            };
            return params;
          }
        } else {
          const params = {
            ..._def.extendedProps,
            title,
            start_date: startStr,
            end_date: endStr,
          };
          return params;
        }
      });

      return setTempEvents(container);
    };

    const handleEventClick = ({ event }) => {
      openDeleteModal({
        title: "Remove schedule?",
        message: `Are you sure you want to delete the ${event.title} `,
        modalAction: () => {
          event.remove(); //remove schedule on the calendar
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
          // weekends={false}
          droppable={true}
          editable={true}
          selectable={false}
          eventOverlap={false} //prevent multiple event per day
          selectMirror={true}
          dayMaxEvents={true}
          events={calendarEvents ?? []} // render default events
          eventContent={content} //event design
          headerToolbar={{
            start: "prev,next",
            center: "title",
            end: "",
          }}
          // select={handleDateSelect} //trigger when select a date from the calendar
          eventClick={handleEventClick} //trigger when click
          eventsSet={handleEvents} //trigger when change events
          // eventResize={handleDateChange} //trigger when resize the specific event
          // eventDrop={handleDateChange} //trigger when move the event
          // eventReceive={handleEventReceive} //trigger when drop an event
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
