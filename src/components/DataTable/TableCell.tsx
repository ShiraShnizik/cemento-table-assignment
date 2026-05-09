import type { TableColumn } from "../../types/tableTypes";

// Props received by the TableCell component
interface TableCellProps {
    column: TableColumn;
    value: any;
    rowId: string;

    // Updates a specific cell value in the parent component
    onCellChange: (
        rowId: string,
        columnId: string,
        newValue: any
    ) => void;
}

export default function TableCell({
    column,
    value,
    rowId,
    onCellChange
}: TableCellProps) {

    // Render boolean columns as checkboxes
    if (column.type === "boolean") {
        return (
            <td>
                <input
                    type="checkbox"

                    // Converts undefined/null values into false
                    checked={Boolean(value)}

                    onChange={(event) =>
                        onCellChange(rowId, column.id, event.target.checked)
                    }
                />
            </td>
        );
    }

    // Render select columns using predefined options
    if (column.type === "select") {
        return (
            <td>
                <select

                    value={value ?? ""}

                    onChange={(event) =>
                        onCellChange(rowId, column.id, event.target.value)
                    }
                >
                    <option value="">Select...</option>

                    {/* Optional chaining prevents errors if options is undefined */}
                    {column.options?.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </td>
        );
    }

    // Render text, number, and date columns 
    return (
        <td>
            <input
                type={
                    column.type === "number"
                        ? "number"
                        : column.type === "date"
                        ? "date"
                        : "text"
                }

                value={value ?? ""}

                // If min/max are undefined, React does not render them
                min={column.min}
                max={column.max}

                step={column.integerOnly ? 1 : "any"}

                onChange={(event) => {

                    // Convert numeric input values from string to number
                    if (column.type === "number") {
                        onCellChange(rowId, column.id, Number(event.target.value));
                        return;
                    }

                    onCellChange(rowId, column.id, event.target.value);
                }}
            />
        </td>
    );
}