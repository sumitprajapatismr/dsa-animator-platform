import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './app/store';
import { logoutUser } from './features/authSlice';
import { LayoutDashboard, Play, Code2, Users, BookOpen, ShieldAlert, LogOut, Menu, X, Flame, Sun, Moon, Settings, Trophy, Sparkles, Briefcase, Cpu, Layers } from 'lucide-react';
import { useAppTheme } from './context/ThemeContext';
import StartupAnimation from './components/StartupAnimation';

// Pages Import
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Visualizer from './pages/Visualizer';
import Problems from './pages/Problems';
import Playground from './pages/Playground';
import CollaborationRoom from './pages/CollaborationRoom';
import Learn from './pages/Learn';
import AdminDashboard from './pages/AdminDashboard';

// Premium Pages
import RaceMode from './pages/RaceMode';
import ComplexityVisualizer from './pages/ComplexityVisualizer';
import GraphPlayground from './pages/GraphPlayground';
import TreeBuilder from './pages/TreeBuilder';
import RecursionTree from './pages/RecursionTree';
import Roadmap from './pages/Roadmap';
import CompanyPrep from './pages/CompanyPrep';
import StoryMode from './pages/StoryMode';
import AIMentor from './components/AIMentor';
import InterviewLab from './pages/InterviewLab';
import ResumeBuilder from './pages/ResumeBuilder';
import PlacementDashboard from './pages/PlacementDashboard';
import Contests from './pages/Contests';
import Welcome from './pages/Welcome';
import AINotebook from './pages/AINotebook';
import AIWhiteboard from './pages/AIWhiteboard';
import AIPlanner from './pages/AIPlanner';
import CommandPalette from './components/CommandPalette';
import ThreeDPlayground from './pages/ThreeDPlayground';
import CSSubjects from './pages/CSSubjects';
import CareerHub from './pages/CareerHub';
import AILabs from './pages/AILabs';
import AILearningWorkspace from './pages/AILearningWorkspace';
import AIAchievementTimeline from './pages/AIAchievementTimeline';

// Route guards
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/welcome" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  return isAuthenticated && user?.role === 'Admin' ? <>{children}</> : <Navigate to="/" replace />;
};

