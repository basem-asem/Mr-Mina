import Link from "next/link";
import { Box, Button, Card, CardContent, Chip, Typography } from "@mui/material";
import { readable } from "./recordConfig";

const labelFor = (id, rows) => rows.find((item) => item.id === id)?.name || id || "—";

export default function RecordCard({ section, row, students, groups, onEdit, onDelete }) {
  const configName = section === "Private lessons" ? "lessons" : section.toLowerCase();
  const fields = {
    students: ["grade", "gradeYear", "className", "language", "groupId", "privateLesson"],
    groups: ["points", "description"],
    notes: ["studentId", "category", "topic", "text", "date"],
    attendance: ["studentId", "date", "status", "lesson"],
    exams: ["maxScore", "grade", "gradeYear", "className", "date"],
    lessons: ["day", "time", "capacity", "studentIds"],
  }[configName] || [];

  return <Card variant="outlined" sx={{ height: "100%" }}><CardContent>
    {configName === "students" ? <Link href={`/students/${row.id}`} passHref legacyBehavior><Typography component="a" variant="h6" sx={{ mb: 1, display: "block", cursor: "pointer", textDecoration: "none", color: "text.primary" }}>{row.name || "Student"}</Typography></Link> : <Typography variant="h6" sx={{ mb: 1 }}>{row.name || row.topic || row.lesson || "Record"}</Typography>}
    {configName === "groups" && <Typography variant="body2" sx={{ mb: 1 }}><b>Students:</b> {students.filter((student) => student.groupId === row.id).map((student) => student.name).join(", ") || "No students assigned"}</Typography>}
    {configName === "exams" && <><Typography variant="body2" sx={{ mb: 1 }}><b>Class:</b> {[row.grade, row.gradeYear && `Year ${row.gradeYear}`, row.className && `Class ${row.className}`].filter(Boolean).join(" · ")} · <b>Maximum:</b> {row.maxScore}</Typography><Link href={`/exams/${row.id}`} passHref legacyBehavior><Button component="a" size="small" variant="outlined" sx={{ mb: 1 }}>Open roster and enter results</Button></Link></>}
    {fields.map((field) => {
      let value = row[field];
      if (field === "groupId") value = labelFor(value, groups);
      if (field === "studentId") value = labelFor(value, students);
      if (field === "studentIds" && Array.isArray(value)) value = value.map((id) => labelFor(id, students)).join(", ");
      if (field === "privateLesson") return <Chip key={field} size="small" sx={{ mr: 1, mb: 1 }} label={value === true || value === "true" ? "Private lessons" : "Regular class"} />;
      if (value !== undefined && value !== "") return <Typography key={field} variant="body2" sx={{ mb: .5 }}><b>{readable(field)}:</b> {Array.isArray(value) ? value.join(", ") : String(value)}</Typography>;
      return null;
    })}
    <Box sx={{ display: "flex", gap: 1, mt: 2 }}><Button size="small" variant="contained" onClick={() => onEdit(row)}>Edit</Button><Button size="small" variant="outlined" color="error" onClick={() => onDelete(row)}>Delete</Button></Box>
  </CardContent></Card>;
}
