import React from "react";
import * as Io5icons from "react-icons/io5";
import { CustomInput } from "../../../../../components/inputs/CustomInput";

function ApplicationForm() {
  return (
    <div className="flex min-h-screen items-center justify-center p-2">
      <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-4 py-8 md:w-[500px]">
        <div>
          <img
            src="https://media.discordapp.net/attachments/1027820284960575610/1146350620928913448/abstract-geometric-logo-or-infinity-line-logo-for-your-company-free-vector.jpg?width=673&height=673"
            alt="Company.png"
            className="w-40 rounded-xl md:w-32"
          />
        </div>
        <div className="w-full">
          <div className="text-center text-xl text-primaryBlue">
            Content Marketing Specialist
          </div>
          <div className="flex items-center justify-center">
            <div className="text-sm font-medium">Company Name</div>
            <Io5icons.IoEllipseSharp className="mx-3 text-[8px]" />
            <div className="text-sm font-medium">Location</div>
          </div>
          <div className="mt-6 grid w-full gap-4">
            <CustomInput type="text" label="Name" />
            <CustomInput type="text" label="Email Address" />
            <CustomInput type="number" label="Contact Number" />
            <div className="-mt-2">
              <label className="text-xs text-neutralGray">
                UPLOAD RESUME / CV
              </label>
              <input
                type="file"
                class="block w-full rounded-lg bg-lightBlue text-sm
      text-slate-500 file:mr-4
      file:rounded-l-lg file:border-0 file:bg-neutralLight file:px-4
      file:py-2 file:py-4
      file:text-sm file:font-semibold
      file:text-white"
              />
            </div>
            <div className="rounded-full bg-primaryBlue p-4 text-center text-white hover:cursor-pointer">
              Submit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationForm;
