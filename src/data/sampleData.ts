import { faker } from "@faker-js/faker";
import type { TableData } from "../types/tableTypes";

const statuses = [
    { label: "Not Started", value: "not_started" },
    { label: "In Progress", value: "in_progress" },
    { label: "Delayed", value: "delayed" },
    { label: "Completed", value: "completed" }
];

const projectTypes = [
    "High Rise",
    "Apartments",
    "Hospital",
    "Hotel",
    "School",
    "Office Building",
    "Shopping Center",
    "Residential Tower",
    "Student Housing",
    "Medical Center",
    "Industrial Facility",
    "Mixed Use Building",
    "Parking Garage",
    "Community Center",
    "Business Park",
    "Research Center",
    "Sports Arena",
    "Convention Center",
    "Warehouse Complex",
    "University Campus",
    "Transportation Hub",
    "Data Center",
    "Logistics Facility",
    "Retail Center"
];

export const sampleData: TableData = {
columns: [
    { id: "taskId", ordinalNo: 1, title: "Task ID", type: "text", width: 30, integerOnly: true, sortable: false, required: true },
    { id: "projectType", ordinalNo: 2, title: "Project Type", type: "text", width: 70, required: true },
    { id: "contractor", ordinalNo: 3, title: "Contractor", type: "text", width: 70 },
    { id: "status", ordinalNo: 4, title: "Status", type: "select", width: 60, options: statuses, required: true },
    { id: "approved", ordinalNo: 5, title: "Approved", type: "boolean", width: 40, required: true },
    { id: "plannedStart", ordinalNo: 6, title: "Planned Start", type: "date", width: 80 },
    { id: "delayDays", ordinalNo: 7, title: "Delay Days", type: "number", width: 50, min: 0, max: 365 }
],

data: Array.from({ length: 20 }, (_, index) => ({
    id: String(index + 1),                                  // Internal unique row id
    taskId: String(index + 1),                              // Displayed Task ID
    projectType: faker.helpers.arrayElement(projectTypes),
    contractor: faker.company.name(),
    status: faker.helpers.arrayElement(statuses).value,
    approved: faker.datatype.boolean(),
    plannedStart: faker.date.future().toISOString().slice(0, 10),
    delayDays: faker.number.int({ min: 0, max: 60 })
}))
};