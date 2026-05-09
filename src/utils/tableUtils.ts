// Validation support:
// Centralizes table validation logic, including unique
// identifiers for columns and rows, and validation of cell
// values according to each column type and constraints.
// This keeps the table data consistent and prevents invalid
// values from being saved.

import type {
    TableColumn,
    TableRow
} from "../types/tableTypes";

export type SortDirection = "asc" | "desc";

export const compareValues = (
    firstValue: unknown,
    secondValue: unknown
) => {
    if (
        typeof firstValue === "number" &&
        typeof secondValue === "number"
    ) {
        return firstValue - secondValue;
    }

    if (
        typeof firstValue === "boolean" &&
        typeof secondValue === "boolean"
    ) {
        return Number(firstValue) - Number(secondValue);
    }

    return String(firstValue ?? "").localeCompare(
        String(secondValue ?? "")
    );
};

// Validates that every column has a unique id
export const validateUniqueColumnIds = (
    columns: TableColumn[]) => {

    // Stores all processed column ids
    const columnIds = new Set<string>();

    columns.forEach((column) => {

        // Reject duplicate column ids
        if (columnIds.has(column.id)) {
            throw new Error(
                `Duplicate column id found: ${column.id}`
            );
        }

        // Add the current column id to the set
        columnIds.add(column.id);
    });
};

// Validates that every row has a unique id
export const validateUniqueRowIds = (
    rows: TableRow[]) => {

    const rowIds = new Set<string>();

    rows.forEach((row) => {
        if (rowIds.has(row.id)) {
            throw new Error(
                `Duplicate row id found: ${row.id}`
            );
        }

        rowIds.add(row.id);
    });
};

// Returns an error message if the cell value is invalid
export const getCellValidationError = (
    column: TableColumn,
    value: unknown
) => {
    const isEmpty =
        value === undefined ||
        value === null ||
        value === "";

    // Required fields cannot be empty
    if (isEmpty) {
        if (column.required) {
            return `${column.title} is required`;
        }

        return null;
    }

    // Validate select values against the allowed options
    if (column.type === "select") {

        const validOptions =
            column.options?.map(
                (option) => option.value
            ) ?? [];

        if (!validOptions.includes(String(value))) {
            return `${column.title} must contain a valid option`;
        }

        return null;
    }

    // Validate date values that may come from external sources
    if (column.type === "date") {
        const dateValue = new Date(String(value));

        if (Number.isNaN(dateValue.getTime())) {
            return `${column.title} must be a valid date`;
        }

        return null;
    }

    // Only number columns require numeric validation
    if (column.type !== "number") {
        return null;
    }

    if (typeof value !== "number" || Number.isNaN(value)) {
        return `${column.title} must be a valid number`;
    }

    if (column.integerOnly && !Number.isInteger(value)) {
        return `${column.title} must be an integer`;
    }

    if (column.min !== undefined && value < column.min) {
        return `${column.title} must be at least ${column.min}`;
    }

    if (column.max !== undefined && value > column.max) {
        return `${column.title} must be at most ${column.max}`;
    }

    return null;
};

// Validates all table rows using the single-cell validation logic
export const validateTableData = (
    columns: TableColumn[],
    rows: TableRow[]
) => {
    rows.forEach((row) => {
        columns.forEach((column) => {
            const value = row[column.id];
            const error = getCellValidationError(column, value);

            if (error) {
                throw new Error(
                    `${error} in row ${row.id}, column ${column.id}`
                );
            }
        });
    });
};