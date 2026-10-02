import { useMemo } from "react";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar, Typography } from "@mui/material";
import useTeacherRecords from "./useTeacherRecords";
import RecordCard from "./RecordCard";
import RecordFormDialog from "./RecordFormDialog";
import StudentFilters from "./StudentFilters";
import SearchField from "src/@core/components/SearchField";

const labelFor = (id, rows) => rows.find((item) => item.id === id)?.name || id || "";

export default function RecordsPage({ section, studentFilters, onStudentFiltersChange, matchesStudent }) {
  const records = useTeacherRecords(section);
  const { uid, authReady, data, loading, config, dialog, setDialog, deleteDialog, setDeleteDialog, deletingRow, setDeletingRow, editing, form, setField, notice, setNotice, error, search, setSearch, openNew, openEdit, save, requestDelete, remove } = records;
  const students = data.students || [];
  const groups = data.groups || [];
  const rows = data[config.name] || [];
  const filteredRows = useMemo(() => rows.filter((row) => {
    const groupName = labelFor(row.groupId, groups);
    const studentName = labelFor(row.studentId, students);
    const groupMembers = section === "Groups" ? students.filter((student) => student.groupId === row.id).map((student) => student.name).join(" ") : "";
    const matchesSearch = `${Object.values(row).join(" ")} ${groupName} ${studentName} ${groupMembers}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (section !== "Students" || !matchesStudent || matchesStudent(row, studentFilters));
  }), [rows, search, groups, students, section, studentFilters, matchesStudent]);

  if (!authReady || loading) return <Box sx={{ display: "grid", placeItems: "center", minHeight: "50vh" }}><CircularProgress /></Box>;
  if (!uid) return <Alert severity="warning">Sign in to use the teacher dashboard.</Alert>;

  return <Box>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <Box><Typography variant="h4" sx={{ mb: 0.5 }}>{section}</Typography><Typography color="text.secondary">Manage your {section.toLowerCase()} and keep your class organized.</Typography></Box>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", width: { xs: "100%", sm: "auto" } }}><SearchField value={search} onChange={setSearch} placeholder={`Search ${section.toLowerCase()}`} /><Button variant="contained" onClick={openNew}>Add {section === "Private lessons" ? "lesson" : section === "Exams" ? "exam" : section.slice(0, -1).toLowerCase()}</Button></Box>
    </Box>
    {section === "Students" && <StudentFilters rows={rows} value={studentFilters} onChange={onStudentFiltersChange} />}
    {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
    <Card><CardContent>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{rows.length ? `${rows.length} total · ${filteredRows.length} shown` : "No records yet"}</Typography>
      {!filteredRows.length ? <Typography color="text.secondary">No matching records. Adjust the search or filters, or add a record.</Typography> : <Grid container spacing={2}>{filteredRows.map((row) => <Grid item xs={12} sm={6} md={4} lg={3} key={row.id}><RecordCard section={section} row={row} students={students} groups={groups} onEdit={openEdit} onDelete={requestDelete} /></Grid>)}</Grid>}
    </CardContent></Card>
    <RecordFormDialog section={section} config={config} open={dialog} onClose={() => setDialog(false)} editing={editing} form={form} setField={setField} onSave={save} students={students} groups={groups} />
    <Dialog open={deleteDialog} onClose={() => { setDeleteDialog(false); setDeletingRow(null); }}><DialogTitle>Confirm deletion</DialogTitle><DialogContent><Typography>Are you sure you want to delete “{deletingRow?.name || deletingRow?.topic || deletingRow?.lesson || "this record"}”? This action cannot be undone.</Typography></DialogContent><DialogActions><Button onClick={() => { setDeleteDialog(false); setDeletingRow(null); }}>Cancel</Button><Button color="error" variant="contained" onClick={remove}>Delete</Button></DialogActions></Dialog>
    <Snackbar open={Boolean(notice)} autoHideDuration={5000} onClose={() => setNotice("")}><Alert severity="error" onClose={() => setNotice("")}>{notice}</Alert></Snackbar>
  </Box>;
}
