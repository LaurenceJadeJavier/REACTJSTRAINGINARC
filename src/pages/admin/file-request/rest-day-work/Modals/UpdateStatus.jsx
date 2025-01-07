import React, { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";

// Components
import CustomTextArea from "../../../../../components/inputs/CustomTextArea";
import FormModal from "../../../../../components/modal/FormModal";
import { alertModalStore } from "../../../../../utils/zustand/AlertModalStore/alertModalStore";
import { CustomSelect } from "../../../../../components/inputs/CustomSelect";
import { PUT } from "../../../../../services/api";
import { loadingStore } from "../../../../../utils/zustand/LoadingStore/loadingStore";
import { applicationStore } from "../../../../../utils/zustand/AdminStore/ApplicationStore/applicationStore";

export default function UpdateStatus(props) {
  const { openModal, setOpenModal, applicationContainer, setSelectedTab } =
    props || {};

  // // Form Object
  const formObject = {
    status: applicationContainer?.status,
    remarks: applicationContainer?.remarks,
  };

  // Global State
  const { openConfirmModal, openSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
  );
  // Global State
  const { loadingHoc } = loadingStore((state) => state, shallow);
  const { fetchApplicationData } = applicationStore((state) => state, shallow);

  // Local State
  const [formValues, setFormValues] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    setFormValues(formObject);
  }, [applicationContainer]);

  // Update Status Action (Sevice)
  const updateStatusAction = async () => {
    setIsEmpty(false);

    const { status } = formValues || {};
    const { _id } = applicationContainer || {};
    if (!status) return setIsEmpty(true);
    loadingHoc(true);

    const { status: serviceStatus } = await PUT(
      "/applications/status/" + _id,
      formValues,
    );

    if (serviceStatus === 201) {
      setFormValues({});
      openSuccessModal({
        title: "Success!",
        message: "Your changes has been successfully saved.",
        closeNameBtn: "Ok",
      });
      setOpenModal("");
      setSelectedTab("All");
      fetchApplicationData();
    }

    return loadingHoc(false);
  };

  // Form Application Body
  const renderUpdateStatus = () => {
    const handleOnChange = (e) => {
      const { name, value } = e.target;

      return setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const statusOptions = [
      {
        label: "Pending",
        value: "pending",
      },
      {
        label: "Approved",
        value: "approved",
      },
      {
        label: "Declined",
        value: "declined",
      },
      {
        label: "Cancelled",
        value: "cancelled",
      },
    ];

    return (
      <div className="grid grid-cols-1 gap-3">
        <CustomSelect
          isRequired
          name="status"
          onChange={handleOnChange}
          value={formValues.status}
          label="Status"
          placeholder={"Select Status"}
          options={statusOptions}
          isEmpty={isEmpty}
        />
        <CustomTextArea
          label="Remarks"
          name="remarks"
          value={formValues.remarks}
          onChange={handleOnChange}
        />
      </div>
    );
  };

  // Table Config
  const modalProps = {
    title: "Update Status",
    body: renderUpdateStatus(),
    submit: {
      name: "Update",
      btnFunction: () =>
        openConfirmModal({
          title: "Are you sure?",
          message: "Are you sure you want to update this?",
          closeNameBtn: "Cancel",
          confirmNameBtn: "Yes, Update",
          modalAction: () => updateStatusAction(),
        }),
    },
    cancel: {
      name: "Cancel",
      btnFunction: () => setOpenModal(""),
    },
    isOpen: openModal === "updatestatus",
    maxWidth: "max-w-md",
  };

  return <FormModal {...modalProps} />;
}
