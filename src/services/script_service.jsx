import { Disclosure } from "@headlessui/react";
import moment from "moment";
import * as Io5icons from "react-icons/io5";

// Filter Logic (must have a array with column id to apply)
export const filterDataAction = (filterSelectionList, rows) => {
  // Filter Match Array Given (Logical Operated)
  if (!filterSelectionList) return;
  const filterTask = filterSelectionList.map((filterTitle) => {
    const selectionInfoTypeChecker = typeof filterTitle === "object";
    let selectionOption = [];

    rows.map((rowItem, rowIndex) => {
      const { object, element } = filterTitle || {};
      const valueSetter = selectionInfoTypeChecker
        ? rowItem[object][element]
        : rowItem[filterTitle];

      const checkIfStored = (item) => item.value === valueSetter;
      const ifStored = selectionOption.findIndex(checkIfStored);
      const sortSelectionData = {
        value: valueSetter,
        label: valueSetter,
        _id: rowIndex,
      };

      // Set If Data Is Object
      if (selectionInfoTypeChecker && ifStored === -1)
        return selectionOption.push(sortSelectionData);

      // Set If Data Is String
      if (ifStored === -1 && valueSetter)
        return selectionOption.push(sortSelectionData);
    });

    const filterTitleCondition = selectionInfoTypeChecker
      ? filterTitle?.columnId
      : filterTitle;

    return {
      filterData: selectionOption,
      filterTitle: filterTitleCondition,
      ...(selectionInfoTypeChecker && {
        columnHeaderName: filterTitle?.headerName,
      }),
    };
  });

  return filterTask;
};

// Custom Table (For Details Viewing Purpose)
export const CustomTable = (props) => {
  const { tableColumn, tableRow } = props || {};
  // Table Column
  const customTableColumn = () => {
    const columnDisplay = (columnItem) => {
      const { title, style } = columnItem || {};
      return (
        <th
          className={`${
            style ?? "border p-2 text-left text-sm font-normal text-neutralGray"
          }`}
        >
          {title}
        </th>
      );
    };

    return tableColumn ? (
      <thead>
        <tr>{tableColumn.map(columnDisplay)}</tr>
      </thead>
    ) : null;
  };

  // Table Row
  const customTableRow = () => {
    const rowDisplay = (rowItem) => {
      const alignToColumnData = (columnItem) => {
        const { title, value, valueElement } = columnItem || {};
        const typeresult = typeof rowItem[value][valueElement];
        let valueData = "";

        switch (title) {
          case "Date":
            valueData = valueElement
              ? moment(rowItem[value][valueElement]).format("MMM DD, YYYY")
              : moment(rowItem[value]).format("MMM DD, YYYY");
            break;
          case "Time In": 
          case "Time Out":
            valueData = valueElement
              ? moment(rowItem[value][valueElement]).format("h:mm A")
              : rowItem[value][valueElement];
            break;
          default:
            valueData = !typeresult ? "Yes" : "No";
        }

        return (
          <th className="border p-2 text-left text-sm font-normal capitalize">
            {valueData}
          </th>
        );
      };
      return <tr>{tableColumn.map(alignToColumnData)}</tr>;
    };

    return tableRow ? (
      <tbody>{tableRow.length > 0 && tableRow.map(rowDisplay)}</tbody>
    ) : null;
  };

  return tableRow ? (
    <table className="w-full table-auto border">
      {customTableColumn()}
      {customTableRow()}
    </table>
  ) : null;
};

// Show And Hide Content
export const ShowHideContent = (props) => {
  const { tableRow, tableColumn, tableTitle, tableCount } = props || {};
  const isTableDataExist = tableRow && tableColumn;
  return (
    <Disclosure>
      {({ open }) => (
        <div
          className={`rounded-lg border ${
            open && isTableDataExist ? "border-primaryBlue" : null
          }`}
        >
          <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm font-medium">
            <span className="font-medium">
              {tableTitle ?? null} :{" "}
              <span className="pl-0.5 font-medium text-primaryBlue">
                {tableCount ?? 0}
              </span>{" "}
            </span>
            {isTableDataExist && (
              <Io5icons.IoChevronDown
                className={`${
                  open ? "rotate-180 transform" : ""
                } h-5 w-5 text-primaryBlue`}
              />
            )}
          </Disclosure.Button>
          {isTableDataExist && (
            <Disclosure.Panel className="p-2">
              {isTableDataExist && (
                <CustomTable tableRow={tableRow} tableColumn={tableColumn} />
              )}
            </Disclosure.Panel>
          )}
        </div>
      )}
    </Disclosure>
  );
};

// Filter Table Tab Data
export const filterDataByTabAction = (tableData, tabName, tableColumn) => {
  if (tabName === "All" || tabName === "all") return tableData;
  const filteredData = tableData.filter(
    (item) => item[tableColumn] === tabName,
  );
  return filteredData;
};
