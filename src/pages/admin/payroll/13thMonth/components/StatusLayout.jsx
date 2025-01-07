import React from "react";

function statusColor(status) {
  const extraStyle = "uppercase text-xs w-fit rounded-md font-medium";
  switch (status.toLowerCase()) {
    case "in review":
      return "bg-lightOrange text-stateOrange " + extraStyle;
    case "for approval":
      return "bg-aquablue/10 text-primaryBlue " + extraStyle;
    case "approved":
      return "bg-lightGreen text-stateGreen " + extraStyle;
    case "declined":
      return "bg-lightRed text-stateRed " + extraStyle;
    case "void":
      return "bg-lightBlue text-darkGray " + extraStyle;
  }
}
export default function StatusLayout({ status, label }) {
  return <div className={"px-2 py-1 " + statusColor(status)}>{label}</div>;
}

export const StatusLayoutDropdown = ({ status, children }) => {
  return <div className={statusColor(status)}>{children}</div>;
};
