import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export default function FeedbackReport() {
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        if (db) {
          const q = query(collection(db, 'feedbacks'), orderBy('createdAt', 'desc'), limit(50));
          const snap = await getDocs(q);
          const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setList(arr);
          return;
        }
      } catch (err) {
        console.error('Firestore read failed', err);
      }

      // fallback to localStorage
      const feedbacks = JSON.parse(localStorage.getItem('interviewFeedbacks') || '[]');
      setList(feedbacks.reverse().slice(0,50));
    })();
  }, []);

  if (list.length === 0) return <div>No feedback submitted yet.</div>;

  return (
    <div>
      <h2>Feedback Report</h2>
      <ul>
        {list.map((f, idx) => (
          <li key={f.id || idx}><strong>{f.candidateEmail}</strong>: {f.comments || f.recommendation || 'No comments'}</li>
        ))}
      </ul>
    </div>
  );
}
