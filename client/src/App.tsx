import "./App.css";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import HomePage from "./pages/Home";
import AuthPage from "./pages/Auth";
import DocsPage from "./pages/Docs";
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./hooks/useAuth";
import AddServerPage from "./pages/AddServer";
import Profile from "./pages/Profile";

function App() {
  const location = useLocation();
  // const isDocsPage = location.pathname === "/docs";

  // Call useAuth hook to authenticate user on app load
  useAuth();

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/*" element={<AuthPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/add-server" element={<AddServerPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
