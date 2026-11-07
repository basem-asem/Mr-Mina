const escapeHtml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

export default function exportStudentsWord({ students, exams = [], examResults = [] }) {
  const selectedExams = [...exams]
    .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")) || String(a.name || "").localeCompare(String(b.name || "")));

  const resultByKey = Object.fromEntries(
    examResults.map((result) => [`${result.examId}_${result.studentId}`, result])
  );

  const examHeaders = selectedExams.map((exam) => (
    `<th style="border:1px solid #000;padding:8px;background:#f0f0f0;vertical-align:bottom;">${escapeHtml(exam.name || "Exam")}${exam.maxScore ? `<br/><span style="font-weight:normal;font-size:11px;">/ ${escapeHtml(exam.maxScore)}</span>` : ""}</th>`
  )).join("");

  const bodyRows = students.map((student) => {
    const examCells = selectedExams.map((exam) => {
      const result = resultByKey[`${exam.id}_${student.id}`];
      const scoreText = result && result.score !== undefined && result.score !== null && result.score !== ""
        ? `${result.score}${exam.maxScore || result.maxScore ? ` / ${exam.maxScore || result.maxScore}` : ""}`
        : "";
      return `<td style="border:1px solid #000;padding:8px;text-align:center;vertical-align:top;">${escapeHtml(scoreText)}</td>`;
    }).join("");

    return `<tr>
      <td style="border:1px solid #000;padding:8px;vertical-align:top;width:18%;">${escapeHtml(student.name || "Student")}</td>
      ${examCells || `<td style="border:1px solid #000;padding:8px;vertical-align:top;"></td>`}
      <td style="border:1px solid #000;padding:8px;vertical-align:top;width:28%;min-height:48px;">&nbsp;</td>
    </tr>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8" />
<title>Filtered students</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
  body { font-family: Arial, sans-serif; font-size: 12pt; }
  table { border-collapse: collapse; width: 100%; }
</style>
</head>
<body>
<h2>Students report</h2>
<table>
  <thead>
    <tr>
      <th style="border:1px solid #000;padding:8px;background:#f0f0f0;text-align:left;">Student name</th>
      ${examHeaders || `<th style="border:1px solid #000;padding:8px;background:#f0f0f0;">Exam results</th>`}
      <th style="border:1px solid #000;padding:8px;background:#f0f0f0;text-align:left;width:28%;">Notes</th>
    </tr>
  </thead>
  <tbody>
    ${bodyRows || `<tr><td colspan="${Math.max(selectedExams.length, 1) + 2}" style="border:1px solid #000;padding:8px;">No students</td></tr>`}
  </tbody>
</table>
</body>
</html>`;

  const blob = new Blob(["\ufeff", html], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `students-${stamp}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
