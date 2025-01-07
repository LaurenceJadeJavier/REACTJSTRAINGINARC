import React, { Fragment } from "react";
import { alertModalStore } from "../../utils/zustand/AlertModalStore/alertModalStore";
import { shallow } from "zustand/shallow";
import { Dialog, Transition } from "@headlessui/react";
import * as Io5icons from "react-icons/io5";

export default function AlertSuccessModal() {
  const { successModal, closeSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
  );

  const { isOpen, title, message, closeNameBtn } = successModal ?? {};

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog open={isOpen} onClose={() => {}} className="relative z-40">
        <div
          className="fixed inset-0 bg-black/30  backdrop-blur-[1px]"
          aria-hidden="true"
        />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`mx-auto w-full max-w-md rounded-xl bg-white`}
              >
                <div className=" p-5">
                  <Dialog.Title className="flex flex-row items-center gap-1">
                    <Io5icons.IoCheckmarkCircle className="text-3xl text-stateGreen" />
                    <div className="text-xl font-medium text-stateGreen">
                      {title}
                    </div>
                  </Dialog.Title>
                  <div className="pt-5">{message}</div>
                </div>
                <div className="flex justify-end gap-5 rounded-b-xl bg-lightGreen p-3">
                  <button
                    onClick={closeSuccessModal}
                    className="btn btn-success rounded-xl bg-stateGreen px-10 font-normal capitalize text-white"
                  >
                    {closeNameBtn}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
