import React from "react";
import { useNavigate } from "react-router-dom";
import * as Io5icons from "react-icons/io5";
export default function BackButton({ label, navigateTo, func }) {
  const navigate = useNavigate();
  return (
    <div>
      <button
        className="flex items-center gap-1 text-primaryBlue"
        onClick={() => (!navigateTo ? func() : navigate(navigateTo ?? -1))}
      >
        <Io5icons.IoArrowBackOutline />{" "}
        <span className="text-sm">{label ?? "Back"}</span>
      </button>
    </div>
  );
}
