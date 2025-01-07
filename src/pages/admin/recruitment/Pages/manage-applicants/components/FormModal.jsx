import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";

export default function FormModal(props) {
  const { title, submit, body, cancel, isOpen, maxWidth } = props ?? {};

  const submitFunction = () => submit.btnFunction();
  const cancelFunction = () => cancel.btnFunction();

  return (
    <Transition show={isOpen ?? false} as={Fragment}>
      <Dialog
        open={isOpen ?? false}
        onClose={() => {}}
        className="relative z-30"
      >
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-[1px]"
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
                className={`mx-auto w-full ${maxWidth} rounded-xl bg-white`}
              >
                <div className=" p-5">
                  <Dialog.Title className="flex flex-row items-center justify-between">
                    <div className="text-xl font-medium">{title}</div>
                    <button
                      onClick={cancelFunction}
                      className="btn btn-circle btn-ghost btn-sm text-primaryBlue focus:outline-none"
                    >
                      ✕
                    </button>
                  </Dialog.Title>
                  <div className="pt-5">{body}</div>
                </div>
                <div className="flex justify-end gap-5 border-t border-primaryBlue/20 p-3">
                  <button
                    onClick={cancelFunction}
                    className=" bg-white px-10 font-normal capitalize text-primaryBlue hover:bg-none"
                  >
                    {cancel.name}
                  </button>
                  <button
                    onClick={submitFunction}
                    className="btn btn-info rounded-xl bg-primaryBlue px-10 font-normal capitalize text-white"
                  >
                    {submit.name}
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
