import React, { useState } from "react";
import * as Io5icons from "react-icons/io5";

export default function Accordion({ icon, title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`accordion-item mt-4 rounded-xl border ${
        isOpen ? "border-lightBlue" : "border-primaryBlue"
      } p-4`}
    >
      <div
        className="flex flex-row items-center justify-between hover:cursor-pointer"
        onClick={toggleAccordion}
      >
        <h2 className="accordion-header flex flex-row">
          <span className={`mr-1 rounded bg-lightBlue p-1`}>{icon}</span>
          <button className="accordion-button" type="button">
            {title}
          </button>
        </h2>
        {!isOpen ? (
          <Io5icons.IoChevronDownOutline className=" text-xl text-primaryBlue" />
        ) : (
          <Io5icons.IoChevronUpOutline className=" text-xl text-primaryBlue" />
        )}
      </div>
      <div
        className={`accordion-content ${
          !isOpen ? "max-h-0 opacity-0 " : "max-h-[1000px] opacity-100"
        } scrollbar-hidden  overflow-y-scroll transition-all duration-300`}
      >
        {children}
      </div>
    </div>
  );
}
