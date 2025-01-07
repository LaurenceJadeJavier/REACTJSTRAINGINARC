import React from "react";

export default function Status({ status, label }) {
  function statusColor(status) {
    const extraStyle =
      "py-1 px-2 uppercase text-xs w-fit rounded-md font-medium";
    switch (status) {
      case "submitted":
        return "bg-lightOrange text-stateOrange " + extraStyle;
      case "pending":
        return "bg-lightOrange text-stateOrange " + extraStyle;
      case "approved":
        return "bg-lightGreen text-stateGreen " + extraStyle;
      case "declined":
        return "bg-lightRed text-stateRed " + extraStyle;
      case "cancelled":
        return "bg-lightBlue text-darkGray " + extraStyle;
    }
  }

  return <div className={statusColor(status)}>{label}</div>;
}
