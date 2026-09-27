import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Snackbar, Tab, Tabs, TextField, Typography } from "@mui/material";
import { auth, db } from "src/configs/firebaseConfig";

// Teacher-owned records live in shared root collections so every page can query them by their IDs.
const collections = {
  Students: { name: "students", fields: ["name", "grade", "gradeYear", "className", "language", "groupId", "privateLesson"] },
  Groups: { name: "groups", fields: ["name", "points", "description"] },
  Notes: { name: "notes", fields: ["studentId", "category", "topic", "text", "date"] },
  Attendance: { name: "attendance", fields: ["studentId", "date", "status", "lesson"] },
  Exams: { name: "exams", fields: ["name", "maxScore", "grade", "gradeYear", "className", "date"] },
  "Private lessons": { name: "lessons", fields: ["name", "day", "time", "capacity", "studentIds"] },
};
const emptyForm = (fields) => Object.fromEntries(fields.map((field) => [field, field === "studentIds" ? [] : ""]));
const defaultsFor = (collectionName) => {
  if (collectionName === "students") return { grade: "Senior", gradeYear: "1", className: "A", language: "English", privateLesson: false, groupId: "" };
  if (collectionName === "exams") return { grade: "Middle", gradeYear: "1", className: "A" };
  if (collectionName === "attendance") return { status: "Present" };
  if (collectionName === "notes") return { category: "Grammar" };
  return {};
};
const valueForField = (field, value, defaults) => {
  if (Array.isArray(value)) return value;
  return value === undefined || value === null || value === "" ? (defaults[field] ?? "") : String(value);
};
const readable = (value) => ({ className: "Class name", grade: "Grade type", gradeYear: "Grade" }[value] || value.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()));

