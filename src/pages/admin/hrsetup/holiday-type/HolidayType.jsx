import { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import * as Io5icons from "react-icons/io5";
import { useLoaderData } from "react-router-dom";
import { shallow } from "zustand/shallow";

// Components
import { CustomInput } from "../../../../components/inputs/CustomInput";
import { alertModalStore } from "../../../../utils/zustand/AlertModalStore/alertModalStore";
import FormModal from "../../../../components/modal/FormModal";
import DropdownMenu from "../../../../components/menu/DropdownMenu";
import DataTable from "../../../../components/tables/datatable/DataTable";
import { CustomSelect } from "../../../../components/inputs/CustomSelect";
import { holidayStore } from "../../../../utils/zustand/AdminStore/HrSetup/holidayStore";
import moment from "moment";
import { DELETE, POST, PUT } from "../../../../services/api";
import { loadingStore } from "../../../../utils/zustand/LoadingStore/loadingStore";

export default function HolidayType() {
  const { accessor } = createColumnHelper();

  // Global State
  const { holiday, fetchAllHoliday } = holidayStore((state) => state, shallow);
  const { loadingHoc } = loadingStore((state) => state, shallow);
  const { openConfirmModal, openSuccessModal, openDeleteModal } =
    alertModalStore((state) => state, shallow);

  // Local State
  const [tableData, setTableData] = useState([]);
  const [cloneData, setCloneData] = useState([]);
  const [openForm, setOpenForm] = useState({});
  const [formValues, setFormValues] = useState({
    type: "select",
  });

  const [isEmpty, setIsEmpty] = useState(false);

  const [selectedTab, setSelectedTab] = useState("All");

  useEffect(() => {
    setTableData(holiday);
  }, [holiday]);

  // Clear Modal
  const clearModal = () => {
    setOpenForm({});
    setFormValues({});
    setIsEmpty(false);
    loadingHoc(false);
  };

  const handeChange = ({ target }) => {
    const { name, value } = target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Holiday Type Modal Form
  const holidayTypeForm = () => {
    const isAdd = openForm.action === "Add";

    const body = () => {
      const typeList = [
        {
          _id: 1,
          value: "regular-holiday",
          label: "Regular",
        },
        {
          _id: 2,
          value: "special-holiday",
          label: "Special Non-Working",
        },
      ];
      return (
        <div className="grid grid-cols-1 gap-2">
          <CustomInput
            label="Name"
            type="text"
            name="name"
            isRequired={true}
            isEmpty={isEmpty}
            value={formValues.name}
            onChange={handeChange}
          />
          <CustomSelect
            label="Type"
            placeholder="Select type"
            options={typeList}
            name="type"
            isRequired={true}
            isEmpty={isEmpty}
            value={formValues.type}
            onChange={handeChange}
          />
          <CustomInput
            label="Date"
            type="date"
            name="date"
            isRequired={true}
            isEmpty={isEmpty}
            value={formValues.date}
            onChange={handeChange}
          />
        </div>
      );
    };

    const addAPI = async () => {
      const { status } = await POST("/holidays", formValues);
      if (status === 201) {
        clearModal();
        openSuccessModal();
        return fetchAllHoliday();
      } else {
        loadingHoc(false);
      }
    };

    const updateAPI = async () => {
      loadingHoc(true);
      const { status } = await PUT(`/holidays/${formValues?._id}`, formValues);
      if (status === 201) {
        openSuccessModal({
          title: "Success!",
          message: "Your changes has been successfully saved.",
          closeNameBtn: "Ok",
        });
        clearModal();
        return fetchAllHoliday();
      } else {
        loadingHoc(false);
      }
    };

    const submitFunc = () => {
      if (isAdd) {
        loadingHoc(true);
        addAPI();
      } else {
        openConfirmModal({
          modalAction: () => updateAPI(),
        });
      }
    };

    const validateField = () => {
      if (!formValues.name || !formValues.date || formValues.type === "select")
        return setIsEmpty(true);
      else return submitFunc();
    };

    const modalProps = {
      title: isAdd ? "Add New Holiday" : "Update Holiday",
      body: body(),
      submit: {
        name: isAdd ? "Add" : "Update",
        btnFunction: () => validateField(),
      },
      cancel: {
        name: "Cancel",
        btnFunction: () => clearModal(),
      },
      isOpen: openForm.isOpen,
      maxWidth: "max-w-lg",
    };

    return <FormModal {...modalProps} />;
  };

  // Holiday Type Table
  const holidayTable = () => {
    // Table Action Option
    const actionList = [
      {
        _id: 1,
        label: "Update",
        textColor: "text-primaryBlue",
        icon: <Io5icons.IoCreateOutline />,
        itemFunction: ({ original }) => {
          setOpenForm({
            action: "Update",
            isOpen: true,
          });
          setFormValues({
            ...original,
            date: moment(original?.date)?.format("YYYY-MM-DD") ?? "",
          });
        },
      },
      {
        _id: 2,
        label: "Delete",
        textColor: "text-stateRed",
        icon: <Io5icons.IoTrashBinOutline />,
        itemFunction: ({ original }) => {
          openDeleteModal({
            modalAction: () => deleteFunc(original),
          });
        },
      },
    ];

    const deleteFunc = async ({ _id }) => {
      loadingHoc(true);
      const { status } = await DELETE(`/holidays/${_id}`);
      if (status === 201) {
        openSuccessModal({
          title: "Success!",
          message: "Deleted Successfully!",
          closeNameBtn: "Ok",
        });
        fetchAllHoliday();
        return loadingHoc(false);
      } else return loadingHoc(false);
    };

    // Table Column
    const columns = [
      accessor("date", {
        id: "date",
        header: "Date",
        cell: (info) => (
          <div className="">{moment(info?.getValue()).format("LL")}</div>
        ),
      }),
      accessor("name", {
        id: "name",
        header: "Name",
        cell: (info) => info.getValue(),
      }),

      accessor("type", {
        id: "type",
        header: "Type",
        cell: (info) => (
          <div>
            {info.getValue() === "regular-holiday"
              ? "Regular"
              : "Special Non-Working"}
          </div>
        ),
      }),
      accessor("_id", {
        id: "_id",
        header: "Action",
        style: "w-20 ",
        cell: ({ row }) => (
          <div className="text-center">
            {" "}
            <DropdownMenu actionList={actionList} row={row} />
          </div>
        ),
      }),
    ];

    // Filter Tab
    const filterDataByTabAction = (tabName) => {
      if (tabName === "All") {
        setCloneData(holiday);
        return setTableData(holiday);
      }
      const filteredData = holiday?.filter((item) => item.type === tabName);
      setCloneData(filteredData);
      return setTableData(filteredData);
    };

    // Tab Selection
    const tabSelection = [
      {
        name: "All",
        isSelected: selectedTab === "All",
        selectTabAction: () => {
          filterDataByTabAction("All");
          return setSelectedTab("All");
        },
      },
      {
        name: "Regular",
        isSelected: selectedTab === "Regular",
        selectTabAction: () => {
          filterDataByTabAction("regular-holiday");
          return setSelectedTab("Regular");
        },
      },
      {
        name: "Special Non-Working",
        isSelected: selectedTab === "Special Non-Working",
        selectTabAction: () => {
          filterDataByTabAction("special-holiday");
          return setSelectedTab("Special Non-Working");
        },
      },
    ];

    const searchData = (value) => {
      const patternData = (item) =>
        pattern.test(moment(item?.date).format("LL")) ||
        pattern.test(item?.name) ||
        pattern.test(item?.type);

      const pattern = new RegExp(value, "i"); // "i" flag for case-insensitive matching
      const fltdData = cloneData.filter((item) => patternData(item));
      setTableData(fltdData);
    };

    // Table Config
    const tableProps = {
      columns,
      rows: tableData,
      title: "Holidays",
      subTitle: "List of holidays",
      btnName: "New Holiday",
      openFormAction: () => {
        setOpenForm({
          action: "Add",
          isOpen: true,
        });
      },
      tableTab: tabSelection,
      searchOption: true,
      searchData,
    };

    return tableProps && <DataTable {...tableProps} />;
  };

  return (
    <div className="h-fit w-full rounded-xl bg-white p-5 drop-shadow-xl">
      {holidayTypeForm()}
      {holidayTable()}
    </div>
  );
}
