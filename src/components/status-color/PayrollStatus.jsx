import React from "react";

export const statusLabel = (statusLabel) => {
  switch (statusLabel) {
    case "review":
      return "In Review";
    case "approval":
      return "For Approval";
    default:
      return statusLabel;
  }
}

export const statusColor = (status) => {
  const extraStyle =
    "py-1 px-2 uppercase text-xs w-fit rounded-md font-medium";
  switch (status) {
    case "review":
      return "bg-lightOrange text-stateOrange " + extraStyle;
    case "approval":
      return "bg-violet-200 text-violet-600 " + extraStyle;
    case "approved":
      return "bg-lightGreen text-stateGreen " + extraStyle;
    case "declined":
      return "bg-lightRed text-stateRed " + extraStyle;
    case "void":
      return "bg-lightBlue text-darkGray " + extraStyle;
  }
}

export const statusSelectionColor = (status) => {
  const extraStyle =
    "flex flex-row items-center gap-1 p-4 uppercase text-xs w-fit rounded-lg font-medium";
  switch (status) {
    case "review":
      return "bg-lightOrange text-stateOrange " + extraStyle;
    case "approval":
      return "bg-violet-200 text-violet-600 " + extraStyle;
    case "approved":
      return "bg-lightGreen text-stateGreen " + extraStyle;
    case "declined":
      return "bg-lightRed text-stateRed " + extraStyle;
    case "void":
      return "bg-lightBlue text-darkGray " + extraStyle;
  }
}


export default function PayrollStatus({ status }) {
  return <div className={statusColor(status)}>{statusLabel(status)}</div>;
}