const Sidebar: React.FC<{ sidebarOpen: boolean; setSidebarOpen: (b: boolean) => void }> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'DSA Visualizer', href: '/visualizer', icon: Play },
    { name: 'Race Mode', href: '/visualizer/race', icon: Flame },
    { name: 'Complexity Curves', href: '/visualizer/complexity', icon: Sun },
    { name: 'Graph Sandbox', href: '/visualizer/graph-playground', icon: Users },
    { name: 'Tree Builder', href: '/visualizer/tree-builder', icon: Code2 },
    { name: 'Recursion Stack', href: '/visualizer/recursion-tree', icon: BookOpen },
    { name: 'Algorithm Story', href: '/visualizer/story', icon: Flame },
    { name: 'Learning Roadmap', href: '/roadmap', icon: LayoutDashboard },
    { name: 'Company Board', href: '/company-prep', icon: ShieldAlert },
    { name: 'Interview Lab', href: '/visualizer/interview-lab', icon: BookOpen },
    { name: 'Resume Lab', href: '/visualizer/resume-builder', icon: Code2 },
    { name: 'Placement Board', href: '/visualizer/placement', icon: LayoutDashboard },
    { name: 'Coding Contests', href: '/visualizer/contests', icon: Trophy },
    { name: 'AI Notebook', href: '/visualizer/notebook', icon: BookOpen },
    { name: 'Whiteboard', href: '/visualizer/whiteboard', icon: Settings },
    { name: 'Pomodoro Planner', href: '/visualizer/planner', icon: LayoutDashboard },
    { name: '3D Experience', href: '/visualizer/3d', icon: Sparkles },
    { name: 'CS Subjects', href: '/subjects', icon: BookOpen },
    { name: 'Placement Hub', href: '/career', icon: Briefcase },
    { name: 'AI Laboratory', href: '/ai-labs', icon: Cpu },
    { name: 'AI Workspace', href: '/ai-workspace', icon: Layers },
    { name: 'AI Timeline', href: '/timeline', icon: Trophy }
  ];

  if (user?.role === 'Admin') {
    navigation.push({ name: 'Admin Control', href: '/admin', icon: ShieldAlert });
  }

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-[#0F1626] border-r border-brand-border transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-brand-border">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-wider text-indigo-400" onClick={() => setSidebarOpen(false)}>
            <Flame className="w-6 h-6 text-brand-teal fill-brand-teal" />
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Brain DSA AI</span>
          </Link>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        {user && (
          <div className="p-4 mx-4 mt-6 border rounded-lg bg-brand-card/50 border-brand-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white uppercase shadow-glow">
                {user.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-semibold truncate w-36">{user.name}</h4>
                <span className="inline-block px-2 py-0.5 mt-1 text-[10px] font-bold tracking-wide rounded bg-indigo-950 text-indigo-400 border border-indigo-900 uppercase">
                  {user.role}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3 text-xs text-gray-400 border-t border-brand-border/40 pt-2">
              <span>Level {user.level}</span>
              <span className="text-brand-teal font-bold">{user.xp} XP</span>
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${active ? 'bg-indigo-600 text-white shadow-glow' : 'text-gray-400 hover:bg-brand-card hover:text-gray-100'}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`mr-3 h-5 w-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brand-border">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-red-950/20 hover:text-red-300 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

const Header: React.FC<{ setSidebarOpen: (b: boolean) => void }> = ({ setSidebarOpen }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme, accent, fontSize, density, glassmorphism, setTheme, setAccent, setFontSize, setDensity, setGlassmorphism } = useAppTheme();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b bg-brand-dark/80 backdrop-blur border-brand-border">
      <button 
        className="text-gray-400 hover:text-white md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="flex items-center ml-auto space-x-4 relative">
        {user && (
          <div className="flex items-center space-x-2 bg-brand-card/35 px-3 py-1.5 rounded-full border border-brand-border/40 text-xs">
            <span className="font-bold text-brand-teal">🪙 {user.coins}</span>
            <span className="text-gray-500">|</span>
            <span className="font-bold text-orange-400">🔥 {user.streak?.current || 0}d</span>
          </div>
        )}

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg text-gray-400 hover:text-white bg-brand-card/35 border border-brand-border/40 transition-colors"
          title="Theme Customizer"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Theme Settings Dropdown panel */}
        {showSettings && (
          <div className="absolute right-0 top-12 w-64 p-4 rounded-xl bg-brand-card border border-brand-border shadow-glow text-xs z-50 space-y-4">
            <h4 className="font-bold text-white uppercase tracking-wider border-b border-brand-border/40 pb-2">Customization</h4>
            
            {/* Theme Select */}
            <div className="space-y-1.5">
              <span className="text-gray-500 block">Color Theme:</span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-brand-dark border border-brand-border rounded text-white focus:outline-none"
              >
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
                <option value="amoled">AMOLED Black</option>
                <option value="blue">Deep Blue</option>
                <option value="purple">Purple Haze</option>
                <option value="green">Forest Green</option>
                <option value="high-contrast">High Contrast</option>
              </select>
            </div>

            {/* Accent Select */}
            <div className="space-y-1.5">
              <span className="text-gray-500 block">Accent Color:</span>
              <div className="flex gap-2.5">
                {(['indigo', 'teal', 'purple', 'pink', 'emerald'] as const).map((color) => (
                  <button
                    key={color}
                    onClick={() => setAccent(color)}
                    className={`w-5 h-5 rounded-full border-2 ${accent === color ? 'border-white' : 'border-transparent'}`}
                    style={{
                      backgroundColor:
                        color === 'indigo' ? '#6366F1' :
                        color === 'teal' ? '#14B8A6' :
                        color === 'purple' ? '#A855F7' :
                        color === 'pink' ? '#EC4899' : '#10B981'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Font Sizing */}
            <div className="space-y-1.5">
              <span className="text-gray-500 block">Font Scaling:</span>
              <div className="flex gap-2">
                {(['sm', 'base', 'lg'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`flex-1 py-1 rounded border text-center uppercase text-[10px] font-bold ${fontSize === sz ? 'bg-indigo-600 border-indigo-500 text-white font-black' : 'bg-brand-dark border-brand-border text-gray-400'}`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Spacing Density */}
            <div className="space-y-1.5">
              <span className="text-gray-500 block">UI Density:</span>
              <div className="flex gap-2">
                {(['compact', 'comfortable'] as const).map((dns) => (
                  <button
                    key={dns}
                    onClick={() => setDensity(dns)}
                    className={`flex-1 py-1 rounded border text-center capitalize text-[10px] font-bold ${density === dns ? 'bg-indigo-600 border-indigo-500 text-white font-black' : 'bg-brand-dark border-brand-border text-gray-400'}`}
                  >
                    {dns}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showStartup, setShowStartup] = useState(() => {
    return localStorage.getItem('show_startup_animation') === 'true';
  });

  if (showStartup && user) {
    return (
      <StartupAnimation
        userName={user.name}
        onComplete={() => {
          localStorage.removeItem('show_startup_animation');
          setShowStartup(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark transition-all duration-700">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
      <AIMentor />
      <CommandPalette />
    </div>
  );
};

const App: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path="/welcome" element={<Welcome />} />

        {/* Private Dashboard routes */}
        <Route path="/*" element={
          <PrivateRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/visualizer" element={<Visualizer />} />
                <Route path="/visualizer/race" element={<RaceMode />} />
                <Route path="/visualizer/complexity" element={<ComplexityVisualizer />} />
                <Route path="/visualizer/graph-playground" element={<GraphPlayground />} />
                <Route path="/visualizer/tree-builder" element={<TreeBuilder />} />
                <Route path="/visualizer/recursion-tree" element={<RecursionTree />} />
                <Route path="/visualizer/story" element={<StoryMode />} />
                <Route path="/visualizer/interview-lab" element={<InterviewLab />} />
                <Route path="/visualizer/resume-builder" element={<ResumeBuilder />} />
                <Route path="/visualizer/placement" element={<PlacementDashboard />} />
                <Route path="/visualizer/contests" element={<Contests />} />
                <Route path="/visualizer/notebook" element={<AINotebook />} />
                <Route path="/visualizer/whiteboard" element={<AIWhiteboard />} />
                <Route path="/visualizer/planner" element={<AIPlanner />} />
                <Route path="/visualizer/3d" element={<ThreeDPlayground />} />
                <Route path="/subjects" element={<CSSubjects />} />
                <Route path="/career" element={<CareerHub />} />
                <Route path="/ai-labs" element={<AILabs />} />
                <Route path="/ai-workspace" element={<AILearningWorkspace />} />
                <Route path="/timeline" element={<AIAchievementTimeline />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/company-prep" element={<CompanyPrep />} />
                <Route path="/problems" element={<Problems />} />
                <Route path="/problems/:slug" element={<Playground />} />
                <Route path="/collaboration" element={<CollaborationRoom />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainLayout>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;