export default function TeacherDashboard() {
  const [uid, setUid] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [tab, setTab] = useState("Students");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const active = collections[tab] || {};
  const students = data.students || [];
  const groups = data.groups || [];
  const labelFor = (id, list) => list.find((item) => item.id === id)?.name || id || "—";

  useEffect(() => onAuthStateChanged(auth, (user) => { setUid(user?.uid || null); setAuthReady(true); }), []);
  useEffect(() => {
    if (!uid) { setLoading(false); return undefined; }
    setLoading(true);
    let cancelled = false;
    let pending = Object.keys(collections).length;
    let unsubscribers = [];
    const startListeners = () => {
      if (cancelled) return;
      unsubscribers = Object.values(collections).map(({ name }) => onSnapshot(query(collection(db, name)), (snapshot) => {
        setData((current) => ({ ...current, [name]: snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) }));
        pending -= 1;
        if (pending <= 0) setLoading(false);
      }, (error) => { console.error(error); setNotice("Could not load dashboard data. Check your Firestore rules."); setLoading(false); }));
    };
    // Preserve records from the previous per-teacher subcollections when moving to the shared collections.
    // const migrateLegacyRecords = async () => {
    //   try {
    //     for (const { name } of Object.values(collections)) {
    //       const legacy = await getDocs(collection(db, "teacherDashboards", uid, name));
    //       for (const oldRecord of legacy.docs) {
    //         const target = doc(db, name, oldRecord.id);
    //         const existing = await getDoc(target);
    //         if (!existing.exists()) await setDoc(target, { ...oldRecord.data(), teacherId: uid });
    //       }
    //     }
    //     startListeners();
    //   } catch (error) {
    //     console.error(error);
    //     setNotice("Could not migrate the old teacher dashboard records. Check Firestore permissions.");
    //     startListeners();
    //   }
    // };
    // migrateLegacyRecords();
    startListeners();

    return () => { cancelled = true; unsubscribers.forEach((unsubscribe) => unsubscribe()); };
  }, [uid]);

  const rows = data[active.name] || [];
  const visibleRows = useMemo(() => rows.filter((row) => {
    const groupName = labelFor(row.groupId, groups);
    const studentName = labelFor(row.studentId, students);
    const groupMembers = active.name === "groups" ? students.filter((student) => student.groupId === row.id).map((student) => student.name).join(" ") : "";
    return `${Object.values(row).join(" ")} ${groupName} ${studentName} ${groupMembers}`.toLowerCase().includes(search.toLowerCase());
  }), [rows, search, groups, students, active.name]);
  const counts = useMemo(() => Object.fromEntries(Object.values(collections).map(({ name }) => [name, data[name]?.length || 0])), [data]);
  const openNew = () => { setEditing(null); setForm({ ...emptyForm(active.fields), ...defaultsFor(active.name) }); setDialog(true); };
  const openEdit = (row) => { const defaults = defaultsFor(active.name); setEditing(row.id); setForm(Object.fromEntries(active.fields.map((field) => [field, valueForField(field, row[field], defaults)]))); setDialog(true); };
  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const save = async () => {
    if (!uid) return;
    if (active.name === "exams" && (!form.name?.trim() || !(Number(form.maxScore) > 0))) {
      setNotice("For an exam, enter a name and a maximum score greater than zero. Grade type, grade, and class name use their defaults unless changed.");
      return;
    }
    const defaults = defaultsFor(active.name);
    const normalizedForm = { ...defaults, ...form };
    const values = { ...normalizedForm, teacherId: uid, updatedAt: new Date().toISOString() };
    if (active.name === "students") {
      values.gradeYear = String(normalizedForm.gradeYear || defaults.gradeYear);
      values.privateLesson = normalizedForm.privateLesson === true || normalizedForm.privateLesson === "true";
    }
    if (active.name === "groups") values.points = Number(form.points) || 0;
    if (active.name === "exams") {
      values.gradeYear = String(normalizedForm.gradeYear || defaults.gradeYear);
      values.maxScore = Number(normalizedForm.maxScore) || 0;
    }
    if (active.name === "lessons") values.capacity = Number(form.capacity) || 0;
    if (!editing) values.createdAt = new Date().toISOString();
    try {
      if (editing) await updateDoc(doc(db, active.name, editing), values);
      else await addDoc(collection(db, active.name), values);
      setDialog(false);
    } catch (error) { console.error(error); setNotice("Save failed. Check your Firestore rules and connection."); }
  };
  const requestDelete = (row) => { setDeletingRow(row); setDeleteDialog(true); };
  const remove = async () => {
    if (!deletingRow) return;
    try {
      await deleteDoc(doc(db, active.name, deletingRow.id));
      setDeleteDialog(false);
      setDeletingRow(null);
    } catch (error) {
      console.error(error);
      setNotice("Delete failed. Check your Firestore rules and connection.");
    }
  };

  if (!authReady || loading) return <Box sx={{ display: "grid", placeItems: "center", minHeight: "50vh" }}><CircularProgress /></Box>;
  if (!uid) return <Alert severity="warning">Sign in to use the teacher dashboard.</Alert>;
  return <Box>
    <Typography variant="h4" sx={{ mb: 1 }}>English Teacher Dashboard</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>One connected record for each student, group, exam, attendance entry, and note.</Typography>
    <Grid container spacing={2} sx={{ mb: 3 }}>{[["Students", "students"], ["Groups", "groups"], ["Notes", "notes"], ["Attendance", "attendance"], ["Exams", "exams"], ["Private lessons", "lessons"]].map(([title, key]) => <Grid item xs={6} sm={4} md={2} key={key}><Card><CardContent><Typography color="text.secondary">{title}</Typography><Typography variant="h4">{counts[key]}</Typography></CardContent></Card></Grid>)}</Grid>
    <Card><Tabs value={tab} onChange={(_, value) => { setTab(value); setSearch(""); }} variant="scrollable" scrollButtons="auto">{Object.keys(collections).map((name) => <Tab key={name} value={name} label={name} />)}</Tabs>
      <CardContent><Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "space-between", alignItems: "center", mb: 2 }}><Typography variant="h6">{tab}</Typography><Box sx={{ display: "flex", gap: 1 }}><TextField size="small" label="Search records" value={search} onChange={(event) => setSearch(event.target.value)} /><Button variant="contained" onClick={openNew}>Add {tab === "Private lessons" ? "lesson" : tab === "Exams" ? "exam" : tab.slice(0, -1).toLowerCase()}</Button></Box></Box>
        {!visibleRows.length ? <Typography color="text.secondary">No matching records. Add one to get started.</Typography> : <Grid container spacing={2}>{visibleRows.map((row) => <Grid item xs={12} md={6} lg={4} key={row.id}><Card variant="outlined"><CardContent>
          {active.name === "students" ? <Link href={`/teacher-dashboard/students/${row.id}`} passHref legacyBehavior><Typography component="a" variant="h6" sx={{ mb: 1, display: "block", cursor: "pointer" }}>{row.name || "Student"}</Typography></Link> : <Typography variant="h6" sx={{ mb: 1 }}>{row.name || row.topic || row.lesson || "Record"}</Typography>}
          {active.name === "groups" && <Typography variant="body2" sx={{ mb: 1 }}><b>Students:</b> {students.filter((student) => student.groupId === row.id).map((student) => student.name).join(", ") || "No students assigned"}</Typography>}
          {active.name === "exams" && <><Typography variant="body2" sx={{ mb: 1 }}><b>Class:</b> {[row.grade, row.gradeYear && `Grade ${row.gradeYear}`, row.className && `Class ${row.className}`].filter(Boolean).join(" · ")} · <b>Maximum:</b> {row.maxScore}</Typography><Link href={`/teacher-dashboard/exams/${row.id}`} passHref legacyBehavior><Button component="a" size="small" variant="outlined" sx={{ mb: 1 }}>Open class roster and enter results</Button></Link></>}
          {active.fields.filter((field) => field !== "name").map((field) => { let value = row[field]; if (field === "groupId") value = labelFor(value, groups); if (field === "studentId") value = labelFor(value, students); if (field === "studentIds" && Array.isArray(value)) value = value.map((id) => labelFor(id, students)).join(", "); if (field === "privateLesson") return <Chip key={field} size="small" sx={{ mr: 1, mb: 1 }} label={value ? "Private lessons" : "Regular class"} />; if (value !== undefined && value !== "") return <Typography key={field} variant="body2" sx={{ mb: .5 }}><b>{readable(field)}:</b> {Array.isArray(value) ? value.join(", ") : String(value)}</Typography>; return null; })}
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}><Button size="small" variant="contained" onClick={() => openEdit(row)}>Edit</Button><Button size="small" variant="contained" color="error" onClick={() => requestDelete(row)}>Delete</Button></Box>
        </CardContent></Card></Grid>)}</Grid>}
      </CardContent></Card>
    <Dialog open={dialog} onClose={() => setDialog(false)} fullWidth maxWidth="sm"><DialogTitle>{editing ? "Edit" : "Add"} {tab === "Private lessons" ? "private lesson" : tab === "Exams" ? "exam" : tab.slice(0, -1).toLowerCase()}</DialogTitle><DialogContent sx={{ pt: "12px !important" }}>
      {active.fields.map((field) => {
        if (field === "groupId" || field === "studentId") { const options = field === "groupId" ? groups : students; return <TextField key={field} select fullWidth margin="normal" label={readable(field)} value={form[field] || ""} onChange={(event) => setField(field, event.target.value)}><MenuItem value="">None</MenuItem>{options.map((option) => <MenuItem key={option.id} value={option.id}>{option.name || option.id}</MenuItem>)}</TextField>; }
        if (field === "studentIds") return <TextField key={field} select fullWidth margin="normal" SelectProps={{ multiple: true }} label="Students" value={Array.isArray(form[field]) ? form[field] : []} onChange={(event) => setField(field, event.target.value)}>{students.map((student) => <MenuItem key={student.id} value={student.id}>{student.name}</MenuItem>)}</TextField>;
        if (field === "privateLesson") return <TextField key={field} select fullWidth margin="normal" label="Private lesson enrollment" value={String(form[field] || false)} onChange={(event) => setField(field, event.target.value)}><MenuItem value="false">No</MenuItem><MenuItem value="true">Yes</MenuItem></TextField>;
        if (field === "category") return <TextField key={field} select fullWidth margin="normal" label="Category" value={form[field] || ""} onChange={(event) => setField(field, event.target.value)}>{["Grammar", "Vocabulary", "Speaking", "Listening", "Reading", "Writing", "Other"].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>;
        if (field === "status") return <TextField key={field} select fullWidth margin="normal" label="Status" value={form[field] || "Present"} onChange={(event) => setField(field, event.target.value)}>{["Present", "Absent", "Excused"].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>;
        if (field === "grade") return <TextField key={field} select fullWidth margin="normal" label="Grade Type" value={form[field] || "Middle"} onChange={(event) => setField(field, event.target.value)}>{["Middle", "Senior"].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>;
        if (field === "gradeYear") return <TextField key={field} select fullWidth margin="normal" label="Grade" value={form[field] || "1"} onChange={(event) => setField(field, event.target.value)}>{["1", "2", "3"].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>;
        if (field === "className") return <TextField key={field} select fullWidth margin="normal" label="Class name" value={form[field] || "A"} onChange={(event) => setField(field, event.target.value)}>{["A", "B"].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>;
        if (field === "language") return <TextField key={field} select fullWidth margin="normal" label="Language" value={form[field] || "English"} onChange={(event) => setField(field, event.target.value)}>{["English", "French"].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>;
        const numeric = ["points", "capacity", "maxScore"].includes(field);
        return <TextField key={field} fullWidth margin="normal" label={readable(field)} type={field === "date" ? "date" : numeric ? "number" : "text"} multiline={field === "text" || field === "description" || field === "notes"} minRows={field === "text" || field === "description" || field === "notes" ? 3 : undefined} InputLabelProps={field === "date" ? { shrink: true } : undefined} value={form[field] ?? ""} onChange={(event) => setField(field, event.target.value)} />;
      })}
    </DialogContent><DialogActions><Button onClick={() => setDialog(false)}>Cancel</Button><Button variant="contained" onClick={save}>{editing ? "Save changes" : "Add"}</Button></DialogActions></Dialog>
    <Dialog open={deleteDialog} onClose={() => { setDeleteDialog(false); setDeletingRow(null); }}>
      <DialogTitle>Confirm deletion</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete “{deletingRow?.name || deletingRow?.topic || deletingRow?.lesson || "this record"}”? This action cannot be undone.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => { setDeleteDialog(false); setDeletingRow(null); }}>Cancel</Button>
        <Button color="error" variant="contained" onClick={remove}>Delete</Button>
      </DialogActions>
    </Dialog>
    <Snackbar open={Boolean(notice)} autoHideDuration={5000} onClose={() => setNotice("")}><Alert severity="error" onClose={() => setNotice("")}>{notice}</Alert></Snackbar>
  </Box>;
}
