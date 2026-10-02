import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Alert, Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, Grid, LinearProgress, Typography } from "@mui/material";
import { auth, db } from "src/configs/firebaseConfig";

const sections = [
  { title: "Students", path: "/students", color: "#6c63ff", short: "S" },
  { title: "Exams", path: "/exams", color: "#168a8a", short: "E" },
  { title: "Notes", path: "/notes", color: "#d28b27", short: "N" },
  { title: "Attendance", path: "/attendance", color: "#dc6075", short: "A" },
  { title: "Groups", path: "/groups", color: "#5686dc", short: "G" },
  { title: "Private lessons", path: "/lessons", color: "#9c59a9", short: "L" },
];

export default function TeacherDashboard() {
  const [uid, setUid] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => onAuthStateChanged(auth, (user) => { setUid(user?.uid || null); setAuthReady(true); }), []);
  useEffect(() => {
    if (!uid) { setLoading(false); return undefined; }
    setLoading(true);
    const names = ["students", "exams", "examResults", "notes", "attendance", "groups", "lessons"];
    const loaded = new Set();
    const unsubscribers = names.map((name) => onSnapshot(query(collection(db, name)), (snapshot) => {
      setData((current) => ({ ...current, [name]: snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) }));
      loaded.add(name);
      if (loaded.size === names.length) setLoading(false);
    }, (snapshotError) => { console.error(snapshotError); setError("Some dashboard data could not be loaded. Check your Firestore rules."); loaded.add(name); if (loaded.size === names.length) setLoading(false); }));
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [uid]);

  const students = data.students || [];
  const studentNames = useMemo(() => Object.fromEntries(students.map((student) => [student.id, student.name || "Student"])), [students]);
  const leaderboard = useMemo(() => {
    const standings = {};
    (data.examResults || []).forEach((result) => {
      const maxScore = Number(result.maxScore);
      const score = Number(result.score);
      if (!result.studentId || !Number.isFinite(score) || !(maxScore > 0)) return;
      if (!standings[result.studentId]) standings[result.studentId] = { totalPercent: 0, exams: 0, bestPercent: 0 };
      const percent = Math.max(0, Math.min(100, (score / maxScore) * 100));
      standings[result.studentId].totalPercent += percent;
      standings[result.studentId].exams += 1;
      standings[result.studentId].bestPercent = Math.max(standings[result.studentId].bestPercent, percent);
    });
    return Object.entries(standings).map(([studentId, result]) => ({ studentId, name: studentNames[studentId] || "Student", average: result.totalPercent / result.exams, exams: result.exams, best: result.bestPercent }))
      .sort((a, b) => b.average - a.average || b.exams - a.exams || a.name.localeCompare(b.name)).slice(0, 5);
  }, [data.examResults, studentNames]);
  const recentResults = useMemo(() => [...(data.examResults || [])].sort((a, b) => String(b.updatedAt || b.date || b.createdAt || "").localeCompare(String(a.updatedAt || a.date || a.createdAt || ""))).slice(0, 5), [data.examResults]);
  const classAverage = useMemo(() => {
    const results = data.examResults || [];
    const percents = results.map((result) => Number(result.maxScore) > 0 ? (Number(result.score) / Number(result.maxScore)) * 100 : null).filter((value) => value !== null && Number.isFinite(value));
    return percents.length ? Math.round(percents.reduce((sum, value) => sum + value, 0) / percents.length) : 0;
  }, [data.examResults]);

  if (!authReady || loading) return <Box sx={{ display: "grid", placeItems: "center", minHeight: "50vh" }}><CircularProgress /></Box>;
  if (!uid) return <Alert severity="warning">Sign in to use the teacher dashboard.</Alert>;

  const stats = [
    ["Students", students.length, "Your active roster", "#6c63ff"],
    ["Exams", (data.exams || []).length, "Assessments created", "#168a8a"],
    ["Class average", `${classAverage}%`, `${(data.examResults || []).length} recorded results`, "#d28b27"],
    ["Learning notes", (data.notes || []).length, "Notes saved for students", "#dc6075"],
  ];

  return <Box sx={{ pb: 4 }}>
    <Card sx={{ mb: 3, overflow: "hidden", color: "common.white", background: "linear-gradient(115deg, #1c2853 0%, #4149a8 58%, #8e61c5 100%)" }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Typography color="common.white" variant="overline" sx={{ letterSpacing: 2, opacity: 0.8 }}>YOUR TEACHING SPACE</Typography>
        <Typography color="common.white" variant="h3" sx={{ fontWeight: 800, mt: 0.5, mb: 1 }}>Hello, Mr. Mina <span aria-hidden="true">👋</span></Typography>
        <Typography sx={{ maxWidth: 620, opacity: 0.88, mb: 3 , color: "common.white"}}>A clear view of your classes, student progress, and the little wins that make great English learners.</Typography>
        <Button component="a" href="/students" variant="contained" sx={{ bgcolor: "common.white", color: "#343d8f", fontWeight: 700, "&:hover": { bgcolor: "#343d8f", color: "#fff" } }}>Open student roster</Button>
      </CardContent>
    </Card>

    {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}
    <Grid container spacing={2} sx={{ mb: 3 }}>{stats.map(([title, value, caption, color]) => <Grid item xs={6} md={3} key={title}><Card sx={{ height: "100%" }}><CardContent><Box sx={{ width: 36, height: 4, bgcolor: color, borderRadius: 2, mb: 1.5 }} /><Typography color="text.secondary" variant="body2">{title}</Typography><Typography variant="h4" sx={{ fontWeight: 750, my: 0.5 }}>{value}</Typography><Typography variant="caption" color="text.secondary">{caption}</Typography></CardContent></Card></Grid>)}</Grid>

    <Typography variant="h5" sx={{ fontWeight: 750, mb: 1.5 }}>Your workspace</Typography>
    <Grid container spacing={1.5} sx={{ mb: 3 }}>{sections.map((section) => <Grid item xs={6} sm={4} md={2} key={section.title}><Button component="a" href={section.path} fullWidth sx={{ justifyContent: "flex-start", gap: 1.25, py: 1.5, px: 1.5, bgcolor: "background.paper", boxShadow: 1, color: "text.primary", "&:hover": { bgcolor: "action.hover" } }}><Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: section.color }}>{section.short}</Avatar><Typography variant="body2" fontWeight={650} noWrap>{section.title}</Typography></Button></Grid>)}</Grid>

    <Grid container spacing={2}>
      <Grid item xs={12} md={7}><Card sx={{ height: "100%" }}><CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}><Box><Typography variant="h6" fontWeight={750}>Top students · all time</Typography><Typography variant="body2" color="text.secondary">Ranked by average percentage across recorded exams</Typography></Box><Chip label="🏆 Leaderboard" color="primary" variant="outlined" /></Box>
        {!leaderboard.length ? <Typography color="text.secondary" sx={{ py: 3 }}>Save exam results to start the leaderboard.</Typography> : leaderboard.map((student, index) => <Box key={student.studentId} sx={{ display: "flex", gap: 1.5, alignItems: "center", py: 1.25, borderTop: index ? 1 : 0, borderColor: "divider" }}>
          <Avatar sx={{ width: 38, height: 38, bgcolor: index === 0 ? "warning.light" : "action.selected", color: index === 0 ? "warning.dark" : "text.primary", fontWeight: 700 }}>{index === 0 ? "★" : index + 1}</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}><Typography fontWeight={650} noWrap>{student.name}</Typography><Typography variant="caption" color="text.secondary">{student.exams} {student.exams === 1 ? "exam" : "exams"} · best {Math.round(student.best)}%</Typography><LinearProgress variant="determinate" value={student.average} sx={{ mt: 0.75, height: 6, borderRadius: 5 }} /></Box>
          <Typography variant="h6" fontWeight={750}>{Math.round(student.average)}%</Typography>
        </Box>)}
      </CardContent></Card></Grid>
      <Grid item xs={12} md={5}><Card sx={{ height: "100%" }}><CardContent>
        <Typography variant="h6" fontWeight={750} sx={{ mb: 0.5 }}>Recent exam results</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Latest scores added to your classes</Typography>
        {!recentResults.length ? <Typography color="text.secondary" sx={{ py: 3 }}>No exam results yet.</Typography> : recentResults.map((result) => <Box key={result.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1, py: 1.4, borderTop: 1, borderColor: "divider" }}><Box sx={{ minWidth: 0 }}><Typography fontWeight={650} noWrap>{studentNames[result.studentId] || "Student"}</Typography><Typography variant="caption" color="text.secondary" noWrap>{result.name || "Exam"}{result.date ? ` · ${result.date}` : ""}</Typography></Box><Chip size="small" label={`${result.score ?? "—"}/${result.maxScore ?? "—"}`} color="primary" variant="outlined" /></Box>)}
      </CardContent></Card></Grid>
    </Grid>
  </Box>;
}
