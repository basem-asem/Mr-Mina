import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { Alert, Box, Button, Card, CardContent, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import { auth, db } from "src/configs/firebaseConfig";

export default function ExamRoster() {
  const router = useRouter();
  const rawExamId = router.query.examId;
  const examId = Array.isArray(rawExamId) ? rawExamId[0] : rawExamId;
  const [authReady, setAuthReady] = useState(false);
  const [exam, setExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState({});
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [teacherId, setTeacherId] = useState(null);

  useEffect(() => onAuthStateChanged(auth, (user) => {
    setTeacherId(user?.uid || null);
    setAuthReady(true);
  }), []);

  useEffect(() => {
    if (!authReady || !teacherId || !examId) return undefined;
    setLoading(true);
    setError("");
    let examLoaded = false;
    let studentsLoaded = false;
    let resultsLoaded = false;
    const markLoaded = () => { if (examLoaded && studentsLoaded && resultsLoaded) setLoading(false); };
    const examUnsubscribe = onSnapshot(doc(db, "exams", examId), (snapshot) => {
      const record = snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
      setExam(record);
      examLoaded = true;
      markLoaded();
    }, (loadError) => { console.error(loadError); setError("Could not load this exam. Check Firestore permissions."); examLoaded = true; markLoaded(); });
    const studentsUnsubscribe = onSnapshot(query(collection(db, "students")), (snapshot) => {
      setStudents(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
      studentsLoaded = true;
      markLoaded();
    }, (loadError) => { console.error(loadError); setError("Could not load the student roster. Check Firestore permissions."); studentsLoaded = true; markLoaded(); });
    const resultsUnsubscribe = onSnapshot(query(collection(db, "examResults"), where("examId", "==", examId)), (snapshot) => {
      const next = Object.fromEntries(snapshot.docs.map((item) => [item.data().studentId, { id: item.id, ...item.data() }]));
      setResults(next);
      setScores(Object.fromEntries(Object.entries(next).map(([studentId, result]) => [studentId, String(result.score ?? "")])));
      resultsLoaded = true;
      markLoaded();
    }, (loadError) => { console.error(loadError); setError("Could not load exam results. Deploy the Firestore indexes and check your rules."); resultsLoaded = true; markLoaded(); });
    return () => { examUnsubscribe(); studentsUnsubscribe(); resultsUnsubscribe(); };
  }, [authReady, teacherId, examId]);

  const roster = useMemo(() => students.filter((student) => student.grade === exam?.grade && String(student.gradeYear || "") === String(exam?.gradeYear || "") && student.className === exam?.className && student.language === exam?.language).sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""))), [students, exam]);

  const saveResults = async () => {
    if (!teacherId || !exam || !examId) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await Promise.all(roster.filter((student) => scores[student.id] !== undefined && scores[student.id] !== "").map((student) => {
        const score = Number(scores[student.id]);
        if (!Number.isFinite(score) || score < 0 || score > Number(exam.maxScore)) throw new Error(`Enter a score from 0 to ${exam.maxScore} for ${student.name}.`);
        const resultId = `${examId}_${student.id}`;
        return setDoc(doc(db, "examResults", resultId), {
          examId,
          studentId: student.id,
          name: exam.name,
          score,
          maxScore: Number(exam.maxScore),
          date: exam.date || "",
          updatedAt: new Date().toISOString(),
          ...(results[student.id]?.createdAt ? {} : { createdAt: new Date().toISOString() }),
        }, { merge: true });
      }));
      setMessage("Exam results saved.");
    } catch (saveError) {
      console.error(saveError);
      setError(saveError.message || "Could not save exam results. Check Firestore permissions.");
    } finally {
      setSaving(false);
    }
  };

  if (!router.isReady || !authReady || loading) return <Box sx={{ display: "grid", placeItems: "center", minHeight: "40vh" }}><CircularProgress /></Box>;
  if (!teacherId) return <Alert severity="warning">Sign in to enter exam results.</Alert>;
  if (error && !exam) return <Alert severity="error">{error}</Alert>;
  if (!exam) return <Alert severity="warning">Exam not found. <Link href="/dashboard">Return to the dashboard.</Link></Alert>;

  return <Box>
    <Link href="/dashboard" passHref legacyBehavior><Button component="a" sx={{ mb: 2 }}>← Back to dashboard</Button></Link>
    <Typography variant="h4" sx={{ mb: 1 }}>{exam.name}</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>
      {[exam.grade, exam.gradeYear && `Grade ${exam.gradeYear}`, exam.className && `Class ${exam.className}`].filter(Boolean).join(" · ")} · Maximum score: {exam.maxScore}
    </Typography>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
    <Card><CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>Students in this class</Typography>
      {!roster.length ? <Typography color="text.secondary">No students match this grade type, grade, and class name yet.</Typography> : <Grid container spacing={2}>
        {roster.map((student) => <Grid item xs={12} sm={6} md={4} key={student.id}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography sx={{ flex: 1 }}>{student.name || "Student"}</Typography>
            <TextField label={`Score / ${exam.maxScore}`} type="number" size="small" inputProps={{ min: 0, max: Number(exam.maxScore), step: "any" }} value={scores[student.id] ?? ""} onChange={(event) => setScores((current) => ({ ...current, [student.id]: event.target.value }))} />
            {results[student.id] && <Link href={`/students/${student.id}`} passHref legacyBehavior><Button component="a" size="small">Profile</Button></Link>}
          </Box>
        </Grid>)}
      </Grid>}
      {roster.length > 0 && <Button variant="contained" sx={{ mt: 3 }} onClick={saveResults} disabled={saving}>{saving ? "Saving…" : "Save results"}</Button>}
    </CardContent></Card>
  </Box>;
}
