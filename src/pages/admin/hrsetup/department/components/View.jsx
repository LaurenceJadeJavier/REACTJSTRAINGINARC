import React from "react";

export default function View(props) {
  const { noOfEmployees, description } = props ?? {};
  const viewList = [
    {
      _id: 1,
      label: "No. of Employees",
      value: noOfEmployees,
    },
    {
      _id: 2,
      label: "Description",
      value: description,
    },
  ];

  return (
    <div className="pt-2">
      {viewList?.map(({ _id, label, value }) => (
        <div className="grid grid-cols-12 text-sm" key={_id}>
          <div className="col-span-3 text-neutralGray">{label}</div>
          <div className="col-span-9 text-neutralDark">: {value ?? "-"}</div>
        </div>
      ))}
    </div>
  );
}
