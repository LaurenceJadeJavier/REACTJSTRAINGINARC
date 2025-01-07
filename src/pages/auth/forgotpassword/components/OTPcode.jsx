import React, { useEffect, useState } from "react";
import { POST } from "../../../../services/api";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";

export default function OTPcode(props) {
  const { setStep, username, setOtpValues, otpValues } = props ?? {};

  //local state

  const [err, setErr] = useState(false);
  const [seconds, setSeconds] = useState(60);

  //global state
  const { loadingHoc } = loadingStore((state) => state, shallow);
  const { openSuccessModal } = alertModalStore((state) => state, shallow);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  const handleChange = ({ target }, i) => {
    const { value, nextElementSibling, previousElementSibling } = target;
    if (value >= 0 && value !== " ") {
      const newValues = [...otpValues];
      newValues[i] = value;
      setOtpValues(newValues);
      if (value) {
        nextElementSibling.focus();
      } else {
        previousElementSibling.focus();
      }
    }
  };

  const resendAPI = async () => {
    loadingHoc(true);
    const { status } = await POST("/auth/forgotpassword", { username });
    if (status === 201) {
      setSeconds(60);
      loadingHoc(true);
      return openSuccessModal({
        title: "Success!",
        message: "Please check your email.",
        closeNameBtn: "Ok",
      });
    } else {
      return loadingHoc(true);
    }
  };

  const styleIfEmpty = (value) => {
    return !value && err ? "border-stateRed/50" : "border-neutralGray/50";
  };

  const checkIfEmpty = () => {
    const checker = otpValues.findIndex((data) => data === "");
    if (checker >= 0) return setErr(true);
    else {
      return otpAPI();
    }
  };

  const otpAPI = async () => {
    loadingHoc(true);
    const { status } = await POST("/auth/verifyotp", {
      otp: otpValues.join(""),
    });

    if (status === 200) {
      setStep(3);
      return loadingHoc(false);
    } else {
      return loadingHoc(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex w-full flex-row justify-evenly gap-1">
        {otpValues.map((value, index) => (
          <input
            key={index}
            className={`h-12 w-12  rounded-md border   text-center ${styleIfEmpty(
              value,
            )} text-gray-700  focus:outline-none`}
            id={`otp-${index + 1}`}
            type="text"
            maxLength="1"
            value={value}
            onChange={(e) => handleChange(e, index)}
          />
        ))}
      </div>
      <div className="w-fit">
        Resend code in{" "}
        <span className="font-medium text-primaryBlue">
          {seconds === 0 ? (
            <span
              className="cursor-pointer underline"
              onClick={() => resendAPI()}
            >
              click here
            </span>
          ) : (
            <span>{seconds}</span>
          )}
        </span>
      </div>
      <button
        onClick={() => checkIfEmpty()}
        className="btn btn-info w-full rounded-2xl bg-primaryBlue font-normal capitalize text-white"
      >
        Confirm
      </button>
    </div>
  );
}
