import React from "react";

export default function FilterHeadings(props) {
  const { headings, selectedFilter, setSelectedFilter } = props || {};
  return (
    <>
      {headings?.map((heading) => (
        // <h1>{heading}</h1>
        <button
          key={heading}
          className={`mx-2 bg-transparent  px-4 py-2 text-sm font-normal capitalize text-neutralGray ${
            selectedFilter === heading
              ? "rounded-lg border border-primaryBlue font-medium text-primaryBlue"
              : "rounded-none "
          }`}
          onClick={() => setSelectedFilter(heading)}
        >
          {heading}
        </button>
      ))}
    </>
  );
}
