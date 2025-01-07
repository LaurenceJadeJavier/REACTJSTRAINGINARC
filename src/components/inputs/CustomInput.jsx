import React from "react";
import { validateEmailAddress } from "../../utils/validation/emailValidation";
import { validateMobileNumber } from "../../utils/validation/mobileValidation";

export const CustomInput = (props) => {
  const {
    label,
    isEmpty,
    value,
    subLabel,
    isRequired,
    isEmail,
    isMobileNum,
    ...rest
  } = props ?? {};
  return (
    <div className="relative flex h-[4.3rem] w-full flex-col">
      <div className="group relative w-full  rounded-lg bg-lightBlue  pt-3">
        <input
          className="peer w-full bg-transparent px-2 py-3 outline-none"
          placeholder=""
          {...rest}
          value={value}
          autoComplete="off"
        />
        <label
          className={` customTextInput ${
            value ? "text-primaryBlue" : "text-gray-400"
          } `}
        >
          {label} {subLabel && <span>{subLabel}</span>}
        </label>
      </div>
      {isRequired && (!value || value === "") && (
        <div className="absolute -bottom-2 text-xs">
          {isEmpty && (
            <span className="text-xs text-stateRed">
              *This field is required
            </span>
          )}
        </div>
      )}
      {isRequired && isEmail && value && validateEmailAddress(value) && (
        <span className="text-xs text-stateRed">*Invalid Email Format</span>
      )}
      {isRequired && isMobileNum && value && validateMobileNumber(value) && (
        <span className="text-xs text-stateRed">
          *Invalid Contact Number Format
        </span>
      )}
    </div>
  );
};
