import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { auth, db } from "src/configs/firebaseConfig";
import { defaultsFor, emptyForm, recordSections, valueForField } from "./recordConfig";

export default function useTeacherRecords(section) {
  const config = recordSections[section];
  const [uid, setUid] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => onAuthStateChanged(auth, (user) => { setUid(user?.uid || null); setAuthReady(true); }), []);
  useEffect(() => {
    if (!uid) { setLoading(false); return undefined; }
    setLoading(true);
    const names = Object.values(recordSections).map(({ name }) => name);
    const loaded = new Set();
    const unsubscribers = names.map((name) => onSnapshot(query(collection(db, name)), (snapshot) => {
      setData((current) => ({ ...current, [name]: snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) }));
      loaded.add(name);
      if (loaded.size === names.length) setLoading(false);
    }, (loadError) => {
      console.error(loadError);
      setError("Could not load dashboard data. Check your Firestore rules.");
      loaded.add(name);
      if (loaded.size === names.length) setLoading(false);
    }));
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [uid]);

  const openNew = () => { setEditing(null); setForm({ ...emptyForm(config.fields), ...defaultsFor(config.name) }); setDialog(true); };
  const openEdit = (row) => {
    const defaults = defaultsFor(config.name);
    setEditing(row.id);
    setForm(Object.fromEntries(config.fields.map((field) => [field, valueForField(field, row[field], defaults)])));
    setDialog(true);
  };
  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const save = async () => {
    if (!uid) return;
    if (config.name === "exams" && (!form.name?.trim() || !(Number(form.maxScore) > 0))) {
      setNotice("For an exam, enter a name and a maximum score greater than zero.");
      return;
    }
    const defaults = defaultsFor(config.name);
    const normalizedForm = { ...defaults, ...form };
    const values = { ...normalizedForm, updatedAt: new Date().toISOString() };
    if (config.name === "students") {
      values.gradeYear = String(normalizedForm.gradeYear || defaults.gradeYear);
      values.privateLesson = normalizedForm.privateLesson === true || normalizedForm.privateLesson === "true";
    }
    if (config.name === "groups") values.points = Number(form.points) || 0;
    if (config.name === "exams") {
      values.gradeYear = String(normalizedForm.gradeYear || defaults.gradeYear);
      values.maxScore = Number(normalizedForm.maxScore) || 0;
    }
    if (config.name === "lessons") values.capacity = Number(form.capacity) || 0;
    if (!editing) values.createdAt = new Date().toISOString();
    try {
      if (editing) await updateDoc(doc(db, config.name, editing), values);
      else await addDoc(collection(db, config.name), values);
      setDialog(false);
    } catch (saveError) {
      console.error(saveError);
      setNotice("Save failed. Check your Firestore rules and connection.");
    }
  };

  const requestDelete = (row) => { setDeletingRow(row); setDeleteDialog(true); };
  const remove = async () => {
    if (!deletingRow) return;
    try {
      await deleteDoc(doc(db, config.name, deletingRow.id));
      setDeleteDialog(false);
      setDeletingRow(null);
    } catch (deleteError) {
      console.error(deleteError);
      setNotice("Delete failed. Check your Firestore rules and connection.");
    }
  };

  return { uid, authReady, data, loading, config, dialog, setDialog, deleteDialog, setDeleteDialog, deletingRow, setDeletingRow, editing, form, setField, notice, setNotice, error, search, setSearch, openNew, openEdit, save, requestDelete, remove };
}
