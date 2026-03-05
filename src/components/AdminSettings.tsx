import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Report, User } from '../types';

const AdminSettings: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'reports'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report)));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
    };
    fetchUsers();
  }, []);

  const toggleModerator = async (user: User) => {
    const newRole = user.role === 'Moderator' ? 'Tourist' : 'Moderator';
    await updateDoc(doc(db, 'users', user.id), { role: newRole });
    setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 space-y-8">
      <h3 className="text-xl font-bold">Admin Settings</h3>
      
      <div>
        <h4 className="text-lg font-bold mb-4">Manage Moderators</h4>
        <div className="space-y-4">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-xl">
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-secondary">{user.role}</p>
              </div>
              <button 
                onClick={() => toggleModerator(user)}
                className={`px-4 py-2 rounded-xl text-xs font-bold ${user.role === 'Moderator' ? 'bg-red-500/10 text-red-500' : 'bg-accent/10 text-accent'}`}
              >
                {user.role === 'Moderator' ? 'Demote' : 'Promote'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-bold mb-4">Reported Posts</h4>
        <div className="space-y-4">
          {reports.map(report => (
            <div key={report.id} className="p-4 border border-border rounded-xl">
              <p className="text-sm font-semibold">Post ID: {report.postId}</p>
              <p className="text-sm text-secondary">Reason: {report.reason}</p>
              <p className="text-xs text-secondary">Reporter ID: {report.reporterId}</p>
              <p className="text-xs text-secondary">Status: {report.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
