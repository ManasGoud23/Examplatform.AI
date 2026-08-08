import { doc, getDoc, setDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export async function saveExam(examData, passedUserId) {
  const currentUid = auth.currentUser?.uid || passedUserId;
  if (!currentUid) throw new Error("User must be authenticated to save an exam.");

  const examId = examData.id || `exam-${Date.now()}`;
  const payload = {
    id: examId,
    userId: currentUid,
    title: examData.title || `${examData.subject || 'AI Exam'} (${examData.difficulty || 'Medium'})`,
    subject: examData.subject || 'General',
    difficulty: examData.difficulty || 'Medium',
    questions: examData.questions || [],
    createdAt: serverTimestamp()
  };

  const examRef = doc(db, 'exams', examId);
  await setDoc(examRef, payload);
  return { ...payload, id: examId };
}

export async function getExamById(examId) {
  if (!examId) return null;
  const examRef = doc(db, 'exams', examId);
  const examSnap = await getDoc(examRef);
  return examSnap.exists() ? { ...examSnap.data(), id: examSnap.id } : null;
}

export async function getUserExams(userId) {
  const targetUid = userId || auth.currentUser?.uid;
  if (!targetUid) return [];

  const examsRef = collection(db, 'exams');
  const q = query(examsRef, where('userId', '==', targetUid));
  const querySnap = await getDocs(q);
  const results = [];
  querySnap.forEach(doc => results.push({ ...doc.data(), id: doc.id }));
  return results;
}
