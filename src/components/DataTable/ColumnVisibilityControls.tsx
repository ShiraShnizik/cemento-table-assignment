import type { TableColumn } from "../../types/tableTypes";

// Props received by the ColumnVisibilityControls component
interface ColumnVisibilityControlsProps {

    // All available table columns
    columns: TableColumn[];

    // List of currently visible column ids
    visibleColumns: string[];

    // Toggles column visibility in the parent component
    onToggleColumn: (columnId: string) => void;
};

export default function ColumnVisibilityControls({
    columns,
    visibleColumns,
    onToggleColumn
}: ColumnVisibilityControlsProps) {

    return (
        <div>

            {/* Render one checkbox for each table column */}
            {columns.map((column) => (

                <label
                    key={column.id}

                    // Add spacing between checkbox items
                    style={{ marginRight: "16px" }}
                >
                    <input
                        type="checkbox"

                        // Checkbox is checked if the column id exists
                        // inside the visibleColumns array
                        checked={visibleColumns.includes(column.id)}

                        // Toggle visibility for the selected column
                        onChange={() => onToggleColumn(column.id)}
                    />

                    {/* Display the column title next to the checkbox */}
                    {column.title}

                </label>

            ))}

        </div>
    );
}