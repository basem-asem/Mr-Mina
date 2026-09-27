import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Link from "next/link";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { onAuthStateChanged as onFirebaseAuthStateChanged } from "firebase/auth";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import { auth, db } from "src/configs/firebaseConfig";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function StudentProfile() {
  const router = useRouter();
  const rawStudentId = router.query.studentId;
  const studentId = Array.isArray(rawStudentId) ? rawStudentId[0] : rawStudentId;
  const [teacherId, setTeacherId] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [student, setStudent] = useState(null);
  const [groups, setGroups] = useState([]);
  const [exams, setExams] = useState([]);
  const [notes, setNotes] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => onFirebaseAuthStateChanged(auth, (user) => {
    setTeacherId(user?.uid || null);
    setAuthReady(true);
  }), []);

  useEffect(() => {
    if (!authReady || !teacherId || !studentId) return undefined;
    setLoaded(false);
    setLoadError("");
    const initiallyLoaded = new Set();
    const markLoaded = (key) => {
      initiallyLoaded.add(key);
      if (initiallyLoaded.size === 5) setLoaded(true);
    };
    const scopedCollection = (name, extra = []) => query(
      collection(db, name),
      where("teacherId", "==", teacherId),
      ...extra
    );
    const subscribe = (key, ref, onData) => onSnapshot(ref, (snapshot) => {
      onData(snapshot);
      markLoaded(key);
    }, (error) => {
      console.error(`Failed to load student ${key}`, error);
      setLoadError("Could not load this student’s records. Check Firestore rules and indexes.");
      markLoaded(key);
    });
    const unsubscribers = [
      subscribe("student", scopedCollection("students"), (snapshot) => {
        const record = snapshot.docs.find((item) => item.id === studentId);
        setStudent(record ? { id: record.id, ...record.data() } : null);
      }),
      subscribe("groups", scopedCollection("groups"), (snapshot) => {
        setGroups(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      }),
      subscribe("exams", scopedCollection("examResults", [where("studentId", "==", studentId)]), (snapshot) => {
        setExams(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      }),
      subscribe("notes", scopedCollection("notes", [where("studentId", "==", studentId)]), (snapshot) => {
        setNotes(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      }),
      subscribe("attendance", scopedCollection("attendance", [where("studentId", "==", studentId)]), (snapshot) => {
        setAttendance(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      }),
    ];
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [authReady, teacherId, studentId]);

  const group = groups.find((item) => item.id === student?.groupId);
  const sortedExams = useMemo(() => [...exams].sort((a, b) => String(a.date || "").localeCompare(String(b.date || ""))), [exams]);
  const chartOptions = {
    chart: { toolbar: { show: false } },
    xaxis: { categories: sortedExams.map((exam) => exam.date || exam.name || "Exam") },
    yaxis: { min: 0, max: 100, title: { text: "Score (%)" } },
    dataLabels: { enabled: true },
    colors: ["#7367F0"],
    stroke: { curve: "smooth", width: 3 },
  };
  const chartSeries = [{
    name: "Score (%)",
    data: sortedExams.map((exam) => exam.maxScore
      ? Math.round((Number(exam.score) / Number(exam.maxScore)) * 100)
      : Number(exam.score) || 0),
  }];

  if (!router.isReady || !authReady || !loaded) return <Box sx={{ display: "grid", placeItems: "center", minHeight: "40vh" }}><CircularProgress /></Box>;
  if (!teacherId) return <Alert severity="warning">Sign in to view student records.</Alert>;
  if (loadError) return <Alert severity="error">{loadError}</Alert>;
  if (!student) return <Alert severity="warning">Student not found. <Link href="/teacher-dashboard">Return to the teacher dashboard.</Link></Alert>;

  return <Box>
    <Link href="/teacher-dashboard" passHref legacyBehavior>
      <Button component="a" sx={{ mb: 2 }}>← Back to teacher dashboard</Button>
    </Link>
    <Typography variant="h4" sx={{ mb: 1 }}>{student.name || "Student"}</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>
      {[student.grade, student.gradeYear && `Year ${student.gradeYear}`, student.className && `Class ${student.className}`].filter(Boolean).join(" · ")}
    </Typography>
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}><Card><CardContent>
        <Typography variant="h6">Student details</Typography>
        <Typography sx={{ mt: 1 }}>Language: {student.language || "—"}</Typography>
        <Typography>Group: {group?.name || "Not assigned"}</Typography>
        <Typography>Private lessons: {student.privateLesson ? "Yes" : "No"}</Typography>
      </CardContent></Card></Grid>
      <Grid item xs={12} md={8}><Card><CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Exam results</Typography>
        {sortedExams.length ? <Chart options={chartOptions} series={chartSeries} type="line" height={300} /> : <Typography color="text.secondary">No exam results yet. Add results from the dashboard Exams tab.</Typography>}
        {sortedExams.map((exam) => <Typography key={exam.id} variant="body2">{exam.date || "Undated"} · {exam.name || "Exam"}: {exam.score}/{exam.maxScore || 100}</Typography>)}
      </CardContent></Card></Grid>
      {[
        ["Learning notes", notes, (item) => `${item.date || ""} ${item.category || ""} ${item.topic || ""}: ${item.text || ""}`],
        ["Attendance", attendance, (item) => `${item.date || ""} · ${item.status || ""}${item.lesson ? ` · ${item.lesson}` : ""}`],
      ].map(([title, items, label]) => <Grid item xs={12} md={6} key={title}><Card><CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography>
        {items.length ? items.map((item) => <Typography key={item.id} variant="body2" sx={{ mb: 1 }}>{label(item)}</Typography>) : <Typography color="text.secondary">No records yet.</Typography>}
      </CardContent></Card></Grid>)}
    </Grid>
  </Box>;
}
