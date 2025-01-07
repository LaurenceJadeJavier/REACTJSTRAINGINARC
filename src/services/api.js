import Swal from "sweetalert2";
import backend from "./backend";
import axios from "axios";

export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: false,
});

export const errorAlert = (message) => {
  return Toast.fire({
    icon: "error",
    title: message,
    timer: 2000,
  });
};

const auth = (props) => {
  const { token } = props || {};
  const ifTokenExist = token ?? localStorage.getItem("token");

  return {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${ifTokenExist}`,
    },
  };
};

export const POST = async (routeName, params) => {
  return backend
    .post(routeName, params, auth())
    .then((reponse) => {
      return reponse;
    })
    .catch((err) => {
      const message = !err.response
        ? "Server Maintenance!"
        : err.response.data.message;
      errorAlert(message);
      const response = {
        ...err?.response,
      };
      return response;
    });
};

export const PUT = async (routeName, params) => {
  return backend
    .put(routeName, params, auth())
    .then((reponse) => {
      return reponse;
    })
    .catch((err) => {
      const message = !err.response
        ? "Server Maintenance!"
        : err.response.data.message;
      errorAlert(message);
      const response = {
        ...err?.response,
      };
      return response;
    });
};

export const GET = async (routeName) => {
  return backend
    .get(routeName, auth())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      const message = !err.response
        ? "Server Maintenance!"
        : err.response.data.message;
      errorAlert(message);
      const response = {
        ...err?.response,
      };
      return response;
    });
};

export const GETALL = async (routeName) => {
  return axios
    .all(routeName.map((apiRoute) => backend.get(apiRoute, auth())))
    .then((response) => {
      return response;
    })
    .catch((err) => {
      const message = !err.response
        ? "Server Maintenance!"
        : err.response.data.message;
      // errorAlert(message);
      const response = {
        ...err?.response,
      };
      return response;
    });
};

export const DELETE = async (routeName) => {
  return backend
    .delete(routeName, auth())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      const message = !err.response
        ? "Server Maintenance!"
        : err.response.data.message;
      errorAlert(message);
      const response = {
        ...err?.response,
      };
      return response;
    });
};

export const AUTH = async (routeName, token) => {
  return backend
    .get(routeName, auth({ token }))
    .then((response) => {
      return response;
    })
    .catch((err) => {
      const message = !err.response
        ? "Server Maintenance!"
        : err.response.data.message;
      errorAlert(message);
      const response = {
        ...err?.response,
      };
      return response;
    });
};
