import React, { useState } from "react";
import { CustomSelect } from "../inputs/CustomSelect";
import { filterStore } from "../../utils/zustand/FilterStore/filterStore";
import { shallow } from "zustand/shallow";
import FormModal from "../modal/FormModal";

export default function TableFilter(props) {
  const { filterSelection, openFilter, setOpenFilter } = props || {};

  // Global State
  const { handleFilterSearch, clearFilterSearch } = filterStore(
    (state) => state,
    shallow,
  );

  const filterInputSelection = () => {
    const filterCustomerSelectionDisplay = (item) => {
      const { filterTitle, filterData, columnHeaderName } = item ?? {};

      return (
        <CustomSelect
          placeholder={"Please Select"}
          onChange={(e) => handleFilterSearch(e, filterTitle)}
          label={(columnHeaderName ?? filterTitle).toUpperCase()}
          options={filterData}
        />
      );
    };

    return (
      filterSelection.length > 0 &&
      filterSelection.map(filterCustomerSelectionDisplay)
    );
  };

  const body = () => {
    return <>{filterInputSelection()}</>;
  };

  const modalProps = {
    title: "Filter",
    body: body(),
    submit: {
      name: "Apply",
      btnFunction: () => {
        setOpenFilter(!openFilter);
      },
    },
    cancel: {
      name: "Reset",
      btnFunction: () => {
        clearFilterSearch();
        setOpenFilter(!openFilter);
      },
    },
    isOpen: openFilter,
    maxWidth: "max-w-lg",
  };

  return <FormModal {...modalProps} />;
}
