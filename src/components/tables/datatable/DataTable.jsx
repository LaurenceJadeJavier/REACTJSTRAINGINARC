import React, { useState } from "react";
import * as Io5icons from "react-icons/io5";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { shallow } from "zustand/shallow";

import FormModal from "../../modal/FormModal";
import { CustomSelect } from "../../inputs/CustomSelect";
import TableFilter from "../../filter/TableFilter";
import TableTab from "../../tab/TableTab";
import { filterDataAction } from "../../../services/script_service";
import { filterStore } from "../../../utils/zustand/FilterStore/filterStore";

export default function DataTable(props) {
  const {
    columns,
    rows,
    title,
    subTitle,
    headDetails,
    btnName,
    openFormAction,
    headingFilter,
    filteredValue,
    headings,
    // Table Tab, Requirement [name,isSelected,selectTabAction]
    tableTab,
    btnPrint,
    // Filter Selection, Requirement ["column name"]
    filterSelectionList,
    // Search Option, Requirement Boolean]
    searchOption,
    hasPagination,
    searchData,
  } = props ?? {};

  // Global State
  const { filteredData: columnFilters } = filterStore(
    (state) => state,
    shallow,
  );

  // Local State
  const [globalFilter, setGlobalFilter] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  React.useEffect(() => {
    setGlobalFilter(filteredValue === headings ? "" : filteredValue);
    return () => {
      setGlobalFilter("");
    };
  }, [filteredValue]);

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    enableColumnFilters: true,
    enableFilters: true,
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  // Table Filter Form Display (Optional)
  const tableFilterDisplay = () => {
    const propsContainer = {
      filterSelection: filterDataAction(filterSelectionList, rows),
      openFilter,
      setOpenFilter,
    };

    return filterSelectionList && <TableFilter {...propsContainer} />;
  };

  // Table Tab Selection Display (Optional)
  const tabSelectionDisplay = () => {
    const propsContainer = {
      tableTab,
    };

    return tableTab && <TableTab {...propsContainer} />;
  };

  return (
    <div className="w-full p-2">
      {/* <div>
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="font-lg border-block border p-2 shadow"
          placeholder="Search all columns..."
        />
      </div> */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <div className="text-xl font-semibold text-neutralDark">
              {title}
            </div>
            {subTitle && (
              <div className="text-sm text-neutralGray">{subTitle}</div>
            )}
          </div>
          <div className="flex flex-row gap-3">
            {searchOption && (
              <div
                className="searchcontainer"
                onChange={(e) => searchData(e.target.value)}
              >
                <input
                  type="text"
                  name="text"
                  className="searchinput"
                  placeholder="Type to search..."
                  required
                />
                <div className="searchicon">
                  <div className="search">
                    <Io5icons.IoSearchOutline className="text-xl text-primaryBlue" />
                  </div>
                  <div className="searchiconclear">
                    {/* <Io5icons.IoCloseOutline
                      onClick={() => console.log("TEST")}
                      className="z-50 cursor-pointer text-lg text-primaryBlue"
                    /> */}
                  </div>
                </div>
              </div>
            )}
            {btnPrint && (
              <button className="btn flex flex-row gap-2 rounded-2xl bg-lightBlue">
                <Io5icons.IoPrintOutline className="text-base text-primaryBlue" />
                <span className="text-sm font-normal text-primaryBlue">
                  Print Form
                </span>
              </button>
            )}
            {filterSelectionList && filterSelectionList.length > 0 && (
              <button
                onClick={() => setOpenFilter(!openFilter)}
                className="btn rounded-2xl bg-lightBlue"
              >
                <Io5icons.IoFilter className="text-xl text-primaryBlue" />{" "}
              </button>
            )}

            {btnName && (
              <button
                className="btn btn-info rounded-xl bg-primaryBlue px-5 text-sm  font-normal capitalize text-white"
                onClick={openFormAction}
              >
                <span>
                  {" "}
                  <Io5icons.IoAddCircleOutline className="text-lg" />
                </span>{" "}
                {btnName}
              </button>
            )}
          </div>
        </div>

        <div className="container"> {headDetails ? headDetails() : null}</div>
        <div className="container">{tableTab && tabSelectionDisplay()}</div>
        {headingFilter && <div className="container">{headingFilter()}</div>}

        <div>
          <table className="w-full border-b">
            <thead className="">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className=" ">
                  {headerGroup.headers.map((header, index) => (
                    <th
                      key={header.id}
                      className={`px-3 py-4 ${header.column.columnDef.style} ${
                        index === 0 ? "rounded-tl-xl " : ""
                      } ${
                        headerGroup?.headers?.length - 1 === index
                          ? "rounded-tr-xl "
                          : ""
                      }  bg-lightBlue text-left text-sm font-medium  uppercase text-primaryBlue`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y rounded-b-xl border border-lightBlue ">
              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id} className="">
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id} className="p-3 text-sm ">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {hasPagination === false ? null : (
          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-sm text-neutralGray">
              <div>Page</div>
              <div>
                <span className="font-medium">
                  {table.getState().pagination.pageIndex + 1}
                </span>{" "}
                of
                <span className="font-medium"> {table.getPageCount()}</span>
              </div>
            </div>

            <div className="flex gap-1">
              {/* <button
              className="rounded border p-1"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <Io5icons.IoChevronBackOutline />
            </button> */}
              <button
                className="rounded bg-primaryBlue/50 px-2 text-white"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <Io5icons.IoChevronBackOutline />
              </button>
              <input
                type="number"
                value={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  if (e.target.value >= 0) {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    table.setPageIndex(page);
                  }
                }}
                className="w-16 rounded border bg-lightBlue p-1 focus:outline-none"
              />
              <button
                className="rounded-md border  bg-primaryBlue/50  p-1 px-2 text-white"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <Io5icons.IoChevronForwardOutline />
              </button>
              {/* <button
              className="rounded border p-1"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <Io5icons.IoChevronForwardOutline />
            </button> */}
            </div>

            {/* <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-16 rounded border p-1"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select> */}
          </div>
        )}
        {/* <div>{table.getPrePaginationRowModel().rows.length} Rows</div> */}
      </div>

      {tableFilterDisplay()}
    </div>
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
