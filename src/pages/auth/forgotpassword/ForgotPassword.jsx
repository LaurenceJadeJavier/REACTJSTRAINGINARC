import React, { useState } from "react";
import { CustomInput } from "../../../components/inputs/CustomInput";
import * as IoIcons from "react-icons/io5";
import { Link } from "react-router-dom";
import OTPcode from "./components/OTPcode";
import Setpassword from "./components/Setpassword";
import { POST } from "../../../services/api";
import { loadingStore } from "../../../utils/zustand/LoadingStore/loadingStore";
import { shallow } from "zustand/shallow";
export default function ForgotPassword() {
  //global state
  const { loadingHoc } = loadingStore((state) => state, shallow);

  //local state
  const [username, setUsername] = useState("");
  const [step, setStep] = useState(1);
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));

  const forgotpasswordAPI = async (e) => {
    loadingHoc(true);
    e.preventDefault();
    const { status } = await POST("/auth/forgotpassword", { username });
    if (status === 201) {
      setStep(2);
      return loadingHoc(false);
    } else {
      return loadingHoc(false);
    }
  };

  const stepperLayout = () => {
    switch (step) {
      case 1:
        return forgotLayout();
      case 2:
        return (
          <OTPcode
            setStep={setStep}
            username={username}
            setOtpValues={setOtpValues}
            otpValues={otpValues}
          />
        );
      case 3:
        return <Setpassword otp={otpValues} />;
    }
  };

  const stepperTitle = () => {
    switch (step) {
      case 1:
        return "Forgot Password";
      case 2:
        return "Check your Email";
      case 3:
        return "Set New Password";
    }
  };

  const stepperSubTitle = () => {
    switch (step) {
      case 1:
        return "To reset your password, you need to enter your email address.";
      case 2:
        return "Please enter the 6-digit  code sent to your email";
      case 3:
        return "Please enter your new password";
    }
  };

  const forgotLayout = () => {
    return (
      <form
        className="grid grid-cols-1 gap-5"
        formNoValidate
        onSubmit={forgotpasswordAPI}
      >
        <div className="flex flex-col gap-1">
          <CustomInput
            name="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            type="email"
            label="Email"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="btn btn-info w-full rounded-2xl bg-primaryBlue font-normal capitalize text-white"
          >
            Submit
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="relative flex h-screen w-full flex-row">
      <div className="absolute left-3 top-3 flex flex-row items-center gap-2">
        <div className="h-16 w-16 rounded-full bg-primaryBlue" />
        <div className="text-xl font-semibold text-primaryBlue">LOGO</div>
      </div>
      <div className="flex basis-full items-center justify-center md:basis-3/6 lg:basis-2/5 ">
        <div className="card m-2 w-full max-w-sm bg-white p-6 shadow-xl">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-medium text-neutralDark">
                {stepperTitle()}
              </div>
              <div className="text-sm font-normal text-neutralGray">
                {stepperSubTitle()}
              </div>
            </div>
            {stepperLayout()}
            <div className="flex items-center justify-center">
              <Link
                to="/"
                className="flex items-center justify-center gap-1 text-sm text-primaryBlue"
              >
                <IoIcons.IoArrowBackOutline />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden basis-3/6 items-center justify-center  bg-loginBg bg-cover bg-center md:flex lg:basis-3/5">
        <div className="flex max-w-xl flex-col gap-2 p-5 text-white">
          <div className="text-5xl font-bold ">Start your journey with us</div>
          <div className="font-light">
            Lorem ipsum dolor sit amet. Ab possimus molestias cum iste corporis
            qui praesentium .
          </div>
        </div>
      </div>
    </div>
  );
}
