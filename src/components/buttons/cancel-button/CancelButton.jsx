// !This component designed for navgated chile Forms
// !See other BTN components for specific usage

import React from "react";
import { useNavigate } from "react-router-dom";
import * as Io5icons from "react-icons/io5";
export default function CancelButton({ label, navigateTo, func }) {
  const navigate = useNavigate();
  return (
    <div className="my-4">
      <button
        className="flex items-center gap-1 text-stateRed"
        onClick={() =>
          func
            ? func()
            : navigateTo
            ? navigate(navigateTo)
            : navigate(navigateTo ?? -1)
        }
      >
        <Io5icons.IoCloseOutline />
        <span className="ml-1 text-sm">{label ?? "Cancel"}</span>
      </button>
    </div>
  );
}
