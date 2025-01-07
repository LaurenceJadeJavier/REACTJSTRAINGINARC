import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import * as Io5icons from "react-icons/io5";

export default function DropdownMenu({ actionList, row }) {
  return (
    <Menu as="div" className="relative inline-block ">
      <div>
        <Menu.Button className=" inline-flex w-full flex-row items-center rounded-md bg-opacity-20 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ">
          <Io5icons.IoEllipsisVertical className="text-xl text-primaryBlue" />
        </Menu.Button>
      </div>
      <Transition appear>
        {/* <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black/30  backdrop-blur-[1px]"
            aria-hidden="true"
          />
        </Transition.Child> */}

        <Menu.Items className="absolute  right-0 z-30 w-48 origin-top-right divide-y divide-gray-100  rounded-lg bg-white shadow-2xl focus:outline-none">
          <div className="flex flex-col py-2">
            {actionList?.map((item, index) => {
              const { label, icon, itemFunction, _id, textColor } = item;
              return (
                <Menu.Item
                  onClick={() => itemFunction(row)}
                  key={_id}
                  className="py-2"
                >
                  {() => (
                    <div
                      className={`${textColor} flex transform cursor-pointer flex-row items-center gap-2 rounded-lg px-4 py-1.5 hover:bg-lightBlue  `}
                    >
                      <span className="text-xl">{icon}</span>
                      <span>{label}</span>
                    </div>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
