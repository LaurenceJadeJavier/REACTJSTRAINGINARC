import React from "react";

export default function CustomTextArea(props) {
  const { label, isRequired, isEmpty, value, subLabel, rows, ...rest } =
    props ?? {};
  return (
    <div className="relative flex w-full  flex-col">
      <div className="group relative w-full  rounded-lg bg-lightBlue  pt-3">
        <textarea
          {...rest}
          value={value}
          rows={rows ?? "3"}
          cols="40"
          className="min-h-24 peer  w-full bg-transparent px-2 py-3 outline-none"
          autoComplete="off"
        />
        <label
          // className={`${labelColor(value)}  customTextInput`}
          className={` customTextInput text-gray-400`}
        >
          {label} {subLabel && <span>{subLabel}</span>}
        </label>
      </div>
      {isRequired && (!value || value === "") && (
        <div className="absolute -bottom-4 text-xs">
          {isEmpty && (
            <span className="text-xs text-stateRed">
              *This field is required
            </span>
          )}
        </div>
      )}
    </div>
  );
}
