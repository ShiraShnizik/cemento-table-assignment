// React hooks used for state management and memoized calculations
import {
    useState,
    useMemo
} from "react";

import type {
    TableColumn,
    TableRow
} from "../../types/tableTypes";

import TableCell from "./TableCell";
import ColumnVisibilityControls from "./ColumnVisibilityControls";
import SearcAndSavehControls from "./SearcAndSavehControls";
import PaginationControls from "./PaginationControls";

import {
    compareValues,
    validateUniqueColumnIds,
    validateUniqueRowIds,
    getCellValidationError,
    validateTableData,
    type SortDirection
} from "../../utils/tableUtils";

import "./DataTable.css";

// Props received by the DataTable component
interface DataTableProps {
    columns: TableColumn[];
    data: TableRow[];
}

const ROWS_PER_PAGE = 5;

// Persistence feature:
// Saving the table in localStorage allows the application
// to preserve user changes even after refreshing or reopening
// the browser, improving user experience and preventing data loss.

// Local storage key used to persist table data.
const STORAGE_KEY = "data-table";

export default function DataTable({
    columns,
    data
}: DataTableProps) {

   // Validate the table structure and initial data before rendering
    validateUniqueColumnIds(columns);
    validateUniqueRowIds(data);
    validateTableData(columns, data);

    // Current table data
    const [tableData, setTableData] = useState<TableRow[]>(() => {

        // Try to load previously saved table data from local storage
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (!savedData) {
            return data;
        }

        try {
            const parsedData = JSON.parse(savedData);

            // Validate restored local storage data
            validateUniqueRowIds(parsedData);
            validateTableData(columns, parsedData);

            return parsedData;
        } catch {
            // Fallback to the initial data if local storage is invalid
            localStorage.removeItem(STORAGE_KEY);

            return data;
        }
    });

    // Stores the ids of columns currently displayed in the table
    const [visibleColumns, setVisibleColumns] = useState(
        columns.map((column) => column.id)
    );

    // Stores the column selected for search, or "all" for all visible columns
    const [searchColumn, setSearchColumn] = useState("all");
   
    // Stores the current search input value
    const [searchTerm, setSearchTerm] = useState("");

    // Added feature:
    // Table sorting allows users to quickly organize rows
    // in ascending or descending order based on a selected column,
    // making large datasets easier to read and analyze.

    // Stores the column currently used for sorting
    const [sortColumn, setSortColumn] =
        useState<string | null>(null);

    // Stores the current sort direction
    const [sortDirection, setSortDirection] =
        useState<SortDirection>("asc");

    // Stores the currently displayed page number
    const [currentPage, setCurrentPage] = useState(1);

    // Validation feedback:
    // Error messages provide clear feedback when
    // user input is invalid, helping users understand
    // what must be corrected before saving changes.

    // Stores the current validation error message
    const [errorMessage, setErrorMessage] = useState("");

    // Updates a specific cell value inside the table data
    const handleCellChange = (
        rowId: string,
        columnId: string,
        newValue: string | number | boolean
    ) => {

        // Find the column configuration of the edited cell
        const column = columns.find(
            (column) => column.id === columnId
        );

        // Stop if the column does not exist
        if (!column) {
            return;
        }

        // Validate the new value before updating the table state
        const error = getCellValidationError(
            column,
            newValue
        );

        if (error) {
            setErrorMessage(error);
            return;
        }

        setErrorMessage("");

        setTableData((prevData) =>
            prevData.map((row) => {

                // Keep rows that were not edited unchanged
                if (row.id !== rowId) {
                    return row;
                }

                // Update only the edited cell in the matching row
                return {
                    ...row,
                    [columnId]: newValue
                };
            })
        );
    };

    // Shows or hides a column by adding/removing its id
    const handleToggleColumn = (columnId: string) => {
        setVisibleColumns((prevColumns) => {
            // If the column is already visible, remove it
            if (prevColumns.includes(columnId)) {
                return prevColumns.filter((id) => id !== columnId);
            }

            // Otherwise, add it to the visible columns list
            return [...prevColumns, columnId];
        });
    };

    // Updates the selected column used for searching
    const handleSearchColumnChange = (
        newSearchColumn: string
    ) => {
        setSearchColumn(newSearchColumn);

        // Reset to the first page after changing search column
        setCurrentPage(1);
    };
    
    // Updates the search text from the input field
    const handleSearchChange = (
        newSearchTerm: string
    ) => {
        setSearchTerm(newSearchTerm);

        // Reset to the first page after searching
        setCurrentPage(1);
    };

    // Updates the active sort column and direction
    const handleSort = (
        columnId: string,
        direction: SortDirection
    ) => {
        setSortColumn(columnId);
        setSortDirection(direction);

        // Reset to the first page after sorting
        setCurrentPage(1);
    };

    // Saves the current table data to local storage
    const handleSave = () => {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tableData)
        );

        alert("Changes saved locally");
    };

    // Added feature:
    // Row deletion allows users to dynamically remove
    // unnecessary entries from the table,
    // improving table management and usability.

    // Removes a row from the table
    const handleDeleteRow = (rowId: string) => {
        setTableData((prevData) => 
            prevData.filter((row) => row.id !== rowId)
        );
    };

    // Optimization:
    // useMemo memoizes expensive derived calculations such as
    // filtering, sorting, and pagination, preventing unnecessary
    // recomputation on every render and improving performance
    // when working with larger datasets.

    // Calculates the columns that should currently be displayed
    const filteredColumns = useMemo(() => {
        return columns.filter((column) =>
            visibleColumns.includes(column.id)
        );
    }, [columns, visibleColumns]);

    // Calculates the rows that match the current search
    const filteredData = useMemo(() => {
        const search = searchTerm.toLowerCase();

        // If search is empty, return all rows
        if (!search) {
            return tableData;
        }

        return tableData.filter((row) => {
            // Search across all visible columns
            if (searchColumn === "all") {
                return filteredColumns.some((column) =>
                    String(row[column.id] ?? "")
                        .toLowerCase()
                        .includes(search)
                );
            }

            // Search only inside the selected column
            return String(row[searchColumn] ?? "")
                .toLowerCase()
                .includes(search);
        });
    }, [tableData, searchTerm, searchColumn, filteredColumns]);

    // Calculates the sorted table data
    const sortedData = useMemo(() => {
        return [...filteredData].sort((firstRow, secondRow) => {
            // If no column was selected for sorting, keep current order
            if (!sortColumn) {
                return 0;
            }

            // Compare the values of the selected column
            const result = compareValues(
                firstRow[sortColumn],
                secondRow[sortColumn]
            );

            // Reverse comparison result for descending order
            return sortDirection === "asc" ? result : -result;
        });
    }, [filteredData, sortColumn, sortDirection]);

    // Calculates the total number of pages
    const totalPages = Math.max(
        1,
        Math.ceil(sortedData.length / ROWS_PER_PAGE)
    );

    // Moves one page backward without going below page 1
    const handlePreviousPage = () => {
        setCurrentPage((prevPage) =>
            Math.max(prevPage - 1, 1)
        );
    };

    // Moves one page forward without passing the last page
    const handleNextPage = () => {
        setCurrentPage((prevPage) =>
            Math.min(prevPage + 1, totalPages)
        );
    };

    // Calculates only the rows that should appear on the current page
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
        const endIndex = startIndex + ROWS_PER_PAGE;

        return sortedData.slice(startIndex, endIndex);
    }, [sortedData, currentPage]);

    return (
        <div>
            <ColumnVisibilityControls
                columns={columns}
                visibleColumns={visibleColumns}
                onToggleColumn={handleToggleColumn}
            />

            <SearcAndSavehControls
                searchColumn={searchColumn}
                searchTerm={searchTerm}
                filteredColumns={filteredColumns}
                onSearchColumnChange={handleSearchColumnChange}
                onSearchChange={handleSearchChange}
                onSave={handleSave}
            />
            
            {errorMessage && (
                <div className="table-error-message">
                    {errorMessage}
                </div>
            )}
            
            <table className="data-table">
                <thead>
                    <tr>
                        {filteredColumns.map((column) => (
                            <th
                                key={column.id}
                                style={{ width: column.width }}
                            >
                                <div className="header-content">
                                    <span>{column.title}</span>

                                    {column.sortable !== false && (
                                        <div className="sort-buttons">
                                            <button
                                                className={
                                                    sortColumn === column.id &&
                                                    sortDirection === "asc"
                                                        ? "active-sort"
                                                        : ""
                                                }
                                                onClick={() =>
                                                    handleSort(column.id, "asc")
                                                }
                                            >
                                                ▲
                                            </button>

                                            <button
                                                className={
                                                    sortColumn === column.id &&
                                                    sortDirection === "desc"
                                                        ? "active-sort"
                                                        : ""
                                                }
                                                onClick={() =>
                                                    handleSort(column.id, "desc")
                                                }
                                            >
                                                ▼
                                            </button>
                                        </div>
                                    )} 
                                </div>
                            </th>
                        ))}
                        <th style={{ width: 40 }}>
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {paginatedData.map((row) => (
                        <tr key={row.id}>
                            {filteredColumns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    column={column}
                                    value={row[column.id]}
                                    rowId={row.id}
                                    onCellChange={handleCellChange}
                                />
                            ))}
                            <td>
                                <button
                                    style={{ width: "70px" }}
                                    onClick={() => handleDeleteRow(row.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
            />
        </div>
    );
}