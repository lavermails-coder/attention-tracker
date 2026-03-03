import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { PingResponse } from './components/PingResponse';
import { WeeklySummary } from './components/WeeklySummary';
import { Analysis } from './components/Analysis';
import { ExperimentActive } from './components/ExperimentActive';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { ExerciseDetail } from './components/ExerciseDetail';
import { Settings } from './components/Settings';
import { SetIntention } from './components/SetIntention';
import { AttentionOverview } from './components/AttentionOverview';
import { Login } from './components/Login';
import { onAuthChange, type User } from './lib/firebase';

function AppContent() {
  const { isLoading, currentView } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  switch (currentView) {
    case 'onboarding':
      return <Onboarding />;
    case 'dashboard':
      return <Dashboard />;
    case 'ping-response':
      return <PingResponse />;
    case 'weekly-summary':
      return <WeeklySummary />;
    case 'analysis':
      return <Analysis />;
    case 'experiment':
      return <ExperimentActive />;
    case 'exercise-library':
      return <ExerciseLibrary />;
    case 'exercise-detail':
      return <ExerciseDetail />;
    case 'settings':
      return <Settings />;
    case 'set-intention':
      return <SetIntention />;
    case 'attention-overview':
      return <AttentionOverview />;
    default:
      return <Dashboard />;
  }
}

function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Still checking auth state
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (user === null) {
    return <Login onSuccess={() => {}} />;
  }

  // Logged in - show app
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
