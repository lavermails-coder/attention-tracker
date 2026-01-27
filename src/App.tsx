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
import { History } from './components/History';

function AppContent() {
  const { isLoading, currentView } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🎯</div>
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
    case 'history':
      return <History />;
    default:
      return <Dashboard />;
  }
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
