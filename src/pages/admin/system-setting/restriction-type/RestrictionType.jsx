import { createColumnHelper } from "@tanstack/table-core";
import React, { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";

import * as Io5icons from "react-icons/io5";

import DataTable from "../../../../components/tables/datatable/DataTable";
import DropdownMenu from "../../../../components/menu/DropdownMenu";
import { restrictionStore } from "../../../../utils/zustand/AdminStore/Restriction/restrictionStore";
import FormModal from "../../../../components/modal/FormModal";
import { CustomInput } from "../../../../components/inputs/CustomInput";
import CustomTextArea from "../../../../components/inputs/CustomTextArea";
import { DELETE, POST, PUT } from "../../../../services/api";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";

export const DropdownUI = (
  original,
  setFormValues,
  setOpenForm,
  selectedTab,
  deleteRestrictAPI,
) => {
  const { openDeleteModal } = alertModalStore((state) => state, shallow);

  const IPRestricParams = {
    description: original?.description,
    ip: original?.ip,
    id: original?._id,
  };

  const LocationParams = {
    description: original?.description,
    ip: original?.ip,
    lat: original?.lat,
    lng: original?.lng,
    radius: original?.radius,
    id: original?._id,
  };

  const params = selectedTab !== "Location" ? IPRestricParams : LocationParams;

  // Table Action Option
  const actionList = [
    {
      _id: 1,
      label: "Update",
      textColor: "text-primaryBlue",
      icon: <Io5icons.IoCreateOutline />,
      itemFunction: () => {
        setOpenForm("update");
        setFormValues(params);
      },
    },
    {
      _id: 2,
      label: "Delete",
      textColor: "text-stateRed",
      icon: <Io5icons.IoTrashBinOutline />,
      itemFunction: () => {
        openDeleteModal({
          modalAction: () => deleteRestrictAPI(original?._id),
        });
      },
    },
  ];

  return (
    <div className="text-center">
      {" "}
      <DropdownMenu actionList={actionList} />
    </div>
  );
};

export default function RestrictionType() {
  const { accessor } = createColumnHelper();

  const { restrictionData, fetchAllRestriction } = restrictionStore(
    (state) => state,
    shallow,
  );
  const { openConfirmModal, openSuccessModal } = alertModalStore(
    (state) => state,
    shallow,
  );

  const [selectedTab, setSelectedTab] = useState("IP Restriction");
  const [openForm, setOpenForm] = useState("");
  const [formValues, setFormValues] = useState({});
  const [tableData, setTableData] = useState([]);
  const [cloneData, setCloneData] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    filterType();
  }, [restrictionData, selectedTab]);

  const filterType = () => {
    let filterRestricRow = [];
    let filterLocationRow = [];

    return restrictionData.filter((item) => {
      if (item?.lat !== null) {
        return filterLocationRow.push(item);
      } else {
        filterRestricRow.push(item);
      }
      const rowData =
        selectedTab === "IP Restriction" ? filterRestricRow : filterLocationRow;
      setCloneData(rowData);
      setTableData(rowData);
    });
  };

  // create Restriction
  const createRestrictAPI = async () => {
    await POST("/restrictions", formValues).then(({ status }) => {
      if (status === 201) {
        openSuccessModal({
          title: "Success!",
          message: "Added Successfully!",
          closeNameBtn: "Ok",
        });
        clearModal();
        fetchAllRestriction();
      }
    });
  };

  // update Restriction
  const updateRestrictAPI = async () => {
    await PUT(`/restrictions/${formValues?.id}`, formValues).then(
      ({ status }) => {
        if (status === 201) {
          openSuccessModal({
            title: "Success!",
            message: "Your changes has been successfully saved.",
            closeNameBtn: "Ok",
          });
          clearModal();
          fetchAllRestriction();
        }
      },
    );
  };

  // delete Restriction
  const deleteRestrictAPI = async (id) => {
    await DELETE(`/restrictions/${id}`).then(({ status }) => {
      if (status === 201) {
        openSuccessModal({
          title: "Success!",
          message: "Delete Successfully!",
          closeNameBtn: "Ok",
        });
        fetchAllRestriction();
      }
    });
  };

  const clearModal = () => {
    setOpenForm("");
    setIsEmpty(false);
    setFormValues({});
  };

  const formModalUI = () => {
    const body = () => {
      return selectedTab !== "Location" ? (
        <div className="grid grid-cols-1 gap-3">
          <CustomInput
            label="IP"
            name="ip"
            type="text"
            isRequired
            isEmpty={isEmpty}
            value={formValues?.ip}
            onChange={(e) =>
              setFormValues({ ...formValues, ip: e.target.value })
            }
          />
          <CustomTextArea
            label="Description"
            name="description"
            isRequired
            isEmpty={isEmpty}
            value={formValues?.description}
            onChange={(e) =>
              setFormValues({ ...formValues, description: e.target.value })
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          <div className="mb-2">
            <CustomTextArea
              label="Description"
              name="description"
              isRequired
              isEmpty={isEmpty}
              value={formValues?.description}
              onChange={(e) =>
                setFormValues({ ...formValues, description: e.target.value })
              }
            />
          </div>
          <CustomInput
            label="Latitude"
            name="latitude"
            type="text"
            isRequired
            isEmpty={isEmpty}
            value={formValues?.lat}
            onChange={(e) =>
              setFormValues({ ...formValues, lat: e.target.value })
            }
          />
          <CustomInput
            label="Longitude"
            name="longitude"
            type="text"
            isRequired
            isEmpty={isEmpty}
            value={formValues?.lng}
            onChange={(e) =>
              setFormValues({ ...formValues, lng: e.target.value })
            }
          />
          <CustomInput
            label="Radius"
            name="radius"
            type="text"
            isRequired
            isEmpty={isEmpty}
            value={formValues?.radius}
            onChange={(e) =>
              setFormValues({ ...formValues, radius: e.target.value })
            }
          />
        </div>
      );
    };

    const formTitle = openForm === "add" ? "Add New" : "Update";

    const validateFields = () => {
      if (selectedTab !== "Location") {
        const { ip, description } = formValues || {};
        if (!ip || !description) return setIsEmpty(true);
        else return submitFunc();
      } else {
        const { lat, lng, radius, description } = formValues || {};
        if (!lat || !lng || !radius || !description) return setIsEmpty(true);
        else return submitFunc();
      }
    };

    const submitFunc = () => {
      if (openForm === "add") {
        createRestrictAPI();
      } else {
        openConfirmModal({
          title: "Are you sure?",
          message: "Are you sure you want to update this?",
          closeNameBtn: "Cancel",
          confirmNameBtn: "Yes, Update",
          modalAction: () => updateRestrictAPI(),
        });
      }
    };

    const modalProps = {
      title: `${formTitle} ${selectedTab}`,
      body: body(),
      submit: {
        name: openForm,
        btnFunction: () => validateFields(),
      },
      cancel: {
        name: "Cancel",
        btnFunction: () => clearModal(),
      },
      isOpen: openForm === "add" || openForm === "update",
      maxWidth: "max-w-lg",
    };

    return <FormModal {...modalProps} />;
  };

  const holidayTable = () => {
    const IPRestrictionColumnData = selectedTab === "IP Restriction" && [
      accessor("ip", {
        id: "ip",
        header: "IP",
        style: "w-96",
        cell: (info) => info.getValue(),
      }),
      accessor("description", {
        id: "description",
        header: "Description",
        cell: (info) => info.getValue(),
      }),
    ];

    const LocationColumnData = selectedTab === "Location" && [
      accessor("description", {
        id: "description",
        header: "Description",
        style: "w-96",
        cell: (info) => info.getValue(),
      }),
      accessor("coordinates", {
        id: "coordinates",
        header: "Coordinates",
        cell: ({ row: { original } }) => (
          <div>
            Latitude {original?.lat}, Longitude {original?.lng}
          </div>
        ),
      }),
      accessor("radius", {
        id: "radius",
        header: "Radius",
        cell: (info) => info.getValue(),
      }),
    ];

    const columnData = IPRestrictionColumnData || LocationColumnData;

    // Table Column
    const columns = [
      ...columnData,
      accessor("_id", {
        id: "_id",
        header: "Action",
        style: "w-20",
        cell: ({ row: { original } }) =>
          DropdownUI(
            original,
            setFormValues,
            setOpenForm,
            selectedTab,
            deleteRestrictAPI,
          ),
      }),
    ];

    // Tab Selection
    const tabSelection = [
      {
        name: "IP Restriction",
        isSelected: selectedTab === "IP Restriction",
        selectTabAction: () => setSelectedTab("IP Restriction"),
      },
      {
        name: "Location",
        isSelected: selectedTab === "Location",
        selectTabAction: () => setSelectedTab("Location"),
      },
    ];

    const searchData = (value) => {
      const patternData = (item) =>
        pattern.test(item.ip) ||
        pattern.test(item?.lat) ||
        pattern.test(item?.lng) ||
        pattern.test(item?.radius) ||
        pattern.test(item?.description);

      const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
      const fltdData = cloneData.filter((item) => patternData(item));
      setTableData(fltdData);
    };

    // Table Config
    const tableProps = {
      columns,
      rows: tableData,
      title: "Restriction Type",
      subTitle: "Set limitations on location access",
      btnName: `New ${selectedTab}`,
      tableTab: tabSelection,
      openFormAction: () => setOpenForm("add"),
      searchOption: true,
      searchData,
    };

    return tableProps && <DataTable {...tableProps} />;
  };

  return (
    <div className="rounded-2xl bg-white px-4 py-6">
      {formModalUI()}
      {holidayTable()}
    </div>
  );
}
