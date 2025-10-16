import React, { useState } from 'react';

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

  // État pour la vue admin
  const [newRecord, setNewRecord] = useState({ studentId: '', date: '', steps: '' });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({ nom: '', prenom: '', classe: '5A' });

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
      alert('Élève ajouté avec succès !');
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
      alert('Relevé ajouté avec succès !');
    }
  };

  const handleDeleteRecord = (recordId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement ?')) {
      const record = dailyRecords.find(r => r.id === recordId);
      if (record) {
        setStudents(students.map(s => 
          s.id === record.studentId 
            ? { ...s, totalSteps: Math.max(0, s.totalSteps - record.steps) }
            : s
        ));
        setDailyRecords(dailyRecords.filter(r => r.id !== recordId));
      }
    }
  };

  // Vue Publique
  if (currentView === 'public') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '30px', marginBottom: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  🚶‍♂️ Objectif Lune 🌙
                </h1>
                <p style={{ color: '#666', marginTop: '10px', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>384 400 km à parcourir ensemble !</p>
              </div>
              <button
                onClick={() => setCurrentView('login')}
                style={{
                  background: '#667eea',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
              >
                🔒 Espace Prof
              </button>
            </div>
          </div>

          {/* Statistiques des classes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px', marginBottom: '30px' }}>
            {/* Classe 5A */}
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              padding: '30px', 
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.1)',
              border: '2px solid rgba(102, 126, 234, 0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.1)';
            }}>
              <h2 style={{ color: '#667eea', marginBottom: '25px', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}>🏃‍♀️ Classe 5ème A</h2>
              <div style={{ marginBottom: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontWeight: '500', color: '#4b5563' }}>Progression vers la Lune</span>
                  <span style={{ fontWeight: 'bold', color: '#667eea', fontSize: '1.1em' }}>{stats5A.moonProgress.toFixed(2)}%</span>
                </div>
                <div style={{ 
                  background: 'linear-gradient(90deg, #e0e7ff 0%, #e0e7ff 100%)', 
                  borderRadius: '50px', 
                  height: '24px', 
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div 
                    style={{
                      background: 'linear-gradient(90deg, #667eea, #764ba2)',
                      height: '100%',
                      width: `${stats5A.moonProgress}%`,
                      borderRadius: '50px',
                      transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      animation: 'shimmer 2s infinite'
                    }}/>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px', fontWeight: '500' }}>
                  📍 {(stats5A.totalDistance / 1000).toFixed(1)} km parcourus
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #f3f4ff 0%, #e0e7ff 100%)', 
                  padding: '18px', 
                  borderRadius: '15px',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, fontWeight: '600', letterSpacing: '0.5px' }}>TOTAL DE PAS</p>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea', margin: '8px 0 0 0' }}>
                    {stats5A.totalSteps.toLocaleString()}
                  </p>
                </div>
                <div style={{ 
                  background: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)', 
                  padding: '18px', 
                  borderRadius: '15px',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, fontWeight: '600', letterSpacing: '0.5px' }}>MOYENNE</p>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#764ba2', margin: '8px 0 0 0' }}>
                    {stats5A.avgSteps.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Classe 5B */}
            <div style={{ 
              background: 'white', 
              borderRadius: '20px', 
              padding: '30px', 
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.1)',
              border: '2px solid rgba(16, 185, 129, 0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.1)';
            }}>
              <h2 style={{ color: '#10b981', marginBottom: '25px', fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}>🏃‍♂️ Classe 5ème B</h2>
              <div style={{ marginBottom: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontWeight: '500', color: '#4b5563' }}>Progression vers la Lune</span>
                  <span style={{ fontWeight: 'bold', color: '#10b981', fontSize: '1.1em' }}>{stats5B.moonProgress.toFixed(2)}%</span>
                </div>
                <div style={{ 
                  background: 'linear-gradient(90deg, #d1fae5 0%, #d1fae5 100%)', 
                  borderRadius: '50px', 
                  height: '24px', 
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <div 
                    style={{
                      background: 'linear-gradient(90deg, #10b981, #3b82f6)',
                      height: '100%',
                      width: `${stats5B.moonProgress}%`,
                      borderRadius: '50px',
                      transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      animation: 'shimmer 2s infinite'
                    }}/>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px', fontWeight: '500' }}>
                  📍 {(stats5B.totalDistance / 1000).toFixed(1)} km parcourus
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', 
                  padding: '18px', 
                  borderRadius: '15px',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, fontWeight: '600', letterSpacing: '0.5px' }}>TOTAL DE PAS</p>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981', margin: '8px 0 0 0' }}>
                    {stats5B.totalSteps.toLocaleString()}
                  </p>
                </div>
                <div style={{ 
                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', 
                  padding: '18px', 
                  borderRadius: '15px',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, fontWeight: '600', letterSpacing: '0.5px' }}>MOYENNE</p>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6', margin: '8px 0 0 0' }}>
                    {stats5B.avgSteps.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top 10 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            {/* Top 10 - 5A */}
            <div style={{ background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#667eea', marginBottom: '20px' }}>🏆 Top 10 - Classe 5ème A</h3>
              <div>
                {getTop10ByClass('5A').map((student, index) => (
                  <div key={student.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '12px', 
                    background: index % 2 === 0 ? '#f9fafb' : 'white',
                    borderRadius: '8px',
                    marginBottom: '5px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ 
                        fontWeight: 'bold', 
                        fontSize: '18px',
                        color: index < 3 ? '#fbbf24' : '#9ca3af'
                      }}>
                        {index + 1}
                      </span>
                      <span>{student.prenom} {student.nom}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontWeight: 'bold', color: '#667eea' }}>
                        {student.totalSteps.toLocaleString()}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                        {getEncouragementMessage(student.totalSteps / 7)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 10 - 5B */}
            <div style={{ background: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#10b981', marginBottom: '20px' }}>🏆 Top 10 - Classe 5ème B</h3>
              <div>
                {getTop10ByClass('5B').map((student, index) => (
                  <div key={student.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '12px', 
                    background: index % 2 === 0 ? '#f9fafb' : 'white',
                    borderRadius: '8px',
                    marginBottom: '5px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ 
                        fontWeight: 'bold', 
                        fontSize: '18px',
                        color: index < 3 ? '#fbbf24' : '#9ca3af'
                      }}>
                        {index + 1}
                      </span>
                      <span>{student.prenom} {student.nom}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontWeight: 'bold', color: '#10b981' }}>
                        {student.totalSteps.toLocaleString()}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                        {getEncouragementMessage(student.totalSteps / 7)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Message motivationnel */}
          <div style={{ 
            background: 'linear-gradient(135deg, #fbbf24 0%, #fb923c 100%)', 
            borderRadius: '15px', 
            padding: '30px', 
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '28px', margin: '0 0 10px 0' }}>💪 Continuez vos efforts !</h3>
            <p style={{ fontSize: '18px', margin: 0 }}>
              L'OMS recommande {OMS_DAILY_STEPS.toLocaleString()} pas par jour pour rester en bonne santé.
            </p>
            <p style={{ fontSize: '16px', marginTop: '10px' }}>
              Chaque pas compte pour atteindre la Lune ensemble ! 🌙
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Vue Login
  if (currentView === 'login') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '40px', 
          width: '100%', 
          maxWidth: '400px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>🔐 Espace Professeur</h2>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#666' }}>
              Nom.Prénom
            </label>
            <input
              type="text"
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid #ddd',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              placeholder="Nom.Prénom"
            />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#666' }}>
              Mot de passe
            </label>
            <input
              type="password"
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '8px', 
                border: '1px solid #ddd',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              placeholder="Mot de passe"
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAdminLogin}
              style={{
                flex: 1,
                padding: '12px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Se connecter
            </button>
            <button
              onClick={() => setCurrentView('public')}
              style={{
                flex: 1,
                padding: '12px',
                background: '#e5e7eb',
                color: '#333',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Retour
            </button>
          </div>
          <p style={{ textAlign: 'center', marginTop: '20px', color: '#999', fontSize: '14px' }}>
            Mot de passe test : admin123
          </p>
        </div>
      </div>
    );
  }

  // Vue Admin
  if (currentView === 'admin' && adminAuth) {
    return (
      <div style={{ minHeight: '100vh', background: '#f3f4f6', padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header Admin */}
          <div style={{ background: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ margin: 0, color: '#333' }}>📊 Tableau de bord - Administration</h1>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setCurrentView('public')}
                  style={{
                    padding: '10px 20px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Vue publique
                </button>
                <button
                  onClick={() => {
                    setAdminAuth(false);
                    setCurrentView('login');
                  }}
                  style={{
                    padding: '10px 20px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Total élèves</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>{students.length}</p>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Total de pas</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>
                {students.reduce((sum, s) => sum + s.totalSteps, 0).toLocaleString()}
              </p>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Progression Lune</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>
                {((students.reduce((sum, s) => sum + s.totalSteps, 0) * METERS_PER_STEP / DISTANCE_TO_MOON) * 100).toFixed(3)}%
              </p>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Moyenne/élève</p>
              <p style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold', color: '#764ba2' }}>
                {Math.round(students.reduce((sum, s) => sum + s.totalSteps, 0) / students.length).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Ajouter un élève */}
          <div style={{ background: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>➕ Ajouter un nouvel élève</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <input
                type="text"
                placeholder="Nom"
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                value={newStudent.nom}
                onChange={(e) => setNewStudent({...newStudent, nom: e.target.value})}
              />
              <input
                type="text"
                placeholder="Prénom"
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                value={newStudent.prenom}
                onChange={(e) => setNewStudent({...newStudent, prenom: e.target.value})}
              />
              <select
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                value={newStudent.classe}
                onChange={(e) => setNewStudent({...newStudent, classe: e.target.value})}
              >
                <option value="5A">5ème A</option>
                <option value="5B">5ème B</option>
              </select>
              <button
                onClick={handleAddStudent}
                style={{
                  padding: '10px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Ajouter l'élève
              </button>
            </div>
          </div>

          {/* Ajouter un relevé */}
          <div style={{ background: 'white', borderRadius: '10px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, marginBottom: '15px', color: '#333' }}>📝 Ajouter un relevé quotidien</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <select
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                value={newRecord.studentId}
                onChange={(e) => setNewRecord({...newRecord, studentId: e.target.value})}
              >
                <option value="">Choisir un élève</option>
                {students
                  .sort((a, b) => a.nom.localeCompare(b.nom))
                  .map(s => (
                  <option key={s.id} value={s.id}>