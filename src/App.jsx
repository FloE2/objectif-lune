import React, { useState } from 'react';
import { Award, Lock, LogOut, Trash2, X, Footprints } from 'lucide-react';

// Distance Terre-Lune en mètres et conversion
const DISTANCE_TO_MOON = 384400000; // mètres
const METERS_PER_STEP = 0.75; // moyenne d'un pas en mètres
const OMS_DAILY_STEPS = 10000; // recommandation OMS

export default function App() {
  const [currentView, setCurrentView] = useState('public');
  const [adminAuth, setAdminAuth] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  
  // Données simulées
  const [students, setStudents] = useState([
    { id: 1, nom: 'Dupont', prenom: 'Marie', classe: '5A', totalSteps: 85000 },
    { id: 2, nom: 'Martin', prenom: 'Lucas', classe: '5A', totalSteps: 78000 },
    { id: 3, nom: 'Bernard', prenom: 'Emma', classe: '5B', totalSteps: 92000 },
    { id: 4, nom: 'Petit', prenom: 'Noah', classe: '5B', totalSteps: 71000 },
    { id: 5, nom: 'Robert', prenom: 'Léa', classe: '5A', totalSteps: 65000 },
    { id: 6, nom: 'Richard', prenom: 'Gabriel', classe: '5B', totalSteps: 87000 },
    { id: 7, nom: 'Dubois', prenom: 'Jules', classe: '5A', totalSteps: 73000 },
    { id: 8, nom: 'Moreau', prenom: 'Louise', classe: '5B', totalSteps: 69000 },
    { id: 9, nom: 'Laurent', prenom: 'Manon', classe: '5A', totalSteps: 76000 },
    { id: 10, nom: 'Simon', prenom: 'Hugo', classe: '5B', totalSteps: 84000 },
    { id: 11, nom: 'Michel', prenom: 'Camille', classe: '5A', totalSteps: 67000 },
    { id: 12, nom: 'Leroy', prenom: 'Nathan', classe: '5B', totalSteps: 72000 },
  ]);

  const [dailyRecords, setDailyRecords] = useState([
    { id: 1, studentId: 1, date: '2024-01-15', steps: 12000 },
    { id: 2, studentId: 1, date: '2024-01-16', steps: 11000 },
    { id: 3, studentId: 2, date: '2024-01-15', steps: 9500 },
  ]);

  // Calculs statistiques
  const getClassStats = (className) => {
    const classStudents = students.filter(s => s.classe === className);
    const totalSteps = classStudents.reduce((sum, s) => sum + s.totalSteps, 0);
    const avgSteps = classStudents.length > 0 ? Math.round(totalSteps / classStudents.length) : 0;
    const totalDistance = totalSteps * METERS_PER_STEP;
    const moonProgress = (totalDistance / DISTANCE_TO_MOON) * 100;
    
    return {
      totalSteps,
      avgSteps,
      totalDistance,
      moonProgress: Math.min(moonProgress, 100),
      studentCount: classStudents.length
    };
  };

  const stats5A = getClassStats('5A');
  const stats5B = getClassStats('5B');

  const getTop10ByClass = (className) => {
    return students
      .filter(s => s.classe === className)
      .sort((a, b) => b.totalSteps - a.totalSteps)
      .slice(0, 10);
  };

  const getEncouragementMessage = (steps) => {
    if (steps >= OMS_DAILY_STEPS) return "🎉 Objectif OMS atteint !";
    if (steps >= OMS_DAILY_STEPS * 0.8) return "💪 Presque là !";
    if (steps >= OMS_DAILY_STEPS * 0.5) return "👍 Bon début !";
    return "🚶 Continue tes efforts !";
  };

  const handleAdminLogin = () => {
    if (loginForm.password === 'admin123') {
      setAdminAuth(true);
      setCurrentView('admin');
    } else {
      alert('Mot de passe incorrect');
    }
  };

  // Vue Publique
  if (currentView === 'public') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                  <Footprints className="text-indigo-600" size={40} />
                  Objectif Lune 🌙
                </h1>
                <p className="text-gray-600 mt-2">384 400 km à parcourir ensemble !</p>
              </div>
              <button
                onClick={() => setCurrentView('login')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                <Lock size={20} />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-indigo-600 mb-4">Classe 5ème A</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>Progression</span>
                  <span className="font-bold">{stats5A.moonProgress.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full"
                    style={{ width: `${stats5A.moonProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {(stats5A.totalDistance / 1000).toFixed(1)} km
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 rounded p-3">
                  <p className="text-sm">Total</p>
                  <p className="text-xl font-bold">{stats5A.totalSteps.toLocaleString()}</p>
                </div>
                <div className="bg-purple-50 rounded p-3">
                  <p className="text-sm">Moyenne</p>
                  <p className="text-xl font-bold">{stats5A.avgSteps.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-green-600 mb-4">Classe 5ème B</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>Progression</span>
                  <span className="font-bold">{stats5B.moonProgress.toFixed(2)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-teal-600 h-full rounded-full"
                    style={{ width: `${stats5B.moonProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {(stats5B.totalDistance / 1000).toFixed(1)} km
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded p-3">
                  <p className="text-sm">Total</p>
                  <p className="text-xl font-bold">{stats5B.totalSteps.toLocaleString()}</p>
                </div>
                <div className="bg-teal-50 rounded p-3">
                  <p className="text-sm">Moyenne</p>
                  <p className="text-xl font-bold">{stats5B.avgSteps.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
                <Award size={24} />
                Top 10 - 5ème A
              </h3>
              <div className="space-y-2">
                {getTop10ByClass('5A').map((student, index) => (
                  <div key={student.id} className="flex justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <span className={index < 3 ? 'text-yellow-500 font-bold' : 'text-gray-400'}>
                        {index + 1}
                      </span>
                      <span>{student.prenom} {student.nom}</span>
                    </div>
                    <div>
                      <p className="font-bold">{student.totalSteps.toLocaleString()}</p>
                      <p className="text-xs">{getEncouragementMessage(student.totalSteps / 7)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <Award size={24} />
                Top 10 - 5ème B
              </h3>
              <div className="space-y-2">
                {getTop10ByClass('5B').map((student, index) => (
                  <div key={student.id} className="flex justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <span className={index < 3 ? 'text-yellow-500 font-bold' : 'text-gray-400'}>
                        {index + 1}
                      </span>
                      <span>{student.prenom} {student.nom}</span>
                    </div>
                    <div>
                      <p className="font-bold">{student.totalSteps.toLocaleString()}</p>
                      <p className="text-xs">{getEncouragementMessage(student.totalSteps / 7)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white text-center">
            <h3 className="text-2xl font-bold mb-2">💪 Continuez vos efforts !</h3>
            <p>Objectif OMS : {OMS_DAILY_STEPS.toLocaleString()} pas/jour</p>
          </div>
        </div>
      </div>
    );
  }

  // Vue Login
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Espace Professeur</h2>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Nom.Prénom</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">Mot de passe</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAdminLogin}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
            >
              Connexion
            </button>
            <button
              onClick={() => setCurrentView('public')}
              className="flex-1 bg-gray-300 py-2 rounded-lg"
            >
              Retour
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">Test: admin123</p>
        </div>
      </div>
    );
  }

  // Vue Admin
  if (currentView === 'admin' && adminAuth) {
    const [newRecord, setNewRecord] = useState({ studentId: '', date: '', steps: '' });
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newStudent, setNewStudent] = useState({ nom: '', prenom: '', classe: '5A' });

    const handleAddStudent = () => {
      if (newStudent.nom && newStudent.prenom) {
        setStudents([...students, {
          id: Date.now(),
          nom: newStudent.nom,
          prenom: newStudent.prenom,
          classe: newStudent.classe,
          totalSteps: 0
        }]);
        setNewStudent({ nom: '', prenom: '', classe: '5A' });
      }
    };

    const handleAddRecord = () => {
      if (newRecord.studentId && newRecord.date && newRecord.steps) {
        const studentId = parseInt(newRecord.studentId);
        const steps = parseInt(newRecord.steps);
        
        setDailyRecords([...dailyRecords, {
          id: Date.now(),
          studentId: studentId,
          date: newRecord.date,
          steps: steps
        }]);
        
        setStudents(students.map(s => 
          s.id === studentId ? { ...s, totalSteps: s.totalSteps + steps } : s
        ));
        
        setNewRecord({ studentId: '', date: '', steps: '' });
      }
    };

    const handleDeleteRecord = (recordId) => {
      const record = dailyRecords.find(r => r.id === recordId);
      if (record) {
        setStudents(students.map(s => 
          s.id === record.studentId 
            ? { ...s, totalSteps: Math.max(0, s.totalSteps - record.steps) }
            : s
        ));
        setDailyRecords(dailyRecords.filter(r => r.id !== recordId));
      }
    };

    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Administration</h1>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentView('public')}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Vue publique
                </button>
                <button
                  onClick={() => {
                    setAdminAuth(false);
                    setCurrentView('login');
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <LogOut size={20} />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Ajouter un élève</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Nom"
                className="px-3 py-2 border rounded"
                value={newStudent.nom}
                onChange={(e) => setNewStudent({...newStudent, nom: e.target.value})}
              />
              <input
                type="text"
                placeholder="Prénom"
                className="px-3 py-2 border rounded"
                value={newStudent.prenom}
                onChange={(e) => setNewStudent({...newStudent, prenom: e.target.value})}
              />
              <select
                className="px-3 py-2 border rounded"
                value={newStudent.classe}
                onChange={(e) => setNewStudent({...newStudent, classe: e.target.value})}
              >
                <option value="5A">5ème A</option>
                <option value="5B">5ème B</option>
              </select>
              <button
                onClick={handleAddStudent}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Ajouter
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Ajouter un relevé</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <select
                className="px-3 py-2 border rounded"
                value={newRecord.studentId}
                onChange={(e) => setNewRecord({...newRecord, studentId: e.target.value})}
              >
                <option value="">Choisir élève</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.nom} {s.prenom} - {s.classe}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="px-3 py-2 border rounded"
                value={newRecord.date}
                onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
              />
              <input
                type="number"
                placeholder="Nombre de pas"
                className="px-3 py-2 border rounded"
                value={newRecord.steps}
                onChange={(e) => setNewRecord({...newRecord, steps: e.target.value})}
              />
              <button
                onClick={handleAddRecord}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Ajouter
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Liste des élèves</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Nom</th>
                  <th className="text-left p-2">Prénom</th>
                  <th className="text-left p-2">Classe</th>
                  <th className="text-left p-2">Total</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id} className="border-b">
                    <td className="p-2">{student.nom}</td>
                    <td className="p-2">{student.prenom}</td>
                    <td className="p-2">{student.classe}</td>
                    <td className="p-2 font-bold">{student.totalSteps.toLocaleString()}</td>
                    <td className="p-2">
                      <button
                        onClick={() => setSelectedStudent(student.id)}
                        className="text-blue-500"
                      >
                        Historique
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedStudent && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Historique - {students.find(s => s.id === selectedStudent)?.prenom} {students.find(s => s.id === selectedStudent)?.nom}
                </h2>
                <button onClick={() => setSelectedStudent(null)}>
                  <X size={24} />
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Pas</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyRecords
                    .filter(r => r.studentId === selectedStudent)
                    .map(record => (
                      <tr key={record.id} className="border-b">
                        <td className="p-2">{record.date}</td>
                        <td className="p-2">{record.steps.toLocaleString()}</td>
                        <td className="p-2">
                          <button
                            onClick={() => handleDeleteRecord(record.id)}
                            className="text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}