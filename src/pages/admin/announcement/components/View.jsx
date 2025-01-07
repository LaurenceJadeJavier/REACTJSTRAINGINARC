import moment from "moment";
import React from "react";

export default function View({ openViewModal }) {
  const { data } = openViewModal ?? {};
  const { date, details, dept_list, to } = data ?? {};
  const content = [
    {
      _id: 1,
      label: "Date and Time",
      value: moment(date).format("MMMM DD, YYYY | h:mm A"),
    },
    {
      _id: 2,
      label: "Receiver",
      value:
        dept_list.length > 0 ? dept_list.map(({ name }) => name + ", ") : to,
    },
  ];
  return (
    <div className="flex flex-col gap-2 pt-2">
      <div className="flex flex-col text-sm">
        {content.map(({ _id, label, value }) => (
          <div className="grid grid-cols-12" key={_id}>
            <div className="col-span-2 text-neutralGray">{label}</div>
            <div className="col-span-10">: {value}</div>
          </div>
        ))}
      </div>
      <div className="break-all text-justify">{details}</div>
    </div>
  );
}
