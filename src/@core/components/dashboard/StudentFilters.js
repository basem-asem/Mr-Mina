import { Box, Button, MenuItem, TextField } from "@mui/material";

const uniqueValues = (rows, field) => [...new Set(rows.map((row) => row[field]).filter((value) => value !== undefined && value !== null && value !== "").map(String))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

export default function StudentFilters({ rows, value, onChange }) {
  const set = (field) => (event) => onChange((current) => ({ ...current, [field]: event.target.value }));
  const choices = [
    ["grade", "Grade type", "All grade types", uniqueValues(rows, "grade")],
    ["gradeYear", "Year", "All years", uniqueValues(rows, "gradeYear")],
    ["className", "Class", "All classes", uniqueValues(rows, "className")],
    ["language", "Language", "All languages", uniqueValues(rows, "language")],
    ["privateLesson", "Class type", "All class types", ["false", "true"]],
  ];
  const clear = () => onChange({ grade: "", gradeYear: "", className: "", language: "", privateLesson: "" });
  const hasFilters = Object.values(value).some(Boolean);

  return <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap", alignItems: "center", mb: 2 }}>
    {choices.map(([field, label, allLabel, options]) => <TextField key={field} select size="small" label={label} value={value[field]} onChange={set(field)} sx={{ minWidth: { xs: "calc(50% - 8px)", sm: 140 } }}>
      <MenuItem value="">{allLabel}</MenuItem>
      {options.map((option) => <MenuItem key={option} value={option}>{field === "privateLesson" ? (option === "true" ? "Private lesson" : "Regular class") : option}</MenuItem>)}
    </TextField>)}
    <Button size="small" onClick={clear} disabled={!hasFilters}>Clear filters</Button>
  </Box>;
}
