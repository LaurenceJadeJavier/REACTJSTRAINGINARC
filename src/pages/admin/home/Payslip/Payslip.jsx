import React from "react";

// component
import BackButton from "../../../../components/buttons/back-button/BackButton";

// Icons
import * as Io5icons from "react-icons/io5";

export default function Payslip() {
  const renderContainer = () => {
    const sampleData = [
      {
        titleDate: "July 2023",
        descDate: "Jul 1 - Jul 15 2023",
      },
      {
        titleDate: "July 2023",
        descDate: "Jul 16 - Jul 31 2023",
      },
      {
        titleDate: "August 2023",
        descDate: "Aug 1 - Aug 15 2023",
      },
      {
        titleDate: "August 2023",
        descDate: "Aug 16 - Aug 31 2023",
      },
    ];

    return (
      <div className="mt-6 rounded-2xl bg-white px-4 py-6 shadow-md">
        <div className="flex flex-row items-center justify-between">
          <div>
            <div className="text-2xl font-medium text-neutralDark">Payslip</div>
            <div className="text-base text-neutralGray">
              View your payslip details
            </div>
          </div>
          <button className="btn rounded-2xl bg-lightBlue">
            <Io5icons.IoSearchOutline className="text-xl text-primaryBlue" />{" "}
          </button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4">
          {sampleData.map(({ titleDate, descDate }) => (
            <div
              className="flex flex-row items-center gap-2 rounded-2xl border border-lightBlue p-4"
              key={descDate}
            >
              <div className="w-fit rounded-lg bg-lightBlue p-1.5">
                <Io5icons.IoCashOutline className="h-6 w-6 text-primaryBlue" />
              </div>
              <div className="flex flex-col justify-between">
                <span className="text-base font-medium text-neutralDark">
                  {titleDate}
                </span>
                <span className="text-xs font-normal text-neutralGray">
                  {descDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="pl-2">
        <BackButton />
      </div>
      {renderContainer()}
    </div>
  );
}
