import React from "react";

export const ColumnHeaderCell = ({
  columnName,
  keyName,
  sortConfig,
  requestSort,
}: {
  columnName: string;
  keyName: string;
  sortConfig: any;
  requestSort: any;
}) => {
  const isSorted = sortConfig.key === keyName;
  const sortDirection =
    isSorted && sortConfig.direction === "ascending" ? "▲" : "▼";

  return (
    <div onClick={() => requestSort(keyName)} className="cursor-pointer">
      {columnName}
      {isSorted && <span className="ml-2">{sortDirection}</span>}
    </div>
  );
};
