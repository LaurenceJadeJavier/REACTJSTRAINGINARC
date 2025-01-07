import React, { useEffect, useState } from "react";
import { CustomInput } from "../../../components/inputs/CustomInput";
import * as IoIcons from "react-icons/io5";
import { Link, useNavigate, redirect, useNavigation } from "react-router-dom";
import { POST } from "../../../services/api";
import { shallow } from "zustand/shallow";
import { loadingStore } from "../../../utils/zustand/LoadingStore/loadingStore";
export default function Login() {
  const navigate = useNavigate();

  const { loadingHoc } = loadingStore((state) => state, shallow);

  const [showPass, setShowPass] = useState(false);
  const [formValues, setFormValues] = useState({});

  const loginFunction = async (e) => {
    e.preventDefault();
    loadingHoc(true);
    const { data, status } = await POST("/auth/login", formValues);
    const { token } = data || {};

    if (status === 201) {
      localStorage.setItem("token", token);
      navigate("/admin/dashboard");
      return loadingHoc(false);
    } else {
      return loadingHoc(false);
    }
  };

  const onHandleChange = ({ target }) => {
    const { value, name } = target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <div className="relative flex h-screen w-full flex-row">
      <div className="absolute left-3 top-3 flex flex-row items-center gap-2">
        <div className="h-16 w-16 rounded-full bg-primaryBlue" />
        <div className="text-xl font-semibold text-primaryBlue">LOGO</div>
      </div>
      <div className="flex basis-full items-center justify-center md:basis-3/6 lg:basis-2/5 ">
        <div className="card m-2 w-full max-w-sm bg-white p-6 shadow-xl">
          <form
            onSubmit={loginFunction}
            formNoValidate
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-medium text-neutralDark">
                Welcome!
              </div>
              <div className="text-sm font-normal text-neutralGray">
                {" "}
                Please login to continue
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <CustomInput
                name="username"
                type="email"
                value={formValues.username}
                label="Email"
                onChange={onHandleChange}
                required
              />
              <div className="relative flex">
                <CustomInput
                  name="password"
                  type={showPass ? "text" : "password"}
                  label="Password"
                  value={formValues.password}
                  onChange={onHandleChange}
                  required
                />
                <div
                  className="absolute right-2 top-5 h-[80%] cursor-pointer rounded-r-md   text-gray-400 "
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? (
                    <IoIcons.IoEyeOutline />
                  ) : (
                    <IoIcons.IoEyeOffOutline />
                  )}
                </div>
              </div>
              <div className="z-10 -mt-2 text-right text-xs font-medium text-neutralDark">
                <Link
                  to="/forgotpassword"
                  className="hover:text-neutralDark/60"
                >
                  Forgot Password
                </Link>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="btn btn-info w-full rounded-2xl bg-primaryBlue font-normal capitalize text-white"
              >
                Login
              </button>
            </div>
            <div className="text-center text-sm">
              Don’t have an account?{" "}
              <a className="font-medium text-primaryBlue">Register here</a>
            </div>
          </form>
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
