import { doc, getDoc, setDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export async function saveExamResult(resultData) {
  const currentUid = auth.currentUser?.uid || resultData.userId;
  if (!currentUid) throw new Error("User must be authenticated to save exam results.");

  const resultId = resultData.id || `result-${Date.now()}`;
  const payload = {
    id: resultId,
    userId: currentUid,
    examId: resultData.examId || '',
    examTitle: resultData.examTitle || 'Exam',
    examSubject: resultData.examSubject || 'General',
    examDifficulty: resultData.examDifficulty || 'Medium',
    score: resultData.score || 0,
    totalScore: resultData.totalScore || 0,
    percentage: resultData.percentage || 0,
    correctAnswers: resultData.correctAnswersCount !== undefined ? resultData.correctAnswersCount : resultData.score,
    wrongAnswers: resultData.wrongAnswersCount !== undefined ? resultData.wrongAnswersCount : (resultData.totalScore - resultData.score),
    correctAnswersCount: resultData.correctAnswersCount !== undefined ? resultData.correctAnswersCount : resultData.score,
    wrongAnswersCount: resultData.wrongAnswersCount !== undefined ? resultData.wrongAnswersCount : (resultData.totalScore - resultData.score),
    timeSpentSeconds: resultData.timeSpentSeconds || 0,
    answers: resultData.answers || [],
    completedAt: serverTimestamp()
  };

  const resultRef = doc(db, 'results', resultId);
  await setDoc(resultRef, payload);
  return { ...payload, id: resultId };
}

export async function getResultById(resultId) {
  if (!resultId) return null;
  const resultRef = doc(db, 'results', resultId);
  const resultSnap = await getDoc(resultRef);
  return resultSnap.exists() ? { ...resultSnap.data(), id: resultSnap.id } : null;
}

export async function getUserResults(userId) {
  const targetUid = userId || auth.currentUser?.uid;
  if (!targetUid) return [];

  try {
    const resultsRef = collection(db, 'results');
    const q = query(resultsRef, where('userId', '==', targetUid));
    const querySnap = await getDocs(q);
    const results = [];
    querySnap.forEach(doc => results.push({ ...doc.data(), id: doc.id }));
    return results.sort((a, b) => {
      const timeA = a.completedAt?.toDate ? a.completedAt.toDate() : new Date(a.completedAt || 0);
      const timeB = b.completedAt?.toDate ? b.completedAt.toDate() : new Date(b.completedAt || 0);
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error getting user results from Firestore:", error);
    return [];
  }
}
