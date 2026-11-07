export const recordSections = {
  Students: { name: "students", fields: ["name", "grade", "gradeYear", "className", "language", "groupId", "privateLesson"] },
  Groups: { name: "groups", fields: ["name", "points", "description"] },
  Notes: { name: "notes", fields: ["studentId", "category", "topic", "text", "date"] },
  Attendance: { name: "attendance", fields: ["studentId", "date", "status", "lesson"] },
  Exams: { name: "exams", fields: ["name", "maxScore", "grade", "gradeYear","language", "className", "date"] },
  "Private lessons": { name: "lessons", fields: ["name", "day", "time", "capacity", "studentIds"] },
};

export const defaultsFor = (name) => {
  if (name === "students") return { grade: "Senior", gradeYear: "1", className: "B", language: "French", privateLesson: false, groupId: "" };
  if (name === "exams") return { grade: "Middle", gradeYear: "1", language: "English", className: "A"};
  if (name === "attendance") return { status: "Present" };
  if (name === "notes") return { category: "Grammar" };
  return {};
};

export const emptyForm = (fields) => Object.fromEntries(fields.map((field) => [field, field === "studentIds" ? [] : ""]));

export const valueForField = (field, value, defaults) => {
  if (Array.isArray(value)) return value;
  return value === undefined || value === null || value === "" ? (defaults[field] ?? "") : String(value);
};

export const readable = (value) => ({ className: "Class name", grade: "Grade type", gradeYear: "Year" }[value] || value.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()));
