import React from "react";

export const CustomSelect = (props) => {
  const {
    label,
    value,
    subLabel,
    isRequired,
    isEmpty,
    options,
    placeholder,
    ...rest
  } = props ?? {};

  return (
    <div className="relative flex h-[4.3rem] w-full flex-col">
      <div className="group relative w-full  rounded-lg bg-lightBlue  pt-3">
        <select
          {...rest}
          value={value}
          className="peer w-full bg-transparent px-2 py-3.5 outline-none"
          placeholder=""
        >
          <option selected disabled value="select">
            {placeholder ?? "Select"}
          </option>
          {options?.length > 0 &&
            options?.map(({ label, value, _id }) => (
              <option value={value} key={_id}>
                {label}
              </option>
            ))}
        </select>
        <label
          className={`customTextInput ${
            value ? "text-primaryBlue" : "text-gray-400"
          }`}
        >
          {label} {subLabel && <span>({subLabel})</span>}
        </label>
      </div>
      {isRequired && (!value || value === "select") && (
        <div className="absolute -bottom-2 text-xs">
          {isEmpty && (
            <span className="text-xs text-stateRed">
              *This field is required
            </span>
          )}
        </div>
      )}
    </div>
  );
};
