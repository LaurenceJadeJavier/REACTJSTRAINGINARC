import moment from "moment";
import React, { useState } from "react";
import { useEffect } from "react";
import FormModal from "../../../../components/modal/FormModal";
import { GET, POST, PUT } from "../../../../services/api";
import { authStore } from "../../../../utils/zustand/AuthStore/authStore";
import { shallow } from "zustand/shallow";
import { employeeAccStore } from "../../../../utils/zustand/EmployeeStore/EmployeeAccStore";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";

export default function TimeinAndTimeout() {
  const { employeeAttendance, getTodayEmpAttendance } = employeeAccStore(
    (state) => state,
    shallow,
  );
  const { userInformation } = authStore((state) => state, shallow);

  const { loadingHoc } = loadingStore((state) => state, shallow);

  const [openModal, setOpenModal] = useState({
    isOpen: false,
    title: "",
  });

  const refetch = () =>
    userInformation?.isEmployee?._id &&
    getTodayEmpAttendance(userInformation?.isEmployee?._id);

  useEffect(() => {
    refetch();
  }, [userInformation]);

  const closeModal = () => {
    return setOpenModal({
      isOpen: false,
      title: "",
    });
  };

  const showConfirmation = () => {
    const modalProps = {
      title: openModal.title + " - Confirmation",
      body: <></>,
      submit: {
        name: "Confirm",
        btnFunction: () => apiFunction(openModal.params),
      },
      cancel: {
        name: "Cancel",
        btnFunction: () => closeModal(),
      },
      isOpen: openModal.isOpen,
      maxWidth: "max-w-sm",
    };

    return <FormModal {...modalProps} />;
  };

  const askConfirmation = (title, params) =>
    setOpenModal({
      isOpen: true,
      title,
      params,
    });

  const apiFunction = async (type) => {
    loadingHoc(true);
    const newParams = {
      type,
      emp_id: userInformation?.isEmployee?._id,
    };

    // function attendanceAPI() {
    //   return employeeAttendance
    //     ? PUT(`/attendances/${userInformation?.isEmployee?._id}`, { type })
    //     : POST("/attendances", newParams);
    // }
    const { status } = await PUT(
      `/attendances/employees/${userInformation?.isEmployee?._id}/today`,
      newParams,
    );
    if (status === 201) {
      refetch();
      closeModal();
      loadingHoc(false);
    } else return loadingHoc(false);
  };

  const styleClose =
    "btn flex h-14 items-center justify-center rounded-lg bg-highlight capitalize";
  const styleOpen =
    "btn flex h-14 flex-col items-center justify-center rounded-lg bg-lightBlue capitalize ";

  const renderStyle = (attendance) => {
    return attendance ? styleClose : styleOpen;
  };

  const renderBtnLabel = (label, time) => {
    return time ? (
      <div className="flex flex-col">
        <span className="font16MediumNeutralDark">
          {moment(time).format("LT")}
        </span>
        <span className="font11NormalNeutralGray">{label}</span>
      </div>
    ) : (
      <span className="font16NormalPrimaryBlue ">{label}</span>
    );
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md">
      {showConfirmation()}
      <RenderDate />
      <div className="border-t-2 border-dashed border-[#ACD0F0]/20 pt-4">
        <div className="grid grid-cols-2 items-center justify-center gap-2 lg:grid-cols-4">
          <button
            onClick={() =>
              !employeeAttendance?.time_in &&
              askConfirmation("Time In", "time_in")
            }
            className={renderStyle(employeeAttendance?.time_in)}
          >
            {renderBtnLabel("Time In", employeeAttendance?.time_in)}
          </button>
          <button
            onClick={() =>
              !employeeAttendance?.lunch_out &&
              askConfirmation("Lunch Out", "lunch_out")
            }
            className={renderStyle(employeeAttendance?.lunch_out)}
          >
            {renderBtnLabel("Lunch Out", employeeAttendance?.lunch_out)}
          </button>
          <button
            onClick={() =>
              !employeeAttendance?.lunch_in &&
              askConfirmation("Lunch In", "lunch_in")
            }
            className={renderStyle(employeeAttendance?.lunch_in)}
          >
            {renderBtnLabel("Lunch In", employeeAttendance?.lunch_in)}
          </button>
          <button
            onClick={() =>
              !employeeAttendance?.time_out &&
              askConfirmation("Time Out", "time_out")
            }
            className={renderStyle(employeeAttendance?.time_out)}
          >
            {renderBtnLabel("Time Out", employeeAttendance?.time_out)}
          </button>
        </div>
      </div>
    </div>
  );
}

const RenderDate = () => {
  // const { setDate } = props ?? {};
  const [ctime, setTime] = useState([
    moment().format("hh:mm:ss"),
    moment().format("A"),
  ]);
  const [cDay, setDay] = useState(moment().format("dddd, DD MMMM YYYY"));
  useEffect(() => {
    setInterval(() => {
      setDay(moment().format("dddd, DD MMMM YYYY"));
      // setDate(moment().format("YYYY-MM-DD"));
      setTime([moment().format("hh:mm:ss"), moment().format("A")]);
    });
  }, []);

  return (
    <div className="">
      <div className="relative w-52">
        <span className=" text-5xl font-medium leading-10 text-primaryBlue">
          {ctime[0]}
        </span>
        <span className="absolute -right-8 bottom-0 pl-1 text-lg font-normal uppercase text-primaryBlue">
          {ctime[1]}
        </span>
      </div>
      <div className="mt-2 pb-4">
        <span className="text-base text-neutralGray">{cDay}</span>
      </div>
    </div>
  );
};
