import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';
import Home from './pages/Home';
import BlogPost from './pages/BlogPost';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/joel" element={<Login />} />
            <Route path="/joel/dashboard/*" element={<Dashboard />} />
          </Routes>
        </Router>
      </SiteProvider>
    </AuthProvider>
  );
}

export default App;
