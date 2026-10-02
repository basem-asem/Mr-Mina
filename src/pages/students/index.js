import { useCallback, useState } from "react";
import RecordsPage from "src/@core/components/dashboard/RecordsPage";

const emptyFilters = { grade: "", gradeYear: "", className: "", language: "", privateLesson: "" };

export default function StudentsPage() {
  const [filters, setFilters] = useState(emptyFilters);
  const matchesStudent = useCallback((student, selected) => (
    (!selected.grade || String(student.grade || "") === selected.grade)
    && (!selected.gradeYear || String(student.gradeYear || "") === selected.gradeYear)
    && (!selected.className || String(student.className || "") === selected.className)
    && (!selected.language || String(student.language || "") === selected.language)
    && (!selected.privateLesson || String(student.privateLesson === true || student.privateLesson === "true") === selected.privateLesson)
  ), []);

  return <RecordsPage section="Students" studentFilters={filters} onStudentFiltersChange={setFilters} matchesStudent={matchesStudent} />;
}
