import React from "react";

export default function CustomToggle(props) {
  const { activeLabel, inactiveLabel, onChange, value } = props;
  return (
    <div className="flex gap-2">
      <input
        type="checkbox"
        className="toggle toggle-success  h-5 w-11"
        checked={value}
        onChange={onChange}
      />
      <span className={`${value ? "text-success" : "text-neutralDark"}`}>
        {value ? activeLabel : inactiveLabel}
      </span>
    </div>
  );
}
