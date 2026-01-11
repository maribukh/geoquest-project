import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { BugReport } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'bugs'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedBugs: BugReport[] = [];
      snapshot.forEach((doc) => {
        fetchedBugs.push({ id: doc.id, ...doc.data() } as BugReport);
      });
      setBugs(fetchedBugs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleResolve = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'fixed' : 'open';
    const bugRef = doc(db, 'bugs', id);
    await updateDoc(bugRef, { status: newStatus });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this report?')) {
      await deleteDoc(doc(db, 'bugs', id));
    }
  };

  return (
    <div className='fixed inset-0 z-[5000] bg-slate-100 flex flex-col animate-slide-up'>
      <div className='bg-slate-900 p-4 text-white flex justify-between items-center shadow-lg'>
        <div>
          <h2 className='font-mono text-xl font-bold text-emerald-400'>
            ADMIN_CONSOLE
          </h2>
          <p className='text-xs text-slate-400'>System Monitoring</p>
        </div>
        <button
          onClick={onClose}
          className='px-4 py-2 bg-slate-700 rounded hover:bg-slate-600'
        >
          Close
        </button>
      </div>

      <div className='flex-1 overflow-y-auto p-4'>
        {loading ? (
          <div className='text-center p-10 text-slate-500'>
            Loading reports...
          </div>
        ) : bugs.length === 0 ? (
          <div className='text-center p-10 text-emerald-600 font-bold'>
            No bugs reported! 🎉
          </div>
        ) : (
          <div className='space-y-4'>
            {bugs.map((bug) => (
              <div
                key={bug.id}
                className={`p-4 rounded-lg border-l-4 shadow-sm bg-white ${
                  bug.status === 'fixed'
                    ? 'border-emerald-500 opacity-60'
                    : 'border-red-500'
                }`}
              >
                <div className='flex justify-between items-start mb-2'>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                      bug.status === 'fixed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {bug.status}
                  </span>
                  <span className='text-xs text-slate-400 font-mono'>
                    {bug.timestamp?.toDate
                      ? bug.timestamp.toDate().toLocaleString()
                      : 'Just now'}
                  </span>
                </div>

                <p className='text-slate-800 font-medium mb-3'>
                  {bug.description}
                </p>

                <div className='text-xs text-slate-500 font-mono bg-slate-50 p-2 rounded mb-3 break-all'>
                  User: {bug.userEmail || bug.userId}
                  <br />
                  Device: {bug.device}
                </div>

                <div className='flex gap-2'>
                  <button
                    onClick={() => handleResolve(bug.id, bug.status)}
                    className={`flex-1 py-2 rounded text-xs font-bold text-white ${
                      bug.status === 'fixed' ? 'bg-slate-400' : 'bg-emerald-600'
                    }`}
                  >
                    {bug.status === 'fixed' ? 'Re-open' : 'Mark Fixed'}
                  </button>
                  <button
                    onClick={() => handleDelete(bug.id)}
                    className='px-4 py-2 bg-red-50 text-red-600 rounded text-xs font-bold border border-red-100'
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
