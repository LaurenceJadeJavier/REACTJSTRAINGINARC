import React from "react";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  let error = useRouteError();

  return <div>{error}</div>;
}
