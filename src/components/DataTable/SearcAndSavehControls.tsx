// Added feature:
// Two-step search improves usability by first selecting
// a specific column and then filtering rows only within
// that column, making searches more focused and efficient.

import type { TableColumn } from "../../types/tableTypes";

// Props received by the SearchAndSaveControls component
interface SearchAndSaveControls {

    // Currently selected column used for searching
    searchColumn: string;

    // Current search input value
    searchTerm: string;

    // Columns currently visible in the table
    filteredColumns: TableColumn[];

    // Updates the selected search column
    onSearchColumnChange: (
        newSearchColumn: string
    ) => void;

    // Updates the search text input
    onSearchChange: (
        newSearchTerm: string
    ) => void;

    // Saves the current table data
    onSave: () => void;
}

export default function SearchAndSaveControls({
    searchColumn,
    searchTerm,
    filteredColumns,
    onSearchColumnChange,
    onSearchChange,
    onSave
}: SearchAndSaveControls) {

    return (
        <div className="table-search-area">

            <select
                value={searchColumn}
                onChange={(event) =>
                    onSearchColumnChange(event.target.value)
                }
                className="table-search-select"
            >
                {/* Search across all visible columns */}
                <option value="all">All columns</option>

                {/* Render one search option for each visible column */}
                {filteredColumns.map((column) => (
                    <option
                        key={column.id}
                        value={column.id}
                    >
                        {column.title}
                    </option>
                ))}
            </select>

            <input
                type="text"

                // Placeholder text displayed before typing
                placeholder="Search..."

                value={searchTerm}

                // Update search state on every input change
                onChange={(event) =>
                    onSearchChange(event.target.value)
                }
                className="table-search-input"
            />

            <button
                onClick={onSave}
                className="save-button"
            >
                Save Changes
            </button>

        </div>
    );
}