import React, { useEffect, useState } from "react";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import * as IoIcons from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";
import { PUT } from "../../../../services/api";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";

const defaultValue = {
  newpass: "",
  confirmpass: "",
};

export default function Setpassword({ otp }) {
  const navigate = useNavigate();

  const { openSuccessModal } = alertModalStore((state) => state, shallow);
  const { loadingHoc } = loadingStore((state) => state, shallow);
  const [showPass, setShowPass] = useState({
    newpass: false,
    confirmpass: false,
  });

  const [err, setErr] = useState(false);
  const [formValues, setFormValues] = useState(defaultValue);

  const resetPasswordValidation = async () => {
    if (formValues.newpass !== formValues.confirmpass) {
      setErr(true);
    } else {
      setErr(false);
      loadingHoc(true);
      return updateAPI();
    }
  };

  const updateAPI = async () => {
    const { status } = await PUT("/auth/setpassword", {
      otp: otp.join(""),
      password: formValues.newpass,
    });

    if (status === 201) {
      openSuccessModal({
        title: "Success!",
        message: "Your password has been changed successfully",
        closeNameBtn: "Ok",
      });
      loadingHoc(false);
      return navigate("/");
    } else {
      loadingHoc(false);
    }
  };

  const onHandleChange = ({ target }) => {
    const { name, value } = target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <div className="relative flex">
          <CustomInput
            name="newpass"
            type={showPass.newpass ? "text" : "password"}
            label="New Password"
            value={formValues.newpass}
            onChange={onHandleChange}
            required
          />
          <div
            className="absolute right-2 top-5 h-[80%] cursor-pointer rounded-r-md   text-gray-400 "
            onClick={() =>
              setShowPass({ ...showPass, newpass: !showPass.newpass })
            }
          >
            {showPass.newpass ? (
              <IoIcons.IoEyeOutline />
            ) : (
              <IoIcons.IoEyeOffOutline />
            )}
          </div>
        </div>
        <div className="relative flex">
          <CustomInput
            name="confirmpass"
            type={showPass.confirmpass ? "text" : "password"}
            label="Confirm Password"
            value={formValues.confirmpass}
            onChange={onHandleChange}
            required
          />
          <div
            className="absolute right-2 top-5 h-[80%] cursor-pointer rounded-r-md   text-gray-400 "
            onClick={() =>
              setShowPass({
                ...showPass,
                confirmpass: !showPass.confirmpass,
              })
            }
          >
            {showPass.confirmpass ? (
              <IoIcons.IoEyeOutline />
            ) : (
              <IoIcons.IoEyeOffOutline />
            )}
          </div>
        </div>
        <div
          className={`${
            formValues.newpass !== formValues.confirmpass
              ? "   text-stateRed"
              : "   text-stateGreen"
          } ${err ? "visible" : "invisible"} text-xs`}
        >
          {formValues.newpass !== formValues.confirmpass
            ? "Password not match"
            : "Password match"}
        </div>
      </div>
      <div className="-mt-2">
        <button
          className="btn btn-info w-full rounded-2xl bg-primaryBlue font-normal capitalize text-white"
          onClick={() => resetPasswordValidation()}
        >
          Set Password
        </button>
      </div>
    </div>
  );
}
