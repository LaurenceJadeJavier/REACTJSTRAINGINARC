import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

import * as Io5icons from "react-icons/io5";

export const CustomSelectCutoff = ({ selectData, setCuttOffData }) => {
  const [selected, setSelected] = useState(selectData[0]);

  return (
    <div className="w-52">
      <Listbox
        value={selected}
        onChange={(target) => {
          setCuttOffData(target);
          setSelected(target);
        }}
      >
        <div className="relative mt-1">
          <Listbox.Button className="relative flex w-full cursor-default flex-row items-center justify-between rounded-2xl border border-primaryBlue bg-transparent p-2 text-sm font-normal">
            <span className="block truncate">{selected.title}</span>
            <span className="pointer-events-none">
              <Io5icons.IoCaretDownOutline
                className="h-5 w-5 text-primaryBlue"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {selectData.map((item) => (
                <Listbox.Option
                  key={item?.title}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active
                        ? "bg-primaryBlue/30 text-primaryBlue"
                        : "text-neutralDark"
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item?.title}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primaryBlue">
                          <Io5icons.IoCheckmarkOutline
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};
