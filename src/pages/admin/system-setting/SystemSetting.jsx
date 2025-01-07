import React from "react";
import * as Io5icons from "react-icons/io5";
import { Link } from "react-router-dom";
export default function SystemSetting() {
  const settingList = [
    {
      _id: 1,
      label: "Company Profile",
      subLabel: "Manage company details",
      icon: <Io5icons.IoBusinessOutline />,
      path: "/admin/system-setting/company-profile",
    },
    {
      _id: 2,
      label: "Department",
      subLabel: "Manage department settings",
      icon: <Io5icons.IoBookmarksOutline />,
      path: "/admin/system-setting/department",
    },
    {
      _id: 3,
      label: "Restriction Type",
      subLabel: "Set limitations on location access",
      icon: <Io5icons.IoMapOutline />,
      path: "/admin/system-setting/restriction-type",
    },
    {
      _id: 4,
      label: "Role",
      subLabel: "Control user roles and access levels",
      icon: <Io5icons.IoPeopleOutline />,
      path: "/admin/system-setting/role",
    },
  ];

  return (
    <div className="flex h-[95vh] w-full flex-col gap-5 rounded-xl bg-white p-7 drop-shadow-xl ">
      <div className="flex flex-col">
        <div className="text-xl font-semibold text-neutralDark">
          System Setting
        </div>
        <div className="text-sm text-neutralGray">
          Customize functionalities
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {settingList?.map((data) => {
          const { _id, label, subLabel, path, icon } = data ?? [];
          return (
            <Link
              key={_id}
              to={path}
              className="flex items-center gap-2 rounded-xl border border-lightBlue p-4  hover:bg-primaryBlue/10 "
            >
              <div className="rounded-lg bg-lightBlue p-2 text-2xl text-primaryBlue">
                {icon}
              </div>
              <div className="flex flex-col gap-1 leading-tight">
                <div className="font-semibold">{label}</div>
                <span className="text-xs text-neutralGray">{subLabel}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
