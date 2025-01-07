import React from "react";
import makeAnimated from "react-select/animated";
import Select from "react-select";

export const CustomMultiSelect = (props) => {
  const animatedComponents = makeAnimated();
  const { label, isEmpty, value, subLabel, isRequired, ...rest } = props ?? {};
  const ReactSelectStyles = () => ({
    multiValueLabel: (styles) => ({
      ...styles,
      textOverflow: "clip",
      fontSize: "13px",
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: "white",
      borderRadius: "8px",
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      backgroundColor: "white",
      borderTopRightRadius: "8px",
      borderBottomRightRadius: "8px",
    }),
  });

  return (
    <div className="relative flex h-[4.3rem] flex-col">
      <div
        className={`group relative w-full border ${
          label ? "pt-3 " : "p-1"
        } rounded-md bg-lightBlue`}
      >
        <Select
          styles={ReactSelectStyles()}
          components={animatedComponents}
          classNamePrefix="mult-email-input"
          value={value}
          placeholder=""
          {...rest}
        />
        <label
          className={` customTextInput ${
            value?.length > 0 || value ? "text-primaryBlue" : "text-gray-400"
          } `}
        >
          {label} {subLabel && <span>{subLabel}</span>}
        </label>
      </div>
      {isRequired && (!value || value?.length <= 0) && (
        <div className="absolute -bottom-1 text-xs">
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
