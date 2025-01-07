import React from "react";

export default function fullNameFormat({
  firstName,
  middleName,
  lastName,
  suffix,
  isMiddleInitial,
}) {
  const fullName = () => {
    if (isMiddleInitial) {
      return `${firstName} ${
        middleName ? middleName?.charAt(0) + "." : ""
      } ${lastName} ${suffix ?? ""}`;
    } else {
      return `${firstName} ${middleName ?? ""} ${lastName} ${suffix ?? ""}`;
    }
  };

  return <div className="capitalize">{fullName()}</div>;
}
