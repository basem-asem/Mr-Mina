import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import { readable } from "./recordConfig";

export default function RecordFormDialog({ section, config, open, onClose, editing, form, setField, onSave, students, groups }) {
  const title = section === "Private lessons" ? "private lesson" : section === "Exams" ? "exam" : section.slice(0, -1).toLowerCase();
  return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>{editing ? "Edit" : "Add"} {title}</DialogTitle>
    <DialogContent sx={{ pt: "12px !important" }}>
      {config.fields.map((field) => {
        if (field === "groupId" || field === "studentId") {
          const options = field === "groupId" ? groups : students;
          return <TextField key={field} select fullWidth margin="normal" label={readable(field)} value={form[field] || ""} onChange={(event) => setField(field, event.target.value)}><MenuItem value="">None</MenuItem>{options.map((option) => <MenuItem key={option.id} value={option.id}>{option.name || option.id}</MenuItem>)}</TextField>;
        }
        if (field === "studentIds") return <TextField key={field} select fullWidth margin="normal" SelectProps={{ multiple: true }} label="Students" value={Array.isArray(form[field]) ? form[field] : []} onChange={(event) => setField(field, event.target.value)}>{students.map((student) => <MenuItem key={student.id} value={student.id}>{student.name}</MenuItem>)}</TextField>;
        if (field === "privateLesson") return <TextField key={field} select fullWidth margin="normal" label="Class type" value={String(form[field] || false)} onChange={(event) => setField(field, event.target.value)}><MenuItem value="false">Regular class</MenuItem><MenuItem value="true">Private lesson</MenuItem></TextField>;
        if (field === "category") return <TextField key={field} select fullWidth margin="normal" label="Category" value={form[field] || ""} onChange={(event) => setField(field, event.target.value)}>{["Grammar", "Vocabulary", "Speaking", "Listening", "Reading", "Writing", "Other"].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>;
        if (field === "status") return <TextField key={field} select fullWidth margin="normal" label="Status" value={form[field] || "Present"} onChange={(event) => setField(field, event.target.value)}>{["Present", "Absent", "Excused"].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>;
        if (field === "grade") return <TextField key={field} select fullWidth margin="normal" label="Grade Type" value={form[field] || "Middle"} onChange={(event) => setField(field, event.target.value)}>{["Middle", "Senior"].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>;
        if (field === "gradeYear") return <TextField key={field} select fullWidth margin="normal" label="Year" value={form[field] || "1"} onChange={(event) => setField(field, event.target.value)}>{["1", "2", "3"].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>;
        if (field === "className") return <TextField key={field} select fullWidth margin="normal" label="Class name" value={form[field] || "A"} onChange={(event) => setField(field, event.target.value)}>{["A", "B"].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>;
        if (field === "language") return <TextField key={field} select fullWidth margin="normal" label="Language" value={form[field] || "English"} onChange={(event) => setField(field, event.target.value)}>{["English", "French"].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>;
        const numeric = ["points", "capacity", "maxScore"].includes(field);
        const multiline = ["text", "description", "notes"].includes(field);
        return <TextField key={field} fullWidth margin="normal" label={readable(field)} type={field === "date" ? "date" : numeric ? "number" : "text"} multiline={multiline} minRows={multiline ? 3 : undefined} InputLabelProps={field === "date" ? { shrink: true } : undefined} value={form[field] ?? ""} onChange={(event) => setField(field, event.target.value)} />;
      })}
    </DialogContent>
    <DialogActions><Button onClick={onClose}>Cancel</Button><Button variant="contained" onClick={onSave}>{editing ? "Save changes" : "Add"}</Button></DialogActions>
  </Dialog>;
}
