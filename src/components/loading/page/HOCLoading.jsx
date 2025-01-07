import React from "react";
import Lottie from "lottie-react";
import LoadingAnimation from "../../../assets/lotttie/loading_animation.json";

export default function HOCLoading() {
  return (
    <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center overflow-hidden bg-lightBlue bg-cover ">
      <div className="flex flex-row items-center justify-center">
        <Lottie animationData={LoadingAnimation} loop={true} />
      </div>
    </div>
  );
}
