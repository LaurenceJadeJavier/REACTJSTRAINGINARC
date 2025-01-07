import React from "react";

export default function TableTab(props) {
  const { tableTab } = props || {};

  const tabSelection = (item, index) => {
    const { name, isSelected, selectTabAction } = item || {};
    const isTabSelected =
      isSelected &&
      "border border-primaryBlue bg-blue-50 rounded-lg text-primaryBlue font-medium";
    return (
      <div
        key={index}
        className={`mx-2 cursor-pointer px-4 py-2 text-sm text-neutralGray ${isTabSelected}`}
        onClick={selectTabAction}
      >
        {name ?? null}
      </div>
    );
  };

  return tableTab && tableTab.length > 0 ? (
    <div className="flex flex-row gap-2 py-2">{tableTab.map(tabSelection)}</div>
  ) : null;
}
