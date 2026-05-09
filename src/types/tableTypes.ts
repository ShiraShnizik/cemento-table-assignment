// Type safety:
// Uses a union type to restrict supported column
// rendering types, while enabling browser-native
// features such as built-in date pickers.

// Supported column rendering types
export type ColumnType =
    | "text"
    | "number"
    | "boolean"
    | "select"
    | "date";

export interface SelectOption {
    // Text displayed to the user
    label: string;

    // Value stored in the data
    value: string;
}

// Column-specific configuration:
// Optional properties allow each column
// to define only the behaviors, features,
// and validation rules relevant to its type.

export interface TableColumn {
    // Unique column identifier
    id: string;

    // Column display order
    ordinalNo: number;

    // Column header text
    title: string;

    // Controls cell rendering
    type: ColumnType;

    // Optional column width
    width?: number;

    // Options for select columns
    options?: SelectOption[];

    // Optional number constraints
    min?: number;
    max?: number;
    integerOnly?: boolean;

    // Controls whether the column can be sorted
    sortable?: boolean;

    // Requires the cell to contain a value
    required?: boolean;
}

export interface TableRow {
    // Unique row identifier
    id: string;

    // Dynamic cell values by column id
    [columnId: string]: any;
}

export interface TableData {
    // Table schema
    columns: TableColumn[];

    // Table content
    data: TableRow[];
}