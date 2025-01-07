import React from "react";
import CancelButton from "../../../../../components/buttons/cancel-button/CancelButton";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomInput } from "../../../../../components/inputs/CustomInput";
import { alertModalStore } from "../../../../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";

export default function Form() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const isAdd = state.formType === "add";
  const { openSuccessModal, openConfirmModal } = alertModalStore(
    (state) => state,
    shallow,
  );
  const askConfirmation = () => {
    if (isAdd) {
      openSuccessModal({
        title: "Success!",
        closeNameBtn: "Ok",
      });
      navigate(-1);
    } else {
      openConfirmModal({
        modalAction: () => {
          openSuccessModal({
            title: "Success!",
            message: "Your changes has been successfully saved.",
            closeNameBtn: "Ok",
          });
          navigate(-1);
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <CancelButton />
      <div className="flex h-full w-full flex-col gap-5 rounded-xl bg-white p-8 drop-shadow-xl lg:h-[90vh]">
        <div className="flex flex-col">
          <div className="text-xl font-semibold text-neutralDark">
            {isAdd ? "Add New Role" : "Update Role"}
          </div>
        </div>
        <div className="max-w-sm">
          <CustomInput label="Name" type="text" />
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-semibold">List of Permissions</div>
          <div className="text-xs">Select permissions for this Role</div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill({
              _id: 1,
              title: "Lorem ipsum",
              list: [
                "Sample Permission",
                "Sample Permission",
                "Sample Permission",
              ],
            })
            .map((data) => {
              const { _id, title, list } = data ?? {};
              return (
                <div
                  className="border-neutralLight flex flex-col gap-2 rounded-xl border p-5"
                  key={_id}
                >
                  <div className="font-medium">{title}</div>
                  <div className="ml-2 flex flex-col gap-2">
                    {list.map((res, index) => (
                      <div className="form-control" key={index}>
                        <label className=" flex cursor-pointer gap-2">
                          <input
                            type="checkbox"
                            className="checkbox-success checkbox h-5 w-5"
                          />
                          <span className="label-text">{res}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
        <div className="flex justify-end">
          <button
            className="btn btn-info w-full bg-primaryBlue px-5 capitalize text-white md:w-32"
            onClick={() => askConfirmation()}
          >
            {isAdd ? "Add" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
