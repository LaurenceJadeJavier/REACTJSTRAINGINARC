import { createWithEqualityFn } from "zustand/traditional";

const alertModalObject = {
  confirmModal: {
    isOpen: false,
    modalAction: () => {},
    content: () => {},
  },
  discardModal: {
    isOpen: false,
    details: {},
    isChange: false,
    modalAction: () => {},
    content: () => {},
  },
  resetModal: {
    isOpen: false,
    modalAction: () => {},
  },
  deleteModal: {
    isOpen: false,
    modalAction: () => {},
  },
  successModal: {
    isOpen: false,
  },
  failedModal: {
    isOpen: false,
  },
};

const fetchConfirmModalDetails = async (set, data) => {
  const { title, message, modalAction, confirmNameBtn, closeNameBtn, content } =
    data ?? {};
  return set({
    confirmModal: {
      title: title || "Are you sure?",
      message: message || "Are you sure you want to update this?",
      confirmNameBtn: confirmNameBtn || "Yes, Update",
      closeNameBtn: closeNameBtn || "Cancel",
      isOpen: true,
      modalAction: modalAction || (() => {}),
      content: content || (() => {}),
    },
  });
};

const fetchDiscardModal = async (set, data) => {
  const {
    title,
    message,
    modalAction,
    confirmNameBtn,
    closeNameBtn,
    content,
    details,
    isChange,
    isOpen,
  } = data ?? {};
  
  return set({
    discardModal: {
      title: title || "Confirm Discard Changes",
      message:
        message ||
        "If you leave, any changes you have made will not be saved. Do you want to proceed?",
      confirmNameBtn: confirmNameBtn || "Yes, Discard Changes",
      closeNameBtn: closeNameBtn || "Cancel",
      isOpen: isOpen,
      details: details,
      isChange: isChange,
      modalAction: modalAction || (() => {}),
      content: content || (() => {}),
    },
  });
};

const fetchResetPasswordModal = async (set, data) => {
  const { title, message, modalAction, confirmNameBtn, closeNameBtn } =
    data ?? {};
  return set({
    resetModal: {
      title: title || "Reset Password",
      message:
        message ||
        "Once you proceed, a link to reset the password will be sent to the associated email of this admin account.",
      confirmNameBtn: confirmNameBtn || "Reset Password",
      closeNameBtn: closeNameBtn || "Cancel",
      isOpen: true,
      modalAction: modalAction || (() => {}),
    },
  });
};

const fetchDeleteModalDetails = async (set, data) => {
  const {
    title,
    message,
    modalAction,
    confirmNameBtn,
    closeNameBtn,
    isDelete,
  } = data ?? {};
  return set({
    deleteModal: {
      title: title || "Confirm Delete",
      isDelete: isDelete || false,
      message:
        message ||
        "Are you sure you want to delete this? This action cannot be undone.",
      confirmNameBtn: confirmNameBtn || "Yes, Delete",
      closeNameBtn: closeNameBtn || "Cancel",
      isOpen: true,
      modalAction: modalAction || (() => {}),
    },
  });
};

const fetchSuccessModalDetails = async (set, data) => {
  const { title, message, closeNameBtn } = data ?? {};
  return set({
    successModal: {
      title: title || "Success!",
      message: message || "Added Successfully!",
      closeNameBtn: closeNameBtn || "Ok",
      isOpen: true,
    },
  });
};

const fetchFailedModalDetails = async (set, data) => {
  const { title, message, closeNameBtn } = data;
  return set({
    failedModal: {
      title: title || "Failed",
      message: message || "Invalid",
      closeNameBtn: closeNameBtn || "Back",
      isOpen: true,
    },
  });
};

const alertModalStoreObject = (set) => ({
  ...alertModalObject,
  closeConfirmModal: (data) =>
    set({
      confirmModal: {
        ...data,
        isOpen: false,
        modalAction: () => {},
        content: () => {},
      },
    }),
  closeDiscardModal: (data) =>
    set({
      discardModal: {
        ...data,
        isOpen: false,
        isChange: false,
        details: {},
        modalAction: () => {},
        content: () => {},
      },
    }),
  closeResetModal: (data) =>
    set({
      resetModal: {
        ...data,
        isOpen: false,
        modalAction: () => {},
      },
    }),
  closeDeleteModal: (data) =>
    set({
      deleteModal: {
        ...data,
        isOpen: false,
        modalAction: () => {},
      },
    }),
  closeSuccessModal: (data) =>
    set({
      successModal: {
        ...data,
        isOpen: false,
      },
    }),
  closeFailedModal: () =>
    set({
      failedModal: {
        isOpen: false,
      },
    }),
  openConfirmModal: (data) => fetchConfirmModalDetails(set, data),
  openDiscardModal: (data) => fetchDiscardModal(set, data),
  openResetModal: (data) => fetchResetPasswordModal(set, data),
  openDeleteModal: (data) => fetchDeleteModalDetails(set, data),
  openSuccessModal: (data) => fetchSuccessModalDetails(set, data),
  openFailedModal: (data) => fetchFailedModalDetails(set, data),
});

export const alertModalStore = createWithEqualityFn(alertModalStoreObject);
