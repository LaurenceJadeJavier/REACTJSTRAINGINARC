import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Stepper(props) {
  const { steps } = props || {};
  const location = useLocation();
  const navigate = useNavigate();

  const getLocations = location.pathname.split("/").pop(); // get the active steps location
  const doneSteps = steps.findIndex((step) => step.navigateTo === getLocations); //  fine those done steps

  return (
    <div className="p-0.5 pb-4">
      {steps.map((step, index) => {
        const { stepNumber, heading, subHeading, navigateTo } = step || {};
        return (
          <div className="flex items-start" key={stepNumber}>
            <div className="flex flex-col">
              <div
                // onClick={() => navigate(navigateTo)}
                className={`mr-4 flex h-8 w-8   items-center justify-center rounded-full ${
                  doneSteps === index
                    ? "bg-stateGreen text-highlight"
                    : "bg-highlight text-stateGreen"
                }  border p-4 ${
                  doneSteps > index ? " border-stateGreen" : "border-highlight"
                }`}
              >
                {stepNumber}
              </div>
              {index + 1 !== steps.length && (
                <div className="px-4">
                  <div
                    className={`h-16 border-l-2 ${
                      doneSteps <= index
                        ? "border-highlight"
                        : "border-stateGreen"
                    }`}
                  ></div>
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-base text-stateGreen">{heading}</span>
              <span className="text-sm">{subHeading}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
